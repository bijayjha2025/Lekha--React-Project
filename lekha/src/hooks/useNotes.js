import { useState, useEffect, useCallback, useRef } from 'react';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const savedTimeoutRef = useRef(null);
  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    const savedNotes = localStorage.getItem('allNotes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
      if (parsed.length > 0 && window.innerWidth > 768) {
        selectNote(parsed[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (notes.length === 0) {
      localStorage.removeItem('allNotes');
    } else {
      localStorage.setItem('allNotes', JSON.stringify(notes));
    }
  }, [notes]);

  const saveCurrentNote = useCallback(() => {
    if (!activeNoteId) return;

    setNotes(prev =>
      prev.map(note =>
        note.id === activeNoteId
          ? {
              ...note,
              title: currentTitle,
              content: currentContent,
              tags: currentTags,
              updatedAt: new Date().toISOString()
            }
          : note
      )
    );
    setIsSaving(false);
  }, [activeNoteId, currentTitle, currentContent, currentTags]);

  useEffect(() => {
    if (!activeNoteId) return;

    setIsSaving(true);

    if (savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
    }

    savedTimeoutRef.current = setTimeout(() => {
      saveCurrentNote();
    }, 1000);

    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, [currentTitle, currentContent, currentTags, saveCurrentNote]);

  const createNewNote = (template= null) => {
    const newNote = {
      id: Date.now(),
      title: template? template.title : 'Untitled Note',
      content: template? template.content : '',
      tags: template? template.tags : [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
    setCurrentTags([]);
  };

  const selectNote = (note) => {
    setActiveNoteId(note.id);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
    setCurrentTags(note.tags || []);
    if (window.innerWidth <= 768) {
      return true;
    }
    return false;
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);

    if (activeNoteId === id) {
      if (newNotes.length > 0) {
        const n = newNotes[0];
        setActiveNoteId(n.id);
        setCurrentTitle(n.title);
        setCurrentContent(n.content);
        setCurrentTags(n.tags || []);
      } else {
        setActiveNoteId(null);
        setCurrentTitle('');
        setCurrentContent('');
        setCurrentTags([]);
      }
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setCurrentTags([...currentTags, trimmedTag]);
      return true;
    }
    return false;
  };

  const removeTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags || []))].sort();

  const togglePin = (noteId) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() } : note
      )
    );
  }

  return {
    notes,
    activeNoteId,
    activeNote,
    currentTitle,
    currentContent,
    currentTags,
    isSaving,
    allTags,
    setCurrentTitle,
    setCurrentContent,
    createNewNote,
    selectNote,
    deleteNote,
    addTag,
    removeTag,
    togglePin,
  };
};