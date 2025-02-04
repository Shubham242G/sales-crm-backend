// interface UserDetail {
//     clientName: string;
//     companyName: string;
//     phoneNumber: string;
//     email: string;
//     enquiryType: string;
//     levelOfEnquiry: string;
//     hotelPreferences: string;
//     city: string;
//     area: string;
//     numberOfRooms: string;
//     checkIn: string;
//     checkOut: string;
//     categoryOfHotel: string[];
//     rateRequiredForOccupancy: string[];
//     billingAddress: string;
// }

interface Room {
  date: string;
  roomCategory: string;
  occupancy: string;
  mealPlan: string[];
  noOfRooms: string;
}

interface Banquet {
  date: string;
  session: string;
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
  mealPlan: string[];
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
}

interface AirTickets {
  tripType: string;
  numberOfPassengers: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string;
}

import { toastError, toastSuccess } from "@/utils/toast";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddEnquiry,
  useEnquiryById,
  useUpdateEnquiryById,
} from "@/services/enquiry.service";
import moment from "moment";
// import { useContact, useContactById } from "@/services/contactUs.service";
import { set } from "lodash";
import Select from "react-select";
import { pageIndex } from "@/common/constant.common";
import { ReactSelectFormat } from "@/services/urls.service";
import { eventNames } from "node:process";
import { Autocomplete, TextField } from "@mui/material";

const AddEnquiryForm = () => {
  // State for User Details
  const [nameObj, setNameObj] = useState<ReactSelectFormat | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
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
  const [occupancy, setOccupancy] = useState<string[]>([]);
  // const occupancyOptions = [
  //   { value: "single occupancy", label: "Single Occupancy" },
  //   { value: "double occupancy", label: "Double Occupancy" },
  //   { value: "extra bed", label: "Extra Bed" },
  // ]
  const [approxPassengers, setApproxPassengers] = useState("");
  // const [hotelPreferences, setHotelPreferences] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [noOfRooms, setNoOfRooms] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  // const [categoryOfHotel, setCategoryOfHotel] = useState([]);
  // const [occupancy, setOccupancy] = useState([]);
  const [billingAddress, setBillingAddress] = useState("");

  // State for Tables
  const [room, setRoom] = useState<Room[]>([]);
  const [banquet, setBanquet] = useState<Banquet[]>([]);
  const [cab, setCab] = useState<Cab[]>([]);
  const [isOutOfStation, setIsOutOfStation] = useState(false);
  // const [selectName, setSelectName] = useState('');

  const { mutateAsync: addEnquiry } = useAddEnquiry();
  const { mutateAsync: updateEnquiryById } = useUpdateEnquiryById();

  // const { data: contact } = useContact({ pageIndex: 0 });

  // const { data: contactById } = useContactById(nameObj?.value || "");

  // useEffect(() => {
  //   if (contactById?.data) {
  //     setPhone(contactById?.data?.phone);
  //     setEmail(contactById?.data?.email);
  //     console.log(nameObj, "<----nameObj");
  //   }
  // }, [contactById?.data]);
  // Meal Plan Options
  const mealPlanOptions = [
    "Breakfast Only",
    "Half Board",
    "Full Board",
    "All Inclusive",
  ];

  // State for Event Setup
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

  const [airTickets, setAirTickets] = useState<AirTickets>({
    tripType: "",
    numberOfPassengers: "",
    fromCity: "",
    toCity: "",
    departureDate: "",
    returnDate: "",
  });

  const [isEventSetupVisible, setIsEventSetupVisible] = useState(false);
  const [isAirTicketVisible, setIsAirTicketVisible] = useState(false);

  const { id } = useParams();
  const { data: enquiryDataById, isLoading } = useEnquiryById(id || "");
  // Generate Rows for Room, Banquet, and Cab Tables Based on Check-In and Check-Out Dates
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const dates = [];

      // Create dates between checkIn and checkOut
      let currentDate = start;
      while (currentDate <= end) {
        dates.push({ date: currentDate.toISOString().split("T")[0] });
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }

      // Update room, banquet, and cab states

      console.log("Check dates ", dates);
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

      setBanquet(
        dates.map((date) => ({
          date: date.date,
          session: "",
          seatingStyle: "",
          avSetup: "",
          menuType: "",
          minPax: "",
          seatingRequired: "",
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
          mealPlan: [],
        }))
      );
    }
  }, [checkIn, checkOut, noOfRooms]); // Make sure you're using correct state variables here (e.g., checkIn, checkOut)

  useEffect(() => {
    setRoom(
      room.map((row) => ({
        date: row.date,
        roomCategory: row.roomCategory,
        noOfRooms: noOfRooms,
        category: "",
        occupancy: row.occupancy,
        mealPlan: [...row.mealPlan],
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
        mealPlan: [...row.mealPlan],
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

  // Add Meal Plan to Input and Remove from Dropdown

  const handleMealPlanChange = (
    table: Room[] | Cab[],
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
    table: Room[] | Cab[],
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

  // Add a Row to the Cab Table
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
        mealPlan: [],
      },
    ]);
  };

  // Handle Input Changes

  // Handle Checkbox for Cab Type
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
    let tempArray = [...eventSetup.eventDates];
    tempArray.push({ startDate: "", endDate: "" });
    setEventSetup({ ...eventSetup, eventDates: tempArray });
  };

  const handleDateChange = (
    index: number,
    field: keyof EventSetup["eventDates"][0], // Ensures that field is either "startDate" or "endDate"
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
        setPhone(value);
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
        setBillingAddress(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Prefill form when editing
    if (enquiryDataById && enquiryDataById?.data) {
      const { eventSetup } = enquiryDataById.data;

      console.log(enquiryDataById.data, "check upcoming data");
      console.log(
        "event setup data: ",
        enquiryDataById.data.eventSetup,
        "getById/"
      );
      console.log(
        "event start data: ",
        enquiryDataById.data.eventSetup.eventStartDate
      );
      console.log(
        "event start data: ",
        enquiryDataById.data.eventSetup.eventEndDate
      );
      setAirTickets(enquiryDataById?.data?.airTickets);
      console.log("Fetched eventSetup:", eventSetup);
      setEventSetup({
        functionType: eventSetup.functionType || "",
        setupRequired: eventSetup.setupRequired || "",
        eventDates: eventSetup.eventDates.map((date: any) => ({
          startDate: moment(date.startDate).format("YYYY-MM-DD"),
          endDate: moment(date.endDate).format("YYYY-MM-DD"),
        })),

        eventStartDate: eventSetup.eventStartDate || "",
        eventEndDate: eventSetup.eventEndDate || "",
      });
      setBanquet(enquiryDataById?.data?.banquet);
      setRoom([...enquiryDataById?.data?.room]);
      //   setCab(enquiryDataById?.data?.cab)
      setBillingAddress(enquiryDataById?.data?.billingAddress);
      setCompanyName(enquiryDataById?.data?.companyName);

      console.log(
        "room category",
        enquiryDataById?.data?.room[0]?.roomCategory
      );
      setPhone(enquiryDataById?.data?.phone);
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

      setCab(enquiryDataById?.data?.cab);
      //  setUser(enquiryDataById?.data)
    }
  }, [enquiryDataById]);

  //   console.log("start date: ", moment(eventSetup.eventDates[0]).format("YYYY-MM-DD"))
  console.log("start date: ", eventSetup.eventDates[0].startDate);
  console.log(eventSetup, "check event setup changes");
  console.log("Enquiry Data by ID:", enquiryDataById);
  console.log("number of rooms: ", enquiryDataById?.data?.noOfRooms);
  // Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log("Current area state:", area);

      const { eventStartDate, eventEndDate, ...restEventSetup } = eventSetup;

      let obj = {
        name: nameObj?.label,
        phone: phone,
        email: email,
        companyName: companyName,
        levelOfEnquiry,
        enquiryType: enquiryType,
        othersPreference: othersPreference,
        hotelName: hotelName,
        approxPassengers: approxPassengers,
        // hotelPreferences: hotelPreferences,
        checkIn: checkIn,
        checkOut: checkOut,
        city: city,
        noOfRooms: noOfRooms,
        categoryOfHotel: categoryOfHotel,
        occupancy: occupancy,
        banquet: banquet,
        room: room,
        eventSetup: {
          ...restEventSetup, // Spread the rest of the eventSetup properties
          setupRequired: eventSetup.setupRequired || "",
          eventDates: eventSetup.eventDates.map((date) => ({
            startDate: date.startDate,
            endDate: date.endDate,
          })),
        },
        airTickets: airTickets,
        cab: cab,
        billingAddress: billingAddress,
        area: area,
      };

      console.log(obj, "obj check");

      // Log each section of the object in detail
      console.log("User Details:", {
        name: obj.name,
        phone: obj.phone,
        email: obj.email,
        companyName: obj.companyName,
        levelOfEnquiry: obj.levelOfEnquiry,
        enquiryType: obj.enquiryType,
        // hotelPreferences: obj.hotelPreferences,
        checkIn: obj.checkIn,
        checkOut: obj.checkOut,
        city: obj.city,
        noOfRooms: obj.noOfRooms,
        categoryOfHotel: obj.categoryOfHotel,
        occupancy: obj.occupancy,
        billingAddress: obj.billingAddress,
        area: obj.area,
      });

      console.log("Room Details:", obj.room);
      obj.room.forEach((room, index) => {
        console.log(`Room ${index + 1}:`, {
          date: room.date,
          roomCategory: room?.roomCategory,
          noOfRooms: room.noOfRooms,
          occupancy: room.occupancy,
          mealPlan: room.mealPlan,
        });
      });

      console.log("Banquet Details:", obj.banquet);
      obj.banquet.forEach((banquet, index) => {
        console.log(`Banquet ${index + 1}:`, {
          date: banquet.date,
          session: banquet.session,
          seatingStyle: banquet.seatingStyle,
          avSetup: banquet.avSetup,
          menuType: banquet.menuType,
          minPax: banquet.minPax,
          seatingRequired: banquet.seatingRequired,
        });
      });

      console.log("Cab Details:", obj.cab);
      obj.cab.forEach((cab, index) => {
        console.log(`Cab ${index + 1}:`, {
          date: cab.date,
          fromCity: cab.fromCity,
          toCity: cab.toCity,
          noOfVehicles: cab.noOfVehicles,
          vehicleType: cab.vehicleType,
          tripType: cab.tripType,
          mealPlan: cab.mealPlan,
        });
      });

      console.log("Event Setup Details:", obj.eventSetup);
      console.log("Event Setup Function Type:", obj.eventSetup.functionType);
      console.log("Event Setup Required:", obj.eventSetup.setupRequired);
      console.log("Event Dates:", obj.eventSetup.eventDates);
      obj.eventSetup.eventDates.forEach((date, index) => {
        console.log(`Event Date ${index + 1}:`, {
          startDate: date.startDate,
          endDate: date.endDate,
        });
      });

      console.log("Air Tickets Details:", obj.airTickets);
      console.log("Air Tickets Trip Type:", obj.airTickets.tripType);
      console.log(
        "Air Tickets Number of Passengers:",
        obj.airTickets.numberOfPassengers
      );
      console.log("Air Tickets From City:", obj.airTickets.fromCity);
      console.log("Air Tickets To City:", obj.airTickets.toCity);
      console.log("Air Tickets Departure Date:", obj.airTickets.departureDate);
      console.log("Air Tickets Return Date:", obj.airTickets.returnDate);

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

  // const nameOptions =
  //   contact?.data &&
  //   contact?.data.map((item: any) => ({ value: item._id, label: item.name }));

  // console.log(cab, "cab check ");
  // console.log(banquet, "banquet check");

  //for resolving error for now
  const nameOptions = [{ value: "", label: "" }];

  console.log(othersPreference, "check other preferences");

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8">
      <div className=" mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Enquiry</h1>
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>

              <Select
                options={nameOptions}
                value={nameObj}
                onChange={(e) => setNameObj(e)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input
                type="text"
                name="area"
                value={area}
                onChange={(e) => {
                  console.log("Area Input Changed: ", e.target.value);
                  setArea(e.target.value);
                }}
                placeholder="Area"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rooms
              </label>
              <input
                type="number"
                name="noOfRooms"
                value={noOfRooms}
                onChange={(e) => setNoOfRooms(e.target.value)}
                placeholder="Number of Rooms"
                className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enquiry Type
              </label>
              <select
                name="enquiryType"
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Enquiry Type</option>
                <option value="room">Room</option>
                <option value="banquet">Banquet</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check In
              </label>
              <input
                type="date"
                name="checkIn"
                value={moment(checkIn).format("YYYY-MM-DD")}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Out
              </label>
              <input
                type="date"
                name="checkOut"
                value={moment(checkOut).format("YYYY-MM-DD")}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level of Enquiry
              </label>
              <select
                name="levelOfEnquiry"
                value={levelOfEnquiry}
                onChange={(e) => setLevelOfEnquiry(e.target.value)}
                className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">Select Enquiry Type</option>
                <option value="urgent">Urgent</option>
                <option value="moderate">Moderate</option>
                <option value="not urgent">Not Urgent</option>
              </select>
            </div>
            {/* Hotel Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Preference
              </label>
              <select
                value={othersPreference}
                onChange={(e) => setOthersPreference(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-2"
              >
                <option value="">Select a Preference</option>
                <option value="preference1">Preference 1</option>
                <option value="preference2">Preference 2</option>
                <option value="other">Other</option>
              </select>
              {othersPreference === "other" && (
                <input
                  type="text"
                  placeholder="Enter Hotel Name"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 "
                />
              )}
            </div>
            {/* Hotel Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Categories..."
              />
            </div>
            {/* Rate Required for (Occupancy) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 mt-2">
                Rate Required for (Occupancy)
              </label>

              <div className="flex space-x-4 mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="single occupancy"
                    checked={occupancy.includes("single occupancy")}
                    onChange={() => handleCheckboxChange("single occupancy")}
                  />
                  <span>Single Occupancy</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="double occupancy"
                    checked={occupancy.includes("double occupancy")}
                    onChange={() => handleCheckboxChange("double occupancy")}
                  />
                  <span>Double Occupancy</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="extra bed"
                    checked={occupancy.includes("extra bed")}
                    onChange={() => handleCheckboxChange("extra bed")}
                  />
                  <span>Extra Bed</span>
                </label>
              </div>
            </div>
          </div>

          {/* Room Table */}
          {(enquiryType === "room" || enquiryType === "both") && (
            <div className="mt-8">
              <h2 className="font-bold text-lg mb-4">Room</h2>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">
                      No. of Rooms
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Room Category
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Occupancy
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Meal Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {room &&
                    room?.length > 0 &&
                    room.map((row, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {row?.date}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
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
                            className="border border-gray-300 p-2 rounded-md w-full"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
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
                            className="border border-gray-300 p-2 rounded-md w-full"
                          >
                            <option value="">Select Category</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
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
                            className="border border-gray-300 p-2 rounded-md w-full"
                          >
                            <option value="">Select Occupancy</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Triple">Triple</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
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
                            className="border border-gray-300 p-2 rounded-md w-full"
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
                          <div className="mt-2">
                            {row &&
                              row?.mealPlan?.length > 0 &&
                              row.mealPlan.map((plan) => (
                                <span
                                  key={plan}
                                  className="inline-block bg-gray-200 px-3 py-1 text-sm rounded-full mr-2"
                                >
                                  {plan}{" "}
                                  <button
                                    onClick={() =>
                                      removeMealPlan(room, setRoom, index, plan)
                                    }
                                    className="text-red-500 font-bold"
                                  >
                                    x
                                  </button>
                                </span>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Button for "Same for All Days" */}
              <button
                type="button"
                onClick={() => {
                  if (room?.length > 0) {
                    const filledRow = room.find(
                      (row) =>
                        (row.noOfRooms && parseInt(row.noOfRooms) > 0) ||
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
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md"
              >
                Same for All Days
              </button>
            </div>
          )}

          {/* Banquet Table */}
          {(enquiryType === "banquet" || enquiryType === "both") && (
            <div className="mt-8">
              <h2 className="font-bold text-lg mb-4">Banquet</h2>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Session
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Seating Style
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      A/V Setup
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Menu Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Minimum No. of Pax
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Seating Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banquet.map((row, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 w-32">
                        {moment(row.date).format("YYYY-MM-DD")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={row?.session}
                          onChange={(e) =>
                            handleTableChange(
                              banquet,
                              setBanquet,
                              index,
                              "session",
                              e.target.value
                            )
                          }
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
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
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
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
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
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
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
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
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
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
                          className="border border-gray-300 p-2 rounded-md w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={() => {
                  if (banquet?.length > 0) {
                    const filledRow = banquet.find(
                      (row) =>
                        row.session ||
                        row.seatingStyle ||
                        row.avSetup ||
                        row.menuType ||
                        (row.minPax && parseInt(row.minPax) > 0) ||
                        row.seatingRequired
                    );
                    if (filledRow) {
                      setBanquet(
                        banquet.map((originalRow) => ({
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
                    alert("No banquet data available.");
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md"
              >
                Same for All Days
              </button>
            </div>
          )}

          {/* Checkboxes to toggle visibility */}
          <div className="mb-4 mt-8">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isEventSetupVisible}
                onChange={() => setIsEventSetupVisible(!isEventSetupVisible)}
                className="form-checkbox"
              />
              <span className="ml-2">Event Setup</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                checked={isAirTicketVisible}
                onChange={() => setIsAirTicketVisible(!isAirTicketVisible)}
                className="form-checkbox"
              />
              <span className="ml-2">Air Ticket</span>
            </label>
          </div>

          {/* Event Setup */}
          {isEventSetupVisible && (
            <div className="border rounded-lg mt-8 p-6 shadow">
              <h2 className="text-lg font-bold mb-4">Event Setup</h2>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Function Type
                </label>
                <select
                  name="functionType"
                  value={eventSetup.functionType}
                  onChange={(e) =>
                    handleEventDetailChange("functionType", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="">Select function type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Birthday Party">Birthday Party</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setup Required
                </label>
                <select
                  value={eventSetup.setupRequired || ""}
                  onChange={(e) =>
                    handleEventDetailChange("setupRequired", e.target.value)
                  }
                  className="border border-gray-300 p-2 rounded-md w-full"
                >
                  <option value="">Select required (yes / no)</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {eventSetup.eventDates.map((date, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Start Date
                  </label>
                  <input
                    type="date"
                    value={moment(date.startDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      handleDateChange(index, "startDate", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event End Date
                  </label>
                  <input
                    type="date"
                    value={moment(date.endDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      handleDateChange(index, "endDate", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addEventDate}
                className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-orange-600"
              >
                Add Date
              </button>
            </div>
          )}

          {/* Air Ticket */}
          {isAirTicketVisible && (
            <div className="border rounded-lg mt-8 p-6 shadow">
              <h2 className="text-lg font-bold mb-4">Air Ticket</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip type
                  </label>
                  <select
                    value={airTickets.tripType}
                    onChange={(e) =>
                      handleAirTicketChange("tripType", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  >
                    <option value="">Select trip type</option>
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of passengers
                  </label>
                  <input
                    type="number"
                    placeholder="Select passengers"
                    value={airTickets.numberOfPassengers}
                    onChange={(e) =>
                      handleAirTicketChange(
                        "numberOfPassengers",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From City
                  </label>
                  <select
                    value={airTickets.fromCity}
                    onChange={(e) =>
                      handleAirTicketChange("fromCity", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To City
                  </label>
                  <select
                    value={airTickets.toCity}
                    onChange={(e) =>
                      handleAirTicketChange("toCity", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  >
                    <option value="">Select To City</option>
                    {cityOptions.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure date
                  </label>
                  <input
                    type="date"
                    value={moment(airTickets.departureDate).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      handleAirTicketChange("departureDate", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return date
                  </label>
                  <input
                    type="date"
                    value={moment(airTickets.returnDate).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      handleAirTicketChange("returnDate", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cab Table */}

          <div className="mt-8">
            <h2 className="font-bold text-lg">Cab</h2>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">Trip Type:</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!isOutOfStation}
                    onChange={handleCabTypeChange}
                  />
                  Local
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isOutOfStation}
                    onChange={handleCabTypeChange}
                  />
                  Out of Station
                </label>
              </div>

              {/* Approx Passengers */}
              <div className="flex flex-col gap-2 mr-20">
                <label className="flex items-center gap-2">
                  Approx Number of Passengers:
                </label>
                <input
                  type="number"
                  value={approxPassengers}
                  onChange={(e) => setApproxPassengers(e.target.value)}
                  className="border p-1 w-86 rounded"
                />
              </div>
            </div>

            <table className="table-auto w-full border mt-4">
              <thead>
                <tr>
                  <th className="border px-2 py-2 w-[14.28%]">Date</th>
                  {isOutOfStation && (
                    <th className="border px-2 py-2 w-[14.28%]">From City</th>
                  )}
                  {isOutOfStation && (
                    <th className="border px-2 py-2 w-[14.28%]">To City</th>
                  )}
                  <th className="border px-2 py-2 w-[14.28%]">
                    No. of Vehicles
                  </th>
                  <th className="border px-2 py-2 w-[14.28%]">
                    Type of Vehicle
                  </th>
                  <th className="border px-2 py-2 w-[14.28%]">Trip Type</th>
                  <th className="border px-2 py-2 w-[14.28%]">Meal Plan</th>
                </tr>
              </thead>
              <tbody>
                {cab.map((row, index) => (
                  <tr key={index}>
                    {/* Date Column */}
                    <td className="border px-2 py-2 w-[14.28%]">
                      <input
                        type="date"
                        value={row?.date}
                        onChange={(e) =>
                          handleTableChange(
                            cab,
                            setCab,
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full rounded"
                      />
                    </td>

                    {/* From City Column */}
                    {isOutOfStation && (
                      <td className="border px-2 py-2 w-[14.28%]">
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
                              size="small" // Added this to reduce input height
                              sx={{
                                "& .MuiInputLabel-root": {
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  "&.MuiInputLabel-shrink": {
                                    transform:
                                      "translate(-50%, -50%) scale(0.75)",
                                    transformOrigin: "center top",
                                  },
                                },
                              }}
                            />
                          )}
                          // sx={{
                          //   "& .MuiAutocomplete-inputRoot": {
                          //     padding: "1px 4px", // Reduced padding
                          //     minHeight: "32px", // Reduced height
                          //   },
                          //   "& .MuiAutocomplete-listbox": {
                          //     maxHeight: "120px", // Reduced dropdown height
                          //     fontSize: "14px",
                          //     "& li": {
                          //       padding: "4px 8px", // Reduced option padding
                          //     },
                          //   },
                          // }}
                        />
                      </td>
                    )}

                    {/* To City Column */}
                    {isOutOfStation && (
                      <td className="border px-2 py-2 w-[14.28%]">
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
                              size="small" // Added this to reduce input height
                              sx={{
                                "& .MuiInputLabel-root": {
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  "&.MuiInputLabel-shrink": {
                                    transform:
                                      "translate(-50%, -50%) scale(0.75)",
                                    transformOrigin: "center top",
                                  },
                                },
                              }}
                            />
                          )}
                          // sx={{
                          //   "& .MuiAutocomplete-inputRoot": {
                          //     padding: "1px 4px", // Reduced padding
                          //     minHeight: "32px", // Reduced height
                          //   },
                          //   "& .MuiAutocomplete-listbox": {
                          //     maxHeight: "120px", // Reduced dropdown height
                          //     fontSize: "14px",
                          //     "& li": {
                          //       padding: "4px 8px", // Reduced option padding
                          //     },
                          //   },
                          // }}
                        />
                      </td>
                    )}

                    {/* Number of Vehicles Column */}
                    <td className="border px-2 py-2 w-[14.28%]">
                      <input
                        type="number"
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
                        className="border p-1 w-full rounded"
                      />
                    </td>

                    {/* Type of Vehicle Column */}
                    <td className="border px-2 py-2 w-[14.28%]">
                      <Autocomplete
                        options={vehicleTypeOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                          vehicleTypeOptions.find(
                            (option) => option.value === row?.vehicleType
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
                            // sx={{
                            //   "& .MuiInputLabel-root": {
                            //     left: "50%",
                            //     transform: "translate(-50%, -50%)",
                            //     "&.MuiInputLabel-shrink": {
                            //       transform:
                            //         "translate(-50%, -50%) scale(0.75)",
                            //       transformOrigin: "center top",
                            //     },
                            //   },
                            // }}
                          />
                        )}
                        sx={{
                          "& .MuiAutocomplete-inputRoot": {
                            padding: "2px 8px",
                          },
                          "& .MuiAutocomplete-listbox": {
                            maxHeight: "150px",
                            fontSize: "14px",
                          },
                        }}
                      />
                    </td>

                    {/* Trip Type Column */}
                    <td className="border px-2 py-2 w-[14.28%]">
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
                        className="border p-1 w-full rounded"
                      >
                        <option value="">Select Trip Type</option>
                        <option value="Airport Transfer">
                          Airport Transfer
                        </option>
                        <option value="Hourly Rental">Hourly Rental</option>
                        <option value="Outstation">Outstation</option>
                      </select>
                    </td>

                    {/* Meal Plan Column */}
                    <td className="border px-2 py-2 w-[14.28%]">
                      <select
                        onChange={(e) =>
                          handleMealPlanChange(
                            cab,
                            setCab,
                            index,
                            e.target.value
                          )
                        }
                        className="border p-1 w-full rounded mt-2"
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
                      <div className="mt-2">
                        {row.mealPlan.map((plan) => (
                          <span
                            key={plan}
                            className="inline-block bg-gray-200 px-2 py-1 mr-1 rounded"
                          >
                            {plan}{" "}
                            <button
                              onClick={() =>
                                removeMealPlan(cab, setCab, index, plan)
                              }
                              className="text-red-500 font-bold ml-1"
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addCabRow}
              className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            >
              Add a Date
            </button>
          </div>

          {/* Billing Address and Submit Button */}
          <div className="mt-8">
            <h2 className="font-bold text-lg">Billing Address</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* <input
                type="text"
                name="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter Billing Address"
                className="border border-gray-300 p-2 rounded-md w-full"
              /> */}
              <textarea
                name="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter Billing Address"
                className="border border-gray-300 p-2 rounded-md w-full"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 mt-6 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnquiryForm;
