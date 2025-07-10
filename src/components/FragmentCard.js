import React from 'react';
import './FragmentCard.css';

const FragmentCard = ({ fragment, onEdit, onView, onDelete }) => {
  const handleCardClick = () => {
    onEdit(fragment);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onView(fragment);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${fragment.title}"?`)) {
      onDelete(fragment.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fragment-card" onClick={handleCardClick}>
      <div className="fragment-card-header">
        <h3 className="fragment-title">{fragment.title}</h3>
        <div className="fragment-actions">
          <button
            className="action-btn view-btn"
            onClick={handleViewClick}
            title="View Code"
          >
            👁️
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="Delete Fragment"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="fragment-code-preview">
        <pre>
          <code>{fragment.code.substring(0, 100)}{fragment.code.length > 100 ? '...' : ''}</code>
        </pre>
      </div>
      
      {fragment.tags && fragment.tags.length > 0 && (
        <div className="fragment-tags">
          {fragment.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="fragment-meta">
        <small>Created: {formatDate(fragment.createdAt)}</small>
        {fragment.updatedAt !== fragment.createdAt && (
          <small>Updated: {formatDate(fragment.updatedAt)}</small>
        )}
      </div>
    </div>
  );
};

export default FragmentCard;