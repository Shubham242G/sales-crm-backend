import { toastError, toastSuccess } from "@/utils/toast";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useAddUser,
  useUserById,

  useUser,
} from "@/services/user.service";

import { useLead } from "@/services/lead.service";
import { useAddLeadManagement, useLeadManagementById, useUpdateLeadManagementById } from "@/services/leadManagement.service";
import { useRoles } from "@/services/roles.service";

const leadManagementEdit = () => {
  const [formData, setFormData] = useState<{ userId: string; leadIds: string[] }>({
    userId: "",
    leadIds: [],
  });



 

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addLeadManagement } = useAddLeadManagement();
  const { mutateAsync: updateLeadManagement } = useUpdateLeadManagementById();
  const { data: leadManagementById } = useLeadManagementById(id ? id: "" , id? true : false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [query, setQuery] = useState("");
  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const [selectedRole , setSelectedRole] = useState('');
  const {data : usersData} = useUser(searchObj);
  const {data: leadData} = useLead(searchObj);
  const {data: roleData } = useRoles(searchObj)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = formData;
      if (id) {
        const { data: res } = await updateLeadManagement({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/leadManagement");
        }
      } else {
        const { data: res } = await addLeadManagement(obj);
        if (res?.message) {
          setFormData(obj);
          toastSuccess(res.message);
          navigate("/leadManagement");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  
useEffect(() => {
  if (leadManagementById?.data) {
    setFormData(leadManagementById?.data);
  }
}, [leadManagementById]);


  return (
    <div className="h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className=" w-full h-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Add Leads to User</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
             <select
  value={formData.userId}
  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
  className="w-full border border-gray-300 rounded-md p-2"
>
  <option value="">Select User</option>
  {(selectedRole
    ? usersData?.data.filter((user) => user.name?.toLocaleLowerCase() === selectedRole.toLocaleLowerCase())
    : usersData?.data
  )?.map((user) => (
    <option value={user._id} key={user._id}>
      {user.name}
    </option>
  ))}
</select>
            </div>

            <div> 
             <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Role
  </label>
  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value)}
    className="w-full border border-gray-300 rounded-md p-2"
  >
    <option value="">All Roles</option>
    {roleData?.data?.map((role: any) => (
      <option value={role.name} key={role._id}>
        {role.name}
      </option>
    ))}
  </select>
</div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Leads
              </label>
              <div className="border border-gray-300 rounded-md p-2 h-96 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {leadData?.data?.map((lead: any) => (
                    <div
                      key={lead._id}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={formData.leadIds.includes(lead._id)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            leadIds: e.target.checked
                              ? [...formData.leadIds, lead._id]
                              : formData.leadIds.filter(
                                  (id) => id !== lead._id
                                ),
                          })
                        }
                      />
                      <span className="ml-2">{lead.firstName + " " + lead.lastName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => navigate("/leadManagement")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default leadManagementEdit;
