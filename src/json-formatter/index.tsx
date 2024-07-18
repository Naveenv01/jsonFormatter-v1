import React, { useState } from 'react';
import Editor from './editor';
import FormattedView from './formatterdView';
import Sidebar from './sidebar';

interface Tab {
    id: number;
    name: string;
    content: string;
    formattedJSON: string;
    jsonError: string;
}

const JSONFormatter: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [tabs, setTabs] = useState<Tab[]>([
        { id: 1, name: 'Tab 1', content: '', formattedJSON: '', jsonError: '' }
    ]);
    const [activeTab, setActiveTab] = useState<number>(1);

    const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);

    const addTab = (): void => {
        const newTab: Tab = {
            id: tabs.length + 1,
            name: `Tab ${tabs.length + 1}`,
            content: '',
            formattedJSON: '',
            jsonError: ''
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab.id);
    };

    const removeTab = (id: number): void => {
        setTabs(tabs.filter(tab => tab.id !== id));
        if (activeTab === id) {
            setActiveTab(tabs[0].id);
        }
    };

    const handleContentChange = (content: string): void => {
        const updatedTabs = tabs.map(tab =>
            tab.id === activeTab ? { ...tab, content, ...formatJSON(content) } : tab
        );
        setTabs(updatedTabs);
    };

    const formatJSON = (content: string): { formattedJSON: string; jsonError: string } => {
        try {
            const formatted = JSON.stringify(JSON.parse(content), null, 2);
            return { formattedJSON: formatted, jsonError: '' };
        } catch (error) {
            return { formattedJSON: '', jsonError: `Invalid JSON: ${(error as Error).message}` };
        }
    };

    const clearActiveTab = (): void => {
        const updatedTabs = tabs.map(tab =>
            tab.id === activeTab ? { ...tab, content: '', formattedJSON: '', jsonError: '' } : tab
        );
        setTabs(updatedTabs);
    };

    const formatActiveTab = (): void => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        if (activeTabData) {
            const { formattedJSON, jsonError } = formatJSON(activeTabData.content);
            const updatedTabs = tabs.map(tab =>
                tab.id === activeTab ? { ...tab, formattedJSON, jsonError } : tab
            );
            setTabs(updatedTabs);
        }
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                addTab={addTab}
                removeTab={removeTab}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white shadow-md p-4">
                    <div className='flex-1 flex flex-row overflow-hidden items-center justify-between'>
                        <h1 className="text-2xl font-bold">JSON Formatter</h1>
                        <div>
                            <button
                                className="text-xl font-bold px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                                onClick={formatActiveTab}
                            >
                                Format
                            </button>
                            <button
                                className="text-xl font-bold px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                onClick={clearActiveTab}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 flex overflow-hidden">
                    <Editor
                        content={activeTabData.content}
                        onChange={handleContentChange}
                        jsonError={activeTabData.jsonError}
                    />
                    <FormattedView formattedJSON={activeTabData.formattedJSON} />
                </div>
            </div>
        </div>
    );
};

export default JSONFormatter;