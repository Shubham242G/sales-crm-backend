import {
  useAddCustomer,
  useZohoCustomerById,
  updateCustomerById,
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { generateFilePath } from "@/services/urls.service";
import { styled } from "@mui/system";
import { Autocomplete, TextField, Popper } from "@mui/material";
import {

} from "react-icons"
import { checkPermissionsForButtons } from "@/utils/permission";

import { Type } from "typescript";
import { AirplanemodeActiveSharp } from "@mui/icons-material";
import { FaBuilding, FaChevronDown, FaFacebook, FaGlobe, FaTwitter, FaUserCircle } from "react-icons/fa";
import { UserRoundIcon } from "lucide-react";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";
import { FiMessageCircle } from "react-icons/fi";

//comment

interface ICustomerForm {
  customerType: string;
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  email: string;
  phone: string;
  mobile: string;
  panNumber: string;
  placeOfSupply: string;
  leadId: string;
  prefersEmail: boolean;
  prefersSms: boolean;
  gstTreatment: string;
  openingBalanceState: string;
  openingBalance: string;
  creditLimit: string;
  taxPreference: string;
  currency: string;
  paymentTerms: string;
  priceList: string;
  enablePortal: boolean;
  portalLanguage: string;
  // attention: string;
  countryRegion: string;
  addressStreet1: string;
  addressStreet2: string;
  city: string;
  state: string;
  phoneNumber: string;
  pinCode: string;
  faxNumber: string;
  // shippingAttention: string;
  shippingCountryRegion: string;
  shippingAddressStreet1: string;
  shippingAddressStreet2: string;
  shippingCity: string;
  shippingState: string;
  shippingPhoneNumber: string;
  shippingPinCode: string;
  shippingFaxNumber: string;
  documentArray: string[];
  websiteUrl: string;
  department: string;
  designation: string;
  skype: string;
  facebook: string;
  twitter: string;

  // communicationChannels: string[];
  // contactPersonsSalutation: string;
  // contactPersonsFirstName: string;
  // contactPersonsLastName: string;
  // contactPersonsEmail: string;
  // contactPersonsWorkPhone: string;
  // contactPersonsMobile: string;
  // contactPersonsCommunicationChannels: string[];
}
type communicationChannelsProps = {
  prefersEmail: boolean;
  prefersSms: boolean;
};

interface IContactPerson {
  salutation: string;
  firstName: string;
  leadId: string;
  lastName: string;
  email: string;
  workPhone: string;
  mobilePhone: string;


  contactPersonDateOfBirth: string;
  contactPersonAnniversary: string;
  contactPersonDesignation: string;
  contactPersonDepartment: string;
  communicationChannels: communicationChannelsProps;
}

const AddCustomer = () => {

  const [activeTab, setActiveTab] = useState<
    "Other Details" | "Address" | "Contact Persons"
  >("Other Details");
  const [formData, setFormData] = useState<ICustomerForm>({
    customerType: "Business",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    phone: "",
    mobile: "",
    panNumber: "",
    leadId: "",
    placeOfSupply: "",
    prefersEmail: false,
    prefersSms: false,
    gstTreatment: "",
    taxPreference: "Taxable",
    currency: "",
    paymentTerms: "",
    priceList: "",
    enablePortal: false,
    portalLanguage: "",
    openingBalanceState: "",
    openingBalance: "",
    creditLimit: "",
    // attention: "",
    countryRegion: "",
    addressStreet1: "",
    addressStreet2: "",
    city: "",
    state: "",
    phoneNumber: "",
    pinCode: "",
    faxNumber: "",
    // shippingAttention: "",
    shippingCountryRegion: "",
    shippingAddressStreet1: "",
    shippingAddressStreet2: "",
    shippingCity: "",
    shippingState: "",
    shippingPhoneNumber: "",
    shippingPinCode: "",
    shippingFaxNumber: "",
    documentArray: [],
    websiteUrl: "",
    department: "",
    designation: "",
    skype: "",
    facebook: "",
    twitter: "",
    // communicationChannels: [],
    // contactPersonsSalutation: "",
    // contactPersonsFirstName: "",
    // contactPersonsLastName: "",
    // contactPersonsEmail: "",
    // contactPersonsWorkPhone: "",
    // contactPersonsMobile: "",
    // contactPersonsCommunicationChannels: "",
  });

  const [contactPersons, setContactPersons] = useState<IContactPerson[]>([
    {
      salutation: "",
      firstName: "",
      lastName: "",
      leadId: "",
      email: "",
      workPhone: "",
      mobilePhone: "",
      contactPersonDesignation: "",
      contactPersonDepartment: "",
      communicationChannels: { prefersEmail: true, prefersSms: false },
      contactPersonDateOfBirth: "",
      contactPersonAnniversary: "",

    },
  ]);

  const handleAddContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        leadId: "",
        contactPersonDateOfBirth: "",
        contactPersonAnniversary: "",
        contactPersonDesignation: "",
        contactPersonDepartment: "",
        workPhone: "",
        mobilePhone: "",
        communicationChannels: { prefersEmail: true, prefersSms: false },
      },
    ]);
  };

  const handleDeleteContactPerson = (index: number) => {
    const newContacts = [...contactPersons];
    newContacts.splice(index, 1);
    setContactPersons(newContacts);
  };

  const handleContactPersonChange = (
    index: number,
    field: keyof IContactPerson,
    value: string | string[]
  ) => {
    const newContacts = [...contactPersons];
    newContacts[index][field] = value as never;
    setContactPersons(newContacts);
  };


  // const handleChannelChange = (
  //   index: number,
  //   channel: string,
  //   checked: boolean
  // ) => {
  //   const newContacts = [...contactPersons];
  //   if (checked) {
  //     newContacts[index].communicationChannels.push(channel);
  //   } else {
  //     newContacts[index].communicationChannels = newContacts[
  //       index
  //     ].communicationChannels.filter((c) => c !== channel);
  //   }
  //   setContactPersons(newContacts);
  // };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addCustomer } = useAddCustomer();
  const { mutateAsync: updateCustomer } = updateCustomerById();
  const { data: customerDataById } = useZohoCustomerById(id || "");

  //for file upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update your useEffect to use optional chaining
  useEffect(() => {
    if (customerDataById) {
      const apiData = customerDataById.data;

      console.log(apiData, "checking the api data");
      // Update your useEffect to use optional chaining
      useEffect(() => {
        if (customerDataById) {
          const apiData = customerDataById.data;

          console.log(apiData, "checking the api data");

          if (apiData?.contactPersons) {
            setContactPersons(
              apiData.contactPersons.map((person: any) => ({
                salutation: person.salutation || "",
                firstName: person.firstName || "",
                lastName: person.lastName || "",
                email: person.email || "",
                leadId: person.leadId || "",
                workPhone: person.workPhone || "",
                mobilePhone: person.mobilePhone || "",
                contactPersonDateOfBirth: person.contactPersonDateOfBirth || "",
                contactPersonAnniversary: person.contactPersonAnniversary || "",
                contactPersonDesignation: person.contactPersonDesignation || "",
                contactPersonDepartment: person.contactPersonDepartment || "",
                communicationChannels: person.communicationChannels || [],
              }))
            );
          }

          setFormData((prev) => ({
            ...prev,

            email: apiData?.email || "",
            phone: apiData?.phone || "",
            mobile: apiData?.mobile || "",
            panNumber: apiData?.panNumber || "",
            placeOfSupply: apiData?.placeOfSupply || "",
            companyName: apiData?.companyName || "",
            displayName: apiData?.displayName || "",
            customerType: apiData?.customerType || "",
            salutation: apiData?.salutation || "",
            leadId: String(apiData?.leadId || ""),
            firstName: apiData?.firstName || "",
            lastName: apiData?.lastName || "",
            taxPreference: apiData?.taxPreference || "",
            gstTreatment: apiData?.gstTreatment || "",
            openingBalanceState: apiData?.openingBalanceState || "",
            openingBalance: apiData?.openingBalance || "",
            creditLimit: apiData?.creditLimit || "",
            enablePortal: apiData?.enablePortal || false,
            currency: apiData?.currency || "",
            paymentTerms: apiData?.paymentTerms || "",
            priceList: apiData?.priceList || "",
            portalLanguage: apiData?.portalLanguage || "",
            // attention: apiData?.attention || "",
            countryRegion: apiData?.countryRegion || "",
            addressStreet1: apiData?.addressStreet1 || "",
            addressStreet2: apiData?.addressStreet2 || "",
            pinCode: apiData?.pinCode || "",
            city: apiData?.city || "",
            state: apiData?.state || "",
            prefersEmail: apiData?.prefersEmail,
            prefersSms: apiData?.prefersSms,
            phoneNumber: apiData?.phoneNumber || "",
            faxNumber: apiData?.faxNumber || "",
            // shippingAttention: apiData?.shippingAttention || "",
            shippingCountryRegion: apiData?.shippingCountryRegion || "",
            shippingAddressStreet1: apiData?.shippingAddressStreet1 || "",
            shippingAddressStreet2: apiData?.shippingAddressStreet2 || "",
            shippingCity: apiData?.shippingCity || "",
            shippingState: apiData?.shippingState || "",
            shippingPinCode: apiData?.shippingPinCode || "",
            shippingPhoneNumber: apiData?.shippingPhoneNumber || "",
            shippingFaxNumber: apiData?.shippingFaxNumber || "",
            documentArray: apiData?.documentArray || [],
            websiteUrl: apiData?.websiteUrl || "",
            department: apiData?.department || "",
            designation: apiData?.designation || "",
            twitter: apiData?.twitter || "",
            skype: apiData?.skype || "",
            facebook: apiData?.facebook || "",
            // communicationChannels: apiData?.communicationChannels || [],
            // contactPersonsSalutation: apiData?.contactPersonsSalutation || "",
            // contactPersonsFirstName: apiData?.contactPersonsFirstName || "",
            // contactPersonsLastName: apiData?.contactPersonsLastName || "",
            // contactPersonsEmail: apiData?.contactPersonsEmail || "",
            // contactPersonsWorkPhone: apiData?.contactPersonsWorkPhone || "",
            // contactPersonsMobile: apiData?.contactPersonsMobile || "",
            // contactPersonsCommunicationChannels: apiData?. contactPersonsCommunicationChannels || "",
          }));
        }
      }, [customerDataById]);
      setFormData((prev) => ({
        ...prev,

        email: apiData?.email || "",
        phone: apiData?.phone || "",
        mobile: apiData?.mobile || "",
        panNumber: apiData?.panNumber || "",
        placeOfSupply: apiData?.placeOfSupply || "",
        companyName: apiData?.companyName || "",
        displayName: apiData?.displayName || "",
        customerType: apiData?.customerType || "",
        salutation: apiData?.salutation || "",
        leadId: String(apiData?.leadId || ""),
        firstName: apiData?.firstName || "",
        lastName: apiData?.lastName || "",
        taxPreference: apiData?.taxPreference || "",
        gstTreatment: apiData?.gstTreatment || "",
        openingBalanceState: apiData?.openingBalanceState || "",
        openingBalance: apiData?.openingBalance || "",
        creditLimit: apiData?.creditLimit || "",
        enablePortal: apiData?.enablePortal || false,
        currency: apiData?.currency || "",
        paymentTerms: apiData?.paymentTerms || "",
        priceList: apiData?.priceList || "",
        portalLanguage: apiData?.portalLanguage || "",
        // attention: apiData?.attention || "",
        countryRegion: apiData?.countryRegion || "",
        addressStreet1: apiData?.addressStreet1 || "",
        addressStreet2: apiData?.addressStreet2 || "",
        pinCode: apiData?.pinCode || "",
        city: apiData?.city || "",
        state: apiData?.state || "",
        prefersEmail: apiData?.prefersEmail,
        prefersSms: apiData?.prefersSms,
        phoneNumber: apiData?.phoneNumber || "",
        faxNumber: apiData?.faxNumber || "",
        // shippingAttention: apiData?.shippingAttention || "",
        shippingCountryRegion: apiData?.shippingCountryRegion || "",
        shippingAddressStreet1: apiData?.shippingAddressStreet1 || "",
        shippingAddressStreet2: apiData?.shippingAddressStreet2 || "",
        shippingCity: apiData?.shippingCity || "",
        shippingState: apiData?.shippingState || "",
        shippingPinCode: apiData?.shippingPinCode || "",
        shippingPhoneNumber: apiData?.shippingPhoneNumber || "",
        shippingFaxNumber: apiData?.shippingFaxNumber || "",
        documentArray: apiData?.documentArray || [],
        websiteUrl: apiData?.websiteUrl || "",
        department: apiData?.department || "",
        designation: apiData?.designation || "",
        twitter: apiData?.twitter || "",
        skype: apiData?.skype || "",
        facebook: apiData?.facebook || "",
        // communicationChannels: apiData?.communicationChannels || [],
        // contactPersonsSalutation: apiData?.contactPersonsSalutation || "",
        // contactPersonsFirstName: apiData?.contactPersonsFirstName || "",
        // contactPersonsLastName: apiData?.contactPersonsLastName || "",
        // contactPersonsEmail: apiData?.contactPersonsEmail || "",
        // contactPersonsWorkPhone: apiData?.contactPersonsWorkPhone || "",
        // contactPersonsMobile: apiData?.contactPersonsMobile || "",
        // contactPersonsCommunicationChannels: apiData?. contactPersonsCommunicationChannels || "",
      }));
    }
  }, [customerDataById]);


  console.log(formData.salutation, "checking the salutation");

  //for file select
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

  //for uploading files
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

  //to remove a file from selection
  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValid);
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
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Email validation
      // if (!isEmailValid) {
      //   toastError("Please enter a valid email address");
      //   return;
      // }

      // Required fields validation
      const requiredFields = {
        customerType: "Customer type",
        displayName: "Display name",
        email: "Email",
        companyName: "Company name",
        leadId: "Lead",
        addressStreet1: "Address",
        city: "City",
        state: "State",
        countryRegion: "Country/Region",
        pinCode: "PIN code",

      };



      // for (const [field, label] of Object.entries(requiredFields)) {
      //   if (!formData[field as keyof ICustomerForm]) {
      //     toastError(`${label} is required`);
      //     return;
      //   }
      // }

      // Phone number validation
      // const phoneRegex = /^\d{10}$/;
      // if (formData.workPhone && !phoneRegex.test(formData.workPhone.replace(/[-\s]/g, ''))) {
      //   toastError("Please enter a valid work phone number");
      //   return;
      // }
      // if (formData.mobile && !phoneRegex.test(formData.mobile.replace(/[-\s]/g, ''))) {
      //   toastError("Please enter a valid mobile number");
      //   return;
      // }

      // // PAN number validation (Indian PAN format)
      // const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      // if (formData.panNumber && !panRegex.test(formData.panNumber)) {
      //   toastError("Please enter a valid PAN number");
      //   return;
      // }

      // PIN code validation
      // const pinCodeRegex = /^\d{6}$/;
      // if (formData.pinCode && !pinCodeRegex.test(formData.pinCode)) {
      //   toastError("Please enter a valid 6-digit PIN code");
      //   return;
      // }

      // Contact persons validation
      // if (contactPersons.length > 0) {
      //   for (let i = 0; i < contactPersons.length; i++) {
      //     const person = contactPersons[i];
      //     if (person.firstName && !person.lastName) {
      //       toastError(`Please enter last name for contact person ${i + 1}`);
      //       return;
      //     }
      //     if (person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
      //       toastError(`Please enter a valid email for contact person ${i + 1}`);
      //       return;
      //     }
      //     if (person.workPhone && !phoneRegex.test(person.workPhone.replace(/[-\s]/g, ''))) {
      //       toastError(`Please enter a valid work phone for contact person ${i + 1}`);
      //       return;
      //     }
      //   }
      // }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        contactPersons: contactPersons,
        documentArray: uploadFiles,
      };



      // Handle create/update based on whether we have an ID
      if (id) {
        await updateCustomer({
          id,
          obj: submissionData,
        });
        toastSuccess("Customer updated successfully");
        navigate("/customer-sales");
        console.log("LeadId----->", formData.leadId)

      } else {
        await addCustomer(submissionData);

        toastSuccess("Customer added successfully");
        navigate("/customer-sales");
        console.log("LeadId----->", formData.leadId)
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleChannelChange = (
    index: number,
    channel: string,
    value: boolean
  ) => {
    setContactPersons((prev) =>
      prev.map((person, i) =>
        i === index
          ? {
            ...person,
            communicationChannels: {
              ...person.communicationChannels,
              [channel]: value,
            },
          }
          : person
      )
    );
  };

  const StyledPopper = styled(Popper)({
    zIndex: 1300, // Ensure it's above other elements
    marginTop: "4px", // Add slight spacing to not overlap
  });

  const copyBillingAddress = () => {
    setFormData({
      ...formData,
      shippingCountryRegion: formData.countryRegion,
      shippingAddressStreet1: formData.addressStreet1,
      shippingAddressStreet2: formData.addressStreet2,
      shippingCity: formData.city,
      shippingState: formData.state,
      shippingPinCode: formData.pinCode,
      shippingPhoneNumber: formData.phoneNumber,
      shippingFaxNumber: formData.faxNumber,
    });
  };

  const { canView, canUpdate, canCreate } =
    checkPermissionsForButtons("Customers");

  // console.log(formData.openingBalance, "checking the opening balance");

  const gstOptions = [
    {
      value: "registered_regular",
      label: "Registered Business - Business that is registered under GST",
    },
    {
      value: "registered_composite",
      label:
        "Registered Business - Composition (Business that is registered under the Composition Scheme in GST)",
    },
    {
      value: "unregistered",
      label:
        "Unregistered Business - Business that is not registered under GST",
    },
    {
      value: "consumer",
      label: "Consumer - A consumer that is a regular customer",
    },
    {
      value: "overseas",
      label:
        "Overseas - A person with whom you do import or export of supplies outside India",
    },
    {
      value: "deemed_export",
      label:
        "Deemed Export - Supply of goods to an Export Oriented Unit or against Advanced Authorization/Export Promotion Capital Goods",
    },
    {
      value: "special_economic_zone",
      label:
        "Tax Deductors - Departments of the State/Central government, governmental agencies or local authorities",
    },
    {
      value: "special_economic_zone_developer",
      label:
        "SEZ Developer - A person/organization who owns at least 26% of the equity in creating business units in a Special Economic Zone (SEZ)",
    },
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

  const paymentTermsOptions = [
    { value: "Advance Paid", label: "Advance Paid" },
    { value: "CC Auth Provided", label: "CC Auth Provided" },
    { value: "Due on Receipt", label: "Due on Receipt" },
    {
      value: "Bill To Company Extras Direct",
      label: "Bill To Company Extras Direct",
    },
    { value: "Entire Bill To Company", label: "Entire Bill To Company" },
    { value: "30 Days", label: "30 Days" },
    { value: "45 Days", label: "45 Days" },
    { value: "Direct From Guest", label: "Direct From Guest" },
    { value: "Due End Of The Month", label: "Due End Of The Month" },
    { value: "Due End Of Next Month", label: "Due End Of Next Month" },
  ];

  const priceListOptions = [
    {
      value: "HEALTHCARE VEDARK [10% Markdown]",
      label: "HEALTHCARE VEDARK [10% Markdown]",
    },
    { value: "Basic SEO Package", label: "Basic SEO Package" },
    { value: "Social Media Management", label: "Social Media Management" },
    {
      value: "Pay-Per-Click (PPC) Campaign Setup",
      label: "Pay-Per-Click (PPC) Campaign Setup",
    },
    { value: "Content Writing", label: "Content Writing" },
    { value: "Website Audit", label: "Website Audit" },
  ];

  const languageOptions = [
    { value: "EN - English", label: "EN - English - Hello" },
    { value: "ES - Spanish", label: "ES - Spanish - Hola" },
    {
      value: "ZH - Chinese (Mandarin)",
      label: "ZH - Chinese (Mandarin) - 你好 (Nǐ hǎo)",
    },
    { value: "HI - Hindi", label: "HI - Hindi - नमस्ते (Namaste)" },
    { value: "AR - Arabic", label: "AR - Arabic - مرحبا (Marhaban)" },
    { value: "BN - Bengali", label: "BN - Bengali - হ্যালো (Hyālō)" },
    { value: "PT - Portuguese", label: "PT - Portuguese - Olá" },
    { value: "RU - Russian", label: "RU - Russian - Привет (Privet)" },
    {
      value: "JA - Japanese",
      label: "JA - Japanese - こんにちは (Konnichiwa)",
    },
    { value: "DE - German", label: "DE - German - Hallo" },
    {
      value: "KO - Korean",
      label: "KO - Korean - 안녕하세요 (Annyeonghaseyo)",
    },
    { value: "FR - French", label: "FR - French - Bonjour" },
    { value: "IT - Italian", label: "IT - Italian - Ciao" },
    { value: "TR - Turkish", label: "TR - Turkish - Merhaba" },
    { value: "VI - Vietnamese", label: "VI - Vietnamese - Xin chào" },
    { value: "PL - Polish", label: "PL - Polish - Witaj" },
    {
      value: "PA - Punjabi",
      label: "PA - Punjabi - ਸਤ ਸ੍ਰੀ ਅਕਾਲ (Sat Sri Akal)",
    },
    { value: "UR - Urdu", label: "UR - Urdu - سلام (Salaam)" },
    {
      value: "FA - Persian (Farsi)",
      label: "FA - Persian (Farsi) - سلام (Salaam)",
    },
    { value: "HE - Hebrew", label: "HE - Hebrew - שלום (Shalom)" },
    { value: "MS - Malay", label: "MS - Malay - Halo" },
    { value: "TH - Thai", label: "TH - Thai - สวัสดี (Sawasdee)" },
    { value: "SW - Swahili", label: "SW - Swahili - Hujambo" },
    { value: "TA - Tamil", label: "TA - Tamil - வணக்கம் (Vanakkam)" },
    { value: "TE - Telugu", label: "TE - Telugu - హలో (Halo)" },
    { value: "EL - Greek", label: "EL - Greek - Γειά σας (Yia sas)" },
    { value: "ML - Malayalam", label: "ML - Malayalam - ഹലോ (Halo)" },
    { value: "CS - Czech", label: "CS - Czech - Ahoj" },
    { value: "SK - Slovak", label: "SK - Slovak - Ahoj" },
    { value: "HU - Hungarian", label: "HU - Hungarian - Helló" },
    { value: "SR - Serbian", label: "SR - Serbian - Zdravo" },
    { value: "RO - Romanian", label: "RO - Romanian - Bună ziua" },
    { value: "DA - Danish", label: "DA - Danish - Hej" },
  ];

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
        <form onSubmit={handleSubmit}>
          {/* Customer Type Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-32 text-base font-medium text-gray-700">
                Customer Type:
              </span>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="Business"
                    checked={formData.customerType === "Business"}
                    onChange={(e) =>
                      setFormData({ ...formData, customerType: e.target.value })
                    }
                    className="ml-2 form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Business</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="Individual"
                    checked={formData.customerType === "Individual"}
                    onChange={(e) =>
                      setFormData({ ...formData, customerType: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Individual</span>
                </label>
              </div>
            </div>
          </div>

          {/* Primary Contact Section */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="w-32 text-base font-medium text-gray-700 mt-2">
                Primary Contact:
              </span>
              <div className="flex-1 space-y-4">
                <div className="flex gap-6">
                  <div className="flex-1 max-w-[200px]">
                    <select
                      value={formData.salutation}
                      onChange={(e) =>
                        setFormData({ ...formData, salutation: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-gray-400 text-sm"
                    >
                      <option value="">Salutation</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Miss.">Miss.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="First Name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
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
                  <span className="w-32 text-base font-medium text-gray-700 mt-2">
                    Company Name:
                  </span>
                  <div className="w-96">
                    {" "}
                    {/* Added width container matching other fields */}
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Enter company name"
                      className="w-full border border-gray-300 rounded-md p-2 pl-3 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Display Name"
                    className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-6">
                  <span className="w-32 text-base font-medium text-gray-700 mt-2">
                    Email Address:
                  </span>
                  <div className="flex-1 relative">
                    {/* <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div> */}
                    <div className="w-96">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setIsEmailValid(true);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        placeholder="Enter email address"
                        className={`w-full border ${!isEmailValid ? "border-red-500" : "border-gray-300"
                          } rounded-md p-2 pl-3 text-sm`}
                      />
                      {!isEmailValid && (
                        <p className="text-red-500 text-sm mt-1">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-center gap-6">
                  <span className="w-32 text-base font-medium text-gray-700 mt-2">
                    Phone:
                  </span>
                  <div className="flex-1 flex gap-4">
                    {/* Work Phone Input */}
                    <div className="relative ">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                      <div className="w-44">
                        <input
                          type="tel"
                          value={formData?.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Work Phone"
                          className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm"
                        />
                      </div>
                    </div>

                    {/* Mobile Phone Input */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                      <div className="w-48">
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) =>
                            setFormData({ ...formData, mobile: e.target.value })
                          }
                          placeholder="Mobile"
                          className="w-full border border-gray-300 rounded-md p-2 pl-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication Channels */}
                <div className="flex items-center gap-6 mt-4">
                  <span className="w-[200px] text-base font-medium text-gray-700 mt-2">
                    Communication Channels:
                  </span>
                  <div className="flex gap-6 mt-2">
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
                        checked={formData.prefersSms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prefersSms: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>

                {/* Separation Line */}
                <hr className="my-6 border-gray-300 mt-4" />

                {/* Tab Menu */}
                <div className="mt-8">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 ">
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
                      <div className="grid grid-cols-2 gap-x-10 gap-y-6 ">
                        {/* GST Treatment */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700 mt-2">
                              GST Treatment:
                            </span>
                            <div className="w-96">
                              <Autocomplete
                                disablePortal
                                options={gstOptions}
                                value={
                                  gstOptions.find((option) => option.value === formData.gstTreatment) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    gstTreatment: newValue?.value || "",
                                  });
                                }}
                                PopperComponent={StyledPopper}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select GST Treatment"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "36px" },
                                    }}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        height: "40px",
                                      },
                                      "& .MuiInputLabel-root": {
                                        fontSize: "14px",
                                        marginTop: "-2px",
                                        transform: "translate(14px, 10px) scale(1)",
                                        "&.MuiInputLabel-shrink": {
                                          transform: "translate(14px, -9px) scale(0.75)",
                                        },
                                      },
                                      "& .MuiInputLabel-root.Mui-focused": {
                                        transform: "translate(14px, -9px) scale(0.75)",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </div>
                            {/* <div className="w-96 mt-1">
                              {" "}
                              {/* Reduced margin-top here */}
                            {/* <Autocomplete
                                disablePortal
                                options={gstOptions}
                                sx={{ width: "100%" }}
                                value={
                                  gstOptions.find(
                                    (option) =>
                                      option.value === formData.gstTreatment
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    gstTreatment: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select GST Treatment"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: {
                                        height: "36px", // Reduced height for the dropdown
                                        padding: "0 14px", // Adjusted padding
                                      },
                                    }}
                                    InputLabelProps={{
                                      ...params.InputLabelProps,
                                      style: {
                                        top: "50%", // Centers the label vertically
                                        transform: "translateY(-50%)", // Vertically centers label
                                        paddingLeft: "8px", // Added some gap from the left
                                      },
                                    }}
                                  />
                                )}
                                className="flex-1 rounded-md p-2 text-sm"
                              /> */}
                            {/* </div> */}
                          </div>
                        </div>

                        {/* Place of Supply */}
                        <div className="col-span-2 mt-1">
                          {/* Reduced margin-top here */}
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700 mt-2">
                              Place of Supply:
                            </span>
                            <div className="w-96 mt-1">
                              {/* Reduced margin-top here */}
                              <Autocomplete
                                disablePortal
                                options={stateOptions}
                                value={
                                  stateOptions.find(
                                    (option) =>
                                      option.value === formData.placeOfSupply
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    placeOfSupply: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select State"
                                    InputProps={{
                                      ...params.InputProps,
                                      style: { height: "36px" },

                                    }}
                                    sx={{

                                      "& .MuiInputLabel-root": {
                                        fontSize: "14px",
                                        marginTop: "-2px",

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

                        {/* PAN Number */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <label
                              className="w-32 text-base font-medium text-gray-700"
                              htmlFor="panNumber"
                            >
                              PAN Number:
                            </label>
                            <div className="w-96">
                              {" "}
                              {/* Removed ml-2 to match exact dropdown width */}
                              <input
                                id="panNumber"
                                type="text"
                                value={formData.panNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    panNumber: e.target.value,
                                  })
                                }
                                placeholder="Enter PAN Number"
                                className="w-full  border border-gray-300 rounded-md p-2 text-[14px] leading-14px focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/*Tax Preference*/}
                        {/* <div className="mt-4">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Tax Prefernce:
                            </span>
                            <div className="flex items-center space-x-4 ml-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="taxPreference"
                                  value="Taxable"
                                  checked={formData.taxPreference === "Taxable"}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      taxPreference: e.target.value,
                                    })
                                  }
                                  className="ml-2 form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700 ">Taxable</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="taxPreference"
                                  value="Tax Exempt"
                                  checked={
                                    formData.taxPreference === "Tax Exempt"
                                  }
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      taxPreference: e.target.value,
                                    })
                                  }
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700">
                                  Tax Exempt
                                </span>
                              </label>
                            </div>
                          </div>
                        </div> */}
                        {/* Currency */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Currency:
                            </span>
                            <div className="w-96">
                              <Autocomplete
                                disablePortal
                                options={currencyOptions}
                                value={
                                  currencyOptions.find(
                                    (option) =>
                                      option.value === formData.currency
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    currency: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Currency"
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
                        </div> */}

                        {/* Opening Balance */}



                        {/* Credit Limit */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Credit Limit:
                            </span>
                            <div className="w-96">
                              <TextField
                                label="Credit Limit"
                                value={formData.creditLimit}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
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
                                            option.value === formData.currency
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
                            <span className="w-32 text-base font-medium text-gray-700">
                              Payment Terms:
                            </span>
                            <div className="w-96">
                              <Autocomplete
                                disablePortal
                                options={paymentTermsOptions}
                                value={
                                  paymentTermsOptions.find(
                                    (option) =>
                                      option.value === formData.paymentTerms
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    paymentTerms: newValue?.value || "",
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
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* Price List */}
                        {/* <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="w-32 text-base font-medium text-gray-700">
                              Price List:
                            </span>
                            <div className="w-96">
                              <Autocomplete
                                disablePortal
                                options={priceListOptions}
                                value={
                                  priceListOptions.find(
                                    (option) =>
                                      option.value === formData.priceList
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    priceList: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Price List"
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
                        </div> */}

                        {/* Enable Portal */}
                        <div className="flex items-center gap-6 mt-2 mb-4">
                          <span className="w-32 text-base font-medium text-gray-700 mt-2">
                            Enable Portal:
                          </span>
                          <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.enablePortal}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    enablePortal: e.target.checked,
                                  })
                                }
                                className="ml-1 form-checkbox h-4 w-4 text-blue-600"
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
                            <span className="w-32 text-base font-medium text-gray-700">
                              Portal Language:
                            </span>
                            <div className="w-96">
                              <Autocomplete
                                disablePortal
                                options={languageOptions}
                                value={
                                  languageOptions.find(
                                    (option) =>
                                      option.value === formData.portalLanguage
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    portalLanguage: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Language"
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
                            {formData &&
                              formData.documentArray.length > 0 &&
                              formData.documentArray.map((image, index) => (
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
                                <IoChevronUpSharp className="w-5 h-5" />
                                Hide More Details
                              </>
                            ) : (
                              <>
                                <IoChevronDownSharp className="w-5 h-5" />
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
                                      <FaGlobe className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="websiteUrl"
                                      type="text"
                                      value={formData.websiteUrl}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                      <FaBuilding className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="department"
                                      type="text"
                                      value={formData.department}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                      <FaUserCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="designation"
                                      type="text"
                                      value={formData.designation}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                      <FaTwitter className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="twitter"
                                      type="text"
                                      value={formData.twitter}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                      <FiMessageCircle className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="skype"
                                      type="text"
                                      value={formData.skype}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                      <FaFacebook className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                      id="facebook"
                                      type="text"
                                      value={formData.facebook}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
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
                                defaultValue={{ value: "IN - India", label: "IN - India" }}
                                sx={{ width: 600 }}
                                value={
                                  countryOptions.find(
                                    (option) =>
                                      option.value === formData.countryRegion
                                  ) || { value: "IN - India", label: "IN - India" }
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    countryRegion: newValue?.value || "",
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
                                value={formData.addressStreet1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    addressStreet1: e.target.value,
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
                                value={formData.addressStreet2}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    addressStreet2: e.target.value,
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
                                value={formData.city}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    city: e.target.value,
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
                                    (option) => option.value === formData.state
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    state: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="State"
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
                                value={formData.pinCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    pinCode: e.target.value,
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
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phoneNumber: e.target.value,
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
                                value={formData.faxNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    faxNumber: e.target.value,
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
                              <FaChevronDown className="h-4 w-4 text-blue-600" />
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
                                defaultValue={{ value: "IN - India", label: "IN - India" }}
                                value={
                                  countryOptions.find(
                                    (option) =>
                                      option.value ===
                                      formData.shippingCountryRegion
                                  ) || { value: "IN - India", label: "IN - India" }
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    countryRegion: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="State"
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
                                value={formData.shippingAddressStreet1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
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
                                value={formData.shippingAddressStreet2}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
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
                                value={formData.shippingCity}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
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
                                      option.value === formData.shippingState
                                  ) || null
                                }
                                onChange={(event, newValue) => {
                                  setFormData({
                                    ...formData,
                                    state: newValue?.value || "",
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="State"
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
                                value={formData.shippingPinCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingPinCode: e.target.value,
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
                                value={formData.shippingPhoneNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingPhoneNumber: e.target.value,
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
                                value={formData.shippingFaxNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
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
                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                              <thead className="bg-gray-50 sticky top-0">
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
                                    Anniversary Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Department
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Designation
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Date of Birth
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Communication Channels
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
                                        value={person.firstName}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "firstName",
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
                                        value={person.lastName}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "lastName",
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
                                        value={person.email}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "email",
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
                                        value={person.workPhone}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "workPhone",
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
                                        value={person.mobilePhone}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "mobilePhone",
                                            e.target.value
                                          )
                                        }
                                        className="w-full border rounded p-1 text-sm"
                                      />
                                    </td>

                                    {/* Anniversary Date */}
                                    <td className="px-4 py-2 border-b">
                                      <input
                                        type="date"
                                        value={person.contactPersonAnniversary}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "contactPersonAnniversary",
                                            e.target.value
                                          )
                                        }
                                        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                        className="w-full border rounded p-1 text-sm"
                                      />
                                    </td>

                                    {/* Department */}
                                    <td className="px-4 py-2 border-b">
                                      <input
                                        type="text"
                                        value={person.contactPersonDepartment}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "contactPersonDepartment",
                                            e.target.value
                                          )
                                        }
                                        className="w-full border rounded p-1 text-sm"
                                      />
                                    </td>

                                    {/* Designation */}
                                    <td className="px-4 py-2 border-b">
                                      <input
                                        type="text"
                                        value={person.contactPersonDesignation}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "contactPersonDesignation",
                                            e.target.value
                                          )
                                        }
                                        className="w-full border rounded p-1 text-sm"
                                      />
                                    </td>

                                    {/* Date of Birth */}
                                    <td className="px-4 py-2 border-b">
                                      <input
                                        type="date"
                                        value={person.contactPersonDateOfBirth}
                                        onChange={(e) =>
                                          handleContactPersonChange(
                                            index,
                                            "contactPersonDateOfBirth",
                                            e.target.value
                                          )
                                        }
                                        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                        className="w-full border rounded p-1 text-sm"
                                      />
                                    </td>



                                    {/* Communication Channels */}
                                    <td className="px-4 py-2 border-b">
                                      <div className="flex gap-4">
                                        <label className="flex items-center space-x-1">
                                          <input
                                            type="checkbox"
                                            checked={
                                              person.communicationChannels
                                                .prefersEmail
                                            }
                                            onChange={(e) =>
                                              handleChannelChange(
                                                index,
                                                "prefersEmail",
                                                e.target.checked
                                              )
                                            }
                                            // checked={person.communicationChannels.includes(
                                            //   "Email"
                                            // )}
                                            // onChange={(e) =>
                                            //   handleChannelChange(
                                            //     index,
                                            //     "Email",
                                            //     e.target.checked
                                            //   )
                                            // }
                                            className="form-checkbox h-4 w-4"
                                          />
                                          <span className="text-sm">Email</span>
                                        </label>
                                        <label className="flex items-center space-x-1">
                                          <input
                                            type="checkbox"
                                            checked={
                                              person.communicationChannels
                                                .prefersSms
                                            }
                                            onChange={(e) =>
                                              handleChannelChange(
                                                index,
                                                "prefersSms",
                                                e.target.checked
                                              )
                                            }
                                            // checked={person.communicationChannels.includes(
                                            //   "SMS"
                                            // )}
                                            // onChange={(e) =>
                                            //   handleChannelChange(
                                            //     index,
                                            //     "SMS",
                                            //     e.target.checked
                                            //   )
                                            // }
                                            className="form-checkbox h-4 w-4"
                                          />
                                          <span className="text-sm">SMS</span>
                                        </label>
                                      </div>
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
                          </div>

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
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;

// import {
//   useAddCustomer,
//   useCustomerById,
//   useUpdateCustomerById,
// } from "@/services/customer.service";
// import { toastError, toastSuccess } from "@/utils/toast";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const AddCustomer = () => {
//   const [formData, setFormData] = useState({
//     contactName: "",
//     contactOwner: "",
//     companyName: "",
//     email: "",
//     phoneNumber: "",
//     panNumber: "",
//     placeOfSupply: "",
//     state: "",
//     city: "",
//     Area: "",
//     Address: "",
//     bankName: "",
//     bankAccountNumber: "",
//     bankIFSCCode: "",
//     salutation: "",
//     contactPersonName: "",
//     contactPersonEmail: "",
//     contactPersonPhoneNumber: "",
//   });

//   const { id } = useParams();

//   const navigate = useNavigate();
//   const { mutateAsync: AddCustomer } = useAddCustomer();
//   const { mutateAsync: updateCustomer } = useUpdateCustomerById();
//   const { data: customerDataById, isLoading } = useCustomerById(id || "");

//   useEffect(() => {
//     // Prefill form when editing
//     if (customerDataById) {
//       console.log(customerDataById, "getById/");
//       setFormData(customerDataById?.data || "");
//     }
//   }, [customerDataById]);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const obj = formData;

//       if (id) {
//         const { data: res } = await updateCustomer({ id, obj });
//         if (res?.message) {
//           toastSuccess(res.message);
//           navigate("/customer-sale");
//         }
//       } else {
//         const { data: res } = await AddCustomer(obj);
//         console.log(res, "res");
//         if (res?.message) {
//           toastSuccess(res.message);
//           navigate("/customer-sales");
//         }
//       }
//     } catch (error) {
//       toastError(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
//         <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
//         <form onSubmit={handleSubmit}>
//           {/* Contact Details Section */}
//           <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* Contact Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Name
//               </label>
//               <input
//                 value={formData.contactName}
//                 name={"contactName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, contactName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter contact name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Contact Owner */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Owner
//               </label>
//               <input
//                 value={formData.contactOwner}
//                 name={"contactOwner"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, contactOwner: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Auto fill"
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 disabled
//               />
//             </div>

//             {/* Company Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Name
//               </label>
//               <input
//                 value={formData.companyName}
//                 name={"companyName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, companyName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter company name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 value={formData.email}
//                 name={"email"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 type="email"
//                 placeholder="Enter email"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 value={formData.phoneNumber}
//                 name={"phoneNumber"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phoneNumber: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter phone number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* PAN Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 PAN Number
//               </label>
//               <input
//                 value={formData.panNumber}
//                 name={"panNumber"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, panNumber: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter PAN number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Place of Supply */}
//             {/* city or state or option are coming from api */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Place of Supply
//               </label>
//               <select
//                 name={"placeOfSupply"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, placeOfSupply: e.target.value })
//                 }
//                 value={formData.placeOfSupply}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 defaultValue=""
//               >
//                 <option value="">Select place of supply</option>
//                 <option value="Gujarat">Gujarat</option>
//                 {/* Add options as needed */}
//               </select>
//             </div>
//           </div>

//           {/* Commented out other sections
//           <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 State
//               </label>
//               <input
//                 value={formData.state}
//                 name={"state"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, state: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter state"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 City
//               </label>
//               <input
//                 value={formData.city}
//                 name={"city"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, city: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter city"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Area
//               </label>
//               <input
//                 value={formData.Area}
//                 name={"Area"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, Area: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter area"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <input
//                 value={formData.Address}
//                 name={"Address"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, Address: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter address"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bank Name
//               </label>
//               <input
//                 value={formData.bankName}
//                 name={"bankName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, bankName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter bank name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bank Account Number
//               </label>
//               <input
//                 value={formData.bankAccountNumber}
//                 name={"bankAccountNumber"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     bankAccountNumber: e.target.value,
//                   })
//                 }
//                 type="text"
//                 placeholder="Enter account number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 IFSC Code
//               </label>
//               <input
//                 value={formData.bankIFSCCode}
//                 name={"bankIFSCCode"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, bankIFSCCode: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter IFSC code"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           <h2 className="text-lg font-semibold mb-4">Contact Person</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Salutation
//               </label>
//               <select
//                 name="salutation"
//                 onChange={(e) =>
//                   setFormData({ ...formData, salutation: e.target.value })
//                 }
//                 value={formData.salutation}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 defaultValue=""
//               >
//                 <option value="">Select salutation</option>
//                 <option>Mr.</option>
//                 <option>Ms.</option>
//                 <option>Dr.</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Name
//               </label>
//               <input
//                 name="contactPersonName"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonName: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonName}
//                 type="text"
//                 placeholder="Enter name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 name="contactPersonEmail"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonEmail: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonEmail}
//                 type="email"
//                 placeholder="Enter email"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 name="contactPersonPhoneNumber"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonPhoneNumber: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonPhoneNumber}
//                 type="text"
//                 placeholder="Enter phone number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>
//           */}

//           {/* Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className=" px-3 py-1.5 bg-orange-500 text-white rounded-md"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;
