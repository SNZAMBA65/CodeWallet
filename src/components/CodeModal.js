import React, { useEffect, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import { useTheme } from '../services/ThemeContext';
import './CodeModal.css';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

const CodeModal = ({ fragment, onClose }) => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Apply syntax highlighting
    const codeElement = document.querySelector('.code-modal-content code');
    if (codeElement) {
      hljs.highlightElement(codeElement);
    }
  }, [fragment]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      if (ipcRenderer) {
        // Use Electron's clipboard
        await ipcRenderer.invoke('copy-to-clipboard', fragment.code);
      } else {
        // Fallback to web clipboard API
        await navigator.clipboard.writeText(fragment.code);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = fragment.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Detect language for syntax highlighting
  const detectLanguage = (code) => {
    // Simple language detection based on common patterns
    if (code.includes('function') && code.includes('{')) return 'javascript';
    if (code.includes('def ') && code.includes(':')) return 'python';
    if (code.includes('#include') || code.includes('int main')) return 'cpp';
    if (code.includes('public class') || code.includes('System.out')) return 'java';
    if (code.includes('<html>') || code.includes('<div>')) return 'html';
    if (code.includes('SELECT') || code.includes('FROM')) return 'sql';
    if (code.includes('{') && code.includes('}')) return 'css';
    return 'plaintext';
  };

  const language = detectLanguage(fragment.code);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content code-modal">
        <div className="code-modal-header">
          <div className="code-modal-title">
            <h3>{fragment.title}</h3>
            <span className="code-language">{language}</span>
          </div>
          <div className="code-modal-actions">
            <button
              className={`btn btn-primary copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy to Clipboard (Ctrl+C)"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button
              className="btn btn-ghost close-btn"
              onClick={onClose}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="code-modal-content">
          <pre className={`hljs ${isDarkMode ? 'hljs-dark' : 'hljs-light'}`}>
            <code className={`language-${language}`}>
              {fragment.code}
            </code>
          </pre>
        </div>
        
        {fragment.tags && fragment.tags.length > 0 && (
          <div className="code-modal-footer">
            <div className="modal-tags">
              {fragment.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeModal;