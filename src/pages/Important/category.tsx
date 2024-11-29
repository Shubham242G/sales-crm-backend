import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddCategory, useCategoryById, useUpdateCategoryById } from "@/services/category.service";
import { toastError, toastSuccess } from "@/utils/toast";

const AddCategory = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id, "id");
    const { mutate: addCategory } = useAddCategory();
    const { mutate: updateCategory } = useUpdateCategoryById();
    const { data: categoryData, isLoading } = useCategoryById(id || "");        

    useEffect(() => {
        // Prefill form when editing
        if (categoryData) {
            console.log(categoryData,"getById/")
            setName(categoryData?.data?.name || "");
        }
    }, [categoryData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const obj = { name };

        if (id) {
            
            updateCategory(
                { id, obj },
                {
                    onSuccess: () => {
                        toastSuccess("Category updated successfully!");
                        navigate("/categoryList");
                    },
                    onError: (error: any) => {
                        console.error("Error updating category:", error.message);
                        toastError("Failed to update category.");
                    },
                }
            );
        } else {

            addCategory(obj, {
                onSuccess: () => {
                    toastSuccess("Category added successfully!");
                    setName("");
                    navigate("/categoryList");
                },
                onError: (error: any) => {
                    console.error("Error adding category:", error.message);
                    toastError("Failed to add category.");
                },
            });
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
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md"
                            >
                                {id ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddCategory;
