import React, { useState, useEffect, useCallback } from 'react';
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
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTab, setActiveTab] = useState<number>(1);

    // Load data from localStorage on component mount
    useEffect(() => {

        const storedTabs = localStorage.getItem('jsonFormatterTabs');
        const storedActiveTab = localStorage.getItem('jsonFormatterActiveTab');

        if (storedTabs) {
            const parsedTabs = JSON.parse(storedTabs);

            setTabs(parsedTabs);

            if (storedActiveTab) {
                const activeTabId = parseInt(storedActiveTab, 10);
                if (parsedTabs.some((tab: Tab) => tab.id === activeTabId)) {
                    setActiveTab(activeTabId);
                } else if (parsedTabs.length > 0) {
                    setActiveTab(parsedTabs[0].id);
                }
            }
        } else {
            const defaultTab = { id: 1, name: 'Tab 1', content: '', formattedJSON: '', jsonError: '' };
            setTabs([defaultTab]);
            setActiveTab(1);
            saveToLocalStorage([defaultTab], 1);
        }
    }, []);

    const saveToLocalStorage = useCallback((tabsToSave: Tab[], activeTabToSave: number) => {
        localStorage.setItem('jsonFormatterTabs', JSON.stringify(tabsToSave));
        localStorage.setItem('jsonFormatterActiveTab', activeTabToSave.toString());
    }, []);

    const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);

    const addTab = (): void => {
        const newTab: Tab = {
            id: tabs.length > 0 ? Math.max(...tabs.map(t => t.id)) + 1 : 1,
            name: `Tab ${tabs.length + 1}`,
            content: '',
            formattedJSON: '',
            jsonError: ''
        };
        const newTabs = [...tabs, newTab];
        setTabs(newTabs);
        setActiveTab(newTab.id);
        saveToLocalStorage(newTabs, newTab.id);
    };

    const removeTab = (id: number): void => {
        const updatedTabs = tabs.filter(tab => tab.id !== id);
        setTabs(updatedTabs);
        let newActiveTab = activeTab;
        if (activeTab === id) {
            newActiveTab = updatedTabs.length > 0 ? updatedTabs[0].id : 0;
            setActiveTab(newActiveTab);
        }
        if (updatedTabs.length === 0) {
            const newTab = { id: 1, name: 'Tab 1', content: '', formattedJSON: '', jsonError: '' };
            setTabs([newTab]);
            newActiveTab = 1;
            setActiveTab(newActiveTab);
        }
        saveToLocalStorage(updatedTabs.length > 0 ? updatedTabs : [{ id: 1, name: 'Tab 1', content: '', formattedJSON: '', jsonError: '' }], newActiveTab);
    };

    const formatJSON = (content: string): { formattedJSON: string; jsonError: string } => {
        try {
            const formatted = JSON.stringify(JSON.parse(content), null, 2);
            return { formattedJSON: formatted, jsonError: '' };
        } catch (error) {
            return { formattedJSON: '', jsonError: `Invalid JSON: ${(error as Error).message}` };
        }
    };

    const handleContentChange = (content: string): void => {

        const updatedTabs = tabs.map(tab =>
            tab.id === activeTab ? { ...tab, content, ...formatJSON(content) } : tab
        );
        setTabs(updatedTabs);
        saveToLocalStorage(updatedTabs, activeTab);
    };

    const clearActiveTab = (): void => {

        const updatedTabs = tabs.map(tab =>
            tab.id === activeTab ? { ...tab, content: '', formattedJSON: '', jsonError: '' } : tab
        );
        setTabs(updatedTabs);
        saveToLocalStorage(updatedTabs, activeTab);
    };

    const formatActiveTab = (): void => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        if (activeTabData) {
            const { formattedJSON, jsonError } = formatJSON(activeTabData.content);
            const updatedTabs = tabs.map(tab =>
                tab.id === activeTab ? { ...tab, content: formattedJSON, formattedJSON, jsonError } : tab
            );
            setTabs(updatedTabs);
            saveToLocalStorage(updatedTabs, activeTab);
        }
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0] || { content: '', formattedJSON: '', jsonError: '' };

    useEffect(() => {

    }, [tabs, activeTab]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(id) => {
                    setActiveTab(id);
                    saveToLocalStorage(tabs, id);
                }}
                addTab={addTab}
                removeTab={removeTab}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white shadow-md p-4">
                    <div className='flex-1 flex flex-row overflow-hidden items-center'>
                        <h1 className="text-2xl font-bold pr-10">JSON Formatter</h1>
                        <div>
                            <button
                                className="px-4 py-2 text-blue-600 mr-2"
                                onClick={formatActiveTab}
                            >
                                Format
                            </button>
                            <button
                                className="px-4 py-2 text-red-600"
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
                        onFormat={formatActiveTab}
                    />
                    <FormattedView formattedJSON={activeTabData.formattedJSON} />
                </div>
            </div>
        </div>
    );
};

export default JSONFormatter;