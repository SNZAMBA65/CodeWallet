import React, { useState, useEffect } from 'react';
import { FragmentsProvider } from './services/FragmentsContext';
import { ThemeProvider } from './services/ThemeContext';
import Header from './components/Header';
import FragmentsPage from './pages/FragmentsPage';
import TagsPage from './pages/TagsPage';
import FragmentFormPage from './pages/FragmentFormPage';
import InfoPage from './pages/InfoPage';
import './styles/App.css';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

function App() {
  const [currentPage, setCurrentPage] = useState('fragments');
  const [selectedFragment, setSelectedFragment] = useState(null);

  // Handle keyboard shortcuts from Electron
  useEffect(() => {
    if (!ipcRenderer) return;

    const handleNewFragment = () => {
      setSelectedFragment(null);
      setCurrentPage('form');
    };

    const handleSearch = () => {
      // Will implement search functionality later
      console.log('Search shortcut triggered');
    };

    const handleDarkMode = () => {
      // Dark mode toggle will be handled by ThemeContext
      document.dispatchEvent(new CustomEvent('toggle-dark-mode'));
    };

    ipcRenderer.on('shortcut-new-fragment', handleNewFragment);
    ipcRenderer.on('shortcut-search', handleSearch);
    ipcRenderer.on('shortcut-dark-mode', handleDarkMode);

    return () => {
      ipcRenderer.removeListener('shortcut-new-fragment', handleNewFragment);
      ipcRenderer.removeListener('shortcut-search', handleSearch);
      ipcRenderer.removeListener('shortcut-dark-mode', handleDarkMode);
    };
  }, []);

  const navigateToPage = (page, fragment = null) => {
    setCurrentPage(page);
    setSelectedFragment(fragment);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'fragments':
        return <FragmentsPage onNavigate={navigateToPage} />;
      case 'tags':
        return <TagsPage onNavigate={navigateToPage} />;
      case 'form':
        return (
          <FragmentFormPage 
            fragment={selectedFragment} 
            onNavigate={navigateToPage} 
          />
        );
      case 'info':
        return <InfoPage onNavigate={navigateToPage} />;
      default:
        return <FragmentsPage onNavigate={navigateToPage} />;
    }
  };

  return (
    <ThemeProvider>
      <FragmentsProvider>
        <div className="app">
          <Header 
            currentPage={currentPage} 
            onNavigate={navigateToPage} 
          />
          <main className="app-content">
            {renderCurrentPage()}
          </main>
        </div>
      </FragmentsProvider>
    </ThemeProvider>
  );
}

export default App;