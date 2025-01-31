import { useCategory } from "@/services/category.service";
import { useHotel } from "@/services/hotel.service";

import FileUpload from "@/utils/FileUpload";
import { toastError, toastSuccess } from "@/utils/toast";
import Select from "react-select";
import React, { useRef, useState,useEffect } from "react";
import { customReactStylesSmall } from "@/utils/ReactSelectStyle";
import { generateFilePath, ReactSelectFormat } from "@/services/urls.service";
import { useBanquet } from "@/services/banquet.service";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateVendorById, useAddVendor , useVendorById} from "@/services/vendor.service";
import { set } from "lodash";

interface IVendor {
  salutation: string
  firstName: string
  lastName: string
  email: string
  companyName: string
  landLine: string
  phoneNumber: string
  displayName: string;
}

interface IOtherDetails {
  sourceOfSupply: string,
  gstTreatment: string,
  gstin: string,
  pan: string,
  msmeRegistered: boolean,
  currency: string,
  paymentTerms: string,
  tds: string,
  priceList: string,
  enablePortal: boolean,
  portalLanguage: string,
  documents: [],
  addOtherDetails: [],
}

interface IBillingAdress {
  addressId: string;
  attention: string;
  billingCountry: string;
  billingAddressStreet1: string;
  billingAddressStreet2: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  billingPhone: string;
  billingFaxNumber: string;
}

interface IShipppingAddress {
  attention: string;
  shippingCountry: string;
  shippingAddressStreet1: string;
  shippingAddressStreet2: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingPhone: string;
  shippingFaxNumber: string;
}

interface IContactPersons {
  salutation: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonWorkPhone: string;
  contactPersonMobile: string;
}[]



const AddVendorForm = () => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);


  
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createVendor } = useAddVendor();
  const { mutateAsync: updateVendor } = useUpdateVendorById();
  const { data: vendorDataById, isLoading: vendorLoading } = useVendorById(id || "");

  const [vendor, setVendor] = useState<IVendor>({
    salutation: "",
    firstName: "",
    lastName: "",
    landLine: "",
    email: "",
    companyName: '',
    phoneNumber: "",
    displayName: "",
  })

  const [otherDetails, setOtherDetails] = useState<IOtherDetails>({
    sourceOfSupply: "",
    gstTreatment: "",
    gstin: "",
    pan: "",
    msmeRegistered: false,
    currency: "",
    paymentTerms: "",
    tds: "",
    priceList: "",
    enablePortal: false,
    portalLanguage: "",
    documents: [],
    addOtherDetails: [],
  })

  const [billingAddress, setBillingAddress] = useState<IBillingAdress>({
    addressId: "",
    attention: "",
    billingCountry: "",
    billingAddressStreet1: "",
    billingAddressStreet2: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    billingPhone: "",
    billingFaxNumber: "",
  })

  const [shippingAddress, setShippingAddress] = useState<IShipppingAddress>({
    attention: "",
    shippingCountry: "",
    shippingAddressStreet1: "",
    shippingAddressStreet2: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingPhone: "",
    shippingFaxNumber: "",
  })




  const [contactPersons, setContactPersons] = useState<IContactPersons[]>([{
    salutation: "",
    contactPersonFirstName: "",
    contactPersonLastName: "",
    contactPersonEmail: "",
    contactPersonWorkPhone: "",
    contactPersonMobile: "",
  }])

  useEffect(() => {
    console.log(vendorDataById, "vendorDataById");
    if (vendorDataById) {
      const apiData = vendorDataById.data;
      console.log(apiData, "check for api data");
      setVendor((prev) => ({
        ...prev,
        salutation: apiData?.vendor?.salutation,
        firstName: apiData?.vendor?.firstName,
        lastName: apiData?.vendor?.lastName,
        email: apiData?.vendor?.email,
        landLine: apiData?.vendor?.landLine,
        phoneNumber: apiData?.vendor?.phoneNumber,
        displayName: apiData?.vendor?.displayName,
        companyName: apiData?.vendor?.companyName
      }));

      setBillingAddress((prev) => ({
        ...prev,
        billingAddressStreet1: apiData?.billingAddress?.billingAddressStreet1,
        attention: apiData?.billingAddress?.attention,
        billingCountry: apiData?.billingAddress?.billingCountry,
        billingAddressStreet2: apiData?.billingAddress?.billingAddressStreet2,
        billingCity: apiData?.billingAddress?.billingCity,
        billingState: apiData?.billingAddress?.billingState,
        billingPincode: apiData?.billingAddress?.billingPincode,
        billingPhone: apiData?.billingAddress?.billingPhone,
        billingFaxNumber: apiData?.billingAddress?.billingFaxNumber,
      }));

      setShippingAddress((prev) => ({
        ...prev,
        shippingAddressStreet1: apiData?.shippingAddress?.shippingAddressStreet1, 
        shippingAddressStreet2: apiData?.shippingAddress?.shippingAddressStreet2,
        attention: apiData?.shippingAddress?.attention,
        shippingCountry: apiData?.shippingAddress?.shippingCountry,
        shippingCity: apiData?.shippingAddress?.shippingCity,
        shippingState: apiData?.shippingAddress?.shippingState,
        shippingPincode: apiData?.shippingAddress?.shippingPincode,
        shippingPhone: apiData?.shippingAddress?.shippingPhone,
        shippingFaxNumber: apiData?.shippingAddress?.shippingFaxNumber, 
      }));

      setOtherDetails((prev) => ({  
        ...prev,
        sourceOfSupply: apiData?.otherDetails?.sourceOfSupply,
        gstTreatment: apiData?.otherDetails?.gstTreatment,
        gstin: apiData?.otherDetails?.gstin,  
        pan: apiData?.otherDetails?.pan,
        msmeRegistered: apiData?.otherDetails?.msmeRegistered,
        currency: apiData?.otherDetails?.currency,
        paymentTerms: apiData?.otherDetails?.paymentTerms,  
        tds: apiData?.otherDetails?.tds,
        priceList: apiData?.otherDetails?.priceList,
        enablePortal: apiData?.otherDetails?.enablePortal,
        portalLanguage: apiData?.otherDetails?.portalLanguage,
        documents: apiData?.otherDetails?.documents,
        addOtherDetails: apiData?.otherDetails?.addOtherDetails,
      }));

      setContactPersons(apiData?.contactPersons);
    }


  }, []);


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      

      console.log(vendor,  "check for vendor data");
      const obj = {
        vendor,
        contactPersons,
        billingAddress,
        shippingAddress,
        otherDetails,
      };


      console.log(obj, "check obj");

      if (id) {

        const { data: res } = await updateVendor({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/vendorList");
      

        }
      } else {

        const { data: res } = await addVendor(obj);
        if (res?.message) {
          setContactPersons(contactPersons);
          setBillingAddress(billingAddress);
          setShippingAddress(shippingAddress);
          setVendor(vendor);
          setOtherDetails(otherDetails);
          toastSuccess(res.message);
          navigate("/vendorList");

        }
      }
    } catch (error) {
      toastError(error);
    }
    console.log("FormDataaaa:-->" ,vendor)
  };

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<string[]>([])

  const [activeTab, setActiveTab] = useState<
    "Other Details" | "Address" | "Contact Persons"
  >("Other Details");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Validate file size and total count
      const validFiles = newFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          // 10MB in bytes
          toastError(`File ${file.name} is larger than 10MB`);
          return false;
        }
        return true;
      });

      if (selectedFiles.length + validFiles.length > 10) {
        toastError("You can only upload a maximum of 10 files");
        return;
      }

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toastError("Please select files to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // Replace this URL with your actual upload endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toastSuccess("Files uploaded successfully");
        setSelectedFiles([]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toastError("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  const handleContactPersonChange = (
    index: number,
    field: keyof IContactPersons,
    value: string | string[]
  ) => {
    const newContacts = [...contactPersons];
    newContacts[index][field] = value as never;
    setContactPersons(newContacts);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {


    const files = e.target.files;
    if (files) {
      const fileReaders: Promise<string>[] = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders)
        .then((base64Images) => {
          setImageState((prevImages) => [...prevImages, ...base64Images]);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };

  const handleAddContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        salutation: "",
        contactPersonFirstName: "",
        contactPersonLastName: "",
        contactPersonEmail: "",
        contactPersonWorkPhone: "",
        contactPersonMobile: "",
      },
    ]);
  };


  const handleDeleteContactPerson = (index: number) => {
    const newContacts = [...contactPersons];
    newContacts.splice(index, 1);
    setContactPersons(newContacts);
  };

  

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValid);
  };

  const salutationOptions = ['Mr.', 'Ms.', 'Dr.', 'Mrs.'];
  const currencyOptions = ['INR.', 'Dollars.', 'Pounds', 'Euros.'];
  const tdsOptions = ['TDS1', 'TDS2.', 'TDS3']; //change these options
  const priceListOptions = ['PL1', 'PL2', 'PL3']; //change these options
  const languageOptions = ['English', 'Hindi', 'Espanyol']; //change these options
  // const [contactName, setContactName] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [alternateContact, setAlternateContact] = useState("");
  // const [email, setEmail] = useState("");
  // const [Website, setWebsite] = useState("");
  // const [landLine, setLandLine] = useState("");
  // const [billingCity, setBillingCity] = useState("");
  // const [billingState, setBillingState] = useState("");
  // const [billingCountry, setBillingCountry] = useState("");
  // const [billingCode, setBillingCode] = useState("");
  // const [Pincode, setPincode] = useState("");
  // const [bankName, setBankName] = useState("");
  // const [accountNumber, setAccountNumber] = useState("");
  // const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  // const [billingFax, setBillingFax] = useState("");
  // const [ifscCode, setIfscCode] = useState("");
  // const [pointOfContact, setPointOfContact] = useState("");
  // const [billingAddress, setBillingAddress] = useState("");
  // const [vendorBankName, setVendorBankName] = useState("");
  // const [vendorIfscCode, setVendorIfscCode] = useState("");


  const { mutateAsync: addVendor } = useAddVendor();
  // const { data: categoryData } = useCategory();
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const { data: getHotelForSelect } = useHotel({ forSelect: true })
  // const { data: getBanquetForSelect } = useBanquet({ forSelect: true })
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedCategory(e.target.value);
  // };


  // const addContactPersons = (contactPersonsIndex:  number) => {
  //   // Create the new room object to add
  //   let ContactPersonsObj = {
  //     salutation: "",
  //     contactPersonFirstName: "",
  //     contactPersonLastName: "",
  //     contactPersonEmail: "",
  //     contactPersonWorkPhone: "",
  //     contactPersonMobile: "",
  //   };

  //   let tempArr = [...contactPersons];
  //   tempArr[hotelIndex] = {
  //     ...tempArr[hotelIndex],
  //     roomsArr: temprRoomArr,
  //   };
  //   console.log(tempArr, "tempArr")
  //   setHotelArr(tempArr);
  // };

  // const addMoreHotels = () => {
  //   let tempArr = [...hotelArr];
  //   let obj = {
  //     hotelId: "",
  //     roomsArr: [
  //       {
  //         category: "",
  //         noOfRooms: 0,
  //         price: 0,
  //         size: "",
  //         imagesArr: [
  //         ],
  //       },
  //     ],
  //   };
  //   console.log(tempArr, "tempArr")
  //   setHotelArr([...tempArr, obj]);
  // };

  // const deleteHotels = (hotelIndex: number) => {
  //   let tempArr = hotelArr.filter((_, i) => i !== hotelIndex);
  //   setHotelArr(tempArr);
  // };
  // const handleChangeSelect = (hotelIndex: number, event: ReactSelectFormat) => {
  //   let tempArr = [...hotelArr]
  //   tempArr[hotelIndex].hotelId = event.value
  //   setHotelArr(tempArr)
  // }

  // const [banquets, setBanquets] = useState([
  //   {
  //     category: "",
  //     name: "",
  //     size: "",
  //     setup: "",
  //     vegPrice: "",
  //     nonVegPrice: "",
  //     floor: "",
  //     pfaSize: "",
  //     images: [] as string[],
  //   },
  // ]);

  const [hasBanquet, setHasBanquet] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);

  // Handle image upload for rooms and banquets
  // const handleImageUpload = (
  //   mainIndex: number,
  //   roomIndex: number,
  //   files: { value: string }[],
  //   section: string
  // ) => {
  //   if (section === "room") {
  //     const tempArr = [...hotelArr];
  //     const tempRoomArr = [...tempArr[mainIndex].roomsArr];
  //     const tempImageArr = tempRoomArr[roomIndex].imagesArr.filter(
  //       (img) => img.image // Filter out empty images
  //     );

  //     files.forEach((file) => {
  //       if (file.value) {
  //         tempImageArr.push({ image: file.value });
  //       }
  //     });

  //     tempRoomArr[roomIndex] = {
  //       ...tempRoomArr[roomIndex],
  //       imagesArr: tempImageArr,
  //     };

  //     tempArr[mainIndex] = { ...tempArr[mainIndex], roomsArr: tempRoomArr };
  //     setHotelArr(tempArr);
  //   }
  // };

  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>
        <form onSubmit={handleSubmit}>

          {/* Primary Contact Section */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="text-base font-medium text-gray-700 mt-2">
                Primary Contact:
              </span>
              <div className="flex-1 space-y-4">
                <div className="flex gap-6">
                  <div className="w-32">
                    <select
                      value={vendor.salutation}
                      onChange={(e) =>
                        setVendor({ ...vendor, salutation: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Salutation</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Miss.">Miss.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={vendor.firstName}
                      onChange={(e) =>
                        setVendor({ ...vendor, firstName: e.target.value })
                      }
                      placeholder="First Name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={vendor.lastName}
                      onChange={(e) =>
                        setVendor({ ...vendor, lastName: e.target.value })
                      }
                      placeholder="Last Name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-6">
                {/* Company Name */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Company Name:
                  </span>
                  <input
                    type="text"
                    value={vendor.companyName}
                    onChange={(e) =>
                      setVendor({ ...vendor, companyName: e.target.value })
                    }
                    placeholder="Enter company name"
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                {/* Display Name */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Display Name:
                  </span>
                  <select
                    value={vendor.displayName}
                    onChange={(e) =>
                      setVendor({ ...vendor, displayName: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">Select Display Name</option>
                    <option value="company">Company Name</option>
                    <option value="contact">Contact Name</option>
                  </select>
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Email Address:
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={vendor.email}
                      onChange={(e) => {
                        setVendor({ ...vendor, email: e.target.value });
                        setIsEmailValid(true);
                      }}
                      onBlur={(e) => validateEmail(e.target.value)}
                      placeholder="Enter email address"
                      className={`w-full border ${!isEmailValid ? "border-red-500" : "border-gray-300"
                        } rounded-md p-2 text-sm pl-10`}
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {!isEmailValid && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Phone:
                  </span>
                  <div className="flex-1 flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={vendor.landLine}
                        onChange={(e) =>
                          setVendor({
                            ...vendor,
                            landLine: e.target.value,
                          })
                        }
                        placeholder="Work Phone"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm pl-10"
                      />
                      <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={vendor.phoneNumber}
                        onChange={(e) =>
                          setVendor({ ...vendor, phoneNumber: e.target.value })
                        }
                        placeholder="Mobile"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm pl-10"
                      />
                      <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Communication Channels
                <div className="flex items-center gap-6 mt-4">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Communication Channels:
                  </span>
                  <div className="flex gap-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.prefersEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prefersEmail: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.prefersSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prefersSMS: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">SMS</span>
                    </label>
                  </div>
                </div> */}

                {/* Tab Menu */}
                <div className="mt-8">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                      {["Other Details", "Address", "Contact Persons"].map(
                        (tab) => (
                          <button
                            type="button"
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                              }`}
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="pt-6">
                    {activeTab === "Other Details" && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* GST Treatment */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700 mt-2">
                              GST Treatment:
                            </span>
                            <select
                              value={otherDetails.gstTreatment}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  gstTreatment: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select GST Treatment</option>
                              <option value="registered_regular">
                                Registered Business - Regular
                              </option>
                              <option value="registered_composite">
                                Registered Business - Composite
                              </option>
                              <option value="unregistered">
                                Unregistered Business
                              </option>
                              <option value="consumer">Consumer</option>
                              <option value="overseas">Overseas</option>
                              <option value="special_economic_zone">
                                Special Economic Zone
                              </option>
                              <option value="deemed_export">
                                Deemed Export
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* GSTIN */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              GSTIN:
                            </span>
                            <input
                              type="text"
                              value={otherDetails.gstin}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  gstin: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                        </div>

                        {/* Place of Supply */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Place of Supply:
                            </span>
                            <select
                              value={otherDetails.sourceOfSupply}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  sourceOfSupply: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select State</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Uttar Pradesh">
                                Uttar Pradesh
                              </option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="West Bengal">West Bengal</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Andhra Pradesh">
                                Andhra Pradesh
                              </option>
                              <option value="Telangana">Telangana</option>
                            </select>
                          </div>
                        </div>

                        {/* PAN Number */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              PAN:
                            </span>
                            <input
                              type="text"
                              value={otherDetails.pan}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  pan: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                        </div>
                        {/*Msme registered*/}
                        <div className="flex items-center gap-6 mt-4">
                          <span className="text-base font-medium text-gray-700 mt-2">
                            MSME Registered?:
                          </span>
                          <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={otherDetails.msmeRegistered}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    msmeRegistered: e.target.checked,
                                  })
                                }
                                className="form-checkbox h-4 w-4 text-blue-600"
                              />
                              <span className="text-gray-700">
                                Allow portal access for this Customer
                              </span>
                            </label>
                          </div>
                        </div>
                        {/* Currency */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Currency:
                            </span>
                            <select
                              value={otherDetails.currency}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  currency: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Currency</option>
                              <option value="INR - Indian Rupee">
                                INR - Indian Rupee
                              </option>
                              <option value="USD - United States Dollar">
                                USD - United States Dollar
                              </option>
                              <option value="EUR - Euro">EUR - Euro</option>
                              <option value="JPY - Japanese Yen">
                                JPY - Japanese Yen
                              </option>
                              <option value="GBP - British Pound Sterling">
                                GBP - British Pound Sterling
                              </option>
                              <option value="AUD - Australian Dollar">
                                AUD - Australian Dollar
                              </option>
                              <option value="CAD - Canadian Dollar">
                                CAD - Canadian Dollar
                              </option>
                              <option value="CHF - Swiss Franc">
                                CHF - Swiss Franc
                              </option>
                              <option value="CNY - Chinese Yuan">
                                CNY - Chinese Yuan
                              </option>
                              <option value="HKD - Hong Kong Dollar">
                                HKD - Hong Kong Dollar
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* Payment Terms */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Payment Terms:
                            </span>
                            <select
                              value={otherDetails.paymentTerms}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  paymentTerms: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Payment Terms</option>
                              <option value="Due on Receipt">
                                Due on Receipt
                              </option>
                              <option value="End of Month (EOM)">
                                End of Month (EOM)
                              </option>
                              <option value="Cash in Advance (CIA)">
                                Cash in Advance (CIA)
                              </option>
                              <option value="Cash on Delivery (COD)">
                                Cash on Delivery (COD)
                              </option>
                              <option value="Partial Payment">
                                Partial Payment
                              </option>
                              <option value="Progressive Payment">
                                Progressive Payment
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* TDS */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              TDS:
                            </span>
                            <select
                              value={otherDetails.tds}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  tds: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Price List</option>
                              <option value="Basic SEO Package">
                                Basic SEO Package
                              </option>
                              <option value="Social Media Management">
                                Social Media Management
                              </option>
                              <option value="Pay-Per-Click (PPC) Campaign Setup">
                                Pay-Per-Click (PPC) Campaign Setup
                              </option>
                              <option value="Content Writing">
                                Content Writing
                              </option>
                              <option value="Website Audit">
                                Website Audit
                              </option>
                            </select>
                          </div>
                        </div>


                        {/* Price List */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Price List:
                            </span>
                            <select
                              value={otherDetails.priceList}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  priceList: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Price List</option>
                              <option value="Basic SEO Package">
                                Basic SEO Package
                              </option>
                              <option value="Social Media Management">
                                Social Media Management
                              </option>
                              <option value="Pay-Per-Click (PPC) Campaign Setup">
                                Pay-Per-Click (PPC) Campaign Setup
                              </option>
                              <option value="Content Writing">
                                Content Writing
                              </option>
                              <option value="Website Audit">
                                Website Audit
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* Enable Portal */}
                        <div className="flex items-center gap-6 mt-4">
                          <span className="text-base font-medium text-gray-700 mt-2">
                            Enable Portal:
                          </span>
                          <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={otherDetails.enablePortal}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    enablePortal: e.target.checked,
                                  })
                                }
                                className="form-checkbox h-4 w-4 text-blue-600"
                              />
                              <span className="text-gray-700">
                                Allow portal access for this Customer
                              </span>
                            </label>
                          </div>
                        </div>
                        {/* Portal Language */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Portal Language:
                            </span>
                            <select
                              value={otherDetails.portalLanguage}
                              onChange={(e) =>
                                setOtherDetails({
                                  ...otherDetails,
                                  portalLanguage: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Portal Language</option>
                              <option value="English (EN)">English (EN)</option>
                              <option value="Spanish (ES)">Espanol (ES)</option>
                              <option value="French (FR)">French (FR)</option>
                              <option value="German (DE)">German (DE)</option>
                              <option value="Hindi (HI)">Hindi (HI)</option>
                            </select>
                          </div>
                        </div>
                        {/* Documents Upload */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Documents:
                            </span>
                            <div className="flex-1">
                              <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mt-8"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>
                                  {uploading
                                    ? "Uploading..."
                                    : "Upload Document"}
                                </span>
                              </button>
                              <p className="text-sm text-gray-500 mt-1">
                                You can upload a maximum of 10 files, 10MB each.
                              </p>

                              {/* Display selected files */}
                              {selectedFiles.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Selected Files:
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedFiles.map((file, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                      >
                                        <span className="text-sm text-gray-600">
                                          {file.name}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveFile(index)
                                          }
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={handleFileUpload}
                                      disabled={uploading}
                                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                    >
                                      {uploading
                                        ? "Uploading..."
                                        : "Upload Selected Files"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {otherDetails && otherDetails.documents.length > 0 && otherDetails.documents.map((image: string, index) => (
                              <img
                                key={index}
                                style={{
                                  height: 100,
                                  width: 100,
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                  borderRadius: "5px",
                                  marginTop: "10px",
                                }}
                                src={image?.includes("base64") ? image : generateFilePath(image)}
                                alt={`Image Preview ${index + 1}`}

                              />
                            ))}
                          </div>
                          <input
                            type="file"
                            accept="image/csv/*"
                            multiple
                            onChange={(e) => handleImageUpload(e, setUploadFiles)}
                            style={{ marginTop: "10px", display: "block" }}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "Address" && (
                      <div className="grid grid-cols-2 gap-8">
                        {/* Billing Address */}
                        <div className="col-span-1">
                          <h2 className="text-2xl font-bold mb-6">
                            Billing Address
                          </h2>
                          {/* Attention */}
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={billingAddress.attention}
                              onChange={(e) =>
                                setBillingAddress({
                                  ...billingAddress,
                                  attention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                          {/* Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              <select
                                value={billingAddress.billingCountry}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingCountry: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">
                                  Select Country / Region
                                </option>
                                <option value="India">India</option>
                                <option value="United States">
                                  United States
                                </option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United Kingdom">
                                  United Kingdom
                                </option>
                              </select>
                            </div>
                          </div>
                          {/* Address */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Address:
                              </span>
                              <input
                                type="text"
                                value={billingAddress.billingAddressStreet1}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingAddressStreet1: e.target.value,
                                  })
                                }
                                placeholder="Street 1"
                                className="w-full ml-16 border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <input
                                type="text"
                                value={billingAddress.billingAddressStreet2}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingAddressStreet2: e.target.value,
                                  })
                                }
                                placeholder="Street 2"
                                className="w-full ml-36 border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                City:
                              </span>
                              <input
                                type="text"
                                value={billingAddress.billingCity}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingCity: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* State */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                State:
                              </span>
                              <select
                                value={billingAddress.billingState}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingState: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                              </select>
                            </div>
                          </div>
                          {/* Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700 w-20">
                                Pin Code:
                              </span>
                              <input
                                type="text"
                                value={billingAddress.billingPincode}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingPincode: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Phone */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Phone:
                              </span>
                              <input
                                type="text"
                                value={billingAddress.billingPhone}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingPhone: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Fax Number */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Fax Number:
                              </span>
                              <input
                                type="text"
                                value={billingAddress.billingFaxNumber}
                                onChange={(e) =>
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingFaxNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="col-span-1">
                          <h2 className="text-2xl font-bold mb-6">
                            Shipping Address
                          </h2>
                          {/* Shipping Attention */}
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={shippingAddress.attention}
                              onChange={(e) =>
                                setShippingAddress({
                                  ...shippingAddress,
                                  attention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                          {/* Shipping Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              <select
                                value={shippingAddress.shippingCountry}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingCountry: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">
                                  Select Country / Region
                                </option>
                                <option value="India">India</option>
                                <option value="United States">
                                  United States
                                </option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United Kingdom">
                                  United Kingdom
                                </option>
                              </select>
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Address:
                              </span>
                              <input
                                type="text"
                                value={shippingAddress.shippingAddressStreet1}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingAddressStreet1: e.target.value,
                                  })
                                }
                                placeholder="Street 1"
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <input
                                type="text"
                                value={shippingAddress.shippingAddressStreet2}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingAddressStreet2: e.target.value,
                                  })
                                }
                                placeholder="Street 2"
                                className="w-full ml-24 border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shippping City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                City:
                              </span>
                              <input
                                type="text"
                                value={shippingAddress.shippingCity}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingCity: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping State */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                State:
                              </span>
                              <select
                                value={shippingAddress.shippingState}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingState: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                              </select>
                            </div>
                          </div>
                          {/* Shipping Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Pin Code:
                              </span>
                              <input
                                type="text"
                                value={shippingAddress.shippingPincode}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingPincode: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Phone */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Phone:
                              </span>
                              <input
                                type="text"
                                value={shippingAddress.shippingPhone}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingPhone: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Fax Number */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Fax Number:
                              </span>
                              <input
                                type="text"
                                value={shippingAddress.shippingFaxNumber}
                                onChange={(e) =>
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingFaxNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Contact Persons" && (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Salutation
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  First Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Last Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Email Address
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Work Phone
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {contactPersons.map((person, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  {/* Salutation Dropdown */}
                                  <td className="px-4 py-2 border-b">
                                    <select
                                      value={person.salutation}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "salutation",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    >
                                      <option value="">Select</option>
                                      <option value="Mr.">Mr.</option>
                                      <option value="Mrs.">Mrs.</option>
                                      <option value="Ms.">Ms.</option>
                                      <option value="Dr.">Dr.</option>
                                    </select>
                                  </td>

                                  {/* First Name */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="text"
                                      value={person.contactPersonFirstName}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "contactPersonFirstName",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Last Name */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="text"
                                      value={person.contactPersonLastName}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "contactPersonLastName",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Email Address */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="email"
                                      value={person.contactPersonEmail}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "contactPersonEmail",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Work Phone */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="tel"
                                      value={person.contactPersonWorkPhone}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "contactPersonWorkPhone",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Delete Button */}
                                  <td className="px-4 py-2 border-b">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteContactPerson(index)
                                      }
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Add Row Button */}
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={handleAddContactPerson}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              Add Row
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"

            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorForm;
