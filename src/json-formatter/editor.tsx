import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface EditorProps {
    content: string;
    onChange: (content: string) => void;
    jsonError: string;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, jsonError }) => {
    const editorRef = useRef<HTMLTextAreaElement>(null);

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        onChange(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === '{' || e.key === '[' || e.key === '(' || e.key === '"') {
            e.preventDefault();
            const closingBracket = e.key === '{' ? '}' : e.key === '[' ? ']' : e.key === '(' ? ')' : '"';
            const target = e.target as HTMLTextAreaElement;
            const { selectionStart, selectionEnd } = target;
            const newContent = target.value.slice(0, selectionStart) + e.key + closingBracket + target.value.slice(selectionEnd);
            target.value = newContent;
            target.setSelectionRange(selectionStart + 1, selectionStart + 1);
            handleContentChange({ target } as ChangeEvent<HTMLTextAreaElement>);
        }
    };

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.style.height = 'auto';
            editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
        }
    }, [content]);


    return (
        <div className="w-1/2 pr-2 flex flex-col overflow-hidden">
            <textarea
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                className="w-full flex-grow p-2 border rounded resize-none font-mono text-sm overflow-y-auto"
                placeholder="Paste your JSON here..."
            />
            {jsonError && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                    {jsonError}
                </div>
            )}
        </div>
    );
};

export default Editor;