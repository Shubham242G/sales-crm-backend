// src/components/NewRoleModal.tsx
import React, { useState } from "react";


// Interface for flattened role (used in dropdown)


// Helper function to flatten the role hierarchy for the dropdown
const flattenRoles = (roles: any, level: number = 0): any=> {
  let result : any = [];
  roles.forEach((role:any) => {
    result.push({ ...role, level });
    if (role.children && role.children.length > 0) {
      result = result.concat(flattenRoles(role.children, level + 1));
    }
  });
  return result;
};

// Props for the NewRoleModal component
interface NewRoleModalProps {
  onClose?: () => void;
  onSave?: (newRole: any) => void;
  roles?: any;
  suggestedParentId?: string | null;
}

const NewRoleModal: React.FC<NewRoleModalProps> = ({
  onClose,
  onSave,
  roles,
  suggestedParentId,
}) => {
  const [roleName, setRoleName] = useState<string>("");
  const [reportsTo, setReportsTo] = useState<string | null>(suggestedParentId??null);
  const [shareData, setShareData] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }
    const newRole: any = {
      name: roleName,
      reportsTo,
      shareData,
      description,
    };
    onSave?.(newRole);
  };

  // Flatten the roles for the dropdown
  const flattenedRoles: any = flattenRoles(roles);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-lg font-semibold mb-4">NEW ROLE</h2>
        <p className="text-gray-600 mb-4">
          THIS PAGE WILL ALLOW YOU TO CREATE A NEW ROLE BASED ON YOUR
          ORGANIZATIONAL HIERARCHY. CREATE A NEW ROLE AND ASSOCIATE IT WITH A
          HIGHER ROLE.
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ROLE NAME</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">REPORTS TO</label>
          <select
            value={reportsTo || ""}
            onChange={(e) => setReportsTo(e.target.value || null)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            {flattenedRoles.map((role:any) => (
              <option key={role.id} value={role.id}>
                {"-".repeat(role.level * 2) + " " + role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={shareData}
            onChange={(e) => setShareData(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700">SHARE DATA WITH PEERS</label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">DESCRIPTION</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700  px-3 py-1.5 rounded-md hover:bg-gray-400"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white  px-3 py-1.5 rounded-md hover:bg-blue-600"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRoleModal;