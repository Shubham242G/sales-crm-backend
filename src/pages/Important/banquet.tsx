import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCategory,
  useCategoryById,
  useUpdateCategoryById,
} from "@/services/category.service";
import { toastError, toastSuccess } from "@/utils/toast";
import MultiFileUpload from "@/utils/multiFileUpload";
import {
  useAddBanquet,
  useBanquetById,
  useUpdateBanquetById,
} from "@/services/banquet.service";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddHotel = () => {
  const [banquetName, setBanquetName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutateAsync: addBanquet } = useAddBanquet();
  const { mutateAsync: updateBanquet } = useUpdateBanquetById();
  const { data: banquetDataById, isLoading } = useBanquetById(id || "");

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Add Banquet");
  //   const [images, setImages] = useState("");
  const [images, setImages] = useState<{ image: string }[]>([{ image: "" }]);
  useEffect(() => {
    // Prefill form when editing
    if (banquetDataById) {
      
      setBanquetName(banquetDataById?.data?.banquetName || "");
    }
  }, [banquetDataById]);
  const handleImageUpload = (files: { value: string }[]) => {
    
    setImages(files.map((el) => ({ image: el.value })));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const obj = { banquetName, imagesArr: images };

    try {
      const obj = { banquetName, imagesArr: images };

      if (id) {
        const { data: res } = await updateBanquet({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/BanquetList");
        }
      } else {
        const { data: res } = await addBanquet(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/BanquetList");
        }
      }
    } catch (error) {
      toastError(error);
    }

    // if (id) {
    //   const res: any = await updateBanquet({ id, obj });
    //     updateBanquet(
    //     { id, obj },
    //     {
    //       onSuccess: () => {
    //         toastSuccess("Banquet updated successfully!");
    //         // navigate("/categoryList");
    //       },
    //       onError: (error: any) => {
    //         console.error("Error updating Banquet:", error.message);
    //         toastError("Failed to update Banquet.");
    //       },
    //     }
    //   );
    // } else {
    //     addBanquet(obj, {
    //     onSuccess: () => {
    //         console.log(obj,"add images")
    //       toastSuccess("Banquet added successfully!");
    //       setBanquetName("");
    //     //   navigate("/categoryList");
    //     },
    //     onError: (error: any) => {
    //       console.error("Error adding Banquet:", error.message);
    //       toastError("Failed to add Banquet.");
    //     },
    //   });
    // }
  };

  return (
    <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Banquet" : "Add Banquet"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Details Section */}
            <h2 className="text-lg font-semibold mb-4">Banquet</h2>
            <div className="flex items-center space-x-3">
              <label className="block text-sm font-medium text-gray-700 mb-2 w-[200px]">
                Banquet Name
              </label>
              <input
                onChange={(e) => setBanquetName(e.target.value)}
                type="text"
                value={banquetName}
                placeholder="Enter category name"
                className="border border-gray-300 rounded-md p-2 w-[200px]"
              />
            </div>

            {/* Buttons */}
             <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
              <button
                type="button"
                onClick={() => navigate("/banquetList")}
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
            {/* <Grid item lg={12} className={styles.mb_3}> */}
            {/* <h2>Upload Multiple Images</h2> */}

            <div className="flex items-center space-x-3 mb-4 mt-6">
              <label className="block text-sm font-medium text-gray-700  w-[200px]">
                Upload Multiple Images
              </label>
              <input
            
                type="file"
                multiple
                  className="block text-sm font-medium text-gray-700  w-[200px]"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileReaders: Promise<string>[] = Array.from(files).map(
                      (file) =>
                        new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) resolve(reader.result as string);
                          };
                          reader.onerror = reject;
                          reader.readAsDataURL(file);
                        })
                    );

                    Promise.all(fileReaders)
                      .then((base64Images) => {
                        setImages(
                          base64Images.map((image) => ({ image }))
                        );
                      })
                      .catch((error) => {
                        console.error("Error uploading images:", error);
                      });
                  }
                }}
              />
            </div>
            {/* </Grid> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddHotel;
