import { Page, FooterHelp, EmptyState, AlphaCard } from '@shopify/polaris';
import React from 'react';

export default function EmptyStateExample() {
  return (
    <Page>
      <AlphaCard>
        <EmptyState
          heading="This page is in development"
          image="https://firtka.if.ua/media/cache/blog_thumb/data/blog/262267/9f4ff8530877d0c5db1e8868d81b64d4.png"
        >
          <p>Coming soon</p>
        </EmptyState>
      </AlphaCard>

      <FooterHelp>© Blake Rogers. All rights reserved.</FooterHelp>
    </Page>
  );
}
