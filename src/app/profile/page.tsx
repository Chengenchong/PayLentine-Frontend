'use client';

import React from 'react';
import LoginHeader from '../../components/LoginHeader';
import Footer from '../../components/Footer';
import ProfileContent from '../../pages/Profile/Context';

export default function ProfilePage() {
  return (
    <>
      <LoginHeader />
      <ProfileContent />
      <Footer />
    </>
  );
}
