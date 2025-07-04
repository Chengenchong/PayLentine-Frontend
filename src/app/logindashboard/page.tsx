'use client';

import dynamic from 'next/dynamic';

const Content = dynamic(() => import('../../pages/LoginDashboard/Content'), {
  ssr: false,
});

export default function TransactionsPage() {
  return <Content />;
}
