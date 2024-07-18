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
  <div className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
    <div className="p-4 flex justify-between items-center">
      <h2 className={`font-bold ${sidebarOpen ? '' : 'hidden'}`}>Tabs</h2>
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-700 rounded">
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
    <div className={`flex-1 overflow-y-auto ${sidebarOpen ? '' : 'hidden'}`}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer ${activeTab === tab.id ? 'bg-blue-600' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
    <button onClick={addTab} className="p-2 mt-2 bg-blue-500 hover:bg-blue-600 flex items-center justify-center">
      <Plus size={20} className="mr-2" /> New Tab
    </button>
  </div>
);

export default Sidebar;