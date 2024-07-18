// File: src/components/JSONFormatter/FormattedView.tsx
import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';

interface FormattedViewProps {
    formattedJSON: string;
}

const FormattedView: React.FC<FormattedViewProps> = ({ formattedJSON }) => {


    return (
        <div className="w-1/2 pl-2 bg-white rounded shadow overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-2 p-2">Formatted JSON:</h2>
            <div className="p-2 font-mono text-sm flex-1 overflow-y-auto flex">
                <div className="flex-1">
                    {formattedJSON ? (
                        <ReactJson
                            src={JSON.parse(formattedJSON)}
                            collapsed={false}
                            displayDataTypes={false}
                            enableClipboard={false}
                            displayObjectSize={true}

                            style={{ backgroundColor: 'white' }}
                        />
                    ) : (
                        <span className="text-gray-500">Formatted JSON will appear here</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormattedView;
