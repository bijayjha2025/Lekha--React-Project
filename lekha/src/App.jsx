import { useState, useEffect, use } from 'react';
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
      note.id === activeNoteId ? { ...note, title: currentTitle, content: currentContent, updatedAt: new Date().toLocaleDateString()() } : note ));
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
  <div className='min-h-screen bg-gray-100 p-8'>
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6'>
      <div className='flex items-center justify-between mb-4'>
      <h1 className='text-3xl font-bold text-gray-800'>My note</h1>

      {
        lastSaved && (
          <p className='text-sm text-gray-500'>Last Saved: {lastSaved}</p>
      )}
      </div>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='Start tracking your note' className='w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] resize-none' />

      <div className='flex items-center justify-between mt-4'>
        <p className=' text-sm text-gray-600'>{charCount} character{charCount !== 1 ? 's' : ''}</p>

        <div className='flex gap-2'>
          <button onClick={clearNote} className='mt-4 px-6 py-2 bg-[#fa9e9b] text-black rounded-lg font-semibold hover:bg-[#fa7f7a] transition-colors cursor-pointer'>✖️ Clear</button>
          
          <button onClick={saveNote} className='mt-4 px-6 py-2 bg-[#aaf542] text-black font-semibold rounded-lg hover:bg-[#23e83a] transition-colors cursor-pointer'>💾 Save</button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;