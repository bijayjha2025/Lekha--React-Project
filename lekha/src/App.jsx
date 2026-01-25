import { useState, useEffect } from 'react';

function App() {
  const [note, setNote] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  
  useEffect(() => {
    const savedNote = localStorage.getItem('myNote');
    const savedTime = localStorage.getItem('lastSaved');
    if (savedNote) {
      setNote(savedNote);
    }
    if (savedTime) {
      const dateObj = isNaN(savedTime) ? new Date(savedTime) : new Date(parseInt(savedTime));
      setLastSaved(dateObj.toLocaleDateString());
    }
   }, []);

  const saveNote = () => {
    const now = new Date().toLocaleDateString();
    localStorage.setItem('myNote', note);
    localStorage.setItem('lastSaved', now);
    setLastSaved(now);
    alert('Note saved successfully!');
  }

  const clearNote = () => {
    if(confirm('Are you sure you want to clear this note?')) {
      setNote('');
      localStorage.removeItem('myNote');
      localStorage.removeItem('lastSaved');
      setLastSaved(null);
    }
  };

  const charCount = note.length;

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