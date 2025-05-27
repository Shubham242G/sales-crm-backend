import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastError, toastSuccess } from "@/utils/toast";
import {
  useAddDepartmentMaster,
  useUpdateDepartmentMasterById,
  useDepartmentMasterById,
} from "@/services/departmentMaster.service";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddDepartment = () => {
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutateAsync: addDepartment } = useAddDepartmentMaster();
  const { mutateAsync: updateDepartment } = useUpdateDepartmentMasterById();
  const { data: departmentData, isLoading } = useDepartmentMasterById(id || "");
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Add Department");

  useEffect(() => {
    // Prefill form when editing
    if (departmentData) {
      setDepartment(departmentData?.data?.department || "");
      setSubDepartment(departmentData?.data?.subDepartment || "");
    }
  }, [departmentData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { department, subDepartment };

      if (id) {
        const { data: res } = await updateDepartment({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/departmentMasterView");
        }
      } else {

        const { data: res } = await addDepartment(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/departmentMasterView");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Department" : "Add Department"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Department. Section */}
            <h2 className="text-lg font-semibold mb-4">Department</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department Name
              </label>
              <input
                onChange={(e) => setDepartment(e.target.value)}
                type="text"
                value={department}
                placeholder="Enter department name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Sub Department Section */}
            <h2 className="text-lg font-semibold mb-4">Sub Department</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Department Name
              </label>
              <input
                onChange={(e) => setSubDepartment(e.target.value)}
                type="text"
                value={subDepartment}
                placeholder="Enter Sub Department name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/departmentMasterView")}
                className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              {((!id && canCreate) || (id && canUpdate)) && (
                <button
                  type="submit"
                  className=" px-3 py-1.5 bg-orange-500 text-white rounded-md"
                >
                  {id ? "Update" : "Save"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDepartment;
