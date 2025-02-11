import { useCategory } from "@/services/category.service";
import { useHotel } from "@/services/hotel.service";

import FileUpload from "@/utils/FileUpload";
import { toastError, toastSuccess } from "@/utils/toast";
import Select from "react-select";
import React, { useRef, useState, useEffect } from "react";
import { customReactStylesSmall } from "@/utils/ReactSelectStyle";
import { generateFilePath, ReactSelectFormat } from "@/services/urls.service";
import { useBanquet } from "@/services/banquet.service";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateVendorById,
  useAddVendor,
  useVendorById,
} from "@/services/vendor.service";
import { set } from "lodash";
import { Autocomplete } from "@mui/material";
import { TextField, TextFieldProps } from "@mui/material";
import {
  ChevronUp,
  ChevronDown,
  Globe,
  Building2,
  UserRound,
  Twitter,
  MessageCircle,
  Facebook,
} from "lucide-react";

interface IVendor {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  landLine: string;
  phoneNumber: string;
  displayName: string;
}

interface IOtherDetails {
  sourceOfSupply: string;
  gstTreatment: string;
  gstin: string;
  pan: string;
  msmeRegistered: boolean;
  currency: string;
  openingBalanceState: string;
  openingBalance: string;
  creditLimit: string;
  paymentTerms: string;
  tds: string;
  priceList: string;
  enablePortal: boolean;
  portalLanguage: string;
  documents: string[];
  websiteUrl: string;
  department: string;
  designation: string;
  skype: string;
  facebook: string;
  twitter: string;
}

interface IBillingAdress {
  addressId: string;
  // attention: string;
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
  // attention: string;
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
  contactPersonMobilePhone: string;
  contactPersonMobile: string;
}
[];

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
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: vendorDataById, isLoading: vendorLoading } = useVendorById(
    id || ""
  );

  const [vendor, setVendor] = useState<IVendor>({
    salutation: "",
    firstName: "",
    lastName: "",
    landLine: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    displayName: "",
  });

  const [otherDetails, setOtherDetails] = useState<IOtherDetails>({
    sourceOfSupply: "",
    gstTreatment: "",
    gstin: "",
    pan: "",
    msmeRegistered: false,
    currency: "",
    openingBalanceState: "",
    openingBalance: "",
    creditLimit: "",
    paymentTerms: "",
    tds: "",
    priceList: "",
    enablePortal: false,
    portalLanguage: "",
    documents: [],
    websiteUrl: "",
    department: "",
    designation: "",
    skype: "",
    facebook: "",
    twitter: "",
  });

  const [billingAddress, setBillingAddress] = useState<IBillingAdress>({
    addressId: "",
    // attention: "",
    billingCountry: "",
    billingAddressStreet1: "",
    billingAddressStreet2: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    billingPhone: "",
    billingFaxNumber: "",
  });

  const [shippingAddress, setShippingAddress] = useState<IShipppingAddress>({
    // attention: "",
    shippingCountry: "",
    shippingAddressStreet1: "",
    shippingAddressStreet2: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingPhone: "",
    shippingFaxNumber: "",
  });

  const [contactPersons, setContactPersons] = useState<IContactPersons[]>([
    {
      salutation: "",
      contactPersonFirstName: "",
      contactPersonLastName: "",
      contactPersonEmail: "",
      contactPersonWorkPhone: "",
      contactPersonMobilePhone: "",
      contactPersonMobile: "",
    },
  ]);

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
        companyName: apiData?.vendor?.companyName,
      }));

      setBillingAddress((prev) => ({
        ...prev,
        billingAddressStreet1: apiData?.billingAddress?.billingAddressStreet1,
        // attention: apiData?.billingAddress?.attention,
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
        shippingAddressStreet1:
          apiData?.shippingAddress?.shippingAddressStreet1,
        shippingAddressStreet2:
          apiData?.shippingAddress?.shippingAddressStreet2,
        // attention: apiData?.shippingAddress?.attention,
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
        openingBalanceState: apiData?.otherDetails?.openingBalanceState,
        openingBalance: apiData?.otherDetails?.openingBalance,
        creditLimit: apiData?.otherDetails?.creditLimit,
        paymentTerms: apiData?.otherDetails?.paymentTerms,
        tds: apiData?.otherDetails?.tds,
        priceList: apiData?.otherDetails?.priceList,
        enablePortal: apiData?.otherDetails?.enablePortal,
        portalLanguage: apiData?.otherDetails?.portalLanguage,
        documents: apiData?.otherDetails?.documents,
        websiteUrl: apiData?.otherDetails?.websiteUrl,
        department: apiData?.otherDetails?.department,
        designation: apiData?.otherDetails?.designation,
        skype: apiData?.otherDetails?.skype,
        twitter: apiData?.otherDetails?.twitter,
        facebook: apiData?.otherDetails?.facebook,
      }));

      setContactPersons(apiData?.contactPersons);
    }
  }, [vendorDataById]);

  console.log(
    contactPersons.find(
      (contactPersonMobilePhone) => contactPersonMobilePhone,
      "checking the mobile number"
    )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(vendor, "check for vendor data");
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
    console.log("FormDataaaa:-->", vendor);
    console.log(otherDetails, "other details check");
    console.log(billingAddress, "billing address check");
    console.log(shippingAddress, "shipping address check");
    console.log(contactPersons, "contact persons check");
  };

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<string[]>([]);

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
        contactPersonMobilePhone: "",
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

  const salutationOptions = ["Mr.", "Ms.", "Dr.", "Mrs."];
  const currencyOptions = [
    { value: "INR - Indian Rupee", label: "INR - Indian Rupee" },
    {
      value: "USD - United States Dollar",
      label: "USD - United States Dollar",
    },
    { value: "EUR - Euro", label: "EUR - Euro" },
    { value: "JPY - Japanese Yen", label: "JPY - Japanese Yen" },
    {
      value: "GBP - British Pound Sterling",
      label: "GBP - British Pound Sterling",
    },
    { value: "AUD - Australian Dollar", label: "AUD - Australian Dollar" },
    { value: "CAD - Canadian Dollar", label: "CAD - Canadian Dollar" },
    { value: "CHF - Swiss Franc", label: "CHF - Swiss Franc" },
    { value: "CNY - Chinese Yuan", label: "CNY - Chinese Yuan" },
    { value: "HKD - Hong Kong Dollar", label: "HKD - Hong Kong Dollar" },
    { value: "NZD - New Zealand Dollar", label: "NZD - New Zealand Dollar" },
    { value: "SGD - Singapore Dollar", label: "SGD - Singapore Dollar" },
    { value: "KRW - South Korean Won", label: "KRW - South Korean Won" },
    { value: "THB - Thai Baht", label: "THB - Thai Baht" },
    { value: "ZAR - South African Rand", label: "ZAR - South African Rand" },
    { value: "BRL - Brazilian Real", label: "BRL - Brazilian Real" },
    { value: "MXN - Mexican Peso", label: "MXN - Mexican Peso" },
    { value: "MYR - Malaysian Ringgit", label: "MYR - Malaysian Ringgit" },
    { value: "IDR - Indonesian Rupiah", label: "IDR - Indonesian Rupiah" },
    { value: "SAR - Saudi Riyal", label: "SAR - Saudi Riyal" },
  ];
  const tdsOptions = ["TDS1", "TDS2.", "TDS3"]; //change these options
  const priceListOptions = ["PL1", "PL2", "PL3"]; //change these options
  const languageOptions = ["English", "Hindi", "Espanyol"]; //change these options
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

  const countryOptions = [
    { value: "US - United States", label: "US - United States" },
    { value: "CA - Canada", label: "CA - Canada" },
    { value: "GB - United Kingdom", label: "GB - United Kingdom" },
    { value: "AU - Australia", label: "AU - Australia" },
    { value: "IN - India", label: "IN - India" },
    { value: "CN - China", label: "CN - China" },
    { value: "JP - Japan", label: "JP - Japan" },
    { value: "DE - Germany", label: "DE - Germany" },
    { value: "FR - France", label: "FR - France" },
    { value: "IT - Italy", label: "IT - Italy" },
    { value: "ES - Spain", label: "ES - Spain" },
    { value: "BR - Brazil", label: "BR - Brazil" },
    { value: "MX - Mexico", label: "MX - Mexico" },
    { value: "ZA - South Africa", label: "ZA - South Africa" },
    { value: "RU - Russia", label: "RU - Russia" },
    { value: "KR - South Korea", label: "KR - South Korea" },
    { value: "AR - Argentina", label: "AR - Argentina" },
    { value: "NG - Nigeria", label: "NG - Nigeria" },
    { value: "EG - Egypt", label: "EG - Egypt" },
    { value: "SE - Sweden", label: "SE - Sweden" },
    { value: "NO - Norway", label: "NO - Norway" },
    { value: "FI - Finland", label: "FI - Finland" },
    { value: "PL - Poland", label: "PL - Poland" },
    { value: "GR - Greece", label: "GR - Greece" },
    { value: "TR - Turkey", label: "TR - Turkey" },
    { value: "PH - Philippines", label: "PH - Philippines" },
    { value: "TH - Thailand", label: "TH - Thailand" },
    { value: "SG - Singapore", label: "SG - Singapore" },
    { value: "HK - Hong Kong", label: "HK - Hong Kong" },
    { value: "MY - Malaysia", label: "MY - Malaysia" },
    { value: "KR - South Korea", label: "KR - South Korea" },
    { value: "CH - Switzerland", label: "CH - Switzerland" },
    { value: "BE - Belgium", label: "BE - Belgium" },
    { value: "NL - Netherlands", label: "NL - Netherlands" },
    { value: "PL - Poland", label: "PL - Poland" },
    { value: "UA - Ukraine", label: "UA - Ukraine" },
    { value: "CZ - Czech Republic", label: "CZ - Czech Republic" },
    { value: "SK - Slovakia", label: "SK - Slovakia" },
    { value: "RO - Romania", label: "RO - Romania" },
    { value: "BG - Bulgaria", label: "BG - Bulgaria" },
    { value: "PT - Portugal", label: "PT - Portugal" },
    { value: "AT - Austria", label: "AT - Austria" },
    { value: "KE - Kenya", label: "KE - Kenya" },
    { value: "AE - United Arab Emirates", label: "AE - United Arab Emirates" },
    { value: "SA - Saudi Arabia", label: "SA - Saudi Arabia" },
    { value: "KW - Kuwait", label: "KW - Kuwait" },
    { value: "IQ - Iraq", label: "IQ - Iraq" },
    { value: "ID - Indonesia", label: "ID - Indonesia" },
    { value: "VN - Vietnam", label: "VN - Vietnam" },
    { value: "PE - Peru", label: "PE - Peru" },
    { value: "CO - Colombia", label: "CO - Colombia" },
    { value: "CL - Chile", label: "CL - Chile" },
  ];

  const stateOptions = [
    {
      value: "[AN] - Andaman and Nicobar Islands",
      label: "[AN] - Andaman and Nicobar Islands",
    },
    { value: "[AP] - Andhra Pradesh", label: "[AP] - Andhra Pradesh" },
    { value: "[AR] - Arunachal Pradesh", label: "[AR] - Arunachal Pradesh" },
    { value: "[AS] - Assam", label: "[AS] - Assam" },
    { value: "[BR] - Bihar", label: "[BR] - Bihar" },
    { value: "[CH] - Chandigarh", label: "[CH] - Chandigarh" },
    { value: "[CG] - Chhattisgarh", label: "[CG] - Chhattisgarh" },
    {
      value: "[DH] - Dadra and Nagar Haveli and Daman and Diu",
      label: "[DH] - Dadra and Nagar Haveli and Daman and Diu",
    },
    { value: "[DL] - Delhi", label: "[DL] - Delhi" },
    { value: "[GA] - Goa", label: "[GA] - Goa" },
    { value: "[GJ] - Gujarat", label: "[GJ] - Gujarat" },
    { value: "[HR] - Haryana", label: "[HR] - Haryana" },
    { value: "[HP] - Himachal Pradesh", label: "[HP] - Himachal Pradesh" },
    { value: "[JK] - Jammu and Kashmir", label: "[JK] - Jammu and Kashmir" },
    { value: "[JH] - Jharkhand", label: "[JH] - Jharkhand" },
    { value: "[KA] - Karnataka", label: "[KA] - Karnataka" },
    { value: "[KL] - Kerala", label: "[KL] - Kerala" },
    { value: "[LA] - Ladakh", label: "[LA] - Ladakh" },
    { value: "[LD] - Lakshadweep", label: "[LD] - Lakshadweep" },
    { value: "[MP] - Madhya Pradesh", label: "[MP] - Madhya Pradesh" },
    { value: "[MH] - Maharashtra", label: "[MH] - Maharashtra" },
    { value: "[MN] - Manipur", label: "[MN] - Manipur" },
    { value: "[ML] - Meghalaya", label: "[ML] - Meghalaya" },
    { value: "[MZ] - Mizoram", label: "[MZ] - Mizoram" },
    { value: "[NL] - Nagaland", label: "[NL] - Nagaland" },
    { value: "[OD] - Odisha", label: "[OD] - Odisha" },
    { value: "[PY] - Puducherry", label: "[PY] - Puducherry" },
    { value: "[PB] - Punjab", label: "[PB] - Punjab" },
    { value: "[RJ] - Rajasthan", label: "[RJ] - Rajasthan" },
    { value: "[SK] - Sikkim", label: "[SK] - Sikkim" },
    { value: "[TN] - Tamil Nadu", label: "[TN] - Tamil Nadu" },
    { value: "[TS] - Telangana", label: "[TS] - Telangana" },
    { value: "[TR] - Tripura", label: "[TR] - Tripura" },
    { value: "[UP] - Uttar Pradesh", label: "[UP] - Uttar Pradesh" },
    { value: "[UK] - Uttarakhand", label: "[UK] - Uttarakhand" },
    { value: "[WB] - West Bengal", label: "[WB] - West Bengal" },
  ];

  const copyBillingAddress = () => {
    console.log("check function working ");
    setShippingAddress({
      ...shippingAddress,
      shippingCountry: billingAddress.billingCountry,
      shippingAddressStreet1: billingAddress.billingAddressStreet1,
      shippingAddressStreet2: billingAddress.billingAddressStreet2,
      shippingCity: billingAddress.billingCity,
      shippingState: billingAddress.billingState,
      shippingPincode: billingAddress.billingPincode,
      shippingPhone: billingAddress.billingPhone,
      shippingFaxNumber: billingAddress.billingFaxNumber,
    });
  };

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
                  <div className="flex-1 max-w-[200px]">
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
                  <div className="w-96">
                    {" "}
                    {/* Ensures consistent width */}
                    <input
                      type="text"
                      value={vendor.companyName}
                      onChange={(e) =>
                        setVendor({ ...vendor, companyName: e.target.value })
                      }
                      placeholder="Enter company name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Display Name:
                  </span>
                  <div className="w-96 ml-4">
                    {" "}
                    {/* Consistent width for dropdown */}
                    <select
                      value={vendor.displayName}
                      onChange={(e) =>
                        setVendor({ ...vendor, displayName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Select Display Name</option>
                      <option value="company">Company Name</option>
                      <option value="contact">Contact Name</option>
                    </select>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Email Address:
                  </span>
                  <div className="w-96 relative ml-2">
                    <input
                      type="email"
                      value={vendor.email}
                      onChange={(e) => {
                        setVendor({ ...vendor, email: e.target.value });
                        setIsEmailValid(true);
                      }}
                      onBlur={(e) => validateEmail(e.target.value)}
                      placeholder="Enter email address"
                      className={`w-full border ${
                        !isEmailValid ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 text-sm pl-10`}
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
                  <span className="text-base font-medium text-gray-700 mt-2 mr-16">
                    Phone:
                  </span>
                  <div className="flex-1 flex gap-4">
                    <div className="relative w-44">
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
                    <div className="relative w-48">
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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

                {/* Separation Line */}
                <hr className="my-6 border-gray-300 mt-4" />

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
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                              activeTab === tab
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
                            <div className="w-96 mt-2 ml-8">
                              {" "}
                              {/* Adjusting width for consistency */}
                              <select
                                value={otherDetails.gstTreatment}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    gstTreatment: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div>

                        {/* GSTIN */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              GSTIN:
                            </span>
                            <div className="w-96 ml-20">
                              {" "}
                              {/* Set width for consistency */}
                              <input
                                type="text"
                                value={otherDetails.gstin}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    gstin: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Place of Supply */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Place of Supply:
                            </span>
                            <div className="w-96 ml-4">
                              <select
                                value={otherDetails.sourceOfSupply}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    sourceOfSupply: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div>

                        {/* PAN Number */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              PAN:
                            </span>
                            <div className="w-96 ml-24">
                              {" "}
                              {/* Same width as the "Place of Supply" field */}
                              <input
                                type="text"
                                value={otherDetails.pan}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    pan: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/*Msme registered*/}
                        <div className="flex items-center gap-6 mt-4">
                          <span className="text-base font-medium text-gray-700 mt-2">
                            MSME Registered?:
                          </span>
                          <div className="flex gap-6 mt-2">
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
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Currency:
                            </span>
                            <div className="w-96 ml-16">
                              {" "}
                               Set width for consistency 
                              <select
                                value={otherDetails.currency}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    currency: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div> */}

                        {/* Opening Balance */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Opening Balance:
                            </span>
                            <div className="flex gap-4">
                              
                              <div className="w-48">
                                <Autocomplete
                                  disablePortal
                                  options={stateOptions}
                                  value={
                                    stateOptions.find(
                                      (option) =>
                                        option.value ===
                                        otherDetails.openingBalanceState
                                    ) || null
                                  }
                                  onChange={(event, newValue) => {
                                    setOtherDetails({
                                      ...otherDetails,
                                      openingBalanceState:
                                        newValue?.value || "",
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Select State"
                                      InputProps={{
                                        ...params.InputProps,
                                        style: { height: "40px" },
                                      }}
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          height: "40px",
                                        },
                                        "& .MuiInputLabel-root": {
                                          transform:
                                            "translate(14px, 10px) scale(1)",
                                          "&.MuiInputLabel-shrink": {
                                            transform:
                                              "translate(14px, -9px) scale(0.75)",
                                          },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                          transform:
                                            "translate(14px, -9px) scale(0.75)",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </div>

                              
                            </div>
                          </div>
                        </div> */}

                        {/* Credit Limit */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Credit Limit:
                            </span>
                            <div className="w-96">
                              <TextField
                                label="Credit Limit"
                                value={otherDetails.creditLimit}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    creditLimit: e.target.value,
                                  })
                                }
                                InputProps={{
                                  startAdornment: (
                                    <div
                                      className="absolute left-0 pl-3 text-gray-700 bg-gray-50 border-r border-gray-300 flex items-center"
                                      style={{
                                        height: "100%",
                                        fontWeight: "500",
                                        minWidth: "50px",
                                      }}
                                    >
                                      {currencyOptions
                                        .find(
                                          (option) =>
                                            option.value ===
                                            otherDetails.currency
                                        )
                                        ?.value.split(" ")[0] || ""}
                                    </div>
                                  ),
                                  style: {
                                    paddingLeft: "60px",
                                    height: "40px",
                                  },
                                }}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    transform: "translate(14px, 10px) scale(1)",
                                    "&.MuiInputLabel-shrink": {
                                      transform:
                                        "translate(14px, -9px) scale(0.75)",
                                    },
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    transform:
                                      "translate(14px, -9px) scale(0.75)",
                                  },
                                }}
                                fullWidth
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* Payment Terms */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Payment Terms:
                            </span>
                            <div className="w-96 ml-4">
                              {" "}
                              Set width for consistency 
                              <select
                                value={otherDetails.paymentTerms}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    paymentTerms: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div> */}

                        {/* TDS */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              TDS:
                            </span>
                            <div className="w-96 ml-24">
                              {" "}
                               Set width for consistency
                              <select
                                value={otherDetails.tds}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    tds: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div> */}

                        {/* Price List */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Price List:
                            </span>
                            <div className="w-96 ml-16">
                              {" "}
                               Set width for consistency 
                              <select
                                value={otherDetails.priceList}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    priceList: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
                        </div> */}

                        {/* Enable Portal */}
                        <div className="flex items-center gap-6 mt-4">
                          <span className="text-base font-medium text-gray-700 mt-2">
                            Enable Portal:
                          </span>
                          <div className="flex gap-6 mt-2 ml-8">
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
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Portal Language:
                            </span>
                            <div className="w-96 ml-2">
                              {" "}
                               Set width for consistency 
                              <select
                                value={otherDetails.portalLanguage}
                                onChange={(e) =>
                                  setOtherDetails({
                                    ...otherDetails,
                                    portalLanguage: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select Portal Language</option>
                                <option value="English (EN)">
                                  English (EN)
                                </option>
                                <option value="Spanish (ES)">
                                  Espanol (ES)
                                </option>
                                <option value="French (FR)">French (FR)</option>
                                <option value="German (DE)">German (DE)</option>
                                <option value="Hindi (HI)">Hindi (HI)</option>
                              </select>
                            </div>
                          </div>
                        </div> */}

                        {/* Documents Upload */}
                        <div className="col-span-2 mt-4">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Documents:
                            </span>
                            <div className="flex-1">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg"
                                multiple
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files) {
                                    // Filter for only PDF and JPEG files
                                    const validFiles = Array.from(files).filter(
                                      (file) =>
                                        file.type === "application/pdf" ||
                                        file.type === "image/jpeg"
                                    );

                                    if (validFiles.length !== files.length) {
                                      alert(
                                        "Only PDF and JPEG files are allowed"
                                      );
                                    }

                                    // Update selectedFiles with only valid files
                                    setSelectedFiles((prev) => [
                                      ...prev,
                                      ...validFiles,
                                    ]);
                                    handleImageUpload(e, setUploadFiles); // Your existing upload logic
                                  }
                                }}
                                className="hidden"
                                ref={fileInputRef}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mt-4"
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
                                <span>Upload Document</span>
                              </button>
                              <p className="text-sm text-gray-500 mt-1">
                                You can upload multiple PDF and JPEG files
                              </p>
                            </div>
                          </div>
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
                                      onClick={() => handleRemoveFile(index)}
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
                              </div>
                            </div>
                          )}
                          <div
                            style={{ display: "flex", flexWrap: "wrap" }}
                            className="gap-4 mt-4"
                          >
                            {otherDetails &&
                              otherDetails.documents.length > 0 &&
                              otherDetails.documents.map((image, index) => (
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
                                  src={
                                    image?.includes("base64")
                                      ? image
                                      : generateFilePath(image)
                                  }
                                  alt={`Image Preview ${index + 1}`}
                                />
                              ))}
                          </div>
                        </div>
                        {/* Add More Details Section */}
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-5 h-5" />
                                Hide More Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-5 h-5" />
                                Add More Details
                              </>
                            )}
                          </button>

                          {isExpanded && (
                            <div className="col-span-2 mt-8">
                              <div className="space-y-8">
                                {/* Website URL */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="websiteUrl"
                                  >
                                    Website URL:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <Globe className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="websiteUrl"
                                      type="text"
                                      value={otherDetails.websiteUrl}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          websiteUrl: e.target.value,
                                        })
                                      }
                                      placeholder="Enter Website URL"
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Department */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="department"
                                  >
                                    Department:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <Building2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="department"
                                      type="text"
                                      value={otherDetails.department}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          department: e.target.value,
                                        })
                                      }
                                      placeholder="Enter Department"
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Designation */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="designation"
                                  >
                                    Designation:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <UserRound className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="designation"
                                      type="text"
                                      value={otherDetails.designation}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          designation: e.target.value,
                                        })
                                      }
                                      placeholder="Enter Designation"
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Twitter */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="twitter"
                                  >
                                    Twitter:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <Twitter className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="twitter"
                                      type="text"
                                      value={otherDetails.twitter}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          twitter: e.target.value,
                                        })
                                      }
                                      placeholder="Enter Twitter id..."
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Skype */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="skype"
                                  >
                                    Skype:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <MessageCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="skype"
                                      type="text"
                                      value={otherDetails.skype}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          skype: e.target.value,
                                        })
                                      }
                                      placeholder="Enter skype id..."
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>

                                {/* Facebook */}
                                <div className="flex items-center gap-6">
                                  <label
                                    className="w-32 text-base font-medium text-gray-700"
                                    htmlFor="facebook"
                                  >
                                    Facebook:
                                  </label>
                                  <div className="w-96 flex">
                                    <div className="flex items-center justify-center w-12 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                      <Facebook className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="facebook"
                                      type="text"
                                      value={otherDetails.facebook}
                                      onChange={(e) =>
                                        setOtherDetails({
                                          ...otherDetails,
                                          facebook: e.target.value,
                                        })
                                      }
                                      placeholder="Enter facebook id..."
                                      className="w-full border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* <div>
                          <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {otherDetails &&
                              otherDetails.documents.length > 0 &&
                              otherDetails.documents.map(
                                (image: string, index) => (
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
                                    src={
                                      image?.includes("base64")
                                        ? image
                                        : generateFilePath(image)
                                    }
                                    alt={`Image Preview ${index + 1}`}
                                  />
                                )
                              )}
                          </div>
                          <input
                            type="file"
                            accept="image/csv/*"
                            multiple
                            onChange={(e) =>
                              handleImageUpload(e, setUploadFiles)
                            }
                            style={{ marginTop: "10px", display: "block" }}
                          />
                        </div> */}
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
                          {/* <div className="flex items-center gap-6">
                            <span className=" min-w-32 text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={formData.attention}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  attention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div> */}
                          {/* Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              {/* <select
                                value={formData.countryRegion}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    countryRegion: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select Country/Region</option>
                                <option value="US - United States">
                                  US - United States
                                </option>
                                <option value="CA - Canada">CA - Canada</option>
                                <option value="GB - United Kingdom">
                                  GB - United Kingdom
                                </option>
                                <option value="AU - Australia">
                                  AU - Australia
                                </option>
                                <option value="IN - India">IN - India</option>
                                <option value="CN - China">CN - China</option>
                                <option value="JP - Japan">JP - Japan</option>
                                <option value="DE - Germany">
                                  DE - Germany
                                </option>
                                <option value="FR - France">FR - France</option>
                                <option value="IT - Italy">IT - Italy</option>
                                <option value="ES - Spain">ES - Spain</option>
                                <option value="BR - Brazil">BR - Brazil</option>
                                <option value="MX - Mexico">MX - Mexico</option>
                                <option value="ZA - South Africa">
                                  ZA - South Africa
                                </option>
                                <option value="RU - Russia">RU - Russia</option>
                                <option value="KR - South Korea">
                                  KR - South Korea
                                </option>
                                <option value="AR - Argentina">
                                  AR - Argentina
                                </option>
                                <option value="NG - Nigeria">
                                  NG - Nigeria
                                </option>
                                <option value="EG - Egypt">EG - Egypt</option>
                                <option value="SE - Sweden">SE - Sweden</option>
                                <option value="NO - Norway">NO - Norway</option>
                                <option value="FI - Finland">
                                  FI - Finland
                                </option>
                                <option value="PL - Poland">PL - Poland</option>
                                <option value="GR - Greece">GR - Greece</option>
                                <option value="TR - Turkey">TR - Turkey</option>
                                <option value="PH - Philippines">
                                  PH - Philippines
                                </option>
                                <option value="TH - Thailand">
                                  TH - Thailand
                                </option>
                                <option value="SG - Singapore">
                                  SG - Singapore
                                </option>
                                <option value="HK - Hong Kong">
                                  HK - Hong Kong
                                </option>
                                <option value="MY - Malaysia">
                                  MY - Malaysia
                                </option>
                                <option value="KR - South Korea">
                                  KR - South Korea
                                </option>
                                <option value="CH - Switzerland">
                                  CH - Switzerland
                                </option>
                                <option value="BE - Belgium">
                                  BE - Belgium
                                </option>
                                <option value="NL - Netherlands">
                                  NL - Netherlands
                                </option>
                                <option value="PL - Poland">PL - Poland</option>
                                <option value="UA - Ukraine">
                                  UA - Ukraine
                                </option>
                                <option value="CZ - Czech Republic">
                                  CZ - Czech Republic
                                </option>
                                <option value="SK - Slovakia">
                                  SK - Slovakia
                                </option>
                                <option value="RO - Romania">
                                  RO - Romania
                                </option>
                                <option value="BG - Bulgaria">
                                  BG - Bulgaria
                                </option>
                                <option value="PT - Portugal">
                                  PT - Portugal
                                </option>
                                <option value="AT - Austria">
                                  AT - Austria
                                </option>
                                <option value="KE - Kenya">KE - Kenya</option>
                                <option value="AE - United Arab Emirates">
                                  AE - United Arab Emirates
                                </option>
                                <option value="SA - Saudi Arabia">
                                  SA - Saudi Arabia
                                </option>
                                <option value="KW - Kuwait">KW - Kuwait</option>
                                <option value="IQ - Iraq">IQ - Iraq</option>
                                <option value="ID - Indonesia">
                                  ID - Indonesia
                                </option>
                                <option value="VN - Vietnam">
                                  VN - Vietnam
                                </option>
                                <option value="PE - Peru">PE - Peru</option>
                                <option value="CO - Colombia">
                                  CO - Colombia
                                </option>
                                <option value="CL - Chile">CL - Chile</option>
                              </select> */}
                              <Autocomplete
                                disablePortal
                                options={countryOptions}
                                sx={{ width: 600 }}
                                value={
                                  countryOptions.find(
                                    (option) =>
                                      option.value ===
                                      billingAddress.billingCountry
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingCountry: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Payment Terms"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "40px" },
                                    }}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        transform:
                                          "translate(14px, 10px) scale(1)",
                                        "&.MuiInputLabel-shrink": {
                                          transform:
                                            "translate(14px, -9px) scale(0.75)",
                                        },
                                      },
                                      "& .MuiInputLabel-root.Mui-focused": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)",
                                      },
                                    }}
                                  />
                                )}
                                className="flex-1 rounded-md p-2 text-sm"
                              />
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
                              <span className="min-w-32 text-base font-medium text-gray-700"></span>
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
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
                                State:
                              </span>
                              {/* <select
                                value={formData.state}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    state: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="AP - Andhra Pradesh">
                                  AP - Andhra Pradesh
                                </option>
                                <option value="AR - Arunachal Pradesh">
                                  AR - Arunachal Pradesh
                                </option>
                                <option value="AS - Assam">AS - Assam</option>
                                <option value="BR - Bihar">BR - Bihar</option>
                                <option value="CT - Chhattisgarh">
                                  CT - Chhattisgarh
                                </option>
                                <option value="GA - Goa">GA - Goa</option>
                                <option value="GJ - Gujarat">
                                  GJ - Gujarat
                                </option>
                                <option value="HR - Haryana">
                                  HR - Haryana
                                </option>
                                <option value="HP - Himachal Pradesh">
                                  HP - Himachal Pradesh
                                </option>
                                <option value="JK - Jammu and Kashmir">
                                  JK - Jammu and Kashmir
                                </option>
                                <option value="JH - Jharkhand">
                                  JH - Jharkhand
                                </option>
                                <option value="KA - Karnataka">
                                  KA - Karnataka
                                </option>
                                <option value="KL - Kerala">KL - Kerala</option>
                                <option value="MP - Madhya Pradesh">
                                  MP - Madhya Pradesh
                                </option>
                                <option value="MH - Maharashtra">
                                  MH - Maharashtra
                                </option>
                                <option value="MN - Manipur">
                                  MN - Manipur
                                </option>
                                <option value="ML - Meghalaya">
                                  ML - Meghalaya
                                </option>
                                <option value="MZ - Mizoram">
                                  MZ - Mizoram
                                </option>
                                <option value="NL - Nagaland">
                                  NL - Nagaland
                                </option>
                                <option value="OD - Odisha">OD - Odisha</option>
                                <option value="PB - Punjab">PB - Punjab</option>
                                <option value="RJ - Rajasthan">
                                  RJ - Rajasthan
                                </option>
                                <option value="SK - Sikkim">SK - Sikkim</option>
                                <option value="TN - Tamil Nadu">
                                  TN - Tamil Nadu
                                </option>
                                <option value="TS - Telangana">
                                  TS - Telangana
                                </option>
                                <option value="UP - Uttar Pradesh">
                                  UP - Uttar Pradesh
                                </option>
                                <option value="UK - Uttarakhand">
                                  UK - Uttarakhand
                                </option>
                                <option value="WB - West Bengal">
                                  WB - West Bengal
                                </option>
                                <option value="AN - Andaman and Nicobar Islands">
                                  AN - Andaman and Nicobar Islands
                                </option>
                                <option value="CH - Chandigarh">
                                  CH - Chandigarh
                                </option>
                                <option value="DN - Dadra and Nagar Haveli and Daman and Diu">
                                  DN - Dadra and Nagar Haveli and Daman and Diu
                                </option>
                                <option value="DD - Lakshadweep">
                                  DD - Lakshadweep
                                </option>
                                <option value="DL - Delhi">DL - Delhi</option>
                                <option value="PY - Puducherry">
                                  PY - Puducherry
                                </option>
                                <option value="LD - Ladakh">LD - Ladakh</option>
                                <option value="LC - Lakshadweep">
                                  LC - Lakshadweep
                                </option>
                                <option value="TN - Tamil Nadu">
                                  TN - Tamil Nadu
                                </option>
                              </select> */}
                              <Autocomplete
                                disablePortal
                                options={stateOptions}
                                sx={{ width: 600 }}
                                value={
                                  stateOptions.find(
                                    (option) =>
                                      option.value ===
                                      billingAddress.billingState
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setBillingAddress({
                                    ...billingAddress,
                                    billingState: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Payment Terms"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "40px" },
                                    }}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        transform:
                                          "translate(14px, 10px) scale(1)",
                                        "&.MuiInputLabel-shrink": {
                                          transform:
                                            "translate(14px, -9px) scale(0.75)",
                                        },
                                      },
                                      "& .MuiInputLabel-root.Mui-focused": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)",
                                      },
                                    }}
                                  />
                                )}
                                className="flex-1 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700 w-20">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                          <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold">
                              Shipping Address
                            </h2>
                            <div
                              onClick={copyBillingAddress}
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md"
                            >
                              <span className="text-blue-600">
                                Same as Billing Address
                              </span>
                              <ChevronDown className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          {/* Shipping Attention */}
                          {/* <div className="flex items-center gap-6">
                            <span className="min-w-32 text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={formData.shippingAttention}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shippingAttention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div> */}
                          {/* Shipping Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              {/* <select
                                value={formData.shippingCountryRegion}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingCountryRegion: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select Country/Region</option>
                                <option value="US - United States">
                                  US - United States
                                </option>
                                <option value="CA - Canada">CA - Canada</option>
                                <option value="GB - United Kingdom">
                                  GB - United Kingdom
                                </option>
                                <option value="AU - Australia">
                                  AU - Australia
                                </option>
                                <option value="IN - India">IN - India</option>
                                <option value="CN - China">CN - China</option>
                                <option value="JP - Japan">JP - Japan</option>
                                <option value="DE - Germany">
                                  DE - Germany
                                </option>
                                <option value="FR - France">FR - France</option>
                                <option value="IT - Italy">IT - Italy</option>
                                <option value="ES - Spain">ES - Spain</option>
                                <option value="BR - Brazil">BR - Brazil</option>
                                <option value="MX - Mexico">MX - Mexico</option>
                                <option value="ZA - South Africa">
                                  ZA - South Africa
                                </option>
                                <option value="RU - Russia">RU - Russia</option>
                                <option value="KR - South Korea">
                                  KR - South Korea
                                </option>
                                <option value="AR - Argentina">
                                  AR - Argentina
                                </option>
                                <option value="NG - Nigeria">
                                  NG - Nigeria
                                </option>
                                <option value="EG - Egypt">EG - Egypt</option>
                                <option value="SE - Sweden">SE - Sweden</option>
                                <option value="NO - Norway">NO - Norway</option>
                                <option value="FI - Finland">
                                  FI - Finland
                                </option>
                                <option value="PL - Poland">PL - Poland</option>
                                <option value="GR - Greece">GR - Greece</option>
                                <option value="TR - Turkey">TR - Turkey</option>
                                <option value="PH - Philippines">
                                  PH - Philippines
                                </option>
                                <option value="TH - Thailand">
                                  TH - Thailand
                                </option>
                                <option value="SG - Singapore">
                                  SG - Singapore
                                </option>
                                <option value="HK - Hong Kong">
                                  HK - Hong Kong
                                </option>
                                <option value="MY - Malaysia">
                                  MY - Malaysia
                                </option>
                                <option value="KR - South Korea">
                                  KR - South Korea
                                </option>
                                <option value="CH - Switzerland">
                                  CH - Switzerland
                                </option>
                                <option value="BE - Belgium">
                                  BE - Belgium
                                </option>
                                <option value="NL - Netherlands">
                                  NL - Netherlands
                                </option>
                                <option value="PL - Poland">PL - Poland</option>
                                <option value="UA - Ukraine">
                                  UA - Ukraine
                                </option>
                                <option value="CZ - Czech Republic">
                                  CZ - Czech Republic
                                </option>
                                <option value="SK - Slovakia">
                                  SK - Slovakia
                                </option>
                                <option value="RO - Romania">
                                  RO - Romania
                                </option>
                                <option value="BG - Bulgaria">
                                  BG - Bulgaria
                                </option>
                                <option value="PT - Portugal">
                                  PT - Portugal
                                </option>
                                <option value="AT - Austria">
                                  AT - Austria
                                </option>
                                <option value="KE - Kenya">KE - Kenya</option>
                                <option value="AE - United Arab Emirates">
                                  AE - United Arab Emirates
                                </option>
                                <option value="SA - Saudi Arabia">
                                  SA - Saudi Arabia
                                </option>
                                <option value="KW - Kuwait">KW - Kuwait</option>
                                <option value="IQ - Iraq">IQ - Iraq</option>
                                <option value="ID - Indonesia">
                                  ID - Indonesia
                                </option>
                                <option value="VN - Vietnam">
                                  VN - Vietnam
                                </option>
                                <option value="PE - Peru">PE - Peru</option>
                                <option value="CO - Colombia">
                                  CO - Colombia
                                </option>
                                <option value="CL - Chile">CL - Chile</option>
                              </select> */}
                              <Autocomplete
                                disablePortal
                                options={countryOptions}
                                sx={{ width: 600 }}
                                value={
                                  countryOptions.find(
                                    (option) =>
                                      option.value ===
                                      shippingAddress.shippingCountry
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingCountry: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Payment Terms"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "40px" },
                                    }}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        transform:
                                          "translate(14px, 10px) scale(1)",
                                        "&.MuiInputLabel-shrink": {
                                          transform:
                                            "translate(14px, -9px) scale(0.75)",
                                        },
                                      },
                                      "& .MuiInputLabel-root.Mui-focused": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)",
                                      },
                                    }}
                                  />
                                )}
                                className="flex-1 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700"></span>
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
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shippping City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
                                State:
                              </span>
                              {/* <select
                                value={formData.shippingState}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingState: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="AP - Andhra Pradesh">
                                  AP - Andhra Pradesh
                                </option>
                                <option value="AR - Arunachal Pradesh">
                                  AR - Arunachal Pradesh
                                </option>
                                <option value="AS - Assam">AS - Assam</option>
                                <option value="BR - Bihar">BR - Bihar</option>
                                <option value="CT - Chhattisgarh">
                                  CT - Chhattisgarh
                                </option>
                                <option value="GA - Goa">GA - Goa</option>
                                <option value="GJ - Gujarat">
                                  GJ - Gujarat
                                </option>
                                <option value="HR - Haryana">
                                  HR - Haryana
                                </option>
                                <option value="HP - Himachal Pradesh">
                                  HP - Himachal Pradesh
                                </option>
                                <option value="JK - Jammu and Kashmir">
                                  JK - Jammu and Kashmir
                                </option>
                                <option value="JH - Jharkhand">
                                  JH - Jharkhand
                                </option>
                                <option value="KA - Karnataka">
                                  KA - Karnataka
                                </option>
                                <option value="KL - Kerala">KL - Kerala</option>
                                <option value="MP - Madhya Pradesh">
                                  MP - Madhya Pradesh
                                </option>
                                <option value="MH - Maharashtra">
                                  MH - Maharashtra
                                </option>
                                <option value="MN - Manipur">
                                  MN - Manipur
                                </option>
                                <option value="ML - Meghalaya">
                                  ML - Meghalaya
                                </option>
                                <option value="MZ - Mizoram">
                                  MZ - Mizoram
                                </option>
                                <option value="NL - Nagaland">
                                  NL - Nagaland
                                </option>
                                <option value="OD - Odisha">OD - Odisha</option>
                                <option value="PB - Punjab">PB - Punjab</option>
                                <option value="RJ - Rajasthan">
                                  RJ - Rajasthan
                                </option>
                                <option value="SK - Sikkim">SK - Sikkim</option>
                                <option value="TN - Tamil Nadu">
                                  TN - Tamil Nadu
                                </option>
                                <option value="TS - Telangana">
                                  TS - Telangana
                                </option>
                                <option value="UP - Uttar Pradesh">
                                  UP - Uttar Pradesh
                                </option>
                                <option value="UK - Uttarakhand">
                                  UK - Uttarakhand
                                </option>
                                <option value="WB - West Bengal">
                                  WB - West Bengal
                                </option>
                                <option value="AN - Andaman and Nicobar Islands">
                                  AN - Andaman and Nicobar Islands
                                </option>
                                <option value="CH - Chandigarh">
                                  CH - Chandigarh
                                </option>
                                <option value="DN - Dadra and Nagar Haveli and Daman and Diu">
                                  DN - Dadra and Nagar Haveli and Daman and Diu
                                </option>
                                <option value="DD - Lakshadweep">
                                  DD - Lakshadweep
                                </option>
                                <option value="DL - Delhi">DL - Delhi</option>
                                <option value="PY - Puducherry">
                                  PY - Puducherry
                                </option>
                                <option value="LD - Ladakh">LD - Ladakh</option>
                                <option value="LC - Lakshadweep">
                                  LC - Lakshadweep
                                </option>
                                <option value="TN - Tamil Nadu">
                                  TN - Tamil Nadu
                                </option>
                              </select> */}
                              <Autocomplete
                                disablePortal
                                options={stateOptions}
                                sx={{ width: 600 }}
                                value={
                                  stateOptions.find(
                                    (option) =>
                                      option.value ===
                                      shippingAddress.shippingState
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setShippingAddress({
                                    ...shippingAddress,
                                    shippingState: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Payment Terms"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "40px" },
                                    }}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        transform:
                                          "translate(14px, 10px) scale(1)",
                                        "&.MuiInputLabel-shrink": {
                                          transform:
                                            "translate(14px, -9px) scale(0.75)",
                                        },
                                      },
                                      "& .MuiInputLabel-root.Mui-focused": {
                                        transform:
                                          "translate(14px, -9px) scale(0.75)",
                                      },
                                    }}
                                  />
                                )}
                                className="flex-1 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                              <span className="min-w-32 text-base font-medium text-gray-700">
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
                                  Mobile
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

                                  {/* Mobile Phone */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="tel"
                                      value={person.contactPersonMobilePhone}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "contactPersonMobilePhone",
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
