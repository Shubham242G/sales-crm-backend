export type FieldType = "text" | "select" | "boolean" | "date";

export interface SearchFieldOption {
    label: string;
    value: string;
}

export interface SearchField {
    key: string;
    label: string;
    type: FieldType;
    options?: SearchFieldOption[]; // For select or boolean
}






import React, { useState } from "react";


interface Props {
    fields: SearchField[];
    onSearch: (query: Record<string, string>) => void;
}


export const mapColumnsToSearchFields = (columns: any[]): SearchField[] => {
    return columns
      .filter(col => typeof col.selector === "function")
      .map(col => {
        const key = col.selector.toString().match(/row\.(\w+)/)?.[1] || "";
        return {
          key,
          label: col.name,
          type: "text", // defaulting to text — can be extended later
        };
      });
  };

const AdvancedSearch: React.FC<Props> = ({ fields, onSearch }) => {
    const [searchValues, setSearchValues] = useState<Record<string, string>>({});

    const handleInputChange = (key: string, value: string) => {
        setSearchValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearch = () => {
        onSearch(searchValues);
    };

    const handleClear = () => {
        setSearchValues({});
        onSearch({});
    };

    return (
        <div className="flex flex-wrap gap-3 p-4 bg-white border rounded-md shadow-md">
            {fields.map(field => (
                <div key={field.key} className="flex flex-col">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "text" && (
                        <input
                            type="text"
                            value={searchValues[field.key] || ""}
                            onChange={e => handleInputChange(field.key, e.target.value)}
                            className="border px-2 py-1 rounded-md"
                        />
                    )}
                    {field.type === "select" && (
                        <select
                            value={searchValues[field.key] || ""}
                            onChange={e => handleInputChange(field.key, e.target.value)}
                            className="border px-2 py-1 rounded-md"
                        >
                            <option value="">--Select--</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {field.type === "boolean" && (
                        <select
                            value={searchValues[field.key] || ""}
                            onChange={e => handleInputChange(field.key, e.target.value)}
                            className="border px-2 py-1 rounded-md"
                        >
                            <option value="">--Select--</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    )}
                </div>
            ))}

            <div className="flex items-end gap-2">
                <button onClick={handleSearch} className="px-3 py-1 bg-blue-600 text-white rounded-md">
                    Apply
                </button>
                <button onClick={handleClear} className="px-3 py-1 border rounded-md">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default AdvancedSearch;
