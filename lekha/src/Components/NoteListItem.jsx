import { Trash2, Pin, Copy } from 'lucide-react';
import { stripHtml } from '../utils/noteUtils';
import { useState } from 'react';

const NoteListItem = ({ note, isActive, onSelect, onDelete, onTogglePin }) => {

    const [showCopyFeedback, setShowCopyFeedback] = useState(false);

    const handlePinClick = (e) => {
        e.stopPropagation();
        onTogglePin(note.id);
    }

    const handleCopyClick = async (e) => {
    e.stopPropagation();
    try {
      const plainText = stripHtml(note.content || '');
      await navigator.clipboard.writeText(plainText);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div onClick={() => onSelect(note)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-[#c8fa6b] transition-colors ${
      isActive ? 'bg-[#f0ffd6] border-l-4 border-l-[#71f022]' : 'hover:bg-gray-50' }`} >
      <div className="flex justify-between items-start">
       <div className='flex items-center gap-2 flex-1'>
        <h3 className="font-medium text-gray-800 truncate">{note.title || 'Untitled'}</h3>
        
        {note.isPinned && (
          <Pin size={14} className="text-[#71f022] fill-[#71f022] flex-shrink-0" /> )}
        </div>
        <div className="flex items-center gap-1">

         <button onClick={handleCopyClick} className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400 hover:text-[#71f022] relative" title="Copy note content">
          <Copy size={14} />
           {showCopyFeedback && (
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap">Copied!</span>
          )}
         </button>

         <button onClick={handlePinClick} className={`p-1 rounded hover:bg-gray-200 transition-colors ${ note.isPinned ? 'text-[#71f022]' : 'text-gray-400' }`} title={note.isPinned ? 'Unpin note' : 'Pin note'}>
          <Pin size={14} className={note.isPinned ? 'fill-current' : ''} />
         </button>

        <button onClick={(e) => onDelete(note.id, e)} className="text-red-500 hover:text-red-700">
        <Trash2 size={16} />
       </button>
      </div>
     </div>
     <p className="text-xs text-gray-500 line-clamp-1 mt-1">{stripHtml(note.content) || 'Empty note...'}</p>
    </div>
  );
};

export default NoteListItem;