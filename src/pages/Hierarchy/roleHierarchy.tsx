// src/components/RoleHierarchy.tsx
import React, { useState, useEffect } from "react";
import NewRoleModal from "./newRoleModal";


// Mock initial roles (simulating Zoho CRM roles)
const initialRoles: any = [
  {
    id: "portl2888",
    name: "Management",
    reportsTo: null,
    children: [
      {
        id: "team-leader-1",
        name: "Team Leader 1",
        reportsTo: "portl2888",
        children: [
          { id: "group-ops-1", name: "Group OPS 1", reportsTo: "team-leader-1", children: [] },
          { id: "group-ops-2", name: "Group OPS 2", reportsTo: "team-leader-1", children: [] },
        ],
      },
    ],
  },
];

// RoleNode component with typed props
interface RoleNodeProps {
  role: any;
  onAddRole: (parentId: string | null) => void;
  isExpandedAll?: boolean;
}

const RoleNode: React.FC<RoleNodeProps> = ({ role, onAddRole, isExpandedAll }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const effectiveExpanded = isExpandedAll !== undefined ? isExpandedAll : isExpanded;

  return (
    <div className="ml-4">
      <div className="flex items-center">
        {role.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 mr-2"
          >
            {effectiveExpanded ? "▼" : "▶"}
          </button>
        )}
        <span className="text-gray-700">{role.name}</span>
        <button
          onClick={() => onAddRole(role.id)}
          className="ml-2 text-blue-500 text-sm hover:underline"
        >
          + Add Child
        </button>
      </div>
      {effectiveExpanded && role.children.length > 0 && (
        <div className="border-l-2 border-dashed border-gray-300 ml-4">
          {role.children.map((child:any) => (
            <RoleNode
              key={child.id}
              role={child}
              onAddRole={onAddRole}
              isExpandedAll={isExpandedAll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RoleHierarchy: React.FC = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [suggestedParentId, setSuggestedParentId] = useState<string | null>(null);

  // Simulate fetching roles from Zoho CRM API
  useEffect(() => {
    console.log("Fetching roles from Zoho CRM (simulated)...");
  }, []);

  const findAndUpdateRole = (
    roles: any,
    roleId: string,
    newRole: any | null
  ): any => {
    return roles.map((role:any) => {
      if (role.id === roleId) {
        return {
          ...role,
          children: newRole
            ? [...role.children, { ...newRole, children: [], reportsTo: roleId }]
            : role.children,
        };
      }
      if (role.children.length > 0) {
        return {
          ...role,
          children: findAndUpdateRole(role.children, roleId, newRole),
        };
      }
      return role;
    });
  };

  const handleAddRole = (newRole: any) => {
    const parentId = newRole.reportsTo; // Use reportsTo from the form data
    const createdRole = {
      id: `role-${Date.now()}`, // Generate a unique ID
      name: newRole.name,
      description: newRole.description,
      shareDataWithPeers: newRole.shareData,
      reportsTo: parentId,
      children: [],
    };

    if (!parentId) {
      setRoles([...roles, createdRole]);
    } else {
      setRoles(findAndUpdateRole(roles, parentId, createdRole));
    }
    setIsModalOpen(false);
    setSuggestedParentId(null);
  };

  const toggleExpandAll = () => {
    setExpanded(!expanded);
  };

  const openModalForRole = (parentId: string | null) => {
    setSuggestedParentId(parentId); // Suggest the parent ID based on "Add Child"
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">ROLES</h2>
        <div className="space-x-2">
          <button
            onClick={() => openModalForRole(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            NEW ROLE
          </button>
          <button
            onClick={toggleExpandAll}
            className="text-blue-500 hover:underline"
          >
            {expanded ? "COLLAPSE ALL" : "EXPAND ALL"}
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">
        THIS PAGE WILL ALLOW YOU TO DEFINE HOW YOU SHARE THE DATA AMONG USERS
        BASED ON YOUR ORGANIZATION’S ROLE HIERARCHY.
      </p>
      <div>
        {roles.map((role:any) => (
          <RoleNode
            key={role.id}
            role={role}
            onAddRole={openModalForRole}
            isExpandedAll={expanded}
          />
        ))}
      </div>
      {isModalOpen && (
        <NewRoleModal
          onClose={() => {
            setIsModalOpen(false);
            setSuggestedParentId(null);
          }}
          onSave={handleAddRole}
          roles={roles}
          suggestedParentId={suggestedParentId}
        />
      )}
    </div>
  );
};

export default RoleHierarchy;