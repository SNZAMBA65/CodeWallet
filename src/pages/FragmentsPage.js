import React, { useState, useEffect } from 'react';
import { useFragments } from '../services/FragmentsContext';
import FragmentCard from '../components/FragmentCard';
import CodeModal from '../components/CodeModal';
import './FragmentsPage.css';

const FragmentsPage = ({ onNavigate }) => {
  const { fragments, deleteFragment, searchFragments } = useFragments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFragments, setFilteredFragments] = useState(fragments);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Update filtered fragments when fragments or search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredFragments(searchFragments(searchTerm));
    } else {
      setFilteredFragments(fragments);
    }
  }, [fragments, searchTerm, searchFragments]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
            break;
          case 'n':
            e.preventDefault();
            onNavigate('form');
            break;
        }
      }
      if (e.key === 'Escape') {
        setSearchTerm('');
        document.querySelector('.search-input')?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      
      // Check if it's a text file
      if (file.type.startsWith('text/') || 
          file.name.match(/\.(js|jsx|ts|tsx|py|java|cpp|c|h|css|html|xml|json|md|txt|sql|sh|bat)$/i)) {
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
          
          // Navigate to form with pre-filled data
          onNavigate('form', {
            title: fileName,
            code: content,
            tags: [getFileExtension(file.name)]
          });
        };
        reader.readAsText(file);
      } else {
        alert('Please drop a text file or code file.');
      }
    }
  };

  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React',
      'ts': 'TypeScript',
      'tsx': 'TypeScript React',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'h': 'C Header',
      'css': 'CSS',
      'html': 'HTML',
      'xml': 'XML',
      'json': 'JSON',
      'md': 'Markdown',
      'sql': 'SQL',
      'sh': 'Shell',
      'bat': 'Batch'
    };
    return languageMap[ext] || ext.toUpperCase();
  };

  const handleEditFragment = (fragment) => {
    onNavigate('form', fragment);
  };

  const handleViewFragment = (fragment) => {
    setSelectedFragment(fragment);
    setShowCodeModal(true);
  };

  const handleDeleteFragment = (fragmentId) => {
    deleteFragment(fragmentId);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div 
      className={`fragments-page ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Search and Actions Bar */}
      <div className="fragments-header">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input input"
              placeholder="Search fragments... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={clearSearch}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-results">
            {searchTerm && (
              <span className="search-count">
                {filteredFragments.length} result{filteredFragments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        <div className="fragments-actions">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('form')}
            title="New Fragment (Ctrl+N)"
          >
            ➕ New Fragment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="fragments-content">
        {filteredFragments.length === 0 ? (
          <div className="empty-state">
            {fragments.length === 0 ? (
              // No fragments at all
              <div className="empty-message">
                <div className="empty-icon">📝</div>
                <h3>No code fragments yet</h3>
                <p>Create your first fragment to get started!</p>
                <div className="empty-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('form')}
                  >
                    Create First Fragment
                  </button>
                </div>
                <div className="drop-hint">
                  <p>💡 <strong>Tip:</strong> You can also drag & drop text files here</p>
                </div>
              </div>
            ) : (
              // No search results
              <div className="empty-message">
                <div className="empty-icon">🔍</div>
                <h3>No fragments found</h3>
                <p>No fragments match your search "{searchTerm}"</p>
                <button
                  className="btn btn-secondary"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="fragments-grid">
            {filteredFragments.map((fragment) => (
              <FragmentCard
                key={fragment.id}
                fragment={fragment}
                onEdit={handleEditFragment}
                onView={handleViewFragment}
                onDelete={handleDeleteFragment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drag & Drop Overlay */}
      {dragActive && (
        <div className="drop-overlay">
          <div className="drop-message">
            <div className="drop-icon">📁</div>
            <h3>Drop your file here</h3>
            <p>Supported: .js, .py, .java, .cpp, .html, .css, .md, .txt and more</p>
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && selectedFragment && (
        <CodeModal
          fragment={selectedFragment}
          onClose={() => {
            setShowCodeModal(false);
            setSelectedFragment(null);
          }}
        />
      )}
    </div>
  );
};

export default FragmentsPage;