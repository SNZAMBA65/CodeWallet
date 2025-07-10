import React, { useState, useEffect, useRef } from 'react';
import { useFragments } from '../services/FragmentsContext';
import './FragmentFormPage.css';

const FragmentFormPage = ({ fragment, onNavigate }) => {
  const { addFragment, updateFragment, deleteFragment, tags: availableTags } = useFragments();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  
  const titleInputRef = useRef(null);
  const codeTextareaRef = useRef(null);
  const tagInputRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (fragment) {
      setFormData({
        title: fragment.title || '',
        code: fragment.code || '',
        tags: fragment.tags || []
      });
    } else {
      setFormData({
        title: '',
        code: '',
        tags: []
      });
    }
    
    // Focus title input when component mounts
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, [fragment]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'Enter':
            if (e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
            break;
        }
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.trim().length < 10) {
      newErrors.code = 'Code must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setShowTagSuggestions(false);
      setNewTag('');
    }
  };

  const handleTagSuggestionClick = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
    setShowTagSuggestions(false);
  };

  const getFilteredSuggestions = () => {
    if (!newTag.trim()) return [];
    return availableTags.filter(tag => 
      tag.toLowerCase().includes(newTag.toLowerCase()) &&
      !formData.tags.includes(tag)
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const fragmentData = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        tags: formData.tags
      };
      
      if (fragment) {
        updateFragment(fragment.id, fragmentData);
      } else {
        addFragment(fragmentData);
      }
      
      // Navigate back to fragments page
      setTimeout(() => {
        onNavigate('fragments');
      }, 100);
      
    } catch (error) {
      console.error('Error saving fragment:', error);
      setErrors({ general: 'Failed to save fragment. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!fragment) return;
    
    const confirmMessage = `Are you sure you want to delete "${fragment.title}"?\nThis action cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      deleteFragment(fragment.id);
      onNavigate('fragments');
    }
  };

  const handleCancel = () => {
    const hasChanges = fragment ? 
      (formData.title !== fragment.title || 
       formData.code !== fragment.code || 
       JSON.stringify(formData.tags) !== JSON.stringify(fragment.tags)) :
      (formData.title.trim() || formData.code.trim() || formData.tags.length > 0);
    
    if (hasChanges) {
      const confirmMessage = 'You have unsaved changes. Are you sure you want to leave?';
      if (window.confirm(confirmMessage)) {
        onNavigate('fragments');
      }
    } else {
      onNavigate('fragments');
    }
  };

  // Auto-resize textarea
  const handleCodeChange = (value) => {
    handleInputChange('code', value);
    
    // Auto-resize textarea
    const textarea = codeTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
    }
  };

  const insertTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      // Insert tab character
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      handleCodeChange(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="fragment-form-page">
      <div className="form-header">
        <div className="form-title">
          <h1>{fragment ? 'Edit Fragment' : 'New Fragment'}</h1>
          <p className="form-subtitle">
            {fragment ? 'Update your code fragment' : 'Create a new code fragment'}
          </p>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            title="Cancel (Esc)"
          >
            Cancel
          </button>
          {fragment && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              title="Delete Fragment"
            >
              🗑️ Delete
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            title="Save Fragment (Ctrl+S)"
          >
            {isSaving ? (
              <>
                <span className="spinner"></span>
                Saving...
              </>
            ) : (
              <>💾 Save</>
            )}
          </button>
        </div>
      </div>

      <div className="form-content">
        <div className="form-section">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            ref={titleInputRef}
            id="title"
            type="text"
            className={`input ${errors.title ? 'error' : ''}`}
            placeholder="Enter fragment title..."
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength={100}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="code" className="form-label">
            Code *
          </label>
          <textarea
            ref={codeTextareaRef}
            id="code"
            className={`code-textarea ${errors.code ? 'error' : ''}`}
            placeholder="Enter your code here...
You can use Tab for indentation"
            value={formData.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={insertTab}
            spellCheck={false}
            rows={10}
          />
          {errors.code && (
            <span className="error-message">{errors.code}</span>
          )}
          <div className="code-info">
            <div className="character-count">
              {formData.code.length} characters, {formData.code.split('\n').length} lines
            </div>
            <div className="code-hint">
              💡 Tip: Use Tab for indentation, Ctrl+S to save
            </div>
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <div className="tags-container">
            <div className="selected-tags">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag tag-removable">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveTag(tag)}
                    title={`Remove ${tag} tag`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            
            <div className="tag-input-container">
              <input
                ref={tagInputRef}
                id="tags"
                type="text"
                className="input tag-input"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setShowTagSuggestions(e.target.value.trim().length > 0);
                }}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => setShowTagSuggestions(newTag.trim().length > 0)}
                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
              />
              <button
                type="button"
                className="btn btn-secondary add-tag-btn"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add
              </button>
            </div>
            
            {showTagSuggestions && getFilteredSuggestions().length > 0 && (
              <div className="tag-suggestions">
                {getFilteredSuggestions().map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className="tag-suggestion"
                    onClick={() => handleTagSuggestionClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="tags-hint">
            Add tags to organize and find your fragments easily
          </div>
        </div>

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}
      </div>
    </div>
  );
};

export default FragmentFormPage;