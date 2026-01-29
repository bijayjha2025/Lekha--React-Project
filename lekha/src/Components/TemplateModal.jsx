import { X, FileText, Calendar, CheckSquare, FolderOpen, BookOpen, Dumbbell, Heart, UtensilsCrossed } from 'lucide-react';
import { noteTemplates } from '../utils/templates';

const TemplateModal = ({ visible, onClose, onSelectTemplate }) => {
  if (!visible) return null;

  const templateIcons = {
    'daily-routine': Calendar,
    'meeting-notes': FileText,
    'to-do-list': CheckSquare,
    'project-planning': FolderOpen,
    'study-notes': BookOpen,
    'workout-log': Dumbbell,
    'journal-entry': Heart,
    'recipe': UtensilsCrossed,
  };

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
   <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
     <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-bold text-gray-800">Choose a Template</h2>
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors" ><X size={20} /></button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
      {noteTemplates.map((template) => {
       const Icon = templateIcons[template.id] || FileText;
        return (
         <button key={template.id} onClick={() => handleSelectTemplate(template)} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#71f022] hover:bg-[#f0ffd6] transition-all text-left group" >
         <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#71f022] group-hover:text-white transition-colors">
          <Icon size={20} />
         </div>
         <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{template.title} </h3>
          <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tag}</span>
          ))}
         </div>
        </div>
       </button>
        );
        })}
       </div>

       <div className="p-4 border-t bg-gray-50">
        <button onClick={onClose} className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">Start with blank note instead</button>
       </div>
      </div>
    </div>
  );
};

export default TemplateModal;