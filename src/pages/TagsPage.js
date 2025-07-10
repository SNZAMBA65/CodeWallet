import React, { useState, useEffect } from 'react';
import { useFragments } from '../services/FragmentsContext';
import './TagsPage.css';

const TagsPage = ({ onNavigate }) => {
  const { tags, fragments, removeTag, updateTag, addTag, getFragmentsByTag } = useFragments();
  const [editingTag, setEditingTag] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState(tags);
  const [showNewTagModal, setShowNewTagModal] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  // Update filtered tags when tags or search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredTags(tags.filter(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredTags(tags);
    }
  }, [tags, searchTerm]);

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
        setSelectedTag(null);
        setEditingTag(null);
        setSearchTerm('');
        setShowNewTagModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const handleCreateNewTag = () => {
    setShowNewTagModal(true);
    setNewTagValue('');
  };

  const handleSaveNewTag = () => {
    if (newTagValue.trim() && !tags.includes(newTagValue.trim())) {
      addTag(newTagValue.trim());
      setShowNewTagModal(false);
      setNewTagValue('');
    }
  };

  const handleCancelNewTag = () => {
    setShowNewTagModal(false);
    setNewTagValue('');
  };

  const getTagUsageCount = (tagName) => {
    return fragments.filter(fragment => fragment.tags.includes(tagName)).length;
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setEditValue(tag);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== editingTag) {
      updateTag(editingTag, editValue.trim());
    }
    setEditingTag(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditValue('');
  };

  const handleDeleteTag = (tag) => {
    const count = getTagUsageCount(tag);
    const message = count > 0 
      ? `Are you sure you want to delete the tag "${tag}"?\nThis will remove it from ${count} fragment${count !== 1 ? 's' : ''}.`
      : `Are you sure you want to delete the tag "${tag}"?`;
    
    if (window.confirm(message)) {
      removeTag(tag);
      if (selectedTag === tag) {
        setSelectedTag(null);
      }
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleFragmentClick = (fragment) => {
    onNavigate('form', fragment);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const selectedTagFragments = selectedTag ? getFragmentsByTag(selectedTag) : [];

  return (
    <div className="tags-page">
      {/* Header */}
      <div className="tags-header">
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input input"
              placeholder="Search tags... (Ctrl+F)"
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
                {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        </div>
        
        <div className="tags-actions">
          <button
            className="btn btn-secondary"
            onClick={handleCreateNewTag}
            title="Create New Tag"
          >
            🏷️ New Tag
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('form')}
            title="New Fragment (Ctrl+N)"
          >
            ➕ New Fragment
          </button>
        </div>
      </div>

      <div className="tags-content">
        {filteredTags.length === 0 ? (
          <div className="empty-state">
            {tags.length === 0 ? (
              <div className="empty-message">
                <div className="empty-icon">🏷️</div>
                <h3>No tags yet</h3>
                <p>Tags will appear here when you create fragments with tags.</p>
                <div className="empty-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleCreateNewTag}
                  >
                    Create First Tag
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('form')}
                  >
                    Create First Fragment
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-message">
                <div className="empty-icon">🔍</div>
                <h3>No tags found</h3>
                <p>No tags match your search "{searchTerm}"</p>
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
          <div className="tags-grid-container">
            {/* Tags Grid */}
            <div className="tags-grid">
              <div className="tags-grid-header">
                <h2>All Tags ({filteredTags.length})</h2>
                <p>Click on a tag to see associated fragments</p>
              </div>
              
              <div className="tags-list">
                {filteredTags.map((tag) => {
                  const usageCount = getTagUsageCount(tag);
                  const isEditing = editingTag === tag;
                  const isSelected = selectedTag === tag;
                  
                  return (
                    <div 
                      key={tag} 
                      className={`tag-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isEditing && handleTagClick(tag)}
                    >
                      {isEditing ? (
                        <div className="tag-edit-form" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            className="input tag-edit-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                          />
                          <div className="tag-edit-actions">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={handleSaveEdit}
                              disabled={!editValue.trim()}
                            >
                              Save
                            </button>
                            <button 
                              className="btn btn-ghost btn-sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="tag-content">
                            <span className="tag tag-large">{tag}</span>
                            <span className="tag-usage">
                              {usageCount} fragment{usageCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="tag-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTag(tag);
                              }}
                              title="Edit tag"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTag(tag);
                              }}
                              title="Delete tag"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fragments Panel */}
            {selectedTag && (
              <div className="fragments-panel">
                <div className="fragments-panel-header">
                  <h3>Fragments with "{selectedTag}" ({selectedTagFragments.length})</h3>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setSelectedTag(null)}
                    title="Close panel"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="fragments-list">
                  {selectedTagFragments.length === 0 ? (
                    <div className="no-fragments">
                      <p>No fragments found with this tag.</p>
                    </div>
                  ) : (
                    selectedTagFragments.map((fragment) => (
                      <div 
                        key={fragment.id} 
                        className="fragment-item"
                        onClick={() => handleFragmentClick(fragment)}
                      >
                        <div className="fragment-info">
                          <h4 className="fragment-title">{fragment.title}</h4>
                          <div className="fragment-preview">
                            {fragment.code.substring(0, 100)}
                            {fragment.code.length > 100 ? '...' : ''}
                          </div>
                          <div className="fragment-tags">
                            {fragment.tags.map((tag, index) => (
                              <span key={index} className="tag tag-small">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="fragment-date">
                          {new Date(fragment.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Tag Modal */}
      {showNewTagModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancelNewTag()}>
          <div className="modal-content new-tag-modal">
            <div className="modal-header">
              <h3>Create New Tag</h3>
              <button
                className="btn btn-ghost close-btn"
                onClick={handleCancelNewTag}
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="newTagInput" className="form-label">
                Tag Name
              </label>
              <input
                id="newTagInput"
                type="text"
                className="input"
                placeholder="Enter tag name..."
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNewTag();
                  if (e.key === 'Escape') handleCancelNewTag();
                }}
                autoFocus
                maxLength={50}
              />
              {newTagValue.trim() && tags.includes(newTagValue.trim()) && (
                <div className="error-message">
                  This tag already exists
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={handleCancelNewTag}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveNewTag}
                disabled={!newTagValue.trim() || tags.includes(newTagValue.trim())}
              >
                Create Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;