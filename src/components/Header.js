import React from 'react';
import { useTheme } from '../services/ThemeContext';
import './Header.css';

const Header = ({ currentPage, onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="header-logo" 
          onClick={() => onNavigate('fragments')}
          title="Go to Fragments"
        >
          Code Wallet
        </button>
      </div>
      
      <nav className="header-nav">
        <button
          className={`nav-btn ${currentPage === 'fragments' ? 'active' : ''}`}
          onClick={() => onNavigate('fragments')}
        >
          Fragments
        </button>
        <button
          className={`nav-btn ${currentPage === 'tags' ? 'active' : ''}`}
          onClick={() => onNavigate('tags')}
        >
          Tags
        </button>
      </nav>
      
      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode (Ctrl+D)`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        <button
          className="btn btn-primary new-btn"
          onClick={() => onNavigate('form')}
          title="New Fragment (Ctrl+N)"
        >
          New
        </button>
        
        <button
          className="info-btn"
          onClick={() => onNavigate('info')}
          title="Information"
        >
          Info
        </button>
      </div>
    </header>
  );
};

export default Header;