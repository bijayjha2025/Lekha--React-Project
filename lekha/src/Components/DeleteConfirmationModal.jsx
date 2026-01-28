import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white border shadow-xl rounded-lg p-4 w-72 animate-fade-in">
        <div className="flex justify-between">
          <p className="text-sm">Delete this note permanently?</p>
          <button onClick={onCancel}>
            <X size={16} />
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1 border rounded text-xs">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;