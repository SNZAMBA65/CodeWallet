import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FragmentsContext = createContext();

export const useFragments = () => {
  const context = useContext(FragmentsContext);
  if (!context) {
    throw new Error('useFragments must be used within a FragmentsProvider');
  }
  return context;
};

export const FragmentsProvider = ({ children }) => {
  const [fragments, setFragments] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagColors, setTagColors] = useState({});

  // Couleurs prédéfinies pour les tags
  const availableColors = [
    '#9a48d0', // Violet (défaut)
    '#e74c3c', // Rouge
    '#3498db', // Bleu
    '#2ecc71', // Vert
    '#f39c12', // Orange
    '#e67e22', // Orange foncé
    '#1abc9c', // Turquoise
    '#9b59b6', // Violet foncé
    '#34495e', // Gris bleu
    '#16a085', // Vert bleu
    '#27ae60', // Vert foncé
    '#d35400'  // Orange rouge
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFragments = localStorage.getItem('code-wallet-fragments');
    const savedTags = localStorage.getItem('code-wallet-tags');
    const savedTagColors = localStorage.getItem('code-wallet-tag-colors');
    
    if (savedFragments) {
      try {
        setFragments(JSON.parse(savedFragments));
      } catch (error) {
        console.error('Error loading fragments:', error);
      }
    }
    
    if (savedTags) {
      try {
        setTags(JSON.parse(savedTags));
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    }

    if (savedTagColors) {
      try {
        setTagColors(JSON.parse(savedTagColors));
      } catch (error) {
        console.error('Error loading tag colors:', error);
      }
    }
  }, []);

  // Save fragments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-wallet-fragments', JSON.stringify(fragments));
  }, [fragments]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-wallet-tags', JSON.stringify(tags));
  }, [tags]);

  // Save tag colors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-wallet-tag-colors', JSON.stringify(tagColors));
  }, [tagColors]);

  // Fragment CRUD operations
  const addFragment = (fragmentData) => {
    const newFragment = {
      id: uuidv4(),
      title: fragmentData.title,
      code: fragmentData.code,
      tags: fragmentData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFragments(prev => [...prev, newFragment]);
    
    // Add new tags to the tags list
    if (fragmentData.tags) {
      fragmentData.tags.forEach(tagName => {
        addTag(tagName);
      });
    }
    
    return newFragment;
  };

  const updateFragment = (id, updates) => {
    setFragments(prev => prev.map(fragment => 
      fragment.id === id 
        ? { 
            ...fragment, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : fragment
    ));
    
    // Add new tags if any
    if (updates.tags) {
      updates.tags.forEach(tagName => {
        addTag(tagName);
      });
    }
  };

  const deleteFragment = (id) => {
    setFragments(prev => prev.filter(fragment => fragment.id !== id));
  };

  const getFragmentById = (id) => {
    return fragments.find(fragment => fragment.id === id);
  };

  // Tag operations
  const addTag = (tagName, color = null) => {
    if (!tagName || typeof tagName !== 'string') return false;
    
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      
      // Assigner une couleur si pas fournie
      const finalColor = color || '#9a48d0'; // Couleur par défaut
      setTagColors(prev => ({
        ...prev,
        [trimmedTag]: finalColor
      }));
      return true;
    }
    return false;
  };

  const removeTag = (tagName) => {
    setTags(prev => prev.filter(tag => tag !== tagName));
    setTagColors(prev => {
      const newColors = { ...prev };
      delete newColors[tagName];
      return newColors;
    });
    
    // Remove tag from all fragments
    setFragments(prev => prev.map(fragment => ({
      ...fragment,
      tags: fragment.tags.filter(tag => tag !== tagName),
      updatedAt: new Date().toISOString()
    })));
  };

  const updateTag = (oldTagName, newTagName) => {
    if (!newTagName || typeof newTagName !== 'string') return;
    
    const trimmedNewTag = newTagName.trim();
    if (!trimmedNewTag) return;
    
    // Update in tags list
    setTags(prev => prev.map(tag => tag === oldTagName ? trimmedNewTag : tag));
    
    // Update in tag colors (keep the same color)
    setTagColors(prev => {
      const newColors = { ...prev };
      if (newColors[oldTagName]) {
        newColors[trimmedNewTag] = newColors[oldTagName];
        delete newColors[oldTagName];
      }
      return newColors;
    });
    
    // Update in all fragments
    setFragments(prev => prev.map(fragment => ({
      ...fragment,
      tags: fragment.tags.map(tag => tag === oldTagName ? trimmedNewTag : tag),
      updatedAt: new Date().toISOString()
    })));
  };

  const updateTagColor = (tagName, color) => {
    setTagColors(prev => ({
      ...prev,
      [tagName]: color
    }));
  };

  const getTagColor = (tagName) => {
    return tagColors[tagName] || '#9a48d0';
  };

  // Search and filter
  const searchFragments = (searchTerm) => {
    if (!searchTerm) return fragments;
    
    const term = searchTerm.toLowerCase();
    return fragments.filter(fragment =>
      fragment.title.toLowerCase().includes(term) ||
      fragment.code.toLowerCase().includes(term) ||
      fragment.tags.some(tag => tag.toLowerCase().includes(term))
    );
  };

  const getFragmentsByTag = (tagName) => {
    return fragments.filter(fragment => fragment.tags.includes(tagName));
  };

  const value = {
    fragments,
    tags,
    tagColors,
    addFragment,
    updateFragment,
    deleteFragment,
    getFragmentById,
    addTag,
    removeTag,
    updateTag,
    updateTagColor,
    getTagColor,
    searchFragments,
    getFragmentsByTag
  };

  return (
    <FragmentsContext.Provider value={value}>
      {children}
    </FragmentsContext.Provider>
  );
};