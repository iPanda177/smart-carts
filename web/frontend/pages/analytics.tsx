import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout, Page, FooterHelp } from '@shopify/polaris';

import CircleChart from '../components/charts/CircleChart';
import LinearChart from '../components/charts/LinearChart';
import RowBarChart from '../components/charts/RowBarChart';
import AreaChart from '../components/charts/AreaChart';
import ConversionChart from '../components/charts/ConversionChart';
import TopChart from '../components/charts/TopChart';

import '@shopify/polaris-viz/build/esm/styles.css';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

type Status = 'Loading' | 'Error' | 'Success';

export default function EmptyStateExample() {
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState<Status>('Loading');
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'Loading') {
      const fetchData = async () => {
        const analyticsData = await fetch('/api/analytics');

        if (analyticsData.ok) {
          const analytics = await analyticsData.json();

          setAnalytics(analytics);
          setStatus('Success');
        } else {
          setStatus('Error');
        }
      };

      fetchData();
    }
  }, [status]);

  console.log(analytics);

  return (
    <Page
      fullWidth
      breadcrumbs={[{ onAction: () => navigate(-1) }]}
      title="Analytics"
    >
      <Layout>
        <Layout.Section oneHalf>
          <LinearChart
            status={status}
            data={analytics ? analytics.total_sales : []}
          ></LinearChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <AreaChart type={'time'}></AreaChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <AreaChart type={'paid'}></AreaChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <ConversionChart></ConversionChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <RowBarChart
            status={status}
            data={analytics ? analytics.locations : []}
          ></RowBarChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <CircleChart></CircleChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <TopChart type={'sold'}></TopChart>
        </Layout.Section>

        <Layout.Section oneHalf>
          <TopChart type={'abandoned'}></TopChart>
        </Layout.Section>
      </Layout>
      <FooterHelp>© Blake Rogers. All rights reserved.</FooterHelp>
    </Page>
  );
}
