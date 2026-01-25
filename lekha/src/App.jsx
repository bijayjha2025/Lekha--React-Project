import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');

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
    if (notes.length > 0) {
      localStorage.setItem('allNotes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toLocaleDateString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
  };

  const selectNote = (note) => {
    if(activeNoteId){
      saveCurrentNote();
    }
    setActiveNoteId(note.id);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
  };

  const saveCurrentNote = () => {
    if(!activeNoteId) return;

    setNotes(notes.map(note =>
      note.id === activeNoteId ? { ...note, title: currentTitle, content: currentContent, updatedAt: new Date().toLocaleDateString() } : note ));
  }

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
      
      if (newNotes.length === 0) {
        localStorage.removeItem('allNotes');
      }
    }
  };

  const charCount = currentContent.length;

  return(
  <div className='flex h-screen bg-gray-100'>
   <div className='w-64 bg-white border-r border-gray-200 flex flex-col'>
    <div className='p-4 border-b border-gray-200'>
     <h1 className='text-xl font-bold text-gray-800 mb-3'>My Notes</h1>

     <button onClick={createNewNote} className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#71f022] text-black rounded-lg hover:bg-[#0dd417] transition-colors cursor-pointer'><Plus size={18} /> New Note</button>
    </div>

    <div className='flex-1 overflow-y-auto'>
     {notes.length === 0 ? (
      <p className='p-4 text-gray-600'>No notes yet. Create one to get started!</p>) : (
            
      notes.map(note => (
      <div key={note.id} onClick={() => selectNote(note)} className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${note.id === activeNoteId ? 'bg-gray-200' : ''}`}>
       <div className='flex justify-between items-center mb-1'>
        <h3>{note.title || 'Untitled'}</h3>

        <button onClick={(e) => deleteNote(note.id, e)} className='text-red-500 hover:text-red-700'><Trash2 size={16} /></button>
       </div>
      <p className='text-xs text-gray-500'>{new Date(note.createdAt).toLocaleDateString()}</p>
     </div>
    ))
    )}
   </div>
  </div>

  <div className='flex-1 flex flex-col'>
    {activeNoteId ? (
     <>
      <div className='p-4 border-b border-gray-200'>
       <input type='text' value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} onBlur={saveCurrentNote} placeholder='Note Title...' className='w-full p-4 border-none text-gray-800 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#bff542]' />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
       <textarea value={currentContent} onChange={(e) => setCurrentContent(e.target.value)} onBlur={saveCurrentNote}placeholder="Start typing your note..." className="w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] resize-none" />
      </div>
      
      <div className="bg-white border-t border-gray-200 p-4">
       <div className="flex items-center justify-between max-w-4xl mx-auto">
        <p className="text-sm text-gray-600">{charCount} character{charCount !== 1 ? 's' : ''}</p>
        <button onClick={saveCurrentNote} className="px-6 py-2 bg-[#71f022] text-black rounded-lg hover:bg-[#0dd417] transition-colors cursor-pointer">Save</button>
       </div>
      </div>
      </>

      ) : (
       <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
         <p className="text-gray-500 text-lg mb-4">No note selected</p>
         <button onClick={createNewNote} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto" ><Plus size={20} />Create Your First Note</button>
        </div>
        </div>
       )}
     </div>
    </div>
  );
}

export default App;