import { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { filterNotes, sortNotes } from './utils/noteUtils';
import Sidebar from './Components/Sidebar';
import MobileHeader from './Components/MobileHeader';
import NoteEditor from './Components/NoteEditor';
import EmptyNoteState from './Components/EmptyNoteState';
import DeleteConfirmationModal from './Components/DeleteConfirmationModal';



function App() {
  const { notes, activeNoteId, activeNote, currentTitle, currentContent, currentTags, isSaving, allTags, setCurrentTitle, setCurrentContent, createNewNote, selectNote, deleteNote, addTag, removeTag, togglePin  } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [selectedTag, setSelectedTag] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    noteId: null,
  });

  const handleSelectNote = (note) => {
    const shouldCloseSidebar = selectNote(note);
    if (shouldCloseSidebar) {
      setIsSidebarOpen(false);
    }
  };
  
  const requestDeleteNote = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ visible: true, noteId: id });
  };

  const confirmDeleteNote = () => {
    if(confirmDelete.noteId){
      deleteNote(confirmDelete.noteId);
    };
    setConfirmDelete({visible:false, noteId:null})
  };

  const cancelDeleteNote = () => {
    setConfirmDelete({ visible: false, noteId: null });
  }

  useEffect(() => {
    if(!confirmDelete.visible) return;
    const timer = setTimeout(cancelDeleteNote, 5000);
    return () => clearTimeout(timer);
  }, [confirmDelete.visible]);

  const filteredNotes = filterNotes(notes, searchQuery, selectedTag);
  const sortedNotes = sortNotes(filteredNotes, sortBy);


  return(
  <div className='flex h-screen bg-gray-100 overflow-hidden'>
    <Sidebar isOpen={isSidebarOpen} notes={sortedNotes} activeNoteId={activeNoteId} searchQuery={searchQuery} setSearchQuery={setSearchQuery}selectedTag={selectedTag} setSelectedTag={setSelectedTag} sortBy={sortBy} setSortBy={setSortBy} allTags={allTags} onCreateNote={createNewNote} onSelectNote={handleSelectNote} onDeleteNote={requestDeleteNote} onTogglePin={togglePin} />
   
    <div className='flex-1 flex flex-col min-w-0 bg-white'>
    <MobileHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
     {activeNoteId ? (
      <NoteEditor activeNote={activeNote} currentTitle={currentTitle} currentContent={currentContent} currentTags={currentTags} isSaving={isSaving} onTitleChange={setCurrentTitle} onContentChange={setCurrentContent} onAddTag={addTag} onRemoveTag={removeTag} onToggleSidebar={() => setIsSidebarOpen(true)} />
      ) : (
        <EmptyNoteState onCreateNote={createNewNote} />
      )}
    </div>

    <DeleteConfirmationModal visible={confirmDelete.visible} onConfirm={confirmDeleteNote} onCancel={cancelDeleteNote} />

    {isSidebarOpen && (
      <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
    )}
  </div>

  );
};

export default App;