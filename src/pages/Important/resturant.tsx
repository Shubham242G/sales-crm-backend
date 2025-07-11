import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastError, toastSuccess } from "@/utils/toast";
import MultiFileUpload from "@/utils/multiFileUpload";
import {
  useAddHotel,
  useHotelById,
  useUpdateHotelById,
} from "@/services/hotel.service";
import {
  useAddBanquet,
  useBanquetById,
  useUpdateBanquetById,
} from "@/services/banquet.service";
import {
  useAddResturant,
  useUpdateResturantById,
  useResturantById,
} from "@/services/resturant.service";
import { floor } from "lodash";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddResturant = () => {
  const [banquetName, setBanquetName] = useState("");
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutateAsync: addResturant } = useAddResturant();
  const { mutateAsync: updateResturant } = useUpdateResturantById();
  const { data: resturantDataById, isLoading } = useResturantById(id || "");
  const { canCreate, canUpdate, canDelete, canView } =
    checkPermissionsForButtons("Add Resturant");
  //   const [images, setImages] = useState("");
  const [images, setImages] = useState<{ image: string }[]>([{ image: "" }]);
  useEffect(() => {
    // Prefill form when editing
    if (resturantDataById) {

      setFloor(resturantDataById?.data?.floor || "");
    }
  }, [resturantDataById]);
  const handleImageUpload = (files: { value: string }[]) => {

    setImages(files.map((el) => ({ image: el.value })));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const obj = { floor, imagesArr: images };

      if (id) {
        const { data: res } = await updateResturant({ id, obj });
        if (res) {
          toastSuccess(res.message);
          navigate("/ResturantList");
        }
      } else {
        const { data: res } = await addResturant(obj);
        if (res) {
          toastSuccess(res.message);
          navigate("/ResturantList");
        }
      }
    } catch (error) {
      toastError(error);
    }

    // if (id) {
    //     updateResturant(
    //     { id, obj },
    //     {
    //       onSuccess: () => {
    //         toastSuccess("Resturant updated successfully!");
    //         // navigate("/categoryList");
    //       },
    //       onError: (error: any) => {
    //         console.error("Error updating Resturant:", error.message);
    //         toastError("Failed to update Resturant.");
    //       },
    //     }
    //   );
    // } else {
    //     addResturant(obj, {
    //     onSuccess: () => {
    //         console.log(obj,"add images")
    //       toastSuccess("Resturant added successfully!");
    //       setBanquetName("");
    //     //   navigate("/categoryList");
    //     },
    //     onError: (error: any) => {
    //       console.error("Error adding Resturant:", error.message);
    //       toastError("Failed to add Resturant.");
    //     },
    //   });
    // }
  };

  return (
    <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Restaurant" : "Add Restaurant"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Details Section */}
            <h2 className="text-lg font-semibold mb-4">Restaurant</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <input
                  onChange={(e) => setFloor(e.target.value)}
                  type="number"
                  min={1}
                  value={floor}
                  placeholder="Enter floor"
                  className="w-[200px] border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Multiple Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files);
                      const validFiles = filesArray.map((file) => {
                        return new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) resolve(reader.result as string);
                          };
                          reader.onerror = reject;
                          reader.readAsDataURL(file);
                        });
                      });

                      Promise.all(validFiles)
                        .then((base64Images) => {
                          setImages(
                            base64Images.map((base64) => ({ image: base64 }))
                          );
                        })
                        .catch((error) => {
                          console.error("Error uploading images", error);
                        });
                    }
                  }}
                  className="w-[200px]"
                />
              </div>
            </div>
               {/* Buttons */}
            <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
              <button
                type="button"
                onClick={() => navigate(-1)}
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

            {/* </Grid> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddResturant;
