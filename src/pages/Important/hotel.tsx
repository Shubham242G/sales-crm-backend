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
      setName(hotelDataById?.data?.name || "");

      setImages(
        hotelDataById?.data?.imagesArr?.length > 0
          ? hotelDataById?.data?.imagesArr.map((el: any) => ({ image: el.image }))
          : [{ image: "" }]
      );

    }
  }, [hotelDataById]);
  const handleImageUpload = (files: { value: string }[]) => {

    setImages(files.map((el) => ({ image: el.value })));
    console.log(images, "<------images in hotel");
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
    <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
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
            <div className="flex items-center space-x-3">
              <label className="block text-sm font-medium text-gray-700 mb-2 w-[200px]">
                Hotel Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                value={name}
                placeholder="Enter category name"
               className="border border-gray-300 rounded-md p-2 w-[200px]"
              />
            </div>

            {/* Buttons */}
            <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
              <button
                type="button"
                onClick={() => navigate("/hotelList")}
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

            {/* <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Images</h2>
              <div className="flex flex-wrap gap-4">
                {images && images.length > 0 ? (
                  images
                    .filter((el) => el.image !== "")
                    .map((el, index) => (
                      <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img src={el.image} alt={`Uploaded ${index}`} className="object-cover w-full h-full" />
                      </div>
                    ))
                ) : (
                  <p>No images uploaded yet.</p>
                )}
              </div>
            </div> */}

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
