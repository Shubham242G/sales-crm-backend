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
  useAddHotel,
  useHotelById,
  useUpdateHotelById,
} from "@/services/hotel.service";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddHotel = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id, "id");
  const { mutateAsync: addHotel } = useAddHotel();
  const { mutateAsync: updateHotel } = useUpdateHotelById();
  const { data: hotelDataById, isLoading } = useHotelById(id || "");
  //   const [images, setImages] = useState("");
  const [images, setImages] = useState<{ image: string }[]>([{ image: "" }]);
  const { canCreate, canUpdate, canDelete, canView } =
    checkPermissionsForButtons("Add Hotel");
  useEffect(() => {
    // Prefill form when editing
    if (hotelDataById) {
      console.log(hotelDataById, "getById/");
      setName(hotelDataById?.data?.name || "");
    }
  }, [hotelDataById]);
  const handleImageUpload = (files: { value: string }[]) => {
    console.log(files, "filessss");
    console.log(images, "image");
    setImages(files.map((el) => ({ image: el.value })));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const obj = { name, imagesArr: images };
      if (id) {
        const { data: res } = await updateHotel({ id, obj });
        if (res) {
          toastSuccess(res.message);
          navigate("/hotelList");
        }
      } else {
        const res: any = await addHotel(obj);
        if (res) {
          toastSuccess(res.message);
          navigate("/hotelList");
        }
      }
    } catch (error) {
      toastError(error);
    }

    // if (id) {
    //   updateHotel(
    //     { id, obj },
    //     {
    //       onSuccess: () => {
    //         toastSuccess("Hotel updated successfully!");
    //         // navigate("/categoryList");
    //       },
    //       onError: (error: any) => {
    //         console.error("Error updating Hotel:", error.message);
    //         toastError("Failed to update Hotel.");
    //       },
    //     }
    //   );
    // } else {
    //   addHotel(obj, {
    //     onSuccess: () => {
    //       console.log(obj, "add images")
    //       toastSuccess("hotel added successfully!");
    //       setName("");
    //       //   navigate("/categoryList");
    //     },
    //     onError: (error: any) => {
    //       console.error("Error adding Hotel:", error.message);
    //       toastError("Failed to add Hotel.");
    //     },
    //   });
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Hotel" : "Add Hotel"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Details Section */}
            <h2 className="text-lg font-semibold mb-4">Hotel</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Name
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
              {((!id && canCreate) || (id && canUpdate)) && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md"
                >
                  {id ? "Update" : "Save"}
                </button>
              )}
            </div>
            {/* <Grid item lg={12} className={styles.mb_3}> */}
            {/* <h2>Upload Multiple Images</h2> */}

            <MultiFileUpload
              value={
                images && images.length > 0
                  ? images
                      .filter((el) => el.image != "")
                      .map((el) => ({ value: el.image }))
                  : []
              }
              onFileChange={handleImageUpload}
              label="Upload Multiple Images"
              accept="image/*"
            />
            {/* </Grid> */}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddHotel;
