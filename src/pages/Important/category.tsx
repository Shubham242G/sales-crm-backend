import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCategory,
  useCategoryById,
  useUpdateCategoryById,
} from "@/services/category.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutateAsync: addCategory } = useAddCategory();
  const { mutateAsync: updateCategory } = useUpdateCategoryById();
  const { data: categoryData, isLoading } = useCategoryById(id || "");
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Add Category");

  useEffect(() => {
    // Prefill form when editing
    if (categoryData) {
      setName(categoryData?.data?.name || "");
    }
  }, [categoryData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { name };

      if (id) {
        const { data: res } = await updateCategory({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/categoryList");
        }
      } else {

        const { data: res } = await addCategory(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/categoryList");
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
          {id ? "Edit Category" : "Add Category"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Details Section */}
            <h2 className="text-lg font-semibold mb-4">Category</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                placeholder="Enter category name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/categoryList")}
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

export default AddCategory;
