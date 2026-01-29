import { useState } from 'react';
import { Tag, X, ChevronLeft } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { getTagColor, getTextStats } from '../utils/noteUtils';

const NoteEditor = ({ activeNote, currentTitle, currentContent, currentTags, isSaving, onTitleChange, onContentChange, onAddTag, onRemoveTag, onToggleSidebar, }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (onAddTag(tagInput)) {
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const { charCount, wordCount } = getTextStats(currentContent);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'align',
    'link',
    'image',
  ];

  return (
    <>
     <div className="px-4 py-2 border-b border-gray-100">
      <div className="flex items-center gap-2 md:hidden mb-2">
       <button onClick={onToggleSidebar} className="text-sm flex items-center text-gray-500">
        <ChevronLeft size={16} />Back to list</button>
      </div>

      <input type="text" value={currentTitle || ''} onChange={(e) => onTitleChange(e.target.value)} placeholder="Note Title..." className="w-full py-2 text-xl text-gray-800 md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#bff542]"/>

      <div className="flex flex-wrap items-center gap-3 mt-2 pb-2">
       <div className="flex items-center gap-2">
        <Tag size={14} className="text-gray-400" />
        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder="Add tags (Press Enter)" className="flex-1 text-sm border-b border-gray-300 focus:border-[#71f022] focus:outline-none py-1" />
        <button onClick={handleAddTag} className="text-xs border-none focus:ring-0 p-0 w-20" >Add tag...</button>
       </div>

       <div className="flex gap-1">
        {(currentTags || []).map((tag) => (
        <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${getTagColor( tag )}`}>
        {tag}
        <X size={10} className="cursor-pointer" onClick={() => onRemoveTag(tag)} />
        </span>
        ))}
        </div>
       </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
       <ReactQuill theme="snow" value={currentContent || ''} onChange={onContentChange} modules={modules} formats={formats} placeholder="Start typing your note..." className="h-full quill-responsive" />
      </div>

      <div className="p-2 border-t flex justify-between items-center text-[10px] text-gray-400 bg-gray-50">
       <div>
        {isSaving ? 'Saving...' : `Saved at ${new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',
        })}`}
      </div>
     <div>
    {wordCount} words | {charCount} chars
    </div>
   </div>
    </>
  );
};

export default NoteEditor;