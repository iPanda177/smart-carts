import { FooterHelp, Layout, Page } from '@shopify/polaris';
import CollapsibleTab from '../components/CollapsibleTab';

export default function NotFound() {
  return (
    <Page title="FAQ">
      <Layout>
        <Layout.Section>
          <CollapsibleTab></CollapsibleTab>
        </Layout.Section>
      </Layout>

      <FooterHelp>© Blake Rogers. All rights reserved. </FooterHelp>
    </Page>
  );
}
