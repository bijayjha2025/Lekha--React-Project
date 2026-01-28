import { Menu } from 'lucide-react';

const MobileHeader = ({ onToggleSidebar }) => {
  return (
    <div className="md:hidden flex items-center p-4 border-b bg-white">
      <button onClick={onToggleSidebar} className="p-2 -ml-2 text-gray-600" >
        <Menu size={20} />
      </button>
      <div className="flex-1 text-center font-bold text-gray-800">Lekha</div>
      <div className="w-8"></div>
    </div>
  );
};

export default MobileHeader;