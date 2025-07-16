"use client";
import React from 'react';
import Header from '../../components/LoginHeader';
import Footer from '../../components/Footer';
import Content, { MultiSignProvider } from '../../pages/MultiSign-Settings/Content';

export default function MultiSignSettingsPage() {
  return (
    <>
      <Header />
      <MultiSignProvider>
        <Content />
      </MultiSignProvider>
      <Footer />
    </>
  );
} 