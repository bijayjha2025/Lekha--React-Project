import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Search, X, Tag, Menu, ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Logo from './assets/Lekha.png';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [tagInput, setTagInput] = useState('');
  const activeNote = notes.find(n => n.id === activeNoteId);

  const savedTimeoutRef = useRef(null);

  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    noteId: null,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      tags: [],
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
      setIsSidebarOpen(false);
    }
  };

  const saveCurrentNote = useCallback(() => {
    if(!activeNoteId) return;

    setNotes(prev =>
      prev.map(note =>
      note.id === activeNoteId ? { ...note, title: currentTitle, content: currentContent, tags:currentTags, updatedAt: new Date().toISOString() } : note )
    );
    setIsSaving(false);
  }, [activeNoteId, currentTitle, currentContent, currentTags]);

    useEffect(() => {
    if(!activeNoteId) return;

    setIsSaving(true);

    if(savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
    }

    savedTimeoutRef.current = setTimeout(() => {
      saveCurrentNote();
    }, 1000);

    return () => {
      if(savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, [currentTitle, currentContent, currentTags, saveCurrentNote]);

  const requestDeleteNote = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ visible: true, noteId: id });
  };

  const confirmDeleteNote = () => {
    const id = confirmDelete.noteId;
    const newNotes= notes.filter(note => note.id !== id);
    setNotes(newNotes);

    if(activeNoteId === id) {
      if(newNotes.length > 0) {
        const n = newNotes[0];
        setActiveNoteId(n.id);
        setCurrentTitle(n.title);
        setCurrentContent(n.content);
        setCurrentTags(n.tags || []);
      }else{
          setActiveNoteId(null);
          setCurrentTitle('');
          setCurrentContent('');
          setCurrentTags([]);
        }
      }
    
    setConfirmDelete({ visible: false, noteId: null });
  };

  const cancelDeleteNote = () => {
    setConfirmDelete({ visible: false, noteId: null });
  }

  useEffect(() => {
    if(!confirmDelete.visible) return;
    const timer = setTimeout(cancelDeleteNote, 5000);
    return () => clearTimeout(timer);
  }, [confirmDelete.visible]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if(tag && !currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags || []))].sort();

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const plainContent = stripHtml(note.content);
    const matchesSearch = note.title.toLowerCase().includes(searchLower) || plainContent.toLowerCase().includes(searchLower);
    const matchesTag = !selectedTag || selectedTag === 'all' || (note.tags || []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const cleanText = stripHtml(currentContent);
  const charCount = cleanText.length;
  const wordCount = cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'align',
    'link', 'image'
  ];

  const tagColors = [
    'bg-red-100 text-red-700',
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-orange-100 text-orange-700',
  ];

  const getTagColor = (tag) => {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return tagColors[index % tagColors.length];
  };

  return(
  <div className='flex h-screen bg-gray-100 overflow-hidden'>
   <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
    <div className='p-4 border-b'>

     <div className='flex items-center gap-3 mb-4'>
      <img src={Logo} alt='LogoOfLekha' className='w-9 h-9' />
      <div>
       <h1 className="text-lg font-bold text-gray-800">Lekha</h1>
       <p className="text-[11px] text-gray-500 leading-tight">Your companion for customized notes</p>
      </div>
      </div>

     <div className='relative mb-3'>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
       <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..." className="w-full pl-9 pr-8 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#bff542] outline-none text-sm"/>
     </div>

     <div className='mb-2'>
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className='w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-xs'>
       <option value='all'>All Tags</option>
        {allTags.map(tag => (
         <option key={tag} value={tag}>{tag}</option>
        ))}
       </select>
      </div>

      <div className='mb-3'>
       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-xs' >
        <option value='updated'>Last Updated</option>
        <option value='created'>Creation Date</option>
        <option value='title'>Title (A-Z)</option>
       </select>
      </div>

     <button onClick={createNewNote} className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#71f022] text-black rounded-lg hover:bg-[#0dd417] transition-colors cursor-pointer'><Plus size={18} /> New Note</button>
    </div>

    <div className='flex-1 overflow-y-auto'>
     {sortedNotes.map(note => (
      <div key={note.id} onClick={() => selectNote(note)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#c8fa6b] transition-colors ${note.id === activeNoteId ? 'bg-[#f0ffd6] border-l-4 border-l-[#71f022]' : 'hover:bg-gray-50'}`}>
       
      <div className='flex justify-between items-start'>
       <h3 className='font-medium text-gray-800 truncate flex-1'>{note.title || 'Untitled'}</h3>
       <button onClick={(e) => requestDeleteNote(note.id, e)} className='text-red-500 hover:text-red-700'><Trash2 size={16} /></button>
      </div>
      <p className='text-xs text-gray-500 line-clamp-1 mt-1'>{stripHtml(note.content) || 'Empty note...'}</p>
     </div>
     ))}
    </div>
   </div>

   <div className='flex-1 flex flex-col min-w-0 bg-white'>
    <div className="md:hidden flex items-center p-4 border-b bg-white">
     <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-600"><Menu size={20} /></button>
     <div className="flex-1 text-center font-bold text-gray-800">Lekha</div>
     <div className="w-8"></div>
    </div>

    {activeNoteId ? (
     <>
     <div className='px-4 py-2 border-b border-gray-100'>
      <div className='flex items-center gap-2 md:hidden mb-2'>
       <button onClick={() => setIsSidebarOpen(true)} className='text-sm flex items-center text-gray-500'><ChevronLeft size={16}/>Back to list</button>
      </div>

      <input type='text' value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} placeholder='Note Title...' className='w-full py-2 text-xl text-gray-800 md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#bff542]'/>

      <div className='flex flex-wrap items-center gap-3 mt-2 pb-2'>
       <div className='flex items-center gap-2'>
        <Tag size={14} className='text-gray-400' />
        <input type='text' value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder='Add tags (Press Enter)' className='flex-1 text-sm border-b border-gray-300 focus:border-[#71f022] focus:outline-none py-1' />
        <button onClick={addTag} className='text-xs border-none focus:ring-0 p-0 w-20'>Add tag...</button>
       </div>
        
       <div className='flex gap-1'>
        {currentTags.map(tag => (
        <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${getTagColor(tag)}`}>
         {tag} <X size={10} className='cursor-pointer' onClick={()=> removeTag(tag)} /> </span>
        ))}
       </div>
      </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
       < ReactQuill theme='snow' value={currentContent} onChange={setCurrentContent} modules={modules} formats={formats} placeholder="Start typing your note..." className="h-full quill-responsive" />
      </div>

      <div className="p-2 border-t flex justify-between items-center text-[10px] text-gray-400 bg-gray-50">
       <div>{isSaving ? 'Saving...' : `Saved at ${new Date(activeNote.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</div>
       <div>{wordCount} words | {charCount} chars</div>
      </div>
      </>

      ) : (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
       <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Plus className="text-gray-400" size={40} />
       </div>

       <h2 className="text-lg font-semibold text-gray-700">No Note Selected</h2>
        <p className="text-gray-500 max-w-xs mb-6">Select a note from the sidebar or create a new one to start writing.</p>
        <button onClick={createNewNote} className="md:hidden px-6 py-2 bg-[#71f022] rounded-lg font-bold" >New Note</button>
       </div>
       )}
     </div>
   
   {confirmDelete.visible && (
    <div className="fixed top-6 right-6 z-50">
     <div className="bg-white border shadow-xl rounded-lg p-4 w-72 animate-fade-in">
      <div className="flex justify-between">
       <p className="text-sm">Delete this note permanently?</p>
       <button onClick={cancelDeleteNote}><X size={16} /></button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
       <button onClick={cancelDeleteNote} className="px-3 py-1 border rounded text-xs">Cancel</button>
       <button onClick={confirmDeleteNote} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
      </div>
     </div>
    </div>
   )}
  
   {isSidebarOpen && (
    <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} /> )}</div>
  );
};

export default App;