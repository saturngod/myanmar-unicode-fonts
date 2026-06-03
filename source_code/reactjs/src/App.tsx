import React, { useState } from 'react';
import { FontProvider } from './Context/mmfontContext';
import { ToastProvider } from './Context/toastContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <FontProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex flex-1">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <MainContent />
          </div>
        </div>
      </ToastProvider>
    </FontProvider>
  );
};

export default App;
