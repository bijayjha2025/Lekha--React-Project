import { Plus, Search } from 'lucide-react';
import NoteListItem from './NoteListItem';
import Logo from '../assets/Lekha.png';

const Sidebar = ({ isOpen, notes, activeNoteId, searchQuery, setSearchQuery, selectedTag, setSelectedTag, sortBy, setSortBy, allTags, onCreateNote, onSelectNote, onDeleteNote, }) => {
  
 return (
  <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 transform ${ isOpen ? 'translate-x-0' : '-translate-x-full' } md:relative md:translate-x-0`} >
   <div className="p-4 border-b">
    <div className="flex items-center gap-3 mb-4">
     <img src={Logo} alt="LogoOfLekha" className="w-9 h-9" />
     <div>
      <h1 className="text-lg font-bold text-gray-800">Lekha</h1>
      <p className="text-[11px] text-gray-500 leading-tight">Your companion for customized notes</p>
     </div>
    </div>

    <div className="relative mb-3">
     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
     <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..." className="w-full pl-9 pr-8 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#bff542] outline-none text-sm" />
    </div>

    <div className="mb-2">
     <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-xs" >
       <option value="all">All Tags</option>
        {allTags.map((tag) => (
         <option key={tag} value={tag}>
         {tag}
        </option>
        ))}
     </select>
    </div>

    <div className="mb-3">
     <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bff542] text-xs" >
       <option value="updated">Last Updated</option>
       <option value="created">Creation Date</option>
       <option value="title">Title (A-Z)</option>
     </select>
    </div>

    <button onClick={onCreateNote} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#71f022] text-black rounded-lg hover:bg-[#0dd417] transition-colors cursor-pointer">
     <Plus size={18} /> New Note
    </button>
   </div>

   <div className="flex-1 overflow-y-auto">
    {notes.map((note) => (
     <NoteListItem key={note.id} note={note} isActive={note.id === activeNoteId} onSelect={onSelectNote} onDelete={onDeleteNote} />
    ))}
  </div>
 </div>
  );
};

export default Sidebar;