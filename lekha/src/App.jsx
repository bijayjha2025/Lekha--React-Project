import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Search, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [isSaving, setIsSaving] = useState(false);

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
  };

  const selectNote = (note) => {
    setActiveNoteId(note.id);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
  };

  const saveCurrentNote = useCallback(() => {
    if(!activeNoteId) return;

    setNotes(prev =>
      prev.map(note =>
      note.id === activeNoteId ? { ...note, title: currentTitle, content: currentContent, updatedAt: new Date().toISOString() } : note )
    );
    setIsSaving(false);
  }, [activeNoteId, currentTitle, currentContent]);

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
  }, [currentTitle, currentContent, saveCurrentNote]);

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
        }else{
          setActiveNoteId(null);
          setCurrentTitle('');
          setCurrentContent('');
        }
      }
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredNotes = notes.filter(note => {
    const searchLower = searchQuery.toLowerCase();
    const plainContent = stripHtml(note.content);
    return (
      note.title.toLowerCase().includes(searchLower) || plainContent.toLowerCase().includes(searchLower)
    );
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