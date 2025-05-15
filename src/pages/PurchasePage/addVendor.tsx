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
import { checkPermissionsForButtons } from "@/utils/permission";
import moment from "moment";
import { clippingParents } from "@popperjs/core";

interface IVendor {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  contactName: string;
  contactOwner: string;
  panNumber: string;
  gst: string;
  vendorType: string[];
  landLine: string;
  phoneNumber: string;
  displayName: string;
}

interface ILocation {
  state: string;
  city: string;
  area: string;
  address: string;
}

interface ICategory {
  categoryType: string;
}

interface IRoomPrice {
  roomType: string;
  roomPrice: string;
}

interface IRoom {
  roomCategory: string;
  numberOfRooms: number;
  roomSize: string;
  roomImageUpload: string[];
  prices: IRoomPrice[];
}

interface IBanquet {
  numberOfBanquests: string;
  banquetCategory: string;
  banquetSize: string;
  banquetImageUpload: string[];
  banquetName: string;
  banquetSetup: string;
  banquetVegPrice: string;
  banquetNonVegPrice: string;
  banquetFloor: string;
  prefuntionAreaSize: string;
}

interface IEventServices {
  services: string;
  rate: string;
}

interface IEventLocation {
  state: string;
  city: string;
  area: string;
  serviceAreas: string[];
}

interface IRestaurant {
  restaurantMenuType: string[];
  restaurantImageUpload: string[];
  restaurantCovers: string;
  restaurantFloor: string;
  restaurantSwimmingPool: string;
}

interface ICarDetails {
  carType: string;
  numberOfCars: number;
  fourHr40Km: string;
  eightHr80Km: string;
  fullDay100Km: string;
  airportTransfer: string;
}

interface ITransportLocation {
  state: string;
  city: string;
  travelLocal: boolean;
  travelOutStation: boolean;
  serviceAreas: string[];
  carDetails: ICarDetails[];
}

interface IBankDetails {
  bankName: string;
  bankAccountNumber: string;
  ifsc: string;
  pointOfContact: string;
  email: string;
  phoneNumber: string;
  billingAddress: string;
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
  contactPersonDesignation: string;
  contactPersonDepartment: string;
  contactPersonDateOfBirth: string;
  contactPersonAnniversary: string;
}
[];

const AddVendorForm = () => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Vendors");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createVendor } = useAddVendor();
  const { mutateAsync: updateVendor } = useUpdateVendorById();
  const [isExpanded, setIsExpanded] = useState(false);
  // const [isRoomDetailsVisible, setIsRoomDetailsVisible] = useState(false);
  const [isBanquetDetailsVisible, setIsBanquetDetailsVisible] = useState(false);
  const [isRestaurantDetailsVisible, setIsRestaurantDetailsVisible] =
    useState(false);
  const [isPrefunctionAreaVisible, setIsPrefunctionAreaVisible] =
    useState(false);
  const { data: vendorDataById, isLoading: vendorLoading } = useVendorById(
    id || ""
  );

  const [vendor, setVendor] = useState<IVendor>({
    salutation: "",
    firstName: "",
    lastName: "",
    contactName: "",
    contactOwner: "",
    panNumber: "",
    gst: "",
    vendorType: [],
    landLine: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    displayName: "",
  });

  const [location, setLocation] = useState<ILocation>({
    state: "",
    city: "",
    area: "",
    address: "",
  });

  const [category, setCategory] = useState<ICategory>({
    categoryType: "",
  });

  const [rooms, setRooms] = useState<IRoom[]>([
    {
      roomCategory: "",
      numberOfRooms: 0,
      roomSize: "",
      roomImageUpload: [],
      prices: [{ roomType: "", roomPrice: "" }],
    },
  ]);

  const [banquets, setBanquets] = useState<IBanquet[]>([
    {
      numberOfBanquests: "",
      banquetCategory: "",
      banquetSize: "",
      banquetImageUpload: [],
      banquetName: "",
      banquetSetup: "",
      banquetVegPrice: "",
      banquetNonVegPrice: "",
      banquetFloor: "",
      prefuntionAreaSize: "",
    },
  ]);

  const [eventServices, setEventServices] = useState<IEventServices[]>([
    {
      services: "",
      rate: "",
    },
  ]);

  const [eventLocation, setEventLocation] = useState<IEventLocation>({
    state: "",
    city: "",
    area: "",
    serviceAreas: [],
  });

  const [restaurant, setRestaurant] = useState<IRestaurant>({
    restaurantMenuType: [],
    restaurantImageUpload: [],
    restaurantCovers: "",
    restaurantFloor: "",
    restaurantSwimmingPool: "",
  });

  const [transportLocation, setTransportLocation] =
    useState<ITransportLocation>({
      state: "",
      city: "",
      travelLocal: false,
      travelOutStation: false,
      serviceAreas: [],
      carDetails: [
        {
          carType: "",
          numberOfCars: 0,
          fourHr40Km: "",
          eightHr80Km: "",
          fullDay100Km: "",
          airportTransfer: "",
        },
      ],
    });

  const [bankDetails, setBankDetails] = useState<IBankDetails>({
    bankName: "",
    bankAccountNumber: "",
    ifsc: "",
    pointOfContact: "",
    email: "",
    phoneNumber: "",
    billingAddress: "",
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
      contactPersonDesignation: "",
      contactPersonDepartment: "",
      contactPersonDateOfBirth: "",
      contactPersonAnniversary: "",
    },
  ]);

  const [isRoomDetailsVisible, setIsRoomDetailsVisible] = useState(false);

  const populateDemoData = () => {
    setVendor({
      salutation: "Mr.",
      firstName: "John",
      lastName: "Doe",
      contactName: "John Doe",
      contactOwner: "Jane Smith",
      panNumber: "ABCDE1234F",
      gst: "27ABCDE1234F1Z5",
      vendorType: ["Hotel"],
      landLine: "022-12345678",
      email: "john.doe@example.com",
      companyName: "Luxury Hotels Ltd.",
      phoneNumber: "+919876543210",
      displayName: "company",
    });

    setLocation({
      state: "Maharashtra",
      city: "Mumbai",
      area: "Bandra",
      address: "123 Luxury Lane, Bandra West",
    });

    setCategory({
      categoryType: "4 star",
    });

    setRooms([
      {
        roomCategory: "deluxe room (head)",
        numberOfRooms: 10,
        roomSize: "300 sq ft",
        roomImageUpload: [],
        prices: [{ roomType: "deluxe", roomPrice: "5000" }],
      },
    ]);

    setBanquets([
      {
        numberOfBanquests: "2",
        banquetCategory: "banquet",
        banquetSize: "500 sq ft",
        banquetImageUpload: [],
        banquetName: "Grand Hall",
        banquetSetup: "theater",
        banquetVegPrice: "1500",
        banquetNonVegPrice: "2000",
        banquetFloor: "1st",
        prefuntionAreaSize: "medium (200 sq ft)",
      },
    ]);

    setRestaurant({
      restaurantMenuType: ["indian", "continental"],
      restaurantImageUpload: [],
      restaurantCovers: "50",
      restaurantFloor: "2nd",
      restaurantSwimmingPool: "Yes",
    });

    setBankDetails({
      bankName: "HDFC Bank",
      bankAccountNumber: "123456789012",
      ifsc: "HDFC0001234",
      pointOfContact: "Rahul Sharma",
      email: "rahul.sharma@hdfc.com",
      phoneNumber: "+919876543211",
      billingAddress: "456 Bank Street, Mumbai",
    });

    setOtherDetails({
      sourceOfSupply: "Local",
      gstTreatment: "Registered",
      gstin: "27ABCDE1234F1Z5",
      pan: "ABCDE1234F",
      msmeRegistered: true,
      currency: "INR - Indian Rupee",
      openingBalanceState: "Credit",
      openingBalance: "10000",
      creditLimit: "50000",
      paymentTerms: "Due on Receipt",
      tds: "TDS1",
      priceList: "PL1",
      enablePortal: true,
      portalLanguage: "English",
      documents: [],
      websiteUrl: "www.luxuryhotels.com",
      department: "Sales",
      designation: "Manager",
      skype: "john.doe.skype",
      facebook: "john.doe.fb",
      twitter: "john_doe",
    });

    setBillingAddress({
      addressId: "1",
      billingCountry: "IN - India",
      billingAddressStreet1: "123 Luxury Lane",
      billingAddressStreet2: "Bandra West",
      billingCity: "Mumbai",
      billingState: "[MH] - Maharashtra",
      billingPincode: "400050",
      billingPhone: "+919876543210",
      billingFaxNumber: "022-98765432",
    });

    setShippingAddress({
      shippingCountry: "IN - India",
      shippingAddressStreet1: "123 Luxury Lane",
      shippingAddressStreet2: "Bandra West",
      shippingCity: "Mumbai",
      shippingState: "[MH] - Maharashtra",
      shippingPincode: "400050",
      shippingPhone: "+919876543210",
      shippingFaxNumber: "022-98765432",
    });

    setContactPersons([
      {
        salutation: "Mr.",
        contactPersonFirstName: "Rahul",
        contactPersonLastName: "Sharma",
        contactPersonEmail: "rahul.sharma@example.com",
        contactPersonWorkPhone: "022-12345678",
        contactPersonMobilePhone: "+919876543211",
        contactPersonMobile: "+919876543211",
        contactPersonDesignation: "Sales Manager",
        contactPersonDepartment: "Sales",
        contactPersonDateOfBirth: "1990-01-01",
        contactPersonAnniversary: "2015-06-15",
      },
    ]);

    setIsBanquetDetailsVisible(true);
    setIsRestaurantDetailsVisible(true);
    toastSuccess("Demo data has been populated!");
  };

  useEffect(() => {
    if (vendor.vendorType.includes("Banquet")) {
      setIsBanquetDetailsVisible(true);
    }
    else {
      setIsBanquetDetailsVisible(false);
    }
  }, [vendor.vendorType]);


  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: '1px solid #e5e7eb !important',
      boxShadow: '0 !important',
      color: "#000",
      padding: '5px',
      fontFamily: "satoshi, sans-serif",
      backgroundColor: '#fafafa',
      zindex: '9',
      minHeight: '30px',
      '&:hover': {
        border: '1px solid #e5e7eb !important',

      },

      menu: (provided: any) => ({
        ...provided,
        zIndex: 9999, // Increase the z-index here
      }),

      menuPortal: (provided: any) => ({ ...provided, zIndex: 5 }),


    }),
    option: (base: any) => ({
      ...base,
      cursor: "pointer",
      background: "white",
      color: "#000",
      fontFamily: "'inter', sans-serif",
      zindex: '9',   // this was the mistake (I needed to remove this)
      "&:hover": {
        backgroundColor: "#687256",
        color: "#fff",
        fontFamily: "'inter', sans-serif",
      },
    })

  }



  useEffect(() => {
    if (vendorDataById) {
      const apiData = vendorDataById.data;

      setVendor((prev) => ({
        ...prev,
        salutation: apiData?.vendor?.salutation || "",
        firstName: apiData?.vendor?.firstName || "",
        lastName: apiData?.vendor?.lastName || "",
        email: apiData?.vendor?.email || "",
        landLine: apiData?.vendor?.landLine || "",
        phoneNumber: apiData?.vendor?.phoneNumber || "",
        displayName: apiData?.vendor?.displayName || "",
        companyName: apiData?.vendor?.companyName || "",
        contactName: apiData?.vendor?.contactName || "",
        contactOwner: apiData?.vendor?.contactOwner || "",
        panNumber: apiData?.vendor?.panNumber || "",
        gst: apiData?.vendor?.gst || "",
        vendorType: apiData?.vendor?.vendorType || [],
      }));

      setIsBanquetDetailsVisible(apiData?.isBanquetDetailsVisible || false);
      setIsRestaurantDetailsVisible(
        apiData?.isRestaurantDetailsVisible || false
      );

      setBillingAddress((prev) => ({
        ...prev,
        billingAddressStreet1:
          apiData?.billingAddress?.billingAddressStreet1 || "",
        billingCountry: apiData?.billingAddress?.billingCountry || "",
        billingAddressStreet2:
          apiData?.billingAddress?.billingAddressStreet2 || "",
        billingCity: apiData?.billingAddress?.billingCity || "",
        billingState: apiData?.billingAddress?.billingState || "",
        billingPincode: apiData?.billingAddress?.billingPincode || "",
        billingPhone: apiData?.billingAddress?.billingPhone || "",
        billingFaxNumber: apiData?.billingAddress?.billingFaxNumber || "",
      }));

      setShippingAddress((prev) => ({
        ...prev,
        shippingAddressStreet1:
          apiData?.shippingAddress?.shippingAddressStreet1 || "",
        shippingAddressStreet2:
          apiData?.shippingAddress?.shippingAddressStreet2 || "",
        shippingCountry: apiData?.shippingAddress?.shippingCountry || "",
        shippingCity: apiData?.shippingAddress?.shippingCity || "",
        shippingState: apiData?.shippingAddress?.shippingState || "",
        shippingPincode: apiData?.shippingAddress?.shippingPincode || "",
        shippingPhone: apiData?.shippingAddress?.shippingPhone || "",
        shippingFaxNumber: apiData?.shippingAddress?.shippingFaxNumber || "",
      }));

      setLocation((prev) => ({
        ...prev,
        state: apiData?.location?.state || "",
        city: apiData?.location?.city || "",
        area: apiData?.location?.area || "",
        address: apiData?.location?.address || "",
      }));

      setCategory((prev) => ({
        ...prev,
        categoryType: apiData?.category?.categoryType || "",
      }));

      setRooms(
        apiData?.rooms?.map((room: any) => ({
          roomCategory: room.roomCategory || "",
          numberOfRooms: room.numberOfRooms || 0,
          roomSize: room.roomSize || "",
          roomImageUpload: room.roomImageUpload || [],
          prices: room.prices?.map((price: any) => ({
            roomType: price.roomType || "",
            roomPrice: price.roomPrice || "",
          })) || [{ roomType: "", roomPrice: "" }],
        })) || [
          {
            roomCategory: "",
            numberOfRooms: 0,
            roomSize: "",
            roomImageUpload: [],
            prices: [{ roomType: "", roomPrice: "" }],
          },
        ]
      );

      setBanquets(
        apiData?.banquets?.map((banquet: any) => ({
          numberOfBanquests: banquet.numberOfBanquests || "",
          banquetCategory: banquet.banquetCategory || "",
          banquetSize: banquet.banquetSize || "",
          banquetImageUpload: banquet.banquetImageUpload || [],
          banquetName: banquet.banquetName || "",
          banquetSetup: banquet.banquetSetup || "",
          banquetVegPrice: banquet.banquetVegPrice || "",
          banquetNonVegPrice: banquet.banquetNonVegPrice || "",
          banquetFloor: banquet.banquetFloor || "",
          prefuntionAreaSize: banquet.prefuntionAreaSize || "",
        })) || [
          {
            numberOfBanquests: "",
            banquetCategory: "",
            banquetSize: "",
            banquetImageUpload: [],
            banquetName: "",
            banquetSetup: "",
            banquetVegPrice: "",
            banquetNonVegPrice: "",
            banquetFloor: "",
            prefuntionAreaSize: "",
          },
        ]
      );

      setEventServices(
        apiData?.eventServices?.map((service: any) => ({
          services: service.services || "",
          rate: service.rate || "",
        })) || [{ services: "", rate: "" }]
      );

      setEventLocation({
        state: apiData?.eventLocation?.state || "",
        city: apiData?.eventLocation?.city || "",
        area: apiData?.eventLocation?.area || "",
        serviceAreas: apiData?.eventLocation?.serviceAreas || [],
      });

      setRestaurant((prev) => ({
        ...prev,
        restaurantMenuType: apiData?.restaurant?.restaurantMenuType || [],
        restaurantImageUpload: apiData?.restaurant?.restaurantImageUpload || [],
        restaurantCovers: apiData?.restaurant?.restaurantCovers || "",
        restaurantFloor: apiData?.restaurant?.restaurantFloor || "",
        restaurantSwimmingPool:
          apiData?.restaurant?.restaurantSwimmingPool || "",
      }));

      setBankDetails((prev) => ({
        ...prev,
        bankName: apiData?.bankDetails?.bankName || "",
        bankAccountNumber: apiData?.bankDetails?.bankAccountNumber || "",
        ifsc: apiData?.bankDetails?.ifsc || "",
        pointOfContact: apiData?.bankDetails?.pointOfContact || "",
        email: apiData?.bankDetails?.email || "",
        phoneNumber: apiData?.bankDetails?.phoneNumber || "",
        billingAddress: apiData?.bankDetails?.billingAddress || "",
      }));

      setTransportLocation({
        state: apiData?.transportLocation?.state || "",
        city: apiData?.transportLocation?.city || "",
        travelLocal: apiData?.transportLocation?.travelLocal || false,
        travelOutStation: apiData?.transportLocation?.travelOutStation || false,
        serviceAreas: apiData?.transportLocation?.serviceAreas || [],
        carDetails: apiData?.transportLocation?.carDetails?.map((car: any) => ({
          carType: car.carType || "",
          numberOfCars: car.numberOfCars || 0,
          fourHr40Km: car.fourHr40Km || "",
          eightHr80Km: car.eightHr80Km || "",
          fullDay100Km: car.fullDay100Km || "",
          airportTransfer: car.airportTransfer || "",
        })) || [
            {
              carType: "",
              numberOfCars: 0,
              fourHr40Km: "",
              eightHr80Km: "",
              fullDay100Km: "",
              airportTransfer: "",
            },
          ],
      });

      setOtherDetails((prev) => ({
        ...prev,
        sourceOfSupply: apiData?.otherDetails?.sourceOfSupply || "",
        gstTreatment: apiData?.otherDetails?.gstTreatment || "",
        gstin: apiData?.otherDetails?.gstin || "",
        pan: apiData?.otherDetails?.pan || "",
        msmeRegistered: apiData?.otherDetails?.msmeRegistered || false,
        currency: apiData?.otherDetails?.currency || "",
        openingBalanceState: apiData?.otherDetails?.openingBalanceState || "",
        openingBalance: apiData?.otherDetails?.openingBalance || "",
        creditLimit: apiData?.otherDetails?.creditLimit || "",
        paymentTerms: apiData?.otherDetails?.paymentTerms || "",
        tds: apiData?.otherDetails?.tds || "",
        priceList: apiData?.otherDetails?.priceList || "",
        enablePortal: apiData?.otherDetails?.enablePortal || false,
        portalLanguage: apiData?.otherDetails?.portalLanguage || "",
        documents: apiData?.otherDetails?.documents || [],
        websiteUrl: apiData?.otherDetails?.websiteUrl || "",
        department: apiData?.otherDetails?.department || "",
        designation: apiData?.otherDetails?.designation || "",
        skype: apiData?.otherDetails?.skype || "",
        twitter: apiData?.otherDetails?.twitter || "",
        facebook: apiData?.otherDetails?.facebook || "",
      }));

      setContactPersons(
        apiData?.contactPersons || [
          {
            salutation: "",
            contactPersonFirstName: "",
            contactPersonLastName: "",
            contactPersonEmail: "",
            contactPersonWorkPhone: "",
            contactPersonMobilePhone: "",
            contactPersonMobile: "",
            contactPersonDesignation: "",
            contactPersonDepartment: "",
            contactPersonDateOfBirth: "",
            contactPersonAnniversary: "",
          },
        ]
      );
    }
  }, [vendorDataById]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = {
        vendor,
        contactPersons,
        billingAddress,
        shippingAddress,
        otherDetails,
        location,
        category,
        rooms,
        banquets,
        eventServices,
        eventLocation,
        transportLocation,
        restaurant,
        bankDetails,
        isBanquetDetailsVisible,
        isRestaurantDetailsVisible,
      };


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
          setLocation(location);
          setCategory(category);
          setRooms(rooms);
          setBanquets(banquets);
          setEventServices(eventServices);
          setEventLocation(eventLocation);
          setTransportLocation(transportLocation);
          setIsBanquetDetailsVisible(isBanquetDetailsVisible);
          setIsRestaurantDetailsVisible(isRestaurantDetailsVisible);
          setRestaurant(restaurant);
          setBankDetails(bankDetails);
          setOtherDetails(otherDetails);
          toastSuccess(res.message);
          navigate("/vendorList");
        }
      }
    } catch (error) {
      toastError(error);
    }

  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        roomCategory: "",
        numberOfRooms: 0,
        roomSize: "",
        roomImageUpload: [],
        prices: [{ roomType: "", roomPrice: "" }],
      },
    ]);
  };

  const handleAddBanquet = () => {
    setBanquets([
      ...banquets,
      {
        numberOfBanquests: "",
        banquetCategory: "",
        banquetSize: "",
        banquetImageUpload: [],
        banquetName: "",
        banquetSetup: "",
        banquetVegPrice: "",
        banquetNonVegPrice: "",
        banquetFloor: "",
        prefuntionAreaSize: "",
      },
    ]);
  };

  const handleAddPrice = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].prices.push({ roomType: "", roomPrice: "" });
    setRooms(newRooms);
  };

  const handleRemovePrice = (roomIndex: number, priceIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].prices = newRooms[roomIndex].prices.filter(
      (_, i) => i !== priceIndex
    );
    setRooms(newRooms);
  };

  const ImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    array: any[],
    setArray: React.Dispatch<React.SetStateAction<any[]>>,
    fieldName: "roomImageUpload" | "banquetImageUpload"
  ) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "application/vnd.ms-excel",
        ];
        if (!validTypes.includes(file.type)) {
          toastError(
            `${file.name} is not a valid file type (XLS, JPG, PNG only)`
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toastError(`${file.name} exceeds 10MB size limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const fileReaders: Promise<string>[] = validFiles.map((file) => {
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
            const newArray = [...array];
            newArray[index][fieldName] = [
              ...newArray[index][fieldName],
              ...base64Images,
            ];
            setArray(newArray);
            toastSuccess(`${validFiles.length} image(s) uploaded successfully`);
          })
          .catch((error) => {
            toastError("Error uploading images");
          });
      }
    }
  };

  const RemoveImage = (
    index: number,
    imageIndex: number,
    array: any[],
    setArray: React.Dispatch<React.SetStateAction<any[]>>,
    fieldName: "roomImageUpload" | "banquetImageUpload"
  ) => {
    const newArray = [...array];
    newArray[index][fieldName] = newArray[index][fieldName].filter(
      (_: any, i: any) => i !== imageIndex
    );
    setArray(newArray);
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

      const validFiles = newFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
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

  // const handleFileUpload = async () => {
  //   if (selectedFiles.length === 0) {
  //     toastError("Please select files to upload");
  //     return;
  //   }

  //   setUploading(true);
  //   try {
  //     const otherDetails = new FormData();
  //     selectedFiles.forEach((file, index) => {
  //       formData.append(`file${index}`, file);
  //     });

  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       toastSuccess("Files uploaded successfully");
  //       setSelectedFiles([]);
  //     } else {
  //       throw new Error("Upload failed");
  //     }
  //   } catch (error) {
  //     toastError("Error uploading files");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

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
    setImageState: React.Dispatch<React.SetStateAction<IOtherDetails>>
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
          setImageState((prev) => ({
            ...prev,
            documents: [...prev.documents, ...base64Images],
          }));
          toastSuccess(`${files.length} image(s) uploaded successfully`);
        })
        .catch((error) => {
          toastError("Error uploading images");
        });
    }
  };

  const handleImageUploadForRestaurant = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<IRestaurant>>
  ) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "application/vnd.ms-excel",
        ];
        if (!validTypes.includes(file.type)) {
          toastError(
            `${file.name} is not a valid file type (XLS, JPG, PNG only)`
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toastError(`${file.name} exceeds 10MB size limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const fileReaders: Promise<string>[] = validFiles.map(
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
            setImageState((prev) => ({
              ...prev,
              restaurantImageUpload: [
                ...prev.restaurantImageUpload, // Append new images instead of overwriting
                ...base64Images,
              ],
            }));
            toastSuccess(`${validFiles.length} image(s) uploaded successfully`);
          })
          .catch((error) => {
            toastError("Error uploading images");
          });
      }
    }
  };

  const handleRemoveImageForRestaurant = (
    imageIndex: number,
    setImageState: React.Dispatch<React.SetStateAction<IRestaurant>>
  ) => {
    setImageState((prev) => ({
      ...prev,
      restaurantImageUpload: prev.restaurantImageUpload.filter(
        (_, i) => i !== imageIndex
      ),
    }));
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
        contactPersonDesignation: "",
        contactPersonDepartment: "",
        contactPersonDateOfBirth: "",
        contactPersonAnniversary: "",
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

  const handleRoomDetailChange = (field: keyof IRoom, value: string) => {
    setRooms((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const categoryOptions = ["Banquet", "3 Star", "4 Star", "5 Star"];
  const floorOptions = ["1st", "2nd", "3rd", "4th"];
  const roomCategoryOptions = ["Deluxe Room (Head)", "Standard Room", "Suite"];
  const banquetSetupOptions = ["Theater", "Classroom", "Banquet", "U-Shape"];
  const pfaSizeOptions = [
    "Small (100 sq ft)",
    "Medium (200 sq ft)",
    "Large (300 sq ft)",
  ];
  const menuTypeOptions = ["Indian", "Continental", "Chinese", "Multi-Cuisine"];
  const numberOfBanquetsOptions = ["1", "2", "3", "4", "5"];

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

  const { mutateAsync: addVendor } = useAddVendor();

  const [hasBanquet, setHasBanquet] = useState(false);
  const [hasRestaurant, setHasRestaurant] = useState(false);

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


    <>
      <div className="min-h-screen m-[60px] bg-white">

        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-6">Add Vendor</h1>

          <div className=" mx-auto">
            <div className="mb-8">
              <div className="items-start ">
                <div className=" space-y-6 rounded-lg ">
                  {/* Primary Contact Section */}
                  <div className="bg-[#FAFAFA] border-[#D1D1D1] rounded-lg border grid lg:grid-cols-3  md:gap-[20px] md:grid-cols-1  p-[20px]">
                    <div className="flex flex-wrap h-[75px] ">
                      <div className="flex flex-col gap-[8px] lg:items-start sm:items-center ">
                        <div >
                          <span className="text-[14px] font-medium text-black">
                            Primary Contact:
                          </span>
                        </div>
                        <div>
                          <div className="flex-1  space-y-4">
                            <div className="flex gap-6">
                              <div className="flex-1 max-w-[200px]">
                                <select
                                  value={vendor.salutation}
                                  onChange={(e) =>
                                    setVendor({ ...vendor, salutation: e.target.value })
                                  }
                                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
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
                                  className="w-full border border-gray-300 bg-gray-50 rounded-md p-2 text-sm"
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
                                  className="w-full border border-gray-300 bg-gray-50 rounded-md p-2 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Company Name */}
                    <div className="flex flex-col lg:items-start gap-[8px] sm:width-[20px] md:items-center">
                      <span className="text-[14px] w-sm font-medium text-black ">
                        Company Name:
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={vendor.companyName}
                          onChange={(e) =>
                            setVendor({ ...vendor, companyName: e.target.value })
                          }
                          placeholder="Enter company name"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        Contact Name:
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={vendor.contactName}
                          onChange={(e) =>
                            setVendor({ ...vendor, contactName: e.target.value })
                          }
                          placeholder="Enter contact name"
                          className="w-full border bg-gray-50 border-gray-300 rounded-md p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-start gap-[8px] md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        Contact Owner:
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={vendor.contactOwner}
                          onChange={(e) =>
                            setVendor({ ...vendor, contactOwner: e.target.value })
                          }
                          placeholder="Enter contact owner"
                          className="w-full border bg-gray-50 border-gray-300 rounded-md p-2 text-sm"
                        />
                      </div>
                    </div>

                    {/* Display Name */}
                    <div className="flex flex-col gap-[8px] lg:items-start  md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        Display Name:
                      </span>
                      <div className="w-full">
                        {" "}
                        <select
                          value={vendor.displayName}
                          onChange={(e) =>
                            setVendor({ ...vendor, displayName: e.target.value })
                          }
                          className="w-full border bg-gray-50 border-gray-300 rounded-md p-2 text-sm "
                        >
                          <option value="">Select Display Name</option>
                          <option value="company">Company Name</option>
                          <option value="contact">Contact Name</option>
                        </select>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        Email Address:
                      </span>
                      <div className="w-full relative">
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
                            } bg-gray-50 rounded-md p-2 text-sm pl-10`}
                        />
                        <div className="absolute top-[9px] left-[6px] ">

                          <svg

                            className="w-[20px] h-[20px] text-[#abb1bc]"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Phone Numbers */}
                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <h1 className="text-[14px] font-medium text-black font-newbold">
                        Phone Number
                      </h1>
                      <div className="flex-1 flex gap-4">
                        <div className="relative w-full">
                          <input
                            type="tel"
                            value={vendor.landLine}
                            onChange={(e) =>
                              setVendor({
                                ...vendor,
                                landLine: e.target.value.replace(/\D/g, '').slice(0, 10), // only numbers, max 10 digits
                              })
                            }
                            placeholder="Work Phone"
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm pl-10"
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
                        <div className="relative w-full">
                          <input
                            type="tel"
                            value={vendor.phoneNumber}
                            onChange={(e) =>
                              setVendor({
                                ...vendor,
                                phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10), // only numbers, max 10 digits
                              })
                            }
                            placeholder="Mobile"
                            className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm pl-10"
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



                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        PAN Number:
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={vendor.panNumber}
                          onChange={(e) =>
                            setVendor({ ...vendor, panNumber: e.target.value })
                          }
                          placeholder="Enter PAN number"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        GST Number:
                      </span>
                      <div className="w-full">
                        <input
                          type="text"
                          value={vendor.gst}
                          onChange={(e) =>
                            setVendor({ ...vendor, gst: e.target.value })
                          }
                          placeholder="Enter GST number"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[8px] lg:items-start md:items-center">
                      <span className="text-[14px] font-medium text-black ">
                        Vendor Type:
                      </span>
                      <div className="w-full ">
                        <Select
                          isMulti
                          options={[
                            { value: "Hotel", label: "Hotel" },
                            { value: "Banquet", label: "Banquet" },
                            { value: "Event Companies", label: "Event Companies" },
                            {
                              value: "Transport Service",
                              label: "Transport Service",
                            },
                            { value: "Gifting", label: "Gifting" },
                          ]}
                          value={vendor.vendorType.map((type) => ({
                            value: type,
                            label: type,
                          }))}
                          onChange={(selectedOptions) => {
                            const newVendorTypes = selectedOptions
                              ? selectedOptions.map((option) => option.value)
                              : [];
                            setVendor({ ...vendor, vendorType: newVendorTypes });
                          }}
                          className=" bg-gray-50 basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select vendor types"
                          // styles={customStyles}
                          styles={customReactStylesSmall}
                        />
                      </div>
                    </div>
                  </div>

                  <div >
                    {vendor.vendorType.includes("Hotel") && (
                      <div className="grid gap-5">
                        <div className="bg-[#FAFAFA] border-[#D1D1D1] rounded-lg border p-[20px]">
                          <h2 className="font-bold text-lg mb-4">Location</h2>
                          <div className=" grid lg:grid-cols-2 sm:gap-[8px] sm:grid-cols-1  ">
                            <div>
                              <label className="text-[14px] sm:text-center inline-block lg:text-left font-medium text-black">State</label>
                              <input
                                type="text"
                                value={location.state}
                                onChange={(e) =>
                                  setLocation({
                                    ...location,
                                    state: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
                                placeholder="Enter state"
                              />
                            </div>
                            <div className="lg:items-start md:items-center">
                              <label className=" font-medium text-sm  text-black mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                value={location.city}
                                onChange={(e) =>
                                  setLocation({ ...location, city: e.target.value })
                                }
                                className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                                placeholder="Enter city"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-sm text-black mb-1">
                                Area
                              </label>
                              <input
                                type="text"
                                value={location.area}
                                onChange={(e) =>
                                  setLocation({ ...location, area: e.target.value })
                                }
                                className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                                placeholder="Enter area"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-sm text-black mb-1">
                                Address
                              </label>
                              <input
                                type="text"
                                value={location.address}
                                onChange={(e) =>
                                  setLocation({
                                    ...location,
                                    address: e.target.value,
                                  })
                                }
                                className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                                placeholder="Enter address"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#FAFAFA]  border-[#D1D1D1] rounded-lg border p-[20px]">
                          <h2 className="font-bold text-lg mb-4">Category</h2>
                          <div className="w-full">
                            <select
                              className="w-full border bg-gray-50 font-satoshiMedium border-gray-300 rounded-md p-2 text-sm"
                              value={category.categoryType}
                              onChange={(e) =>
                                setCategory({
                                  ...category,
                                  categoryType: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Category</option>
                              {categoryOptions.map((option) => (
                                <option key={option} value={option.toLowerCase()}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* {isRoomDetailsVisible && ( */}
                        {!isRoomDetailsVisible && (
                          <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                            <div className="flex justify-between items-center mb-6">
                              <h2 className="text-xl font-bold">Room Details </h2>
                              {/* <div>
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isRoomDetailsVisible}
                                    onChange={() => setIsRoomDetailsVisible(!isRoomDetailsVisible)}
                                    className="form-checkbox"
                                  />
                                  <span className="ml-2 text-sm">Do you have Rooms</span>
                                </label>
                              </div> */}
                            </div>

                            {/* new room details   */}


                            <div className=" bg-gray-50 rounded-lg mt-8 p-6 ">

                              {!isRoomDetailsVisible && (
                                <>
                                  {/* Number of Rooms Dropdown */}
                                  <div className="mb-6">
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Number Of Rooms
                                    </label>
                                    <select
                                      value={rooms.length}
                                      onChange={(e) => {
                                        const count = parseInt(e.target.value, 10);
                                        if (isNaN(count)) return;

                                        if (count > rooms.length) {
                                          setRooms(
                                            rooms.concat(
                                              Array.from({ length: count - rooms.length }, () => ({
                                                roomCategory: "",
                                                numberOfRooms: 0,
                                                roomSize: "",
                                                roomImageUpload: [],
                                                prices: [{ roomType: "", roomPrice: "" }],
                                              }))
                                            )
                                          );
                                        } else if (count < rooms.length) {
                                          setRooms(rooms.slice(0, count));
                                        }
                                      }}
                                      className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                    >
                                      {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {rooms.map((room, index) => (
                                    <div
                                      key={index}
                                      className="mb-8 bg-gray-50 pb-6 border-b border-gray-200"
                                    >
                                      <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-lg">{index + 1}. Room</h3>
                                        {index > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newRooms = rooms.filter((_, i) => i !== index);
                                              setRooms(newRooms);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left column - Room details */}
                                        <div>
                                          <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                              <label className="block text-sm font-medium text-black mb-2">
                                                Room Category
                                              </label>
                                              <select
                                                value={room.roomCategory}
                                                onChange={(e) => {
                                                  const newRooms = [...rooms];
                                                  newRooms[index].roomCategory = e.target.value;
                                                  setRooms(newRooms);
                                                }}
                                                className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                              >
                                                <option value="">Select Category</option>
                                                {categoryOptions.map((option) => (
                                                  <option key={option} value={option.toLowerCase()}>
                                                    {option}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>

                                            <div>
                                              <label className="block text-sm font-medium text-black mb-2">
                                                Number of Rooms
                                              </label>
                                              <input
                                                type="number"
                                                min={0} 
                                                placeholder="Enter number of rooms"
                                                value={room.numberOfRooms}
                                                onChange={(e) => {
                                                  const newRooms = [...rooms];
                                                  newRooms[index].numberOfRooms =
                                                    parseInt(e.target.value) || 0;
                                                  setRooms(newRooms);
                                                }}
                                                className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                              />
                                            </div>
                                          </div>

                                          <div className="mb-4">
                                            <label className="block text-sm font-medium text-black mb-2">
                                              Size (LXBXH)
                                            </label>
                                            <input
                                              type="number"
                                              min={0}
                                              placeholder="Enter size"
                                              value={room.roomSize}
                                              onChange={(e) => {
                                                const newRooms = [...rooms];
                                                newRooms[index].roomSize = e.target.value;
                                                setRooms(newRooms);
                                              }}
                                              className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                            />
                                          </div>

                                          {/* Price Details Section */}
                                          <div className="mt-6">
                                            <h3 className="text-sm font-medium text-black mb-3">
                                              Price Details
                                            </h3>
                                            {room.prices.map((price, priceIndex) => (
                                              <div
                                                key={priceIndex}
                                                className="grid grid-cols-2 gap-4 mb-4"
                                              >
                                                <div>
                                                  <select
                                                    value={price.roomType}
                                                    onChange={(e) => {
                                                      const newRooms = [...rooms];
                                                      newRooms[index].prices[priceIndex].roomType =
                                                        e.target.value;
                                                      setRooms(newRooms);
                                                    }}
                                                    className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                                  >
                                                    <option value="">Select Room Type</option>
                                                    {roomCategoryOptions.map((option) => (
                                                      <option key={option} value={option.toLowerCase()}>
                                                        {option}
                                                      </option>
                                                    ))}
                                                  </select>
                                                </div>

                                                <div className="flex">
                                                  <input
                                                    type="number"
                                                    min={0}
                                                    placeholder="Enter price"
                                                    value={price.roomPrice}
                                                    onChange={(e) => {
                                                      const newRooms = [...rooms];
                                                      newRooms[index].prices[priceIndex].roomPrice =
                                                        e.target.value;
                                                      setRooms(newRooms);
                                                    }}
                                                    className="border border-gray-300 bg-gray-50 p-2 rounded-l-md w-full"
                                                  />
                                                  <span className="inline-flex items-center border border-l-0 border-gray-300 bg-gray-100 px-3 rounded-r-md text-sm text-gray-500">
                                                    per night
                                                  </span>
                                                </div>
                                              </div>
                                            ))}

                                            <div className="flex items-center mt-2">
                                              {room.prices.length > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleRemovePrice(index, room.prices.length - 1)
                                                  }
                                                  className="text-red-500 hover:text-red-700 text-sm mr-4"
                                                >
                                                  Remove Price
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => handleAddPrice(index)}
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                              >
                                                Add Price
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Right column - Image upload */}
                                        <div>
                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full">
                                            <label className="block text-sm font-medium text-black mb-4">
                                              Upload image
                                            </label>

                                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 text-gray-400 mb-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                              </svg>
                                              <p className="text-sm text-gray-500 mb-2">
                                                Maximum upload file size 25 MB, allowed files XLS,JPG,PNG *
                                              </p>

                                              <input
                                                type="file"
                                                accept=".xls,.jpg,.png"
                                                multiple
                                                onChange={(e) =>
                                                  ImageUpload(e, index, rooms, setRooms, "roomImageUpload")
                                                }
                                                className="hidden bg-gray-50"
                                                id={`room-image-upload-${index}`}
                                              />
                                              <label
                                                htmlFor={`room-image-upload-${index}`}
                                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                                              >
                                                Upload Images
                                              </label>
                                            </div>

                                            {/* Display uploaded images */}
                                            {room.roomImageUpload.length > 0 && (
                                              <div className="grid grid-cols-2 gap-4">
                                                {room.roomImageUpload.map((image, imgIndex) => (
                                                  <div key={imgIndex} className="relative">
                                                    <img
                                                      src={
                                                        image.includes("base64")
                                                          ? image
                                                          : generateFilePath(image)
                                                      }
                                                      alt={`Room Image ${imgIndex + 1}`}
                                                      className="h-24 w-full object-cover rounded-md border border-gray-200"
                                                      onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                          "path/to/placeholder-image.jpg"; // Fallback image
                                                      }}
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        RemoveImage(
                                                          index,
                                                          imgIndex,
                                                          rooms,
                                                          setRooms,
                                                          "roomImageUpload"
                                                        )
                                                      }
                                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                                    >
                                                      X
                                                    </button>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="flex justify-end mt-4">
                                    <button
                                      type="button"
                                      onClick={handleAddRoom}
                                      className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md flex items-center"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                      Add Room
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Number of Rooms Dropdown */}




                          </div>
                        )}
                        {/* )} */}




                        {/* <div className="mb-4 mt-8">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={isBanquetDetailsVisible}
                              onChange={(e) =>
                                setIsBanquetDetailsVisible(e.target.checked)
                              }
                              className="form-checkbox"
                            />
                            <span className="ml-2">Do you have Banquet</span>
                          </label>
                        </div> */}

                        <div className="mb-4 mt-8">
                          {/* <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={isRestaurantDetailsVisible}
                            onChange={(e) =>
                              setIsRestaurantDetailsVisible(e.target.checked)
                            }
                            className="form-checkbox"
                          />
                          <span className="ml-2">Do you have Restaurant</span>
                        </label> */}

                          {isRestaurantDetailsVisible && (
                            <div className="border rounded-lg mt-8 p-6 shadow">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">
                                  Restaurant Details
                                </h2>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                {/* Menu Type (Multi-select Dropdown) */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Menu Type
                                  </label>
                                  <Select
                                    isMulti
                                    options={[
                                      { value: "veg", label: "Veg" },
                                      { value: "non-veg", label: "Non-Veg" },
                                    ]}
                                    value={restaurant.restaurantMenuType.map(
                                      (type) => ({
                                        value: type,
                                        label:
                                          type.charAt(0).toUpperCase() +
                                          type.slice(1),
                                      })
                                    )}
                                    onChange={(selectedOptions) => {
                                      const newMenuTypes = selectedOptions
                                        ? selectedOptions.map(
                                          (option) => option.value
                                        )
                                        : [];
                                      setRestaurant({
                                        ...restaurant,
                                        restaurantMenuType: newMenuTypes,
                                      });
                                    }}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Select menu types"
                                    styles={customReactStylesSmall}
                                  />
                                </div>

                                {/* Covers (Number of Occupancy) */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Covers (No. of Occupancy)
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="Enter number of covers"
                                    value={restaurant.restaurantCovers}
                                    onChange={(e) =>
                                      setRestaurant({
                                        ...restaurant,
                                        restaurantCovers: e.target.value,
                                      })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  />
                                </div>

                                {/* Floor Dropdown */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Floor
                                  </label>
                                  <select
                                    value={restaurant.restaurantFloor}
                                    onChange={(e) =>
                                      setRestaurant({
                                        ...restaurant,
                                        restaurantFloor: e.target.value,
                                      })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  >
                                    <option value="">Select Floor</option>
                                    {floorOptions.map((option) => (
                                      <option
                                        key={option}
                                        value={option.toLowerCase()}
                                      >
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Swimming Pool Dropdown */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Swimming Pool
                                  </label>
                                  <select
                                    value={restaurant.restaurantSwimmingPool}
                                    onChange={(e) =>
                                      setRestaurant({
                                        ...restaurant,
                                        restaurantSwimmingPool: e.target.value,
                                      })
                                    }
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  >
                                    <option value="">Select Option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                  </select>
                                </div>
                              </div>

                              {/* Image Upload Section */}
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Restaurant Images (XLS, JPG, PNG only, max 10MB)
                                </label>
                                <div className="flex items-center gap-4">
                                  <input
                                    type="file"
                                    accept=".xls,.jpg,.png"
                                    multiple
                                    onChange={(e) =>
                                      handleImageUploadForRestaurant(
                                        e,
                                        setRestaurant
                                      )
                                    }
                                    className="hidden"
                                    id="restaurant-image-upload"
                                  />
                                  <label
                                    htmlFor="restaurant-image-upload"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300"
                                  >
                                    Upload Images
                                  </label>
                                  <span className="text-sm text-gray-500">
                                    {restaurant.restaurantImageUpload.length}{" "}
                                    file(s) uploaded
                                  </span>
                                </div>

                                {/* Display uploaded images */}
                                {restaurant.restaurantImageUpload.length > 0 && (
                                  <div className="mt-4 flex flex-wrap gap-4">
                                    {restaurant.restaurantImageUpload.map(
                                      (image, imgIndex) => (
                                        <div key={imgIndex} className="relative">
                                          <img
                                            src={
                                              image.includes("base64")
                                                ? image
                                                : generateFilePath(image)
                                            }
                                            alt={`Restaurant Image ${imgIndex + 1}`}
                                            style={{
                                              height: 100,
                                              width: 100,
                                              objectFit: "cover",
                                              border: "1px solid #ddd",
                                              borderRadius: "5px",
                                            }}
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveImageForRestaurant(
                                                imgIndex,
                                                setRestaurant
                                              )
                                            }
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                          >
                                            X
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* {vendor.vendorType.includes("Banquet") && (
                      <div>
                        <div className="">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={isBanquetDetailsVisible}
                              onChange={(e) =>
                                setIsBanquetDetailsVisible(e.target.checked)
                              }
                              className="form-checkbox"
                            />
                            <span className="ml-2">Do you have Banquet</span>
                          </label>
                        </div>
                      </div>
                    )} */}

                    <div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={isBanquetDetailsVisible}
                          onChange={() => setIsBanquetDetailsVisible(!isBanquetDetailsVisible)}
                          className="form-checkbox"
                        />
                        <span className="ml-2 text-sm">Do you have Banquet</span>
                      </label>
                    </div>

                    {isBanquetDetailsVisible && (
                      <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold">Banquet Details</h2>
                        </div>

                        {/* Number of Banquets Dropdown */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-black mb-2">
                            Number Of Banquet
                          </label>
                          <select
                            value={banquets.length}
                            onChange={(e) => {
                              const count = parseInt(e.target.value, 10);
                              if (isNaN(count)) return;

                              if (count > banquets.length) {
                                setBanquets(banquets.concat(
                                  Array.from({ length: count - banquets.length }, () => ({
                                    numberOfBanquests: "",
                                    banquetCategory: "",
                                    banquetSize: "",
                                    banquetImageUpload: [],
                                    banquetName: "",
                                    banquetSetup: "",
                                    banquetVegPrice: "",
                                    banquetNonVegPrice: "",
                                    banquetFloor: "",
                                    prefuntionAreaSize: ""
                                  }))));
                              } else if (count < banquets.length) {
                                setBanquets(banquets.slice(0, count));
                              }
                            }}
                            className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>

                        {banquets.map((banquet, index) => (
                          <div key={index} className="mb-8 bg-gray-50 pb-6 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium text-lg">{index + 1}. Banquet</h3>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newBanquets = banquets.filter((_, i) => i !== index);
                                    setBanquets(newBanquets);
                                  }}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left column - Banquet details */}
                              <div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Category
                                    </label>
                                    <select
                                      value={banquet.banquetCategory}
                                      onChange={(e) => {
                                        const newBanquet = [...banquets];
                                        newBanquet[index].banquetCategory = e.target.value;
                                        setBanquets(newBanquet);
                                      }}
                                      className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                    >
                                      <option value="">Select category (Head)</option>
                                      {categoryOptions.map((option) => (
                                        <option key={option} value={option.toLowerCase()}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter banquet name"
                                      value={banquet.banquetName}
                                      onChange={(e) => {
                                        const newBanquet = [...banquets];
                                        newBanquet[index].banquetName = e.target.value;
                                        setBanquets(newBanquet);
                                      }}
                                      className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Size (LXBXH)
                                    </label>
                                    <input
                                      type="number"
                                      min={0}
                                      placeholder="To be discus development time"
                                      value={banquet.banquetSize}
                                      onChange={(e) => {
                                        const newBanquet = [...banquets];
                                        newBanquet[index].banquetSize = e.target.value;
                                        setBanquets(newBanquet);
                                      }}
                                      className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Setup
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter setup"
                                      value={banquet.banquetSetup}
                                      onChange={(e) => {
                                        const newBanquet = [...banquets];
                                        newBanquet[index].banquetSetup = e.target.value;
                                        setBanquets(newBanquet);
                                      }}
                                      className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Veg Price
                                    </label>
                                    <div className="flex">
                                      <input
                                        type="number"
                                        min={0}
                                        placeholder="Enter veg price"
                                        value={banquet.banquetVegPrice}
                                        onChange={(e) => {
                                          const newBanquet = [...banquets];
                                          newBanquet[index].banquetVegPrice = e.target.value;
                                          setBanquets(newBanquet);
                                        }}
                                        className="border border-gray-300 bg-gray-50 p-2 rounded-l-md w-full"
                                      />
                                      <span className="inline-flex items-center border border-l-0 border-gray-300 bg-gray-100 px-3 rounded-r-md text-sm text-gray-500">
                                        per plate
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Non Veg Price
                                    </label>
                                    <div className="flex">
                                      <input
                                        type="number"
                                        placeholder="Enter nonveg price"
                                        min={0}
                                        value={banquet.banquetNonVegPrice}
                                        onChange={(e) => {
                                          const newBanquet = [...banquets];
                                          newBanquet[index].banquetNonVegPrice = e.target.value;
                                          setBanquets(newBanquet);
                                        }}
                                        className="border border-gray-300 bg-gray-50 p-2 rounded-l-md w-full"
                                      />
                                      <span className="inline-flex items-center border border-l-0 border-gray-300 bg-gray-100 px-3 rounded-r-md text-sm text-gray-500">
                                        per plate
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-black mb-2">
                                    Floor
                                  </label>
                                  <select
                                    value={banquet.banquetFloor}
                                    onChange={(e) => {
                                      const newBanquet = [...banquets];
                                      newBanquet[index].banquetFloor = e.target.value;
                                      setBanquets(newBanquet);
                                    }}
                                    className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                  >
                                    <option value="">Select floor</option>
                                    {floorOptions.map((option) => (
                                      <option key={option} value={option.toLowerCase()}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="mt-6">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={isPrefunctionAreaVisible}
                                      onChange={() => setIsPrefunctionAreaVisible(!isPrefunctionAreaVisible)}
                                      className="form-checkbox"
                                    />
                                    <span className="ml-2 text-sm">Do you have PFA (prefunction area)</span>
                                  </label>

                                  {isPrefunctionAreaVisible && (
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-black mb-2">
                                        Size LXBXH
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="Enter Size"
                                        min={0}
                                        value={banquet.prefuntionAreaSize}
                                        onChange={(e) => {
                                          const newBanquet = [...banquets];
                                          newBanquet[index].prefuntionAreaSize = e.target.value;
                                          setBanquets(newBanquet);
                                        }}
                                        className="border border-gray-300 bg-gray-50 p-2 rounded-md w-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right column - Image upload */}
                              <div>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full">
                                  <label className="block text-sm font-medium text-black mb-4">
                                    Upload image
                                  </label>

                                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-sm text-gray-500 mb-2">Maximum upload file size 25 MB, allowed files XLS,JPG,PNG *</p>

                                    <input
                                      type="file"
                                      accept=".xls,.jpg,.png"
                                      multiple
                                      onChange={(e) => ImageUpload(e, index, banquets, setBanquets, "banquetImageUpload")}
                                      className="hidden bg-gray-50"
                                      id={`banquet-image-upload-${index}`}
                                    />
                                    <label
                                      htmlFor={`banquet-image-upload-${index}`}
                                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                                    >
                                      Upload Images
                                    </label>
                                  </div>

                                  {/* Display uploaded images */}
                                  {banquet.banquetImageUpload.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                      {banquet.banquetImageUpload.map((image, imgIndex) => (
                                        <div key={imgIndex} className="relative">
                                          <img
                                            src={image.includes("base64") ? image : generateFilePath(image)}
                                            alt={`Banquet Image ${imgIndex + 1}`}
                                            className="h-24 w-full object-cover rounded-md border border-gray-200"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => RemoveImage(index, imgIndex, banquets, setBanquets, "banquetImageUpload")}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                          >
                                            X
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-end mt-4">
                          <button
                            type="button"
                            onClick={handleAddBanquet}
                            className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Banquet
                          </button>
                        </div>
                      </div>
                    )}

                    {vendor.vendorType.includes("Event Companies") && (
                      <div>
                        {/* Services Section */}
                        <div className="mb-4 mt-8">
                          <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-lg font-bold">Event Services</h2>
                              <button
                                type="button"
                                onClick={() =>
                                  setEventServices([
                                    ...eventServices,
                                    { services: "", rate: "" },
                                  ])
                                }
                                className="bg-[#FAFAFA]  border hover:bg-[#EF611F] hover:text-white border-[#EF611F] text-[#EF611F] px-4 py-2 rounded-md"
                              >
                                Add Services
                              </button>
                            </div>

                            {eventServices.map((service, index) => (
                              <div
                                key={index}
                                className="mb-4 flex items-center gap-4"
                              >
                                {/* Services Dropdown */}
                                <div className="flex-1">
                                  <label className="block text-sm  font-semibold text-gray-700 mb-2">
                                    Services
                                  </label>
                                  <select
                                    value={service.services}
                                    onChange={(e) => {
                                      const newServices = [...eventServices];
                                      newServices[index].services = e.target.value;
                                      setEventServices(newServices);
                                    }}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                                  >
                                    <option value="">Select Service</option>
                                    <option value="catering">Catering</option>
                                    <option value="decoration">Decoration</option>
                                    <option value="photography">Photography</option>
                                    <option value="entertainment">
                                      Entertainment
                                    </option>
                                    <option value="venue">Venue</option>
                                  </select>
                                </div>

                                {/* Rate Input */}
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rate
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Enter rate"
                                    value={service.rate}
                                    onChange={(e) => {
                                      const newServices = [...eventServices];
                                      newServices[index].rate = e.target.value;
                                      setEventServices(newServices);
                                    }}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                                  />
                                </div>

                                {/* Remove Button */}
                                {eventServices.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newServices = eventServices.filter(
                                        (_, i) => i !== index
                                      );
                                      setEventServices(newServices);
                                    }}
                                    className="text-red-500 hover:text-red-700 mt-6"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Location Section */}
                        <div className="mb-4 mt-8">
                          <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                            <h2 className="text-lg font-bold mb-4">Location</h2>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-black mb-1">
                                  State
                                </label>
                                <input
                                  type="text"
                                  value={eventLocation.state}
                                  onChange={(e) =>
                                    setEventLocation({
                                      ...eventLocation,
                                      state: e.target.value,
                                    })
                                  }
                                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                                  placeholder="Enter state"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-black mb-1">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={eventLocation.city}
                                  onChange={(e) =>
                                    setEventLocation({
                                      ...eventLocation,
                                      city: e.target.value,
                                    })
                                  }
                                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                                  placeholder="Enter city"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-black mb-1">
                                  Area
                                </label>
                                <input
                                  type="text"
                                  value={eventLocation.area}
                                  onChange={(e) =>
                                    setEventLocation({
                                      ...eventLocation,
                                      area: e.target.value,
                                    })
                                  }
                                  className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                                  placeholder="Enter area"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-black mb-2">
                                  Service Areas
                                </label>
                                <Select
                                  isMulti
                                  options={stateOptions}
                                  value={eventLocation.serviceAreas.map((area) => ({
                                    value: area,
                                    label:
                                      stateOptions.find((opt) => opt.value === area)
                                        ?.label || area,
                                  }))}
                                  onChange={(selectedOptions) => {
                                    const newServiceAreas = selectedOptions
                                      ? selectedOptions.map(
                                        (option) => option.value
                                      )
                                      : [];
                                    setEventLocation({
                                      ...eventLocation,
                                      serviceAreas: newServiceAreas,
                                    });
                                  }}
                                  className="basic-multi-select"
                                  classNamePrefix=" select"
                                  placeholder="Select service areas"
                                  styles={customReactStylesSmall}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {vendor.vendorType.includes("Transport Service") && (
                      <div className="mb-4 mt-8">
                        <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                          <h2 className="text-lg font-bold mb-4">
                            Location Details
                          </h2>
                          <div className="grid grid-cols-2 gap-6">
                            {/* State Dropdown */}
                            <div>
                              <label className="block font-semibold text-sm text-black mb-2">
                                State
                              </label>
                              <select
                                value={transportLocation.state}
                                onChange={(e) =>
                                  setTransportLocation({
                                    ...transportLocation,
                                    state: e.target.value,
                                  })
                                }
                                className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                {stateOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* City Dropdown */}
                            <div>
                              <label className="block text-sm font-semibold text-black mb-2">
                                City
                              </label>
                              <select
                                value={transportLocation.city}
                                onChange={(e) =>
                                  setTransportLocation({
                                    ...transportLocation,
                                    city: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 bg-gray-50 rounded-md p-2 text-sm"
                              >
                                <option value="">Select City</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                                <option value="chennai">Chennai</option>
                                <option value="kolkata">Kolkata</option>
                              </select>
                            </div>

                            {/* How do you travel Checkboxes */}
                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-black mb-2">
                                How do you travel?
                              </label>
                              <div className="flex gap-6">
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={transportLocation.travelLocal}
                                    onChange={(e) =>
                                      setTransportLocation({
                                        ...transportLocation,
                                        travelLocal: e.target.checked,
                                      })
                                    }
                                    className="form-checkbox"
                                  />
                                  <span className="ml-2">Local</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={transportLocation.travelOutStation}
                                    onChange={(e) =>
                                      setTransportLocation({
                                        ...transportLocation,
                                        travelOutStation: e.target.checked,
                                      })
                                    }
                                    className="form-checkbox"
                                  />
                                  <span className="ml-2">Out-station</span>
                                </label>
                              </div>
                            </div>

                            {/* Service Areas Multi-Select */}
                            <div className="col-span-2">
                              <label className="block text-sm font-semibold text-black mb-2">
                                Service Areas
                              </label>
                              <Select
                                isMulti
                                options={stateOptions}
                                value={transportLocation.serviceAreas.map(
                                  (area) => ({
                                    value: area,
                                    label:
                                      stateOptions.find((opt) => opt.value === area)
                                        ?.label || area,
                                  })
                                )}
                                onChange={(selectedOptions) => {
                                  const newServiceAreas = selectedOptions
                                    ? selectedOptions.map((option) => option.value)
                                    : [];
                                  setTransportLocation({
                                    ...transportLocation,
                                    serviceAreas: newServiceAreas,
                                  });
                                }}
                                className=" basic-multi-select bg-gray-50"
                                classNamePrefix="select"
                                placeholder="Select service areas"
                                styles={customReactStylesSmall}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Car Details Block */}
                  {(transportLocation.travelLocal ||
                    transportLocation.travelOutStation) && (
                      <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Car Details</h2>
                            <button
                              type="button"
                              onClick={() =>
                                setTransportLocation({
                                  ...transportLocation,
                                  carDetails: [
                                    ...transportLocation.carDetails,
                                    {
                                      carType: "",
                                      numberOfCars: 0,
                                      fourHr40Km: "",
                                      eightHr80Km: "",
                                      fullDay100Km: "",
                                      airportTransfer: "",
                                    },
                                  ],
                                })
                              }
                              className="bg-[#FAFAFA]  border hover:bg-[#EF611F] hover:text-white border-[#EF611F] text-[#EF611F] px-4 py-2 rounded-md"
                            >
                              Add Car
                            </button>
                          </div>

                          {transportLocation.carDetails.map((car, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 mb-4"
                            >
                              {/* Car Type Dropdown */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Car Type
                                </label>
                                <select
                                  value={car.carType}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].carType = e.target.value;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                >
                                  <option value="">Select Car Type</option>
                                  <option value="sedan">Sedan</option>
                                  <option value="suv">SUV</option>
                                  <option value="van">Van</option>
                                  <option value="luxury">Luxury</option>
                                </select>
                              </div>

                              {/* Number of Cars Input */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  No. of Cars
                                </label>
                                <input
                                  type="number"
                                  value={car.numberOfCars}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].numberOfCars =
                                      parseInt(e.target.value) || 0;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  placeholder="No. of Cars"
                                />
                              </div>

                              {/* 4hr 40km Input */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  4hr 40km
                                </label>
                                <input
                                  type="text"
                                  value={car.fourHr40Km}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].fourHr40Km =
                                      e.target.value;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  placeholder="4hr 40km Rate"
                                />
                              </div>

                              {/* 8hr 80km Input */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  8hr 80km
                                </label>
                                <input
                                  type="text"
                                  value={car.eightHr80Km}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].eightHr80Km =
                                      e.target.value;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  placeholder="8hr 80km Rate"
                                />
                              </div>

                              {/* Full Day 100km Input */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Full Day 100km
                                </label>
                                <input
                                  type="text"
                                  value={car.fullDay100Km}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].fullDay100Km =
                                      e.target.value;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  placeholder="Full Day 100km Rate"
                                />
                              </div>

                              {/* Airport Transfer Input */}
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Airport Transfer
                                </label>
                                <input
                                  type="text"
                                  value={car.airportTransfer}
                                  onChange={(e) => {
                                    const newCarDetails = [
                                      ...transportLocation.carDetails,
                                    ];
                                    newCarDetails[index].airportTransfer =
                                      e.target.value;
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                  placeholder="Airport Transfer Rate"
                                />
                              </div>

                              {/* Remove Button */}
                              {transportLocation.carDetails.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCarDetails =
                                      transportLocation.carDetails.filter(
                                        (_, i) => i !== index
                                      );
                                    setTransportLocation({
                                      ...transportLocation,
                                      carDetails: newCarDetails,
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 mt-6"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* bANK dETAILS */}


                  <div className="border rounded-lg mt-8 p-6 shadow bg-gray-50">
                    <h2 className="text-lg font-semibold mb-4">Bank Details</h2>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={bankDetails.bankName}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankName: e.target.value,
                            })
                          }
                          placeholder="Bank Name"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Bank Account Number
                        </label>
                        <input
                          type="number"
                          name="bankAccountNumber"
                          value={bankDetails.bankAccountNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              bankAccountNumber: e.target.value,
                            })
                          }
                          placeholder="Bank Account Number"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          name="ifsc"
                          value={bankDetails.ifsc}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              ifsc: e.target.value,
                            })
                          }
                          placeholder="IFSC Code"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Point of Contact
                        </label>
                        <input
                          type="text"
                          name="pointOfContact"
                          value={bankDetails.pointOfContact}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              pointOfContact: e.target.value,
                            })
                          }
                          placeholder="Point of Contact"
                          className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={bankDetails.email}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              email: e.target.value,
                            })
                          }
                          placeholder="Email"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={bankDetails.phoneNumber}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              phoneNumber: e.target.value,
                            })
                          }
                          placeholder="Phone Number"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-black mb-2">
                          Billing Address
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={bankDetails.billingAddress}
                          onChange={(e) =>
                            setBankDetails({
                              ...bankDetails,
                              billingAddress: e.target.value,
                            })
                          }
                          placeholder="Billing Address"
                          className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    </div>
                  </div>


                  {/* Tab Menu */}
                  <div className="mt-8 p-3">
                    <div className="border border-gray-400 bg-gray-50 ">
                      <nav className="flex space-x-8 mt-5 ml-2  ">
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
                    <div className="p-6 bg-gray-50 border border-gray-300">
                      {activeTab === "Other Details" && (
                        <div className="grid grid-cols-4 gap-6">
                          {/* GST Treatment */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6">
                              <span className="text-base font-medium text-gray-700 mt-2">
                                GST Treatment:
                              </span>
                              <div className="w-full mt-2 ml-8">
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
                              <div className="w-full ml-20">
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
                              <div className="w-full ml-4">
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
                              <div className="w-full ml-24">
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
                            <div className="w-full ml-16">
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
                            <div className="w-full">
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
                            <div className="w-full ml-4">
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
                            <div className="w-full ml-24">
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
                            <div className="w-full ml-16">
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
                            <div className="w-full ml-2">
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

                                      setSelectedFiles((prev) => [
                                        ...prev,
                                        ...validFiles,
                                      ]);
                                      handleImageUpload(e, setOtherDetails);
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {selectedFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm relative"
                                    >
                                      {file.type === "application/pdf" ? (
                                        <svg
                                          className="w-6 h-6 text-red-500 mr-2"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0013.414 5L10 2.586A2 2 0 008.586 2H6z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt="preview"
                                          className="w-10 h-10 object-cover rounded mr-2"
                                        />
                                      )}
                                      <span className="text-sm text-gray-700 flex-1 truncate">
                                        {file.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(index)}
                                        className="text-red-500 hover:text-red-700 absolute top-1 right-1"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {otherDetails.documents?.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Uploaded Files:
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {otherDetails.documents.map((doc, index) => (
                                    <div
                                      key={index}
                                      className="relative flex flex-col items-center bg-white shadow-sm p-3 rounded-lg border"
                                    >
                                      {doc.includes(".pdf") ? (
                                        <svg
                                          className="w-10 h-10 text-red-500 mb-2"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0013.414 5L10 2.586A2 2 0 008.586 2H6z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      ) : (
                                        <img
                                          src={generateFilePath(doc)}
                                          alt="uploaded"
                                          className="w-16 h-16 object-cover rounded"
                                        />
                                      )}
                                      <a
                                        href={
                                          doc.includes("base64")
                                            ? doc
                                            : generateFilePath(doc)
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline text-sm mt-2"
                                      >
                                        {doc.includes(".pdf")
                                          ? "View PDF"
                                          : "View Image"}
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newDocuments = [
                                            ...otherDetails.documents,
                                          ];
                                          newDocuments.splice(index, 1);
                                          setOtherDetails({
                                            ...otherDetails,
                                            documents: newDocuments,
                                          });
                                          toastSuccess(
                                            "Document removed successfully"
                                          );
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
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
                                <div className="space-y-8 w-[400px]">
                                  {/* Website URL */}
                                  <div className="flex items-center ">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                                  <div className="flex items-center ">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                                  <div className="flex items-center ">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                                  <div className="flex items-center ">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                                  <div className="flex items-center ">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                                  <div className="flex items-center">
                                    <label
                                      className="w-[200px] text-base font-medium text-gray-700"
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
                              value={otherDetails.attention}
                              onChange={(e) =>
                                setotherDetails({
                                  ...otherDetails,
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
                                value={otherDetails.countryRegion}
                                onChange={(e) =>
                                  setotherDetails({
                                    ...otherDetails,
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
                                  defaultValue={{
                                    value: "IN - India",
                                    label: "IN - India",
                                  }}
                                  value={
                                    countryOptions.find(
                                      (option) =>
                                        option.value ===
                                        billingAddress.billingCountry
                                    ) || {
                                      value: "IN - India",
                                      label: "IN - India",
                                    }
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
                                      label="Country"
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
                                value={otherDetails.state}
                                onChange={(e) =>
                                  setotherDetails({
                                    ...otherDetails,
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
                                      label="Enter State"
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
                                      billingPincode: e.target.value.replace(/\D/g, '').slice(0, 7),
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
                                  value={billingAddress.billingPincode}
                                  onChange={(e) =>
                                    setBillingAddress({
                                      ...billingAddress,
                                      billingPincode: e.target.value.replace(/\D/g, '').slice(0, 10), // only digits, max 10
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
                                  type="number"
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
                              value={otherDetails.shippingAttention}
                              onChange={(e) =>
                                setotherDetails({
                                  ...otherDetails,
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
                                <Autocomplete
                                  disablePortal
                                  options={countryOptions}
                                  defaultValue={{
                                    value: "IN - India",
                                    label: "IN - India",
                                  }}
                                  value={
                                    countryOptions.find(
                                      (option) =>
                                        option.value ===
                                        shippingAddress.shippingCountry
                                    ) || {
                                      value: "IN - India",
                                      label: "IN - India",
                                    }
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
                                      label="Enter Country/Region"
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
                                      label="Enter State"
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
                                      shippingPincode: e.target.value.replace(/\D/g, '').slice(0, 7),
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
                                      shippingPhone: e.target.value.replace(/\D/g, '').slice(0, 10), // only digits, max 10
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
                                  type="number"
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
                                    Department
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Designation
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Date of Birth
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                    Anniversary Date
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
                                className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md flex items-center"
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
                onClick={populateDemoData}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Populate Demo Data
              </button>
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

          </div>
        </form>
      </div>
    </ >

  );
};

export default AddVendorForm;