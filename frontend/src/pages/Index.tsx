import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import MainApp from '@/components/MainApp';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default Index;