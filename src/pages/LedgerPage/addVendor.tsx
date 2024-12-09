import { useCategory } from "@/services/category.service";
import { useHotel } from "@/services/hotel.service";
import { useAddVendor } from "@/services/vendor.service";
import FileUpload from "@/utils/FileUpload";
import { toastError, toastSuccess } from "@/utils/toast";
import Select from "react-select";
import React, { useState } from "react";
import { customReactStylesSmall } from "@/utils/ReactSelectStyle";
import { ReactSelectFormat } from "@/services/urls.service";
import { useBanquet } from "@/services/banquet.service";
interface IHotel {
  hotelId: string | undefined;
  roomsArr: {
    category: string | undefined;
    noOfRooms: number | undefined;
    size: string | undefined;
    price: number | undefined;
    imagesArr: {
      image: string | undefined;
    }[];
  }[];
}

const AddVendorForm = () => {
  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [email, setEmail] = useState("");
  const [Website, setWebsite] = useState("");
  const [landLine, setLandLine] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingCode, setBillingCode] = useState("");
  const [Pincode, setPincode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  const [billingFax, setBillingFax] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [vendorBankName, setVendorBankName] = useState("");
  const [vendorIfscCode, setVendorIfscCode] = useState("");
  const { mutateAsync: addVendor } = useAddVendor();
  const { data: categoryData } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: getHotelForSelect } = useHotel({ forSelect: true })
  const { data: getBanquetForSelect } = useBanquet({ forSelect: true })
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  console.log(categoryData, "categoryData");
  const [hotelArr, setHotelArr] = useState<IHotel[]>([
    {
      hotelId: "",
      roomsArr: [
        {
          category: "",
          noOfRooms: 0,
          price: 0,
          size: "",
          imagesArr: [
          ],
        },
      ],
    },
  ]);

  const addHotelsRooms = (hotelIndex: number) => {
    // Create the new room object to add
    let roomObj = {
      category: "",
      noOfRooms: 0,
      price: 0,
      size: "",
      imagesArr: [
      ],
    };

    let tempArr = [...hotelArr];
    let temprRoomArr = tempArr[hotelIndex].roomsArr;
    temprRoomArr = [...temprRoomArr, roomObj];
    tempArr[hotelIndex] = {
      ...tempArr[hotelIndex],
      roomsArr: temprRoomArr,
    };
    console.log(tempArr, "tempArr")
    setHotelArr(tempArr);
  };

  const addMoreHotels = () => {
    let tempArr = [...hotelArr];
    let obj = {
      hotelId: "",
      roomsArr: [
        {
          category: "",
          noOfRooms: 0,
          price: 0,
          size: "",
          imagesArr: [
          ],
        },
      ],
    };
    console.log(tempArr, "tempArr")
    setHotelArr([...tempArr, obj]);
  };

  const deleteHotels = (hotelIndex: number) => {
    let tempArr = hotelArr.filter((_, i) => i !== hotelIndex);
    setHotelArr(tempArr);
  };
  const handleChangeSelect = (hotelIndex: number, event: ReactSelectFormat) => {
    let tempArr = [...hotelArr]
    tempArr[hotelIndex].hotelId = event.value
    setHotelArr(tempArr)
  }

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
    mainIndex: number,
    roomIndex: number,
    files: { value: string }[],
    section: string
  ) => {
    if (section === "room") {
      const tempArr = [...hotelArr];
      const tempRoomArr = [...tempArr[mainIndex].roomsArr];
      const tempImageArr = tempRoomArr[roomIndex].imagesArr.filter(
        (img) => img.image // Filter out empty images
      );

      files.forEach((file) => {
        if (file.value) {
          tempImageArr.push({ image: file.value });
        }
      });

      tempRoomArr[roomIndex] = {
        ...tempRoomArr[roomIndex],
        imagesArr: tempImageArr,
      };

      tempArr[mainIndex] = { ...tempArr[mainIndex], roomsArr: tempRoomArr };
      setHotelArr(tempArr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const invalidHotels = hotelArr.some((hotel) => !hotel.hotelId || hotel.hotelId.trim() === "");

      if (invalidHotels) {
        toastError("Validation Error: One or more hotels are missing a valid hotelId.");
        return;
      }

      const obj = {
        hotelArr,
        phoneNumber,
        alternateContact,
        email,
        Website,
        landLine,
        billingAddress,
        vendorBankName,
        vendorIfscCode,
      };

      const { data: res } = await addVendor(obj);
      toastSuccess(res.message);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

        {/* Contact Information */}
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <input placeholder="Contact Person" value={contactName} onChange={(e) => setContactName(e.target.value)} className="input" />
          <input placeholder="Contact Person Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input" />
          <input placeholder="Alternate Contact Number" value={alternateContact} onChange={(e) => setAlternateContact(e.target.value)} className="input" />
          <input placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Website URL" className="input" value={Website} onChange={(e) => setWebsite(e.target.value)} />
          <input placeholder="Phone Number" className="input" />
          <input placeholder="Landline" value={landLine} onChange={(e) => setLandLine(e.target.value)} className="input" />
        </div>

        {/* Location */}
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input placeholder="Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="input" />
          <input placeholder="City" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} className="input" />
          <input placeholder="State" value={billingState} onChange={(e) => setBillingState(e.target.value)} className="input" />
          <input placeholder="Pincode" value={billingCode} onChange={(e) => setBillingCode(e.target.value)} className="input" />
        </div>

        {/* Category */}
        <h2 className="text-xl font-semibold mb-4">Category</h2>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="input mb-6 border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categoryData?.data?.map((category: any) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={addMoreHotels} className="text-blue-500 font-semibold">
          + Add Hotel
        </button>
        {hotelArr &&
          hotelArr?.map((el, index) => (
            <div className="">
              <h2 className="text-xl font-semibold mb-4">Hotel</h2>
              <button
                onClick={() => deleteHotels(index)}
                className="text-blue-500 font-semibold"
              >
                Delet Hotel
              </button>
              {/* Room Details */}
              <h2 className="text-xl font-semibold mb-4">Room Details</h2>
              <div className="w-full mb-8 px-3">
                <label
                  className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                  htmlFor="grid-first-name"
                >
                  Select Hotel <span className="text-red-500">*</span>
                </label>
                <Select
                  classNamePrefix="select"
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  isClearable={isClearable}
                  isRtl={isRtl}
                  isSearchable={isSearchable}
                  name="color"
                  options={getHotelForSelect?.data}
                  value={getHotelForSelect?.data?.find((e) => e._id === el.hotelId)}
                  onChange={(val: any) => handleChangeSelect(index, val)}
                  styles={customReactStylesSmall}
                />
              </div>
              <div key={index} className="mb-6 border p-4 rounded-lg">
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => addHotelsRooms(index)}
                    className="text-blue-500 font-semibold"
                  >
                    + Add Room
                  </button>
                </div>
                {el.roomsArr.map((room, roomIndex) => (
                  <>
                    <div className="flex items-center justify-start mb-4">
                      <h3 className="text-lg font-semibold">
                        Room {roomIndex + 1}
                      </h3>
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
                          handleImageUpload(index, roomIndex, files, "room")
                        }
                        label="Upload Room Images"
                        accept="image/*"
                      />
                    </div>
                  </>
                ))}
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
                      handleImageUpload(index, 0, files, "banquet")
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
                onFileChange={(files) =>
                  handleImageUpload(0, 0, files, "banquet")
                }
                label="Upload Restaurant Images"
                accept="image/*"
              />
            </div>
          </>
        )}

        {/* Bank Details */}
        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <input placeholder="Bank Name" value={vendorBankName} onChange={(e) => setVendorBankName(e.target.value)} className="input" />
          <input placeholder="Bank Account Number" className="input" />
          <input placeholder="IFSC Code" value={vendorIfscCode} onChange={(e) => setVendorIfscCode(e.target.value)} className="input" />
          <input placeholder="Point Of Contact" className="input" />
          <input placeholder="Email" className="input" />
          <input placeholder="Phone Number" className="input" />
          <input placeholder="Billing Address" className="input" />
        </div>
        <div className="flex justify-end space-x-4">
          <button className="w-full bg-white-500 text-orange py-2 rounded-lg font-semibold border 5px">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVendorForm;
