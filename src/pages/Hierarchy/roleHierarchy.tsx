import React, { useState, useEffect } from "react";
import { useRoleHierarchy } from "@/services/roleHierarchy.service";

// Role type interface
interface Role {
  id: string;
  name: string;
  reportsTo: string | null;
  description?: string;
  children?: Role[];
}

// Build a tree from flat role data
const buildRoleTree = (roles: Role[]): Role[] => {
  const map = new Map<string, Role>();
  const roots: Role[] = [];
  
  roles.forEach(role => {
    const newRole = { ...role, children: [] };
    map.set(role.id, newRole);
  });
  
  roles.forEach(role => {
    if (role.reportsTo && map.has(role.reportsTo)) {
      map.get(role.reportsTo)!.children!.push(map.get(role.id)!);
    } else {
      roots.push(map.get(role.id)!);
    }
  });
  
  return roots;
};

// TreeNode component (recursive)
const TreeNode: React.FC<{ role: Role; isLast: boolean }> = ({ role, isLast }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = role.children && role.children.length > 0;
  
  return (
    <div className="relative pl-6">
      {/* Vertical connector (not for last item) */}
      {!isLast && <div className="absolute left-2 top-4 h-full border-l-2 border-gray-300" />}
      
      <div className="relative flex items-start mb-2">
        {/* Horizontal connector */}
        <div className="absolute left-0 top-4 w-2 border-t-2 border-gray-300" />
        
        {/* Node circle */}
        <div className="z-10 flex items-center justify-center w-4 h-4 mt-2 bg-blue-500 rounded-full">
          {hasChildren && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="flex items-center justify-center w-full h-full text-white text-xs font-bold"
            >
              {expanded ? "-" : "+"}
            </button>
          )}
        </div>
        
        {/* Content box */}
        <div className="ml-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm w-full hover:shadow-md transition-shadow duration-200">
          <div className="font-medium text-gray-800">{role.name || "(Unnamed Role)"}</div>
          {role.description && (
            <div className="text-sm text-gray-500 mt-1">{role.description}</div>
          )}
        </div>
      </div>
      
      {/* Children */}
      {hasChildren && expanded && (
        <div className="pl-1">
          {role.children!.map((child, index) => (
            <TreeNode 
              key={child.id} 
              role={child} 
              isLast={index === role.children!.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component
const RoleHierarchy: React.FC = () => {
  const { data, isLoading, error } = useRoleHierarchy();
  const [treeData, setTreeData] = useState<Role[]>([]);
  
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      const tree = buildRoleTree(data.data);
      setTreeData(tree);
    }
  }, [data]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Organizational Role Hierarchy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Interactive visualization of reporting relationships
      </p>
      
      {isLoading && <div className="text-gray-500">Loading role hierarchy...</div>}
      {error && <div className="text-red-500">Failed to load roles.</div>}
      
      {!isLoading && !error && treeData.length === 0 && (
        <div className="text-gray-500">No roles available.</div>
      )}
      
      <div className="pt-4">
        {treeData.map((role, index) => (
          <TreeNode 
            key={role.id} 
            role={role} 
            isLast={index === treeData.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default RoleHierarchy;