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
  <div className=''>
    <div className=''>
      <h1>Lekha- Your trusted companion for customized note-taking</h1>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder='Start tracking your note' />

      <button onClick={saveNote}>Save Note</button>
    </div>



  </div>
  );
}

export default App;