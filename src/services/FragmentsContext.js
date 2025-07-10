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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFragments = localStorage.getItem('code-wallet-fragments');
    const savedTags = localStorage.getItem('code-wallet-tags');
    
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
  }, []);

  // Save fragments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-wallet-fragments', JSON.stringify(fragments));
  }, [fragments]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('code-wallet-tags', JSON.stringify(tags));
  }, [tags]);

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
  const addTag = (tagName) => {
    if (!tagName || typeof tagName !== 'string') return false;
    
    const trimmedTag = tagName.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      return true;
    }
    return false;
  };

  const removeTag = (tagName) => {
    setTags(prev => prev.filter(tag => tag !== tagName));
    
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
    
    // Update in all fragments
    setFragments(prev => prev.map(fragment => ({
      ...fragment,
      tags: fragment.tags.map(tag => tag === oldTagName ? trimmedNewTag : tag),
      updatedAt: new Date().toISOString()
    })));
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
    addFragment,
    updateFragment,
    deleteFragment,
    getFragmentById,
    addTag,
    removeTag,
    updateTag,
    searchFragments,
    getFragmentsByTag
  };

  return (
    <FragmentsContext.Provider value={value}>
      {children}
    </FragmentsContext.Provider>
  );
};