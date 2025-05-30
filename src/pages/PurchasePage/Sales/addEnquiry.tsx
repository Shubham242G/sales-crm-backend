"use client";

import { toastError, toastSuccess } from "@/utils/toast";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddEnquiry,
  useEnquiryById,
  useUpdateEnquiryById,
} from "@/services/enquiry.service";
import moment from "moment";
import Select from "react-select";
import type { ReactSelectFormat } from "@/services/urls.service";
import { Autocomplete, TextField } from "@mui/material";
import { checkPermissionsForButtons } from "@/utils/permission";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css"; // Default styling
import { format } from "date-fns";
import { useUserName } from "@/services/user.service";
import {
  useZohoCustomerById,
  useZohoCustomers,
} from "@/services/customer.service";
import { SiReactquery } from "react-icons/si";
import { getEffectiveConstraintOfTypeParameter } from "typescript";

interface Products {
  id: number,
  particular: string,
  area: number,
  qty: number,
  days: number,
  rate: number,
  amount: number,
  height: number,
  width: number,
  size: string,
}

interface Room {
  date: string;
  roomCategory: string;
  occupancy: string;
  mealPlan: string[];
  noOfRooms: string;
}

interface Banquet {
  date: string;
  session: string[];
  seatingStyle: string;
  avSetup: string;
  menuType: string;
  minPax: string;
  seatingRequired: string;
}

interface Cab {
  date: string;
  fromCity?: string;
  toCity?: string;
  noOfVehicles: string;
  vehicleType: string;
  tripType: string;
}

interface EventDates {
  startDate: "";
  endDate: "";
}
//eventStartdate to be removed
interface EventSetup {
  functionType: string;
  setupRequired: string;
  eventDates: { startDate: string; endDate: string }[];
  eventStartDate: string;
  eventEndDate: string;
  // FabricationItem: FabricationItem[]
  //ExhibitionItem: ExhibitionItem[]
}

interface FabricationItem {
  particular: string;
  size?: string;
  area?: number;
  quantity?: number;
  days?: number | string;
  rate?: string;
  amount: string;
}

const fabricationData: FabricationItem[] = [
  {
    particular: "Welcome Banner on Road",
    size: "20ft (Width) x 10ft (Height)",
    area: 200,
    quantity: 4,
    days: "-",
    rate: "₹70.00",
    amount: "₹56,000.00",
  },
  {
    particular: "Signages on Road Side",
    size: "4ft (Width) x 6ft (Height)",
    area: 24,
    quantity: 10,
    days: "-",
    rate: "₹100.00",
    amount: "₹24,000.00",
  },
  {
    particular: "Welcome Banner at Entry",
    size: "20ft (Width) x 10ft (Height)",
    area: 200,
    quantity: 2,
    days: "-",
    rate: "₹100.00",
    amount: "₹40,000.00",
  },
  {
    particular: "Entry Gate",
    area: 1,
    quantity: 1,
    days: "-",
    rate: "₹25,000.00",
    amount: "₹25,000.00",
  },
  {
    particular: "Cubical for Welcome Branding",
    quantity: 20,
    rate: "₹1,000.00",
    amount: "₹20,000.00",
  },
  {
    particular: "Creative Standees for Signages & Branding",
    size: "3ft (Width) x 6ft (Height)",
    area: 18,
    quantity: 40,
    rate: "₹100.00",
    amount: "₹72,000.00",
  },
  {
    particular: "Registration Area Truss Structure",
    size: "200ft (Width) x 30ft (Depth)",
    area: 6000,
    rate: "₹90.00",
    amount: "₹540,000.00",
  },
  {
    particular: "Registration Area Wall Masking",
    size: "200ft (Width) x 10ft (Depth)",
    area: 2000,
    rate: "₹40.00",
    amount: "₹80,000.00",
  },
  {
    particular: "Platform with Printed Carpet",
    size: "200ft (Width) x 40ft (Depth)",
    area: 8000,
    rate: "₹40.00",
    amount: "₹320,000.00",
  },
  {
    particular: "Registration Backdrop",
    size: "30ft (Width) x 10ft (Height)",
    area: 300,
    rate: "₹70.00",
    amount: "₹21,000.00",
  },
  {
    particular: "Registration Window with Vinyl Printing",
    quantity: 12,
    rate: "₹4,000.00",
    amount: "₹48,000.00",
  },
  {
    particular: "Selfie Booth with Letter Cutout",
    quantity: 3,
    rate: "₹30,000.00",
    amount: "₹90,000.00",
  },
];

const exhibitionData: ExhibitionItem[] = [
  {
    particular:
      "Octonurm Stalls with General Carpet, 1 Table, 2 Chairs, 3 Spotlight, 1 Dustbin, 1 Plug Point (One Time Cost Only; Days are mentioned just for reference)",
    size: "3mtr x 3 mtrs",
    area: 1,
    quantity: 150,
    days: 2,
    rate: "₹5,500.00",
    amount: "₹8,25,000.00",
  },
  {
    particular: "Entry Gate",
    quantity: 2,
    days: 1,
    rate: "₹15,000.00",
    amount: "₹30,000.00",
  },
  {
    particular: "Signages & Exhibition Map",
    size: "20ft (Width) x 10ft (Height)",
    area: 200,
    quantity: 1,
    days: 1,
    rate: "₹70.00",
    amount: "₹14,000.00",
  },
  {
    particular: "General Carpet (Printed)",
    area: 2000,
    rate: "₹15.00",
    amount: "₹30,000.00",
  },
  {
    particular: "Cocktail Tables",
    quantity: 20,
    rate: "₹1,000.00",
    amount: "₹20,000.00",
  },
  {
    particular: "Genset 125 KVA",
    quantity: 2,
    days: 4,
    rate: "₹15,000.00",
    amount: "₹1,20,000.00",
  },
  {
    particular: "Diesel for Genset (12 Hours x 6 Days x 2)",
    quantity: 24,
    days: 4,
    rate: "₹1,800.00",
    amount: "₹1,72,800.00",
  },
  {
    particular: "Electrication & Cabling",
    quantity: 1,
    days: 1,
    rate: "₹50,000.00",
    amount: "₹50,000.00",
  },
];



interface Item {
  particular: string;
  size: string;
  area: number;
  quantity: number;
  days: number;
  rate: number;
  amount: number;
}

interface Section {
  items: Item[];
  total: number;
}

interface EventData {
  fabrication: Section;
  exhibition: Section;
  conferenceAV: Section;
}

const eventData: EventData = {
  fabrication: {
    items: [
      {
        particular: "LED P3",
        size: "14ft (Width) x 7ft (Height)",
        area: 98,
        quantity: 1,
        days: 2,
        rate: 150.0,
        amount: 29400.0,
      },
      {
        particular: "PA System JBL VRX 1 Pair",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 15000.0,
        amount: 30000.0,
      },
      {
        particular: "Podium Mic",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 650.0,
        amount: 1300.0,
      },
      {
        particular: "Collar Mic",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 650.0,
        amount: 1300.0,
      },
      {
        particular: "Cordless MIC",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 650.0,
        amount: 1300.0,
      },
      {
        particular: "HD Camera with Cameraman",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 12000.0,
        amount: 24000.0,
      },
      {
        particular: "Photographer",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 7000.0,
        amount: 14000.0,
      },
      {
        particular: "Live Switcher",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 3000.0,
        amount: 6000.0,
      },
      {
        particular: "HDMI Splitter",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 3000.0,
        amount: 6000.0,
      },
      {
        particular: "Laptops",
        size: "",
        area: 0,
        quantity: 3,
        days: 2,
        rate: 1200.0,
        amount: 7200.0,
      },
    ],
    total: 123100.0,
  },
  exhibition: {
    items: [
      {
        particular: "Touch Screen Plasma TV 65 inch",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 8000.0,
        amount: 16000.0,
      },
      {
        particular: "Server & Networking for Central Loading",
        size: "",
        area: 0,
        quantity: 1,
        days: 2,
        rate: 15000.0,
        amount: 30000.0,
      },
    ],
    total: 190000.0,
  },
  conferenceAV: {
    items: [
      {
        particular: "Preview Room Setup & LAN Connection",
        size: "",
        area: 0,
        quantity: 1,
        days: 3,
        rate: 30000.0,
        amount: 90000.0,
      },
      {
        particular: "Laptops & Manpower for Preview Room",
        size: "",
        area: 0,
        quantity: 5,
        days: 3,
        rate: 5000.0,
        amount: 75000.0,
      },
      {
        particular: "Genset 125KVA",
        size: "",
        area: 0,
        quantity: 1,
        days: 3,
        rate: 15000.0,
        amount: 45000.0,
      },
      {
        particular: "Diesel for Genset (Approx.)",
        size: "",
        area: 0,
        quantity: 1,
        days: 3,
        rate: 5000.0,
        amount: 15000.0,
      },
    ],
    total: 225000.0,
  },
};

interface ExhibitionItem {
  particular: string;
  size?: string;
  area?: number;
  quantity?: number;
  days?: number | string;
  rate: string;
  amount: string;
}

interface AirTickets {
  tripType: string;
  numberOfPassengers: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string;
  multiFromCity: string;
  multiToCity: string;
  multiDepartureDate: string;
}

const AddEnquiryForm = () => {
  const [nameObj, setNameObj] = useState<ReactSelectFormat | null>(null);

  const { canView, canUpdate, canCreate } =
    checkPermissionsForButtons("Enquiry");

  const { id } = useParams();

  const [productsArray, setProductsArray] = useState<Products[]>([{
    id: 1,
    particular: "Welcome Banner on Road",
    area: 200,
    qty: 4,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "20ft (Width)x10ft (Height)"
  },
  {
    id: 2,
    particular: "Signages on Road Side",
    area: 24,
    qty: 10,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "4ft (Width)x6ft (Height)"
  },
  {
    id: 3,
    particular: "Welcome Banner at Entry",
    area: 200,
    qty: 2,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "20ft (Width)x10ft (Height)"
  },
  {
    id: 4,
    particular: "Entry Gate",
    area: 1,
    qty: 1,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "-"
  },
  {
    id: 5,
    particular: "Cubical for Welcome Branding",
    area: 1,
    qty: 20,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "-"
  },
  {
    id: 6,
    particular: "Creative Standees for Signages & Branding",
    area: 18,
    qty: 40,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "3ft (Width)x6ft (Height)"
  },
  {
    id: 7,
    particular: "Registration Area Truss Structure",
    area: 6000,
    qty: 1,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "200ft (Width)x30ft (Depth)"
  },
  {
    id: 8,
    particular: "Registration Area Wall Masking",
    area: 2000,
    qty: 1,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "200ft (Width)x10ft (Depth)"
  },
  {
    id: 9,
    particular: "Platform with Printed Carpet",
    area: 8000,
    qty: 1,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "200ft (Width)x40ft (Depth)"
  },
  {
    id: 10,
    particular: "Registration Backdrop",
    area: 300,
    qty: 1,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "30ft (Width)x10ft (Height)"
  },
  {
    id: 11,
    particular: "Registration Window with Vinyl Printing",
    area: 1,
    qty: 12,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "-"
  },
  {
    id: 12,
    particular: "Selfie Booth with Letter Cutout",
    area: 1,
    qty: 3,
    days: 0,
    rate: 0,
    amount: 0,
    height: 0,
    width: 0,
    size: "-"
  }
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleToggleItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };


  const handleRateChange = (itemId: number, newRate: number) => {
    setProductsArray(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, rate: isNaN(newRate) ? 0 : newRate }
          : item
      )
    );
  };

  const handleQtyChange = (itemId: number, newQty: number) => {
    setProductsArray(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, qty: isNaN(newQty) ? 0 : newQty }
          : item
      )
    );
  };

  const calculateSelectedTotal = () => {
    return productsArray
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.rate * item.qty), 0);
  };

  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [lastName, setLastName] = useState("");
  const [salutation, setSalutation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [levelOfEnquiry, setLevelOfEnquiry] = useState("");
  const [othersPreference, setOthersPreference] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [categoryOfHotel, setCategoryOfHotel] = useState<string[]>([]);
  const hotelCategoryOptions = [
    { value: "budget", label: "Budget" },
    { value: "midrange", label: "Mid-Range" },
    { value: "luxury", label: "Luxury" },
    { value: "boutique", label: "Boutique" },
    { value: "business", label: "Business" },
    { value: "resort", label: "Resort" },
  ];

  const salutationOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
  ];

  const [occupancy, setOccupancy] = useState<string[]>([]);
  // const occupancyOptions = [
  //   { value: "single occupancy", label: "Single Occupancy" },
  //   { value: "double occupancy", label: "Double Occupancy" },
  //   { value: "extra bed", label: "Extra Bed" },
  // ]
  const [approxPassengers, setApproxPassengers] = useState("");
  // const [hotelPreferences, setHotelPreferences] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [noOfRooms, setNoOfRooms] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [banquetDate, setBanquetDate] = useState("");
  const [banquetTime, setBanquetTime] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [needCab, setNeedCab] = useState(false);
  // const [categoryOfHotel, setCategoryOfHotel] = useState([]);
  // const [occupancy, setOccupancy] = useState([]);
  const [billingInstructions, setBillingInstructions] = useState("");

  const [room, setRoom] = useState<Room[]>([]);
  const [banquet, setBanquet] = useState<Banquet[]>([]);
  const [cab, setCab] = useState<Cab[]>([]);
  const [isOutOfStation, setIsOutOfStation] = useState(false);
  // const [selectName, setSelectName] = useState('');

  const { mutateAsync: addEnquiry } = useAddEnquiry();
  const { mutateAsync: updateEnquiryById } = useUpdateEnquiryById();
  const { data: userNames } = useUserName();
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const [customerId, setCustomerId] = useState("");
  const { data: Customer } = useZohoCustomers(searchObj);
  const { data: CustomerById } = useZohoCustomerById(customerId || "");

  const handleSessionChange = (index: number, values: string[]) => {
    setBanquet((prev: any) =>
      prev.map((row: any, i: any) =>
        i === index ? { ...row, session: values } : row
      )
    );
  };

  const sessionOptions = [
    { value: "Hi Tea", label: "Hi Tea" },
    { value: "AMT/Lunch/PMT", label: "AMT/Lunch/PMT" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Rental only", label: "Rental only" },
  ];

  banquet.forEach((item: any, index) => {
    if (typeof item.session === "string") {
      banquet[index].session = item.session
        .split(",")
        .map((s: any) => s.trim());
    }
  });

  console.log(Customer, "check customer value in ENquiry Form ");
  // const { data: contact } = useContact({ pageIndex: 0 });

  // const { data: contactById } = useContactById(nameObj?.value || "");

  // useEffect(() => {
  //   if (contactById?.data) {
  //     setPhone(contactById?.data?.phone);
  //     setEmail(contactById?.data?.email);
  //     console.log(nameObj, "<----nameObj");
  //   }
  // }, [contactById?.data]);
  const mealPlanOptions = [
    "Breakfast Only",
    "Half Board",
    "Full Board",
    "All Inclusive",
  ];

  const [eventSetup, setEventSetup] = useState<EventSetup>({
    functionType: "",
    setupRequired: "",
    eventDates: [
      {
        startDate: "",
        endDate: "",
      },
    ],
    eventStartDate: "",
    eventEndDate: "",
  });

  const handleRemoveDate = (indexToRemove: number) => {
    setEventSetup(prev => ({
      ...prev,
      eventDates: prev.eventDates.filter((_, index) => index !== indexToRemove)
    }));
  };

  const [airTickets, setAirTickets] = useState<AirTickets>({
    tripType: "",
    numberOfPassengers: "",
    fromCity: "",
    toCity: "",
    departureDate: "",
    returnDate: "",
    multiDepartureDate: "",
    multiFromCity: "",
    multiToCity: "",
  });

  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: "2px solid #e5e7eb !important",
      boxShadow: "0 !important",
      color: "#000",
      padding: "5px",
      fontFamily: "satoshi, sans-serif",
      backgroundColor: "#fafafa",
      zindex: "9",
      minHeight: "30px",
      "&:hover": {
        border: "1px solid #e5e7eb !important",
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
      zindex: "9", // this was the mistake (I needed to remove this)
      "&:hover": {
        backgroundColor: "#687256",
        color: "#fff",
        fontFamily: "'inter', sans-serif",
      },
    }),
  };

  useEffect(() => {
    let customer = Customer?.data?.filter(
      (item: any) => item.displayName === displayName
    );
    // setCustomerId(customer?._id || "")

    console.log(customer, "check customer value");

    setCompanyName(customer[0]?.companyName);
  }, [displayName, Customer]);

  const [isEventSetupVisible, setIsEventSetupVisible] = useState(false);
  const [isAirTicketVisible, setIsAirTicketVisible] = useState(false);

  const handleDeleteRow = (idx: number, setTable: any) => {
    setTable((prev: any) => prev.filter((_: any, i: number) => i !== idx));
  };

  const { data: enquiryDataById, isLoading } = useEnquiryById(id || "");
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const dates = [];

      let currentDate = start;
      for (
        let currentDate = new Date(start);
        currentDate < end;
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
      ) {
        dates.push({ date: currentDate.toISOString().split("T")[0] });
      }

      console.log(dates.length, "check dates.length ");

      setRoom(
        dates.map((date) => ({
          date: date.date,
          roomCategory: "",
          noOfRooms: noOfRooms,
          category: "",
          occupancy: "",
          mealPlan: [],
        }))
      );

      setCab(
        dates.map((date) => ({
          date: date.date,
          fromCity: "",
          toCity: "",
          noOfVehicles: "",
          vehicleType: "",
          tripType: "",
        }))
      );
    }
  }, [checkIn, checkOut, noOfRooms]);

  useEffect(() => {
    if (banquetDate) {
      setBanquet((prev: any) => {
        const existingIndex = prev.findIndex((row: any) =>
          moment(row.date).isSame(banquetDate, "day")
        );
        const newRow = {
          date: banquetDate,
          session: "",
          seatingStyle: "",
          avSetup: "",
          menuType: "",
          minPax: "",
          seatingRequired: "",
        };

        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            date: banquetDate,
          };
          return updated;
        }

        // Else, replace all with just the new row
        return [newRow];
      });
    }
  }, [banquetDate]);

  useEffect(() => {
    setRoom(
      room.map((row) => ({
        date: row.date,
        roomCategory: row.roomCategory,
        noOfRooms: noOfRooms,
        category: "",
        occupancy: row.occupancy,
        mealPlan: row.mealPlan,
      }))
    );
  }, [enquiryDataById, noOfRooms]);

  useEffect(() => {
    setCab(
      cab.map((row) => ({
        date: row.date,
        fromCity: row.fromCity,
        toCity: row.toCity,
        noOfVehicles: row.noOfVehicles,
        vehicleType: row.vehicleType,
        tripType: row.tripType,
      }))
    );
    setBanquet(
      banquet.map((row) => ({
        date: row.date,
        session: row.session,
        seatingStyle: row.seatingRequired,
        avSetup: row.avSetup,
        menuType: row.menuType,
        minPax: row.minPax,
        seatingRequired: row.seatingRequired,
      }))
    );
  }, [enquiryDataById]);

  const handleMealPlanChange = (
    table: Room[],
    setTable: any,
    index: number,
    value: string
  ): void => {
    const updatedTable: any = [...table];
    if (!updatedTable[index].mealPlan.includes(value)) {
      updatedTable[index].mealPlan.push(value);
    }
    setTable(updatedTable);
  };

  const handleCheckboxChange = (value: string) => {
    setOccupancy((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const removeMealPlan = (
    table: Room[],
    setTable: any,
    index: number,
    value: string
  ): void => {
    const updatedTable = [...table];
    updatedTable[index].mealPlan = updatedTable[index].mealPlan.filter(
      (plan) => plan !== value
    );
    setTable(updatedTable);
  };

  const addCabRow = () => {
    setCab((prev) => [
      ...prev,
      {
        date: "",
        fromCity: "",
        toCity: "",
        noOfVehicles: "",
        vehicleType: "",
        tripType: "",
      },
    ]);
  };

  const addBanquetRow = () => {
    if (
      banquet.length === 0 ||
      moment(banquet[banquet.length - 1].date).isBefore(moment(checkOut))
    ) {
      const nextDate = new Date(
        banquet[banquet.length - 1]?.date || new Date()
      );
      nextDate.setDate(nextDate.getDate() + 1);
      setBanquet((prev) => [
        ...prev,
        {
          date: nextDate.toISOString().split("T")[0], // nextDate ,
          session: [],
          seatingStyle: "",
          avSetup: "",
          menuType: "",
          minPax: "",
          seatingRequired: "",
        },
      ]);
    }
  };

  const handleCabTypeChange = () => {
    setIsOutOfStation(!isOutOfStation);
  };

  // Handle Table Input Changes
  const handleTableChange = <T,>(
    table: T[],
    setTable: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: string
  ): void => {
    const updatedTable: any = [...table];
    updatedTable[index][field] = value;
    setTable(updatedTable);
  };

  const handleEventDetailChange = (field: keyof EventSetup, value: string) => {
    setEventSetup((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAirTicketChange = (field: keyof AirTickets, value: string) => {
    setAirTickets((prev) => ({ ...prev, [field]: value }));
  };

  const addEventDate = () => {
    const tempArray = [...eventSetup.eventDates];
    tempArray.push({ startDate: "", endDate: "" });
    setEventSetup({ ...eventSetup, eventDates: tempArray });
  };

  const handleDateChange = (
    index: number,
    field: keyof EventSetup["eventDates"][0],
    value: string
  ): void => {
    const updatedDates = [...eventSetup.eventDates];
    updatedDates[index] = {
      ...updatedDates[index],
      [field]: value,
    };

    setEventSetup((prevState) => ({
      ...prevState,
      eventDates: updatedDates,
    }));
  };

  const handleTimeChange = (
    index: number,
    field: keyof EventSetup["eventDates"][0],
    timeValue: string
  ): void => {
    if (!timeValue) return; // Skip if no time is provided

    const updatedDates = [...eventSetup.eventDates];
    const currentDateStr = updatedDates[index][field] as string;

    // If no valid date exists, skip or initialize as needed
    if (!currentDateStr) return;

    // Parse the existing date and update time
    const currentDate = moment(currentDateStr);
    const [hours, minutes] = timeValue.split(":").map(Number);
    currentDate.set({
      hour: hours,
      minute: minutes,
      second: 0,
      millisecond: 0,
    });

    // Update the state with the new date string (same format as handleDateChange)
    updatedDates[index] = {
      ...updatedDates[index],
      [field]: currentDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"), // ISO format to match Date object
    };

    setEventSetup((prevState) => ({
      ...prevState,
      eventDates: updatedDates,
    }));
  };

  const navigate = useNavigate();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "companyName":
        setCompanyName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "city":
        setCity(value);
        break;
      case "area":
        setArea(value);
        break;
      case "noOfRooms":
        setNoOfRooms(value);
        break;
      case "enquiryType":
        setEnquiryType(value);
        break;
      case "checkIn":
        setCheckIn(value);
        break;
      case "checkOut":
        setCheckOut(value);
        break;
      case "levelOfEnquiry":
        setLevelOfEnquiry(value);
        break;
      case "billingAddress":
        setBillingInstructions(value);
        break;
      default:
        break;
    }
  };

  const totalAmount = productsArray.reduce((sum, item) => {
    const amount = item.amount
    return sum + amount;
  }, 0);


  useEffect(() => {


    if (enquiryType === "banquet") {

      setCheckIn("")
      setCheckOut("")


    }

  }, [enquiryType])

  useEffect(() => {

    if (enquiryDataById && enquiryDataById?.data) {
      const { eventSetup } = enquiryDataById.data;

      setAirTickets(enquiryDataById?.data?.airTickets || airTickets);
      setEventSetup({
        functionType: eventSetup.functionType || "",
        setupRequired: eventSetup.setupRequired || "",
        eventDates: eventSetup.eventDates.map((date: any) => ({
          startDate: moment(date?.startDate).format("YYYY-MM-DD"),
          endDate: moment(date?.endDate).format("YYYY-MM-DD"),
        })),

        eventStartDate: eventSetup?.eventStartDate || "",
        eventEndDate: eventSetup?.eventEndDate || "",
      });
      setBanquet(
        enquiryDataById?.data?.banquet
          ? enquiryDataById.data.banquet.map((item: any) => ({
            ...item,
            session: Array.isArray(item.session)
              ? item.session
              : [item.session].filter(Boolean),
          }))
          : []
      );
      setRoom([...enquiryDataById?.data?.room]);
      //   setCab(enquiryDataById?.data?.cab)
      setBillingInstructions(enquiryDataById?.data?.billingInstructions || "");
      setCompanyName(enquiryDataById?.data?.companyName);

      setPhoneNumber(enquiryDataById?.data?.phoneNumber);
      setHotelName(enquiryDataById?.data?.hotelName);
      setApproxPassengers(enquiryDataById?.data?.approxPassengers);
      setOthersPreference(enquiryDataById?.data?.othersPreference);
      setCategoryOfHotel(enquiryDataById?.data?.categoryOfHotel);
      setOccupancy(enquiryDataById?.data?.occupancy);
      setEmail(enquiryDataById?.data?.email);
      setCity(enquiryDataById?.data?.city);
      setArea(enquiryDataById?.data?.area);
      setNoOfRooms(enquiryDataById?.data?.noOfRooms || "");
      setEnquiryType(enquiryDataById?.data?.enquiryType);
      setCheckIn(enquiryDataById?.data?.checkIn);
      setCheckOut(enquiryDataById?.data?.checkOut);
      setLevelOfEnquiry(enquiryDataById?.data?.levelOfEnquiry);
      setEventSetup(enquiryDataById?.data?.eventSetup);
      setFirstName(enquiryDataById?.data?.firstName);
      setAssignTo(enquiryDataById?.data?.assignTo);
      setDisplayName(enquiryDataById?.data?.displayName);
      setLastName(enquiryDataById?.data?.lastName);
      setSalutation(enquiryDataById?.data?.salutation);
      setBanquetDate(enquiryDataById?.data?.banquetDate);
      setBanquetTime(enquiryDataById?.data?.banquetTime);

      setIsOutOfStation(
        !!enquiryDataById?.data?.cab?.some((c: Cab) => c.fromCity && c.toCity)
      );

      setCab(enquiryDataById?.data?.cab);
      //  setUser(enquiryDataById?.data)
      setIsEventSetupVisible(!!enquiryDataById.data.eventSetup?.functionType);
      setIsAirTicketVisible(!!enquiryDataById.data.airTickets?.tripType);
    }
  }, [enquiryDataById]);

  // Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { eventStartDate, eventEndDate, ...restEventSetup } = eventSetup;

      const obj = {
        salutation: salutation,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        companyName: companyName,
        levelOfEnquiry,
        enquiryType: enquiryType,
        othersPreference: othersPreference,
        hotelName: hotelName,
        approxPassengers: approxPassengers,
        banquetDate: banquetDate,
        banquetTime: banquetTime,
        // hotelPreferences: hotelPreferences,
        checkIn: checkIn,
        checkOut: checkOut,
        city: city,
        noOfRooms: noOfRooms,
        categoryOfHotel: categoryOfHotel,
        assignTo: assignTo,
        displayName: displayName,
        occupancy: occupancy,
        banquet: banquet,
        room: room,
        eventSetup: {
          ...restEventSetup,
          setupRequired: eventSetup.setupRequired || "",
          eventDates: eventSetup.eventDates.map((date) => ({
            startDate: date?.startDate,
            endDate: date?.endDate,
          })),
        },
        airTickets: airTickets,
        cab: cab,
        billingInstructions: billingInstructions,
        area: area,
      };

      console.log(
        "Room Details:",
        obj.checkIn,
        "checkout",
        obj.checkOut,
        "this one",
        obj,
        obj.eventSetup
      );

      // obj.room.forEach((room, index) => {
      //   console.log(`Room ${index + 1}:`, {
      //     date: room.date,
      //     roomCategory: room?.roomCategory,
      //     noOfRooms: room.noOfRooms,
      //     occupancy: room.occupancy,
      //     mealPlan: room.mealPlan,
      //   })
      // })

      // console.log("Banquet Details:", obj.banquet)
      // obj.banquet.forEach((banquet, index) => {
      //   console.log(`Banquet ${index + 1}:`, {
      //     date: banquet.date,
      //     session: banquet.session,
      //     seatingStyle: banquet.seatingStyle,
      //     avSetup: banquet.avSetup,
      //     menuType: banquet.menuType,
      //     minPax: banquet.minPax,
      //     seatingRequired: banquet.seatingRequired,
      //   })
      // })

      // console.log("Cab Details:", obj.cab)
      // obj.cab.forEach((cab, index) => {
      //   console.log(`Cab ${index + 1}:`, {
      //     date: cab.date,
      //     fromCity: cab.fromCity,
      //     toCity: cab.toCity,
      //     noOfVehicles: cab.noOfVehicles,
      //     vehicleType: cab.vehicleType,
      //     tripType: cab.tripType,
      //     mealPlan: cab.mealPlan,
      //   })
      // })

      // console.log("Event Setup Details:", obj.eventSetup)
      // console.log("Event Setup Function Type:", obj.eventSetup.functionType)
      // console.log("Event Setup Required:", obj.eventSetup.setupRequired)
      // console.log("Event Dates:", obj.eventSetup.eventDates)
      // obj.eventSetup.eventDates.forEach((date, index) => {
      //   console.log(`Event Date ${index + 1}:`, {
      //     startDate: date?.startDate,
      //     endDate: date?.endDate,
      //   })
      // })

      if (id) {
        const { data: res } = await updateEnquiryById({ id, obj });

        if (res?.message) {
          toastSuccess(res.message);
          navigate("/enquiryList");
        }
      } else {
        const { data: res } = await addEnquiry(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/enquiryList");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const cityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Chennai", label: "Chennai" },
    { value: "Kolkata", label: "Kolkata" },
    { value: "Pune", label: "Pune" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Surat", label: "Surat" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Indore", label: "Indore" },
    { value: "Thane", label: "Thane" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Visakhapatnam", label: "Visakhapatnam" },
    { value: "Vadodara", label: "Vadodara" },
    { value: "Patna", label: "Patna" },
    { value: "Ghaziabad", label: "Ghaziabad" },
    { value: "Ludhiana", label: "Ludhiana" },
    { value: "Agra", label: "Agra" },
    { value: "Nashik", label: "Nashik" },
    { value: "Faridabad", label: "Faridabad" },
    { value: "Meerut", label: "Meerut" },
    { value: "Rajkot", label: "Rajkot" },
    { value: "Varanasi", label: "Varanasi" },
    { value: "Srinagar", label: "Srinagar" },
    { value: "Amritsar", label: "Amritsar" },
  ];

  const vehicleTypeOptions = [
    { label: "Sedan", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "Minivan", value: "minivan" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Luxury", value: "luxury" },
  ];
  const handleSelectChange = (name: string, value: string) => {
    setSalutation(value);
  };

  // const nameOptions =
  //   contact?.data &&
  //   contact?.data.map((item: any) => ({ value: item._id, label: item.name }));

  //for resolving error for now
  const nameOptions = [{ value: "", label: "" }];

  console.log(assignTo, "assignTo");
  return (
    <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
      <div className="bg-white text-black ">
        <h1 className="text-xl font-semibold">Enquiry</h1>
      </div>
      <div className="min-h-screen w-full">
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className=" p-6 rounded  shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Salutation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salutation
                </label>
                <select
                  onChange={(val) =>
                    handleSelectChange("salutation", val.target.value)
                  }
                  value={salutation}
                  className="w-full  border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                  {salutationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* FirstName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full border  border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              {/* LastName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full border  border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  onChange={(e) => setAssignTo(e.target.value)}
                  value={assignTo}
                  name="assignTo"
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                  {userNames.data.map((option: any) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <select
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                  }}
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                  {Customer.data.map((option: any) => (
                    <option key={option.displayName} value={option.displayName}>
                      {option.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full border  border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Allow only digits and restrict length to 3
                    const numericValue = input.replace(/\D/g, '').slice(0, 10);
                    setPhoneNumber(numericValue);
                  }}
                  placeholder="Phone Number"
                  className="w-full border  border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border  border-gray-300 rounded p-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* City */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* Area */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value)
                  }}
                  placeholder="Area"
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* Number of Rooms */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  name="noOfRooms"
                  value={noOfRooms}
                  onChange={(e) => setNoOfRooms(e.target.value)}
                  placeholder="Number of Rooms"
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* Enquiry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enquiry Type
                </label>
                <select
                  name="enquiryType"
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Enquiry Type</option>
                  <option value="room">Room</option>
                  <option value="banquet">Banquet</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Check In */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <input
                  type="date"
                  name="checkIn"
                  value={moment(checkIn).format("YYYY-MM-DD")}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}

              {/* Show Check In only after Enquiry Type is selected */}
              {(enquiryType === "room" || enquiryType === "both") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check In
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={moment(checkIn).format("YYYY-MM-DD")}
                    onChange={(e) => setCheckIn(e.target.value)}
                    onFocus={(e) => (e.target as HTMLInputElement).showPicker()}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    min={moment().format("YYYY-MM-DD")}
                    className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Check Out */}
              {(enquiryType === "room" || enquiryType === "both") &&
                checkIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check Out
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={moment(checkOut).format("YYYY-MM-DD")}
                      onChange={(e) => setCheckOut(e.target.value)}
                      onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                      min={moment(checkIn).format("YYYY-MM-DD")}
                      className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

              {(enquiryType === "banquet" || enquiryType === "both") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banquet Date
                  </label>
                  <input
                    type="date"
                    name="banquetDate"
                    value={banquetDate}
                     onClick={(e) =>
                        (e.target as HTMLInputElement).showPicker()
                      }
                    onChange={(e) => setBanquetDate(e.target.value)}
                    min={checkIn ? checkIn : moment().format("YYYY-MM-DD")}
                    max={checkOut}
                    className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {(enquiryType === "banquet" || enquiryType === "both") &&
                banquetDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banquet Time
                    </label>
                    <input
                      type="time"
                      name="banquetTime"
                      value={banquetTime}
                      onChange={(e) => setBanquetTime(e.target.value)}
                      className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

              {/* Level of Enquiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level of Enquiry
                </label>
                <select
                  name="levelOfEnquiry"
                  value={levelOfEnquiry}
                  onChange={(e) => setLevelOfEnquiry(e.target.value)}
                  className="w-full  border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Enquiry Type</option>
                  <option value="urgent">Urgent</option>
                  <option value="moderate">Moderate</option>
                  <option value="not urgent">Not Urgent</option>
                </select>
              </div>

              {/* Hotel Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Preference
                </label>
                <input
                  type="text"
                  name="othersPreference"
                  value={othersPreference}
                  onChange={(e) => setOthersPreference(e.target.value)}
                  placeholder="Preferences"
                  className="w-full border  border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Hotel Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Category
                </label>
                <Select
                  isMulti
                  options={hotelCategoryOptions}
                  value={hotelCategoryOptions.filter((option) =>
                    categoryOfHotel.includes(option.value)
                  )}
                  onChange={(selected) => {
                    const values = selected
                      ? selected.map((opt) => opt.value)
                      : [];
                    setCategoryOfHotel(values);
                  }}
                  className="basic-multi-select text-xs text-gray-600"
                  classNamePrefix="select"
                  placeholder="Select Categories..."
                  
                />
              </div>

              {/* Rate Required for (Occupancy) */}
              {enquiryType === "room" && <div>
                <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">
                  Rate Required for (Occupancy)
                </label>
                <div className="flex space-x-4 mt-5">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="single occupancy"
                      checked={occupancy.includes("single occupancy")}
                      onChange={() => handleCheckboxChange("single occupancy")}
                      className="form-checkbox  h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Single Occupancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="double occupancy"
                      checked={occupancy.includes("double occupancy")}
                      onChange={() => handleCheckboxChange("double occupancy")}
                      className="form-checkbox  h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Double Occupancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="extra bed"
                      checked={occupancy.includes("extra bed")}
                      onChange={() => handleCheckboxChange("extra bed")}
                      className="form-checkbox  h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Extra Bed</span>
                  </label>
                </div>
              </div>}
            </div>
          </div>

          {/* Room Table */}
          {(enquiryType === "room" || enquiryType === "both") && (
            <div className="bg-white rounded shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-base">Room</h2>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#0B2F46] text-white">
                      <tr>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Date
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          No. of Rooms
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Room Category
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Occupancy
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Meal Plan
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {room &&
                        room?.length > 0 &&
                        room.map((row, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : ""
                            }
                          >
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              {row?.date}
                            </td>
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <input
                                type="number"
                                min="0"
                                value={row?.noOfRooms}
                                onChange={(e) =>
                                  handleTableChange(
                                    room,
                                    setRoom,
                                    index,
                                    "noOfRooms",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              />
                            </td>
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <select
                                value={row?.roomCategory}
                                onChange={(e) =>
                                  handleTableChange(
                                    room,
                                    setRoom,
                                    index,
                                    "roomCategory",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Category</option>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                              </select>
                            </td>
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <select
                                value={row?.occupancy}
                                onChange={(e) =>
                                  handleTableChange(
                                    room,
                                    setRoom,
                                    index,
                                    "occupancy",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Occupancy</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                              </select>
                            </td>
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <select
                                onChange={(e) =>
                                  handleMealPlanChange(
                                    room,
                                    setRoom,
                                    index,
                                    e.target.value
                                  )
                                }
                                value={row?.mealPlan}
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Meal Plan</option>
                                {mealPlanOptions.map(
                                  (plan) =>
                                    !row.mealPlan.includes(plan) && (
                                      <option key={plan} value={plan}>
                                        {plan}
                                      </option>
                                    )
                                )}
                              </select>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {row &&
                                  row?.mealPlan?.length > 0 &&
                                  row.mealPlan.map((plan) => (
                                    <span
                                      key={plan}
                                      className="inline-block bg-gray-100 px-2 py-1 text-xs rounded"
                                    >
                                      {plan}{" "}
                                      <button
                                        onClick={() =>
                                          removeMealPlan(
                                            room,
                                            setRoom,
                                            index,
                                            plan
                                          )
                                        }
                                        className="text-red-500 font-bold"
                                      >
                                        x
                                      </button>
                                    </span>
                                  ))}
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteRow(index, setRoom)}
                                className="text-red-500 font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {/* Button for "Same for All Days" */}
                <button
                  type="button"
                  onClick={() => {
                    if (room?.length > 0) {
                      const filledRow = room.find(
                        (row) =>
                          (row.noOfRooms &&
                            Number.parseInt(row.noOfRooms) > 0) ||
                          row.roomCategory ||
                          row.occupancy ||
                          (row.mealPlan && row.mealPlan.length > 0)
                      );
                      if (filledRow) {
                        setRoom(
                          room.map((originalRow) => ({
                            ...filledRow,
                            date: originalRow.date,
                          }))
                        );
                      } else {
                        alert(
                          "Please fill in at least one row before applying to all days."
                        );
                      }
                    } else {
                      alert("No room data available.");
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 mt-3 rounded"
                >
                  Same for All Days
                </button>
              </div>
            </div>
          )}

          {/* Banquet Table */}
          {(enquiryType === "banquet" || enquiryType === "both") && (
            <div className="bg-white rounded shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-base">Banquet</h2>
              </div>
              <div className="p-4">
                <div className="">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#0B2F46] text-white">
                      <tr>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Date
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Session
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Seating Style
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          A/V Setup
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Menu Type
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Minimum No. of Pax
                        </th>
                        <th className=" px-3 py-1.5 text-left text-xs font-medium">
                          Seating Required
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {banquet.map((row, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : ""
                          }
                        >
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            {moment(row.date).format("YYYY-MM-DD")}
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200 relative">
                            <Select
                              isMulti
                              options={sessionOptions}
                              value={sessionOptions.filter((option) =>
                                row.session.includes(option.value)
                              )}
                              onChange={(selected) =>
                                handleSessionChange(
                                  index,
                                  selected.map((opt) => opt.value)
                                )
                              }
                              className="text-sm z-99"
                              classNamePrefix="react-select"
                              styles={{
                                menu: (provided) => ({
                                  ...provided,
                                }),
                              }}
                            />
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            <select
                              value={row?.seatingStyle}
                              onChange={(e) =>
                                handleTableChange(
                                  banquet,
                                  setBanquet,
                                  index,
                                  "seatingStyle",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Theater">Theater</option>
                              <option value="Clusters">Clusters</option>
                              <option value="Theaters and Clusters">
                                Theaters and Clusters
                              </option>
                              <option value="Mix">Mix</option>
                            </select>
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            <select
                              value={row?.avSetup}
                              onChange={(e) =>
                                handleTableChange(
                                  banquet,
                                  setBanquet,
                                  index,
                                  "avSetup",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            <select
                              value={row?.menuType}
                              onChange={(e) =>
                                handleTableChange(
                                  banquet,
                                  setBanquet,
                                  index,
                                  "menuType",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            >
                              <option value="">Select</option>
                              <option value="Veg">Veg</option>
                              <option value="Non-Veg">Non-Veg</option>
                              <option value="Mix">Mix</option>
                            </select>
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            <input
                              type="number"
                              min={0}
                              value={row?.minPax}
                              onChange={(e) =>
                                handleTableChange(
                                  banquet,
                                  setBanquet,
                                  index,
                                  "minPax",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                            <input
                              type="number"
                                min={0}
                              value={row?.seatingRequired}
                              onChange={(e) =>
                                handleTableChange(
                                  banquet,
                                  setBanquet,
                                  index,
                                  "seatingRequired",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteRow(index, setBanquet)}
                              className="text-red-500 font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={addBanquetRow}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 mt-3 rounded"
                >
                  Add Date
                </button>
              </div>
            </div>
          )}

          {/* Checkboxes */}
          <div className="flex gap-4 ml-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isEventSetupVisible}
                onChange={() => setIsEventSetupVisible(!isEventSetupVisible)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">Event Setup</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isAirTicketVisible}
                onChange={() => setIsAirTicketVisible(!isAirTicketVisible)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">Air Ticket</span>
            </label>

                 {/* Need Cab Checkbox */}
      
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 ml-4">
              <input
                type="checkbox"
                checked={needCab}
                onChange={(e) => setNeedCab(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              Need Cab?
            </label>
       

          </div>

          {/* Event Setup */}
          {isEventSetupVisible && (
            <div className="bg-white rounded shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-base">Event Setup</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Function Type
                    </label>
                    <select
                      name="functionType"
                      value={eventSetup.functionType}
                      onChange={(e) =>
                        handleEventDetailChange("functionType", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select function type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Birthday Party">Birthday Party</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Setup Required
                    </label>
                    <select
                      value={eventSetup.setupRequired || ""}
                      onChange={(e) =>
                        handleEventDetailChange("setupRequired", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select required (yes / no)</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* Fabrication Table */}
                <div className="mt-6">
                  <h3 className="font-medium text-sm text-gray-700 mb-2">
                    Fabrication Requirements
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="">
                        <tr>
                          <th className="px-4 py-2  text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-8">
                            Select
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            Particular
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            Size
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            Rate (₹)
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            Amount (₹)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productsArray.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleToggleItem(item.id)}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                              {item.particular}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center border-b border-gray-200">
                              {item.size}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                              <input
                                type="number"
                                value={item.qty === 0 ? '' : item.qty}
                                onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="border border-gray-300 p-1 rounded w-16 text-center"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm  text-gray-700 border-b border-gray-200">
                              <input
                                type="number"
                                value={item.rate === 0 ? '' : item.rate}
                                onChange={(e) => handleRateChange(item.id, Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="border border-gray-300 p-1 rounded w-20 text-center"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center border-b border-gray-200">
                              ₹{(item.rate * item.qty).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                        <tr className=" font-semibold">
                          <td colSpan={5} className="px-4 py-2 text-center text-sm border-b border-gray-200">
                            Selected Total
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center border-b border-gray-200">
                            ₹{calculateSelectedTotal().toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {eventSetup.eventDates.map((date, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mt-4 relative">
                    {eventSetup.eventDates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDate(index)}
                        className="absolute right-0 top-0 text-red-300 hover:text-red-500 text-xs px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Start Date
                      </label>
                      <input
                        type="date"
                        value={
                          date && date?.startDate
                            ? moment(date?.startDate).format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) =>
                          handleDateChange(index, "startDate", e.target.value)
                        }
                        onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker()
                        }
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Start Time
                      </label>
                      <input
                        type="time"
                        value={
                          date && date?.startDate
                            ? moment(date?.startDate).format("HH:mm")
                            : ""
                        }
                        onChange={(e) =>
                          handleTimeChange(index, "startDate", e.target.value)
                        }
                        onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker()
                        }
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event End Date
                      </label>
                      <input
                        type="date"
                        value={moment(date.endDate).format("YYYY-MM-DD")}
                        onChange={(e) =>
                          handleDateChange(index, "endDate", e.target.value)
                        }
                        onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker()
                        }
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event End Time
                      </label>
                      <input
                        type="time"
                        value={
                          date && date?.endDate
                            ? moment(date?.endDate).format("HH:mm")
                            : ""
                        }
                        onChange={(e) =>
                          handleTimeChange(index, "endDate", e.target.value)
                        }
                        onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker()
                        }
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEventDate}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 mt-4 rounded"
                >
                  Add Date
                </button>
              </div>
            </div>
          )}

          {/* Air Ticket */}
          {isAirTicketVisible && (
            <div className="bg-white rounded shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-base">Air Ticket</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Common Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trip type
                    </label>
                    <select
                      value={airTickets.tripType}
                      onChange={(e) =>
                        handleAirTicketChange("tripType", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select trip type</option>
                      <option value="One Way">One Way</option>
                      <option value="Round Trip">Round Trip</option>
                      <option value="Multi City">Multi City</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of passengers
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Select passengers"
                      value={airTickets.numberOfPassengers}
                      onChange={(e) =>
                        handleAirTicketChange(
                          "numberOfPassengers",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From City
                    </label>
                    <select
                      value={airTickets.fromCity}
                      onChange={(e) =>
                        handleAirTicketChange("fromCity", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select From City</option>
                      {cityOptions.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To City
                    </label>
                    <select
                      value={airTickets.toCity}
                      onChange={(e) =>
                        handleAirTicketChange("toCity", e.target.value)
                      }
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select To City</option>
                      {cityOptions
                        .filter((city) => city.value !== airTickets.fromCity)
                        .map((city) => (
                          <option key={city.value} value={city.value}>
                            {city.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Round Trip Fields */}
                  {airTickets.tripType === "Round Trip" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return date
                      </label>
                      <input
                        type="date"
                        value={moment(airTickets.returnDate).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={(e) =>
                          handleAirTicketChange("returnDate", e.target.value)
                        }
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>
                  )}

                  {/* Multi City Fields */}
                  {airTickets.tripType === "Multi City" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From City
                        </label>
                        <select
                          value={airTickets.multiFromCity}
                          onChange={(e) =>
                            handleAirTicketChange(
                              "multiFromCity",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        >
                          <option value="">Select From City</option>
                          {cityOptions.map((city) => (
                            <option key={city.value} value={city.value}>
                              {city.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To City
                        </label>
                        <select
                          value={airTickets.multiToCity}
                          onChange={(e) =>
                            handleAirTicketChange("multiToCity", e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        >
                          <option value="">Select To City</option>
                          {cityOptions
                            .filter(
                              (city) => city.value !== airTickets.multiFromCity
                            )
                            .map((city) => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Departure date
                        </label>
                        <input
                          type="date"
                          value={moment(airTickets.multiDepartureDate).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) =>
                            handleAirTicketChange(
                              "multiDepartureDate",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        />
                      </div>

                      
         
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Need Cab Checkbox */}
          {/* <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 ml-4">
              <input
                type="checkbox"
                checked={needCab}
                onChange={(e) => setNeedCab(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              Need Cab?
            </label>
          </div> */}

          {/* Cab Table */}

          {needCab && (
            <div className="bg-white rounded shadow-sm mb-6">
              <div className="bg-white rounded shadow-sm mb-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-base">Cab</h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Trip Type:
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!isOutOfStation}
                          onChange={handleCabTypeChange}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">Local</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isOutOfStation}
                          onChange={handleCabTypeChange}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">Out of Station</span>
                      </label>
                    </div>

                    {/* Approx Passengers */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Approx Number of Passengers:
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={approxPassengers}
                        onChange={(e) => setApproxPassengers(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead className="bg-stone-200 text-gray-800">
                        <tr>
                          <th className=" px-3 py-1.5 text-left text-xs font-bold">
                            Date
                          </th>
                          {isOutOfStation && (
                            <th className=" px-3 py-1.5 text-left text-xs font-medium">
                              From City
                            </th>
                          )}
                          {isOutOfStation && (
                            <th className=" px-3 py-1.5 text-left text-xs font-medium">
                              To City
                            </th>
                          )}
                          <th className=" px-3 py-1.5 text-left text-xs font-bold">
                            No. of Vehicles
                          </th>
                          <th className=" px-3 py-1.5 text-left text-xs font-bold">
                            Type of Vehicle
                          </th>
                          <th className=" px-3 py-1.5 text-left text-xs font-bold">
                            Trip Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cab.map((row, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : ""
                            }
                          >
                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <input
                                type="date"
                                value={
                                  moment(row?.date).format("YYYY-MM-DD") ||
                                  row?.date
                                }
                                onChange={(e) =>
                                  handleTableChange(
                                    cab,
                                    setCab,
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              />
                            </td>

                            {isOutOfStation && (
                              <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                                <Autocomplete
                                  options={cityOptions}
                                  getOptionLabel={(option) => option.label}
                                  value={
                                    cityOptions.find(
                                      (option) => option.value === row?.fromCity
                                    ) || null
                                  }
                                  onChange={(event, newValue) =>
                                    handleTableChange(
                                      cab,
                                      setCab,
                                      index,
                                      "fromCity",
                                      newValue?.value || ""
                                    )
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      className="w-full"
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          padding: "0px",
                                          fontSize: "0.875rem",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </td>
                            )}

                            {isOutOfStation && (
                              <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                                <Autocomplete
                                  options={cityOptions}
                                  getOptionLabel={(option) => option.label}
                                  value={
                                    cityOptions.find(
                                      (option) => option.value === row?.toCity
                                    ) || null
                                  }
                                  onChange={(event, newValue) =>
                                    handleTableChange(
                                      cab,
                                      setCab,
                                      index,
                                      "toCity",
                                      newValue?.value || ""
                                    )
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value.value
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      className="w-full"
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          padding: "0px",
                                          fontSize: "0.875rem",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </td>
                            )}

                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <input
                                type="number"
                                min={0}
                                value={row?.noOfVehicles}
                                onChange={(e) =>
                                  handleTableChange(
                                    cab,
                                    setCab,
                                    index,
                                    "noOfVehicles",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              />
                            </td>

                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <Autocomplete
                                options={vehicleTypeOptions}
                                getOptionLabel={(option) => option.label}
                                value={
                                  vehicleTypeOptions.find(
                                    (option) =>
                                      option.value === row?.vehicleType
                                  ) || null
                                }
                                onChange={(event, newValue) =>
                                  handleTableChange(
                                    cab,
                                    setCab,
                                    index,
                                    "vehicleType",
                                    newValue?.value || ""
                                  )
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="w-full"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        padding: "0px",
                                        fontSize: "0.875rem",
                                      },
                                    }}
                                  />
                                )}
                              />
                            </td>

                            <td className=" px-3 py-1.5 text-sm border-b border-gray-200">
                              <select
                                value={row?.tripType}
                                onChange={(e) =>
                                  handleTableChange(
                                    cab,
                                    setCab,
                                    index,
                                    "tripType",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Trip Type</option>
                                <option value="Airport Transfer">
                                  Airport Transfer
                                </option>
                                <option value="Hourly Rental">
                                  Hourly Rental
                                </option>
                                <option value="Outstation">Outstation</option>
                              </select>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteRow(index, setCab)}
                                className="text-red-500 font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={addCabRow}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 mt-3 rounded"
                  >
                    Add a Date
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Address and Submit Button */}
          {/* <div className="bg-white rounded shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-base">Billing Instructions</h2>
            </div>
            <div className="p-4">
              <textarea
                name="billingInstructions"
                value={billingInstructions}
                onChange={(e) => setBillingInstructions(e.target.value)}
                placeholder="Enter Billing Instructions"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              ></textarea>
            </div>
          </div> */}

         <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" px-3 py-1.5 border border-gray-300 rounded text-gray-700 text-sm"
            >
              Cancel
            </button>

            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnquiryForm;