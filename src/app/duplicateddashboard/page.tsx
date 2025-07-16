'use client';

import React from 'react';
import LoginHeader from '../../components/LoginHeader';
import Footer from '../../components/Footer';
import Context from '../../pages/DuplicatedDashboard/Context';
import { MultiSignProvider } from '../../pages/MultiSign-Settings/Content';

export default function DuplicatedDashboardPage() {
  return (
    <>
      <LoginHeader />
      <MultiSignProvider>
        <Context />
      </MultiSignProvider>
      <Footer />
    </>
  );
}
