import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const CONTENT_FIELD_ID = 'body';

const Sidebar = () => {
  // The sdk allows us to interact with the Contentful web app
  const sdk = useSDK<SidebarAppSDK>();

  // With the field ID we can reference individual fields from an entry
  const contentField = sdk.entry.fields[CONTENT_FIELD_ID];

  // Get the current value from the blog post field and store it in React state
  const [blogText, setBlogText] = useState(contentField.getValue());

  return <Paragraph>Hello Sidebar ComponentAAAAAAA</Paragraph>;
};

export default Sidebar;