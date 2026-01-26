import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Search, X, Tag } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const activeNote = notes.find(n => n.id === activeNoteId);

  const savedTimeoutRef = useRef(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('allNotes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed);
      if (parsed.length > 0) {
        setActiveNoteId(parsed[0].id);
        setCurrentTitle(parsed[0].title);
        setCurrentContent(parsed[0].content);
        setCurrentTags(parsed[0].tags || []);
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

  const deleteNote = (id, e) => {
    e.stopPropagation();

    if(confirm('Are you sure you want to clear this note?')) {
      const newNotes= notes.filter(note => note.id !== id);
      setNotes(newNotes);

      if(activeNoteId === id) {
        if(newNotes.length > 0) {
          setActiveNoteId(newNotes[0].id);
          setCurrentTitle(newNotes[0].title);
          setCurrentContent(newNotes[0].content);
          setCurrentTags(newNotes[0].tags || []);
        }else{
          setActiveNoteId(null);
          setCurrentTitle('');
          setCurrentContent('');
          setCurrentTags([]);
        }
      }
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if(tag && !currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  }

  const handleTagKeyPress = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const allTags = [...new Set(notes.flatMap(note => note.tags || []))].sort();

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const plainContent = stripHtml(note.content);
    const matchesSearch = note.title.toLowerCase().includes(searchLower) || plainContent.toLowerCase().includes(searchLower);
    const matchesTag = selectedTag === 'all' || (notes.tags || []).includes(selectedTag);

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

  const plainContent = stripHtml(currentContent);
  const charCount = currentContent.length;
  const wordCount = currentContent.trim().split(/\s+/).filter(w => w.length > 0).length;

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
    'list', 'bullet',
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
  <div className='flex h-screen bg-gray-100'>
   <div className='w-72 bg-white border-r border-gray-200 flex flex-col'>
    <div className='p-4 border-b border-gray-200'>
     <h1 className='text-xl font-bold text-gray-800 mb-3'>My Notes</h1>

     <div className='relative mb-3'>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
       <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..." className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542]"/>

      {searchQuery && (
       <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X size={18} />
       </button>
      )}
     </div>

     <div className='mb-3'>
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-sm' >
      <option value='all'>All Tags</option>
       {allTags.map(tag => ( <option key={tag} value={tag}>{tag}</option> ))}
      </select>
     </div>

     <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='w-full mb-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-sm'>
      <option value='' disabled>Sort By</option>
      <option value='updated'>Last Updated</option>
      <option value='created'>Creation Date</option>
      <option value='title'>Title(A-Z)</option>
     </select>

     <button onClick={createNewNote} className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#71f022] text-black rounded-lg hover:bg-[#0dd417] transition-colors cursor-pointer'><Plus size={18} /> New Note</button>
    </div>

    <div className='flex-1 overflow-y-auto'>
     {notes.length === 0 ? (
      <p className='p-4 text-gray-600'>No notes yet. Create one to get started!</p>) : (
            
      sortedNotes.map(note => (
      <div key={note.id} onClick={() => selectNote(note)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#c8fa6b] transition-colors ${note.id === activeNoteId ? 'bg-[#f0ffd6] border-l-4 border-l-[#71f022]' : ''}`}>
       
       <div className='flex justify-between items-start mb-1'>
        <h3 className='font-medium text-gray-800 truncate flex-1'>{note.title || 'Untitled'}</h3>

        <button onClick={(e) => deleteNote(note.id, e)} className='text-red-500 hover:text-red-700'><Trash2 size={16} /></button>
       </div>
      
      <p className='text-xs text-gray-500 line-clamp-2 mb-1'>{stripHtml(note.content) || 'No Content'}</p>
      {note.tags && note.tags.length > 0 && (
       <div className='flex flex-wrap gap-1 mb-1'>
        {note.tags.map(tag => (
        <span key={tag} className={`text-xs px-2 py-0.5 rounded ${getTagColor(tag)}`}>#{tag}</span>
        ))}
       </div>
       )}
      <p className='text-xs text-gray-400'>{new Date(note.updatedAt).toLocaleDateString()}</p>
     </div>
    ))
    )}
   </div>

  <div className="p-3 border-t border-gray-200 bg-gray-50">
    <p className="text-xs text-gray-500 text-center"> {notes.length} total note{notes.length !== 1 ? 's' : ''} {searchQuery && ` • ${sortedNotes.length} found`}
   </p>
  </div>
  </div>

  <div className='flex-1 flex flex-col'>
    {activeNoteId ? (
     <>
      <div className='p-4 border-b border-gray-200'>
       <input type='text' value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} placeholder='Note Title...' className='w-full p-4 border-none text-gray-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#bff542]'/>

       <div className='mt-3 mb-2'>
        <div className='flex items-center gap-2 mb-2'>
         <Tag size={16} className='text-gray-500' />
         <input type='text' value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder='Add tags (Press Enter)' className='flex-1 text-sm border-b border-gray-300 focus:border-[#71f022] focus:outline-none py-1' />
         <button onClick={addTag} className='px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors'>Add</button>
        </div>

        {currentTags.length > 0 && (
         <div className='flex flex-wrap gap-2'>
          {currentTags.map(tag => (
          <span key={tag} className={`text-sm px-3 py-1 rounded flex items-center gap-2 ${getTagColor(tag)}`}>
           {tag}<button onClick={() => removeTag(tag)} className='hover:text-red-600' ><X size={14} /></button>
          </span>
          ))}
         </div>
         )}
        </div>

       <div className="flex items-center justify-between mt-2">
       <p className='text-xs text-gray-500'>
        {isSaving ? (
          <span className='text-amber-600'>Saving...</span>):
          (
          <span className='text-amber-800'>Last saved: {activeNote ? new Date(activeNote.updatedAt).toLocaleTimeString() : 'Never'}</span> )}
       </p>
       <p className='text-xs text-gray-500'>{wordCount} word{wordCount !== 1 ? 's' : ''} • {charCount} character{charCount !== 1 ? 's' : ''}</p>
      </div>
      </div>

      <div className="flex-1 overflow-hidden">
       < ReactQuill theme='snow' value={currentContent} onChange={setCurrentContent} modules={modules} formats={formats} placeholder="Start typing your note..." className="h-full" style={{ height: 'calc(100% - 42px)' }} />
      </div>
      </>

      ) : (
       <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
         <p className="text-gray-500 text-lg mb-4">No note selected</p>
         <button onClick={createNewNote} className="flex items-center gap-2 px-6 py-3 bg-[#71f022] text-white rounded-lg hover:bg-[#0dd417] transition-colors mx-auto" ><Plus size={20} />Create Your First Note</button>
        </div>
        </div>
       )}
     </div>
    </div>
  );
}

export default App;