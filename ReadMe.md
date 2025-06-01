# Miroku-Contentful-AppsのGit運用 / Contentful環境へのデプロイ手順

## 0.Contentful Appsの初期化(新規フォルダを追加して開発を始めるとき)

- ローカルでアプリを初期化＆実装して起動できることを確認
- ここでAppId(APP_DEFINITION_ID)が発行されるので、GitHubのSecret Keyにも登録する
- Develop用、Master用でアプリの定義を分けて作成すること
- 手順は公式を参照
<<https://www.contentful.com/developers/docs/extensibility/app-framework/tutorial/>>
``` sh
# アプリの初期化("my-first-app"の部分は任意のアプリ名)
npx create-contentful-app my-first-app
  > Do you want to start with a blank template or use one of our examples?
    -> Template
  > Pick a template (Use arrow keys)
    -> React + Vite

# ローカルで起動できることを確認
# localhost:3000でアプリがホストされるので、Contentfulにログインしてカスタムアプリの定義を作成する
cd my-first-app
npm run start
```

- ビルドした資産(dist配下一式)をContentful Appsにアップロードする<br>
  (一度ローカルからアップロードしておかないとGitからデプロイできないため)
``` sh
npm run build
```

## 1.Git運用
- feature/[チケット番号] ・・・ 開発用ブランチ。改修後にプッシュしてContentful Apps(develop用)にdeploy-contentful-apps-develop.yamlでデプロイする。<br>
テストまで完了したらdevelopブランチへPRする。<br>
デプロイが正常終了したことのワークフローリンク、テストエビデンスを必須とする。
- develop・・・feature/xxxからのPRを確認し、問題なければマージする。<br>
他にfeatureブランチを分けて管理している場合、それぞれがdevelopにマージされた段階であたらめてContentful Apps(develop用)にdeploy-contentful-apps-develop.yamlでデプロイする。
本番リリースの準備ができたら、mainブランチにPRする。
- main・・・本番リリース用のブランチ。developからのPRをマージ後、Contentful Apps(master用)にdeploy-contentful-main-develop.yamlでデプロイする。


## 2-1. デプロイまでの準備 ※アプリ追加の初回のみ

### 前提(Contentful Appsのフォルダ名)
- ハイフンつなぎでフォルダを作成する
- GitHubのシークレットキーはアンダースコアつなぎ
- それぞれの命名が一致するようにする<br>
（例）
リポジトリ上に「sidebar-cachepurge-button」でフォルダを作成した場合<br>
-><br>
APP_DEFINITION_ID_PRD_sidebar_cachepurge_button
APP_DEFINITION_ID_DEV_sidebar_cachepurge_button

### シークレットキーの登録
- Settings > Secrets and variables > Actions > Repository secretsで「New repository secret」を押下し、<br>
  対象のContentful AppsのAppId(APP_DEFINITION_ID)を設定する。<br>
（例）<br>
develop環境用： APP_DEFINITION_ID_DEV_XXXX <br>
master環境用： APP_DEFINITION_ID_PRD_XXXX <br>
※ XXXXにAppIdを入れる

### ワークフローファイルへの追加
- .github/workflows/deploy-contentful-apps-common.yamlに「シークレットキーの登録」で追加したsecret keyを追加する。<br>
``` deploy-contentful-apps-common.yaml
on:
  workflow_call:
・・・
    secrets:
      APP_DEFINITION_ID_PRD_xxx_xxx_xxx:
        required: false
      APP_DEFINITION_ID_DEV_xxx_xxx_xxx:
        required: false
・・・
jobs:
  deploy:
    steps:
        env:
          APP_DEFINITION_ID_PRD_xxx_xxx_xxx: ${{ secrets.APP_DEFINITION_ID_PRD_xxx_xxx_xxx }}
          APP_DEFINITION_ID_DEV_xxx_xxx_xxx: ${{ secrets.APP_DEFINITION_ID_DEV_xxx_xxx_xxx }}
```

## 2-2. デプロイ(Actionsから対象ワークフローを選択してデプロイ)
- deploy-contentful-apps-develop.yaml<br>
Contentful develop環境用アプリへのデプロイ　※ feature/xxxx, developブランチから実行可
<br>
- deploy-contentful-apps-main.yaml<br>
Contentful master環境用アプリへのデプロイ　※ masterブランチから実行可
<br>
<br>

### 「2-2. デプロイ(Actionsから対象ワークフローを選択してデプロイ)」の補足
- GitHubのワークフローディスパッチ(画面UIから環境を選択してデプロイできる仕組み)の仕様上、どちらのyamlからも全ブランチを選択できるようになっているが、対象ブランチとContentful対象環境の組み合わせが正しくない場合はデプロイされないようにガードされている（ワークフローが異常終了するようにチェックしている） <br>
（例）<br>
deploy-contentful-apps-main.yamlのワークフローディスパッチを使ってdevelopブランチからデプロイはできない。



### Secret Key
- ACCESS_TOKEN
- ORGANIZATION_ID
- APP_DEFINITION_ID_DEV_SIDEBAR_CACHEPURGE_BUTTON
- APP_DEFINITION_ID_PRD_SIDEBAR_CACHEPURGE_BUTTON