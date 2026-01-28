import { Plus } from 'lucide-react';

const EmptyNoteState = ({ onCreateNote }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Plus className="text-gray-400" size={40} />
      </div>

      <h2 className="text-lg font-semibold text-gray-700">No Note Selected</h2>
      <p className="text-gray-500 max-w-xs mb-6">Select a note from the sidebar or create a new one to start writing.</p>
      <button onClick={onCreateNote} className="md:hidden px-6 py-2 bg-[#71f022] rounded-lg font-bold">New Note</button>
    </div>
  );
};

export default EmptyNoteState;