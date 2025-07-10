import React from 'react';
import { useFragments } from '../services/FragmentsContext';

const Tag = ({ 
  name, 
  removable = false, 
  onRemove, 
  size = 'normal',
  className = '',
  onClick,
  style = {}
}) => {
  const { getTagColor } = useFragments();
  
  const tagColor = getTagColor(name);
  
  const sizeClasses = {
    small: 'tag-small',
    normal: '',
    large: 'tag-large'
  };

  const tagStyle = {
    backgroundColor: tagColor,
    ...style
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(name);
    }
  };

  const handleClick = (e) => {
    if (onClick) {
      onClick(name, e);
    }
  };

  return (
    <span 
      className={`tag ${sizeClasses[size]} ${removable ? 'tag-removable' : ''} ${className}`}
      style={tagStyle}
      onClick={handleClick}
    >
      {name}
      {removable && (
        <button
          type="button"
          className="tag-remove"
          onClick={handleRemove}
          title={`Remove ${name} tag`}
        >
          ✕
        </button>
      )}
    </span>
  );
};

export default Tag;