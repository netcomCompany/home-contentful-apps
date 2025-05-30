import { SidebarAppSDK } from '@contentful/app-sdk';
import { Button, Note } from '@contentful/f36-components';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'; // ★追加
import { useState } from 'react';
import { API_URL, SUCCESS_MESSAGE, FAILURE_MESSAGE } from '../constants/constants';

 // ★追加
const getLocaleOfEntry = async (cma: ReturnType<typeof useCMA>, entryId: string): Promise<string | undefined> => {
  const entry = await cma.entry.get({ entryId });
  const fields = entry.fields;
  const firstField = Object.values(fields)[0];
  if (!firstField) return undefined;
  const locales = Object.keys(firstField);
  return locales[0];
};
/*
 *
 * キャッシュパージボタン
 *
 */
const Sidebar = () => {

  //
  // 初期化処理
  //
  const cma = useCMA(); // ★追加
  const sdk = useSDK<SidebarAppSDK>();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  //
  // キャッシュパージイベント
  //
  const cachePurge = async () => {
    setLoading(true);
    setResult(null);

    try {
      const entryId = sdk.ids.entry;
      const locale = await getLocaleOfEntry(cma, entryId); // ★追加
      const revision = sdk.entry.getSys().publishedCounter;
      console.log("entryId:" + entryId);
      console.log("locale:" + locale);
      console.log("revision:" + revision);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId, locale, revision })
      });

      setResult(
        response.ok
          ? SUCCESS_MESSAGE
          : FAILURE_MESSAGE
      );
      setIsError(!response.ok);
    } catch (error) {
      setResult(FAILURE_MESSAGE);
      setIsError(true);
      console.error(error)
    } finally {
      setLoading(false);
    }
}

  //
  // ページレンダリング
  //
  return (
    <>
      <Button
        isLoading={loading}
        onClick={cachePurge}
        variant="primary"
        size="small"
      >
        CachePurgeForThePage
      </Button>
      {result && (
        <Note
          variant={isError  ? 'negative' : 'positive'}
          style={{ marginTop: '1rem' }}
        >
          {result}
        </Note>
      )}
    </>
  );
};

export default Sidebar;
