import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCategory,
  useCategoryById,
  useUpdateCategoryById,
} from "@/services/category.service";
import { toastError, toastSuccess } from "@/utils/toast";
import MultiFileUpload from "@/utils/multiFileUpload";
import { useAddHotel, useHotelById, useUpdateHotelById } from "@/services/hotel.service";
import { useAddBanquet, useBanquetById, useUpdateBanquetById } from "@/services/banquet.service";

const AddHotel = () => {
  const [banquetName, setBanquetName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id, "id");
  const { mutateAsync: addBanquet } = useAddBanquet();
  const { mutateAsync: updateBanquet } = useUpdateBanquetById();
  const { data: banquetDataById, isLoading } = useBanquetById(id || "");
  //   const [images, setImages] = useState("");
  const [images, setImages] = useState<{ image: string }[]>([{ image: "" }]);
  useEffect(() => {
    // Prefill form when editing
    if (banquetDataById) {
      console.log(banquetDataById, "getById/");
      setBanquetName(banquetDataById?.data?.banquetName || "");
    }
  }, [banquetDataById]);
  const handleImageUpload = (files: { value: string }[]) => {
    console.log(files, "filessss");
    console.log(images, "image");
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
          navigate("/BanquetList")

        }
      } else {

        const { data: res } = await addBanquet(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/BanquetList")

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
    <div className="min-h-screen bg-gray-100 p-8">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banquet Name
              </label>
              <input
                onChange={(e) => setBanquetName(e.target.value)}
                type="text"
                value={banquetName}
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
