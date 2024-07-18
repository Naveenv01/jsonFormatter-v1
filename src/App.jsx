import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const JSONFormatter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState([{ id: 1, name: 'Tab 1', content: '' }]);
  const [activeTab, setActiveTab] = useState(1);
  const [collapsedKeys, setCollapsedKeys] = useState({});
  const editorRef = useRef(null);
  const [formattedJSON, setFormattedJSON] = useState('');
  const [jsonError, setJsonError] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addTab = () => {
    const newTab = { id: tabs.length + 1, name: `Tab ${tabs.length + 1}`, content: '' };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (id) => {
    setTabs(tabs.filter(tab => tab.id !== id));
    if (activeTab === id) {
      setActiveTab(tabs[0].id);
    }
  };

  const handleContentChange = (e) => {
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? { ...tab, content: e.target.value } : tab
    );
    setTabs(updatedTabs);
    formatJSON(e.target.value);
  };

  const formatJSON = (content) => {
    try {
      const formatted = JSON.stringify(JSON.parse(content), null, 2);
      setFormattedJSON(formatted);
      setJsonError('');
    } catch (error) {
      setFormattedJSON('');
      setJsonError(`Invalid JSON: ${error.message}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === '{' || e.key === '[' || e.key === '(') {
      e.preventDefault();
      const closingBracket = e.key === '{' ? '}' : e.key === '[' ? ']' : ')';
      const { selectionStart, selectionEnd } = e.target;
      const newContent = e.target.value.slice(0, selectionStart) + e.key + closingBracket + e.target.value.slice(selectionEnd);
      e.target.value = newContent;
      e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
      handleContentChange(e);
    }
  };

  const toggleCollapse = (key) => {
    setCollapsedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderJSONWithCollapsible = (obj, depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      return <span className="text-green-600">{JSON.stringify(obj)}</span>;
    }

    const isArray = Array.isArray(obj);
    const bracketRender = (isArray, isOpening) => (
      <span className="text-yellow-500">{isArray ? (isOpening ? '[' : ']') : (isOpening ? '{' : '}')}</span>
    );

    return (
      <div style={{ marginLeft: depth * 20 + 'px' }}>
        {bracketRender(isArray, true)}
        {Object.entries(obj).map(([key, value], index) => {
          const isCollapsed = collapsedKeys[`${depth}-${key}`];
          const isObject = typeof value === 'object' && value !== null;

          return (
            <div key={key} className="my-1">
              {isObject && (
                <span
                  onClick={() => toggleCollapse(`${depth}-${key}`)}
                  className="cursor-pointer inline-block mr-2"
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                </span>
              )}
              <span className="text-blue-500">{isArray ? '' : `"${key}": `}</span>
              {isCollapsed ? (
                <span className="text-gray-500">{isArray ? '[...]' : '{...}'}</span>
              ) : (
                renderJSONWithCollapsible(value, depth + 1)
              )}
              {index < Object.entries(obj).length - 1 && <span className="text-gray-500">,</span>}
            </div>
          );
        })}
        {bracketRender(isArray, false)}
      </div>
    );
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = editorRef.current.scrollHeight + 'px';
    }
  }, [tabs, activeTab]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-bold ${sidebarOpen ? '' : 'hidden'}`}>Tabs</h2>
          <button onClick={toggleSidebar} className="p-2 hover:bg-gray-700 rounded">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <div className={`${sidebarOpen ? '' : 'hidden'}`}>
          {tabs.map(tab => (
            <div key={tab.id} className="flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer">
              <span onClick={() => setActiveTab(tab.id)}>{tab.name}</span>
              <button onClick={() => removeTab(tab.id)} className="p-1 hover:bg-gray-600 rounded">
                <X size={16} />
              </button>
            </div>
          ))}
          <button onClick={addTab} className="w-full p-2 mt-2 bg-blue-500 hover:bg-blue-600 flex items-center justify-center">
            <Plus size={20} className="mr-2" /> New Tab
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold">JSON Formatter</h1>
        </div>
        <div className="flex-1 p-4 flex">
          {/* Input area */}
          <div className="w-1/2 pr-2 flex flex-col">
            <textarea
              ref={editorRef}
              value={tabs.find(tab => tab.id === activeTab)?.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="w-full flex-grow p-2 border rounded resize-none font-mono text-sm"
              placeholder="Paste your JSON here..."
            />
            {jsonError && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {jsonError}
              </div>
            )}
          </div>
          {/* Formatted JSON area */}
          <div className="w-1/2 pl-2 bg-white rounded shadow overflow-auto">
            <h2 className="text-lg font-semibold mb-2 p-2">Formatted JSON:</h2>
            <div className="p-2 font-mono text-sm">
              {formattedJSON ? (
                renderJSONWithCollapsible(JSON.parse(formattedJSON))
              ) : (
                <span className="text-gray-500">Formatted JSON will appear here</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;