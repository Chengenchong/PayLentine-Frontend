'use client';

import React from 'react';
import LoginHeader from '../../components/LoginHeader';
import Footer from '../../components/Footer';
import DuplicatedDashboardContent from '../../pages/DuplicatedDashboard/Context';

export default function DuplicatedDashboardPage() {
  return (
    <>
      <LoginHeader />
      <DuplicatedDashboardContent />
      <Footer />
    </>
  );
}
