import { Trash2 } from 'lucide-react';
import { stripHtml } from '../utils/noteUtils';

const NoteListItem = ({ note, isActive, onSelect, onDelete }) => {
  return (
    <div onClick={() => onSelect(note)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#c8fa6b] transition-colors ${
      isActive ? 'bg-[#f0ffd6] border-l-4 border-l-[#71f022]' : 'hover:bg-gray-50' }`} >
      <div className="flex justify-between items-start">
       <h3 className="font-medium text-gray-800 truncate flex-1">{note.title || 'Untitled'}</h3>
       <button onClick={(e) => onDelete(note.id, e)} className="text-red-500 hover:text-red-700">
        <Trash2 size={16} />
       </button>
      </div>
     <p className="text-xs text-gray-500 line-clamp-1 mt-1">{stripHtml(note.content) || 'Empty note...'}</p>
    </div>
  );
};

export default NoteListItem;