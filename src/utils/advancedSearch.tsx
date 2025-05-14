// utils/advancedSearch.tsx
import React, { useState } from "react";

export interface SearchField {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

interface AdvancedSearchProps {
  fields: SearchField[];
  onSearch: (values: string) => void;
  onClear: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  fields,
  onSearch,
  onClear,
}) => {
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [conditions, setConditions] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleConditionChange = (field: string, condition: string) => {
    setConditions((prev) => ({ ...prev, [field]: condition }));
  };

  const handleSearch = () => {
    // Build the query string based on searchValues and conditions
    const queryParts = Object.entries(searchValues)
      .filter(([_, value]) => value.trim() !== "")
      .map(([field, value]) => {
        const condition = conditions[field] || "contains";
        return `${field}:${condition}:${value}`;
      });

    const queryString = queryParts.join(",");
    onSearch(queryString);
  };

  const handleClear = () => {
    setSearchValues({});
    setConditions({});
    onClear();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Advanced Search</h2>
        <button 
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              
              {/* <select
                className="border border-gray-300 rounded-md text-sm px-2 py-1"
                value={conditions[field.key] || "contains"}
                onChange={(e) => handleConditionChange(field.key, e.target.value)}
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="startsWith">Starts With</option>
                <option value="endsWith">Ends With</option>
                {field.type === "number" && (
                  <>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                  </>
                )}
              </select> */}
            </div>
            
            {field.type === "select" && field.options ? (
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={searchValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "date" ? (
              <input
                type="date"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={searchValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            ) : (
              <input
                type={field.type}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={searchValues[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;