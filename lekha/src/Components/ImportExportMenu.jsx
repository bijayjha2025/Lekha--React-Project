import { useState, useRef } from 'react';
import { FileUp, Copy, CheckCircle, X, AlertCircle } from 'lucide-react';

const ImportExportMenu = ({ visible, onClose, onImportPdf, currentContent }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  if (!visible) return null;

  const handleCopyToClipboard = async () => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentContent;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(plainText);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setImportError('Please select a PDF file');
      setTimeout(() => setImportError(null), 3000);
      return;
    }

    try {
      await onImportPdf(file);
      onClose();
    } catch (error) {
      setImportError('Failed to import PDF. Please try again.');
      setTimeout(() => setImportError(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Import & Export</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors" >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {importError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              {importError}
            </div>
          )}

          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#71f022] hover:bg-[#f0ffd6] transition-all">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileUp size={20} className="text-gray-600" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-gray-800">Import PDF</h3>
              <p className="text-xs text-gray-500">
                Convert PDF text to a new note
              </p>
            </div>
          </button>

          <button onClick={handleCopyToClipboard} className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-[#71f022] hover:bg-[#f0ffd6] transition-all" disabled={!currentContent}>
            <div className="p-2 bg-gray-100 rounded-lg">
              {copySuccess ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Copy size={20} className="text-gray-600" />
              )}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-gray-800">
                {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              </h3>
              <p className="text-xs text-gray-500">
                {currentContent
                  ? 'Copy current note content'
                  : 'No content to copy'}
              </p>
            </div>
          </button>

          <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
        </div>

        <div className="p-4 border-t bg-gray-50">
          <button onClick={onClose} className="w-full py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportMenu;