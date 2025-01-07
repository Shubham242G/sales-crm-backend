import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastError, toastSuccess } from "@/utils/toast";
import MultiFileUpload from "@/utils/multiFileUpload";
import { useAddHotel, useHotelById, useUpdateHotelById } from "@/services/hotel.service";
import { useAddBanquet, useBanquetById, useUpdateBanquetById } from "@/services/banquet.service";
import { useAddResturant, useUpdateResturantById, useResturantById } from "@/services/resturant.service";
import { floor } from "lodash";

const AddResturant = () => {
  const [banquetName, setBanquetName] = useState("");
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id, "id");
  const { mutateAsync: addResturant } = useAddResturant();
  const { mutateAsync: updateResturant } = useUpdateResturantById();
  const { data: resturantDataById, isLoading } = useResturantById(id || "");
  //   const [images, setImages] = useState("");
  const [images, setImages] = useState<{ image: string }[]>([{ image: "" }]);
  useEffect(() => {
    // Prefill form when editing
    if (resturantDataById) {
      console.log(resturantDataById, "getById/");
      setFloor(resturantDataById?.data?.floor || "");
    }
  }, [resturantDataById]);
  const handleImageUpload = (files: { value: string }[]) => {
    console.log(files, "filessss");
    console.log(images, "image");
    setImages(files.map((el) => ({ image: el.value })));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const obj = { floor, imagesArr: images };


      if (id) {

        const { data: res } = await updateResturant({ id, obj })
        if (res) {
          toastSuccess(res.message)
          navigate("/ResturantList")
        }
      }
      else {
        const { data: res } = await addResturant(obj)
        if (res) {
          toastSuccess(res.message)
          navigate("/ResturantList")
        }
      }


    }
    catch (error) {
      toastError(error)


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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Resturant" : "Add Resturant"}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Category Details Section */}
            <h2 className="text-lg font-semibold mb-4">Resturant</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor
              </label>
              <input
                onChange={(e) => setFloor(e.target.value)}
                type="text"
                value={floor}
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

export default AddResturant;
