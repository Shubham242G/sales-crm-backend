import FileUpload from "@/utils/FileUpload";
import React, { useState } from "react";

const AddVendorForm = () => {
  const [rooms, setRooms] = useState([
    {
      category: "",
      numberOfRooms: "",
      size: "",
      price: "",
      roomOnlyPrice: "",
      images: [] as string[],
    },
  ]);
  const [banquets, setBanquets] = useState([
    {
      category: "",
      name: "",
      size: "",
      setup: "",
      vegPrice: "",
      nonVegPrice: "",
      floor: "",
      pfaSize: "",
      images: [] as string[],
    },
  ]);
  const [hasBanquet, setHasBanquet] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);

  // Handle image upload for rooms and banquets
  const handleImageUpload = (
    index: number,
    files: { mimeType: string; value: string }[],
    section: string
  ) => {
    if (section === "room") {
      const newRooms = [...rooms];
      newRooms[index].images = files.map((file) => file.value);
      setRooms(newRooms);
    } else if (section === "banquet") {
      const newBanquets = [...banquets];
      newBanquets[index].images = files.map((file) => file.value);
      setBanquets(newBanquets);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

        {/* Contact Information */}
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <input placeholder="Contact Person" className="input" />
          <input placeholder="Contact Person Phone" className="input" />
          <input placeholder="Alternate Contact Number" className="input" />
          <input placeholder="Email" className="input" />
          <input placeholder="Website URL" className="input" />
          <input placeholder="Phone Number" className="input" />
          <input placeholder="Landline" className="input" />
        </div>

        {/* Location */}
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input placeholder="Address" className="input" />
          <input placeholder="City" className="input" />
          <input placeholder="State" className="input" />
          <input placeholder="Pincode" className="input" />
        </div>

        {/* Category */}
        <h2 className="text-xl font-semibold mb-4">Category</h2>
        <input
          placeholder="Sample Category (e.g., Hotel, Restaurant, Banquet)"
          className="input mb-6"
        />

        {/* Room Details */}
        <h2 className="text-xl font-semibold mb-4">Room Details</h2>
        {rooms.map((room, index) => (
          <div key={index} className="mb-6 border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Room {index + 1}</h3>
              <button
                onClick={() =>
                  setRooms([
                    ...rooms,
                    {
                      category: "",
                      numberOfRooms: "",
                      size: "",
                      price: "",
                      roomOnlyPrice: "",
                      images: [],
                    },
                  ])
                }
                className="text-blue-500 font-semibold"
              >
                + Add Room
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <input placeholder="Category" className="input" />
              <input placeholder="Number of Rooms" className="input" />
              <input placeholder="Size (LxBxH)" className="input" />
              <input placeholder="Price" className="input" />
              <input placeholder="Room Only Price" className="input" />
            </div>
            <div className="mb-4">
              <FileUpload
                onFileChange={(files) =>
                  handleImageUpload(index, files, "room")
                }
                label="Upload Room Images"
                accept="image/*"
              />
            </div>
          </div>
        ))}

        {/* Do you have Banquet */}
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasBanquet}
              onChange={() => setHasBanquet(!hasBanquet)}
            />
            <span>Do you have Banquet</span>
          </label>
        </div>

        {hasBanquet && (
          <>
            {/* Banquet Details */}
            <h2 className="text-xl font-semibold mb-4">Banquet Details</h2>
            <input
              type="number"
              placeholder="Number of Banquets"
              className="input mb-6"
            />

            {banquets.map((banquet, index) => (
              <div key={index} className="mb-6 border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Banquet {index + 1}</h3>
                  <button
                    onClick={() =>
                      setBanquets([
                        ...banquets,
                        {
                          category: "",
                          name: "",
                          size: "",
                          setup: "",
                          vegPrice: "",
                          nonVegPrice: "",
                          floor: "",
                          pfaSize: "",
                          images: [],
                        },
                      ])
                    }
                    className="text-blue-500 font-semibold"
                  >
                    + Add Banquet
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <select className="input">
                    <option value="">Select Category</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <input placeholder="Banquet Name" className="input" />
                  <input placeholder="Size (LxBxH)" className="input" />
                  <input placeholder="Setup" className="input" />
                  <input
                    placeholder="Veg Price (per plate)"
                    className="input"
                  />
                  <input
                    placeholder="Non-Veg Price (per plate)"
                    className="input"
                  />
                  <select className="input">
                    <option value="">Select Floor</option>
                    <option>1st Floor</option>
                    <option>2nd Floor</option>
                  </select>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>Do you have PFA (pre-function area)</span>
                  </label>
                  <input placeholder="PFA Size (LxBxH)" className="input" />
                </div>
                <div className="mb-4">
                  <FileUpload
                    onFileChange={(files) =>
                      handleImageUpload(index, files, "banquet")
                    }
                    label="Upload Banquet Images"
                    accept="image/*"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Do you have Restaurant */}
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasRestaurant}
              onChange={() => setHasRestaurant(!hasRestaurant)}
            />
            <span>Do you have Restaurant</span>
          </label>
        </div>

        {hasRestaurant && (
          <>
            {/* Restaurant Details */}
            <h2 className="text-xl font-semibold mb-4">Restaurant Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <select className="input">
                <option value="">Select Food Option</option>
                <option>Veg</option>
                <option>Non Veg</option>
              </select>
              <input
                placeholder="Covers (No. of Occupancy)"
                className="input"
              />
              <select className="input">
                <option value="">Select Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
              </select>
              <select className="input">
                <option value="">Swimming Pool</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="mb-4">
              <FileUpload
                onFileChange={(files) => handleImageUpload(0, files, "banquet")}
                label="Upload Restaurant Images"
                accept="image/*"
              />
            </div>
          </>
        )}

        {/* Bank Details */}
        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <input placeholder="Bank Name" className="input" />
          <input placeholder="Bank Account Number" className="input" />
          <input placeholder="IFSC Code" className="input" />
          <input placeholder="Point Of Contact" className="input" />
          <input placeholder="Email" className="input" />
          <input placeholder="Phone Number" className="input" />
          <input placeholder="Billing Address" className="input" />
        </div>
        <div className="flex justify-end space-x-4">
          <button className="w-full bg-white-500 text-orange py-2 rounded-lg font-semibold border 5px">
            Cancel
          </button>
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVendorForm;
