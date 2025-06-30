import dynamic from 'next/dynamic';

const Content = dynamic(() => import('../../pages/TransactionHistory/Content'), { ssr: false });

export default function TransactionHistoryPage() {
  return <Content />;
} 