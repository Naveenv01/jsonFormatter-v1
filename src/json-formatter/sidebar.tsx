import React from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface Tab {
  id: number;
  name: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  addTab: () => void;
  removeTab: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  toggleSidebar,
  tabs,
  activeTab,
  setActiveTab,
  addTab,
  removeTab
}) => (
  <div className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-60' : 'w-16'}`}>
    <div className="p-2 flex justify-between items-center">
      <button
        onClick={addTab}
        className="flex items-center w-full p-2 hover:bg-gray-700 transition-colors duration-200"
      >
        <Plus size={20} className="mr-2" />
        {sidebarOpen && <span>New Tab</span>}
      </button>
    </div>
    <div className="flex-1 overflow-y-auto">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center justify-between p-2 cursor-pointer ${activeTab === tab.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            } transition-colors duration-200`}
          onClick={() => setActiveTab(tab.id)}
        >
          {sidebarOpen && <span className="truncate">{tab.name}</span>}
          {(!sidebarOpen || tab.id !== 1) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
              className="p-1 hover:bg-gray-600 rounded transition-colors duration-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
    <div className="p-2 mt-auto">
      <button onClick={toggleSidebar} className="w-full hover:bg-gray-700 rounded p-2">
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  </div>
);

export default Sidebar;
