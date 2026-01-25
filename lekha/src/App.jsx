import { useState, useEffect } from 'react';

function App() {
  const [note, setNote] = useState('');
  
  useEffect(() => {
    const savedNote = localStorage.getItem('myNote');
    if (savedNote) {
      setNote(savedNote);
    }
   }, []);

  const saveNote = () => {
    localStorage.setItem('myNote', note);
    alert('Note saved successfully!');
  }


  return(
  <div className='min-h-screen bg-gray-100 p-8'>
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6'>
      <h1 className='text-xl font-bold text-gray-800 mb-4'>My note</h1>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='Start tracking your note' className='w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] resize-none' />

      <button onClick={saveNote} className='mt-4 px-6 py-2 bg-[#aaf542] text-black rounded-lg hover:bg-[#bcf542] transition-colors cursor-pointer'>Save Note</button>
    </div>



  </div>
  );
}

export default App;