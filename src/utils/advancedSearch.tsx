// utils/advancedSearch.tsx
import React, { useState } from "react";

export interface SearchField {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
}

export interface AdvancedSearchProps {
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
<div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-h-[70vh] overflow-y-auto border border-gray-100">
  {/* Header */}
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-lg font-semibold text-gray-800">Advanced Search</h2>
    <button
      onClick={onClear}
      className="text-gray-400 hover:text-gray-600 text-lg font-bold"
      aria-label="Close"
    >
      ×
    </button>
  </div>

  {/* Search Fields */}
  <div className="space-y-5">
    {fields.map((field) => (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>

        {/* Condition */}
        <select
          className="w-full border border-gray-300 rounded-md text-sm px-3 py-2 bg-white text-gray-700"
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
        </select>

        {/* Input */}
        {field.type === "select" && field.options ? (
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
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
        ) : (
          <input
            type={field.type === "date" ? "date" : field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 placeholder-gray-400"
            value={searchValues[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        )}
      </div>
    ))}
  </div>

  {/* Action Buttons */}
  <div className="flex justify-end gap-3 mt-6">
    <button
      onClick={handleClear}
      className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
    >
      Clear
    </button>
    <button
      onClick={handleSearch}
      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Search
    </button>
  </div>
</div>


  );
};

export default AdvancedSearch;
