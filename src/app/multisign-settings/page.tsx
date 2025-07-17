"use client";
import React from 'react';
import Header from '../../components/LoginHeader';
import Footer from '../../components/Footer';
import ClientOnly from '../../components/ClientOnly';

// Import Content as a dynamic component to ensure proper hydration
import dynamic from 'next/dynamic';

const Content = dynamic(() => import('../../pages/MultiSign-Settings/Content'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function MultiSignSettingsPage() {
  return (
    <>
      <Header />
      <ClientOnly>
        <Content />
      </ClientOnly>
      <Footer />
    </>
  );
} 