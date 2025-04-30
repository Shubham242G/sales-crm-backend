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

"use client"

import { toastError, toastSuccess } from "@/utils/toast"
import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAddEnquiry, useEnquiryById, useUpdateEnquiryById } from "@/services/enquiry.service"
import moment from "moment"
import Select from "react-select"
import type { ReactSelectFormat } from "@/services/urls.service"
import { Autocomplete, TextField } from "@mui/material"
import { checkPermissionsForButtons } from "@/utils/permission"

interface Room {
  date: string
  roomCategory: string
  occupancy: string
  mealPlan: string[]
  noOfRooms: string
}

interface Banquet {
  date: string
  session: string
  seatingStyle: string
  avSetup: string
  menuType: string
  minPax: string
  seatingRequired: string
}

interface Cab {
  date: string
  fromCity?: string
  toCity?: string
  noOfVehicles: string
  vehicleType: string
  tripType: string
  mealPlan: string[]
}

interface EventDates {
  startDate: ""
  endDate: ""
}
//eventStartdate to be removed
interface EventSetup {
  functionType: string
  setupRequired: string
  eventDates: { startDate: string; endDate: string }[]
  eventStartDate: string
  eventEndDate: string
}

interface AirTickets {
  tripType: string
  numberOfPassengers: string
  fromCity: string
  toCity: string
  departureDate: string
  returnDate: string
  multiFromCity: string
  multiToCity: string
  multiDepartureDate: string
}

const AddEnquiryForm = () => {
  const [nameObj, setNameObj] = useState<ReactSelectFormat | null>(null)

  const { canView, canUpdate, canCreate } = checkPermissionsForButtons("Enquiry")

  const [companyName, setCompanyName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [salutation, setSalutation] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [enquiryType, setEnquiryType] = useState("")
  const [levelOfEnquiry, setLevelOfEnquiry] = useState("")
  const [othersPreference, setOthersPreference] = useState("")
  const [hotelName, setHotelName] = useState("")
  const [categoryOfHotel, setCategoryOfHotel] = useState<string[]>([])
  const hotelCategoryOptions = [
    { value: "budget", label: "Budget" },
    { value: "midrange", label: "Mid-Range" },
    { value: "luxury", label: "Luxury" },
    { value: "boutique", label: "Boutique" },
    { value: "business", label: "Business" },
    { value: "resort", label: "Resort" },
  ]

  const salutationOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
  ]

  const [occupancy, setOccupancy] = useState<string[]>([])
  // const occupancyOptions = [
  //   { value: "single occupancy", label: "Single Occupancy" },
  //   { value: "double occupancy", label: "Double Occupancy" },
  //   { value: "extra bed", label: "Extra Bed" },
  // ]
  const [approxPassengers, setApproxPassengers] = useState("")
  // const [hotelPreferences, setHotelPreferences] = useState("");
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [noOfRooms, setNoOfRooms] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  // const [categoryOfHotel, setCategoryOfHotel] = useState([]);
  // const [occupancy, setOccupancy] = useState([]);
  const [billingAddress, setBillingAddress] = useState("")

  const [room, setRoom] = useState<Room[]>([])
  const [banquet, setBanquet] = useState<Banquet[]>([])
  const [cab, setCab] = useState<Cab[]>([])
  const [isOutOfStation, setIsOutOfStation] = useState(false)
  // const [selectName, setSelectName] = useState('');

  const { mutateAsync: addEnquiry } = useAddEnquiry()
  const { mutateAsync: updateEnquiryById } = useUpdateEnquiryById()

  // const { data: contact } = useContact({ pageIndex: 0 });

  // const { data: contactById } = useContactById(nameObj?.value || "");

  // useEffect(() => {
  //   if (contactById?.data) {
  //     setPhone(contactById?.data?.phone);
  //     setEmail(contactById?.data?.email);
  //     console.log(nameObj, "<----nameObj");
  //   }
  // }, [contactById?.data]);
  const mealPlanOptions = ["Breakfast Only", "Half Board", "Full Board", "All Inclusive"]

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
  })

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
  })

  const customStyles = {
    control: (base: any) => ({
        ...base,
        border: '2px solid #e5e7eb !important',
        boxShadow: '0 !important',
        color:"#000",
        padding:'5px',
        fontFamily: "satoshi, sans-serif", 
        backgroundColor:'#fafafa',
        zindex:'9',
        minHeight:'30px',
        '&:hover': {
            border: '1px solid #e5e7eb !important',
           
        },

        menu: (provided:any) => ({
            ...provided,
            zIndex: 9999, // Increase the z-index here
          }),

          menuPortal: (provided:any) => ({ ...provided, zIndex: 5 }),
      
        
    }),
    option: (base:any) => ({
        ...base,
        cursor: "pointer",
        background: "white",
        color:"#000",
        fontFamily: "'inter', sans-serif", 
        zindex:'9',   // this was the mistake (I needed to remove this)
        "&:hover": {
           backgroundColor: "#687256",
           color:"#fff",
           fontFamily: "'inter', sans-serif", 
         },
})

}

  const [isEventSetupVisible, setIsEventSetupVisible] = useState(false)
  const [isAirTicketVisible, setIsAirTicketVisible] = useState(false)

  const { id } = useParams()
  const { data: enquiryDataById, isLoading } = useEnquiryById(id || "")
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const dates = []

      let currentDate = start
      while (currentDate <= end) {
        dates.push({ date: currentDate.toISOString().split("T")[0] })
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
      }

      setRoom(
        dates.map((date) => ({
          date: date.date,
          roomCategory: "",
          noOfRooms: noOfRooms,
          category: "",
          occupancy: "",
          mealPlan: [],
        })),
      )

      setBanquet(
        dates.map((date) => ({
          date: date.date,
          session: "",
          seatingStyle: "",
          avSetup: "",
          menuType: "",
          minPax: "",
          seatingRequired: "",
        })),
      )
      setCab(
        dates.map((date) => ({
          date: date.date,
          fromCity: "",
          toCity: "",
          noOfVehicles: "",
          vehicleType: "",
          tripType: "",
          mealPlan: [],
        })),
      )
    }
  }, [checkIn, checkOut, noOfRooms])

  useEffect(() => {
    setRoom(
      room.map((row) => ({
        date: row.date,
        roomCategory: row.roomCategory,
        noOfRooms: noOfRooms,
        category: "",
        occupancy: row.occupancy,
        mealPlan: [...row.mealPlan],
      })),
    )
  }, [enquiryDataById, noOfRooms])

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
      })),
    )
    setBanquet(
      banquet.map((row) => ({
        date: row.date,
        session: row.session,
        seatingStyle: row.seatingRequired,
        avSetup: row.avSetup,
        menuType: row.menuType,
        minPax: row.minPax,
        seatingRequired: row.seatingRequired,
      })),
    )
  }, [enquiryDataById])

  const handleMealPlanChange = (table: Room[] | Cab[], setTable: any, index: number, value: string): void => {
    const updatedTable: any = [...table]
    if (!updatedTable[index].mealPlan.includes(value)) {
      updatedTable[index].mealPlan.push(value)
    }
    setTable(updatedTable)
  }

  const handleCheckboxChange = (value: string) => {
    setOccupancy((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const removeMealPlan = (table: Room[] | Cab[], setTable: any, index: number, value: string): void => {
    const updatedTable = [...table]
    updatedTable[index].mealPlan = updatedTable[index].mealPlan.filter((plan) => plan !== value)
    setTable(updatedTable)
  }

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
    ])
  }

  const handleCabTypeChange = () => {
    setIsOutOfStation(!isOutOfStation)
  }

  // Handle Table Input Changes
  const handleTableChange = <T,>(
    table: T[],
    setTable: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: string,
  ): void => {
    const updatedTable: any = [...table]
    updatedTable[index][field] = value
    setTable(updatedTable)
  }

  const handleEventDetailChange = (field: keyof EventSetup, value: string) => {
    setEventSetup((prevState) => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleAirTicketChange = (field: keyof AirTickets, value: string) => {
    setAirTickets((prev) => ({ ...prev, [field]: value }))
  }

  const addEventDate = () => {
    const tempArray = [...eventSetup.eventDates]
    tempArray.push({ startDate: "", endDate: "" })
    setEventSetup({ ...eventSetup, eventDates: tempArray })
  }

  const handleDateChange = (index: number, field: keyof EventSetup["eventDates"][0], value: string): void => {
    const updatedDates = [...eventSetup.eventDates]
    updatedDates[index] = {
      ...updatedDates[index],
      [field]: value,
    }

    setEventSetup((prevState) => ({
      ...prevState,
      eventDates: updatedDates,
    }))
  }

  const navigate = useNavigate()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    switch (name) {
      case "companyName":
        setCompanyName(value)
        break
      case "phoneNumber":
        setPhoneNumber(value)
        break
      case "email":
        setEmail(value)
        break
      case "city":
        setCity(value)
        break
      case "area":
        setArea(value)
        break
      case "noOfRooms":
        setNoOfRooms(value)
        break
      case "enquiryType":
        setEnquiryType(value)
        break
      case "checkIn":
        setCheckIn(value)
        break
      case "checkOut":
        setCheckOut(value)
        break
      case "levelOfEnquiry":
        setLevelOfEnquiry(value)
        break
      case "billingAddress":
        setBillingAddress(value)
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Prefill form when editing
    if (enquiryDataById && enquiryDataById?.data) {
      const { eventSetup } = enquiryDataById.data


      setAirTickets(enquiryDataById?.data?.airTickets || airTickets)
      setEventSetup({
        functionType: eventSetup.functionType || "",
        setupRequired: eventSetup.setupRequired || "",
        eventDates: eventSetup.eventDates.map((date: any) => ({
          startDate: moment(date?.startDate).format("YYYY-MM-DD"),
          endDate: moment(date?.endDate).format("YYYY-MM-DD"),
        })),

        eventStartDate: eventSetup?.eventStartDate || "",
        eventEndDate: eventSetup?.eventEndDate || "",
      })
      setBanquet(enquiryDataById?.data?.banquet)
      setRoom([...enquiryDataById?.data?.room])
      //   setCab(enquiryDataById?.data?.cab)
      setBillingAddress(enquiryDataById?.data?.billingAddress)
      setCompanyName(enquiryDataById?.data?.companyName)

      setPhoneNumber(enquiryDataById?.data?.phoneNumber)
      setHotelName(enquiryDataById?.data?.hotelName)
      setApproxPassengers(enquiryDataById?.data?.approxPassengers)
      setOthersPreference(enquiryDataById?.data?.othersPreference)
      setCategoryOfHotel(enquiryDataById?.data?.categoryOfHotel)
      setOccupancy(enquiryDataById?.data?.occupancy)
      setEmail(enquiryDataById?.data?.email)
      setCity(enquiryDataById?.data?.city)
      setArea(enquiryDataById?.data?.area)
      setNoOfRooms(enquiryDataById?.data?.noOfRooms || "")
      setEnquiryType(enquiryDataById?.data?.enquiryType)
      setCheckIn(enquiryDataById?.data?.checkIn)
      setCheckOut(enquiryDataById?.data?.checkOut)
      setLevelOfEnquiry(enquiryDataById?.data?.levelOfEnquiry)
      setEventSetup(enquiryDataById?.data?.eventSetup)
      setFirstName(enquiryDataById?.data?.firstName)
      setLastName(enquiryDataById?.data?.lastName)
      setSalutation(enquiryDataById?.data?.salutation)

      setIsOutOfStation(!!enquiryDataById?.data?.cab?.some((c: Cab) => c.fromCity && c.toCity))

      setCab(enquiryDataById?.data?.cab)
      //  setUser(enquiryDataById?.data)
      setIsEventSetupVisible(!!enquiryDataById.data.eventSetup?.functionType)
      setIsAirTicketVisible(!!enquiryDataById.data.airTickets?.tripType)
    }
  }, [enquiryDataById])


  // Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {

      const { eventStartDate, eventEndDate, ...restEventSetup } = eventSetup

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
          ...restEventSetup,
          setupRequired: eventSetup.setupRequired || "",
          eventDates: eventSetup.eventDates.map((date) => ({
            startDate: date?.startDate,
            endDate: date?.endDate,
          })),
        },
        airTickets: airTickets,
        cab: cab,
        billingAddress: billingAddress,
        area: area,
      }




      // obj.room.forEach((room, index) => {
      //   console.log(`Room ${index + 1}:`, {
      //     date: room.date,
      //     roomCategory: room?.roomCategory,
      //     noOfRooms: room.noOfRooms,
      //     occupancy: room.occupancy,
      //     mealPlan: room.mealPlan,
      //   })
      // })

      // console.log("Banquet Details:", obj.banquet)
      // obj.banquet.forEach((banquet, index) => {
      //   console.log(`Banquet ${index + 1}:`, {
      //     date: banquet.date,
      //     session: banquet.session,
      //     seatingStyle: banquet.seatingStyle,
      //     avSetup: banquet.avSetup,
      //     menuType: banquet.menuType,
      //     minPax: banquet.minPax,
      //     seatingRequired: banquet.seatingRequired,
      //   })
      // })

      // console.log("Cab Details:", obj.cab)
      // obj.cab.forEach((cab, index) => {
      //   console.log(`Cab ${index + 1}:`, {
      //     date: cab.date,
      //     fromCity: cab.fromCity,
      //     toCity: cab.toCity,
      //     noOfVehicles: cab.noOfVehicles,
      //     vehicleType: cab.vehicleType,
      //     tripType: cab.tripType,
      //     mealPlan: cab.mealPlan,
      //   })
      // })

      // console.log("Event Setup Details:", obj.eventSetup)
      // console.log("Event Setup Function Type:", obj.eventSetup.functionType)
      // console.log("Event Setup Required:", obj.eventSetup.setupRequired)
      // console.log("Event Dates:", obj.eventSetup.eventDates)
      // obj.eventSetup.eventDates.forEach((date, index) => {
      //   console.log(`Event Date ${index + 1}:`, {
      //     startDate: date?.startDate,
      //     endDate: date?.endDate,
      //   })
      // })

      

      if (id) {
        
        const { data: res } = await updateEnquiryById({ id, obj })

        if (res?.message) {
          toastSuccess(res.message)
          navigate("/enquiryList")
        }
      } else {
        const { data: res } = await addEnquiry(obj)
        if (res?.message) {
          toastSuccess(res.message)
          navigate("/enquiryList")
        }
      }
    } catch (error) {
      toastError(error)
    }
  }

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
  ]

  const vehicleTypeOptions = [
    { label: "Sedan", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "Minivan", value: "minivan" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Luxury", value: "luxury" },
  ]
  const handleSelectChange = (name: string, value: string) => {
    setSalutation(value)
  }

  // const nameOptions =
  //   contact?.data &&
  //   contact?.data.map((item: any) => ({ value: item._id, label: item.name }));

  // console.log(cab, "cab check ");
  // console.log(banquet, "banquet check");

  //for resolving error for now
  const nameOptions = [{ value: "", label: "" }]


  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white text-black py-4 px-6">
        <h1 className="text-xl font-semibold">Enquiry</h1>
      </div>
      <div className="min-h-screen w-full bg-[#FAFAFA] p-4">
        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className=" p-6 rounded bg-[#FAFAFA] shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Salutation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salutation</label>
                <select
                  onChange={(val) => handleSelectChange("salutation", val.target.value)}
                  value={salutation}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* LastName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={area}
                  onChange={(e) => {
                    console.log("Area Input Changed: ", e.target.value)
                    setArea(e.target.value)
                  }}
                  placeholder="Area"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Number of Rooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  name="noOfRooms"
                  value={noOfRooms}
                  onChange={(e) => setNoOfRooms(e.target.value)}
                  placeholder="Number of Rooms"
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Enquiry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Type</label>
                <select
                  name="enquiryType"
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Enquiry Type</option>
                  <option value="room">Room</option>
                  <option value="banquet">Banquet</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Check In */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <input
                  type="date"
                  name="checkIn"
                  value={moment(checkIn).format("YYYY-MM-DD")}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Check Out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={moment(checkOut).format("YYYY-MM-DD")}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border bg-gray-50 border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Level of Enquiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level of Enquiry</label>
                <select
                  name="levelOfEnquiry"
                  value={levelOfEnquiry}
                  onChange={(e) => setLevelOfEnquiry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Enquiry Type</option>
                  <option value="urgent">Urgent</option>
                  <option value="moderate">Moderate</option>
                  <option value="not urgent">Not Urgent</option>
                </select>
              </div>

              {/* Hotel Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Preference</label>
                <select
                  value={othersPreference}
                  onChange={(e) => setOthersPreference(e.target.value)}
                  className="w-full border border-gray-300 bg-gray-50 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded p-2 text-sm mt-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>

              {/* Hotel Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Category</label>
                <Select
                  isMulti
                  options={hotelCategoryOptions}
                  value={hotelCategoryOptions.filter((option) => categoryOfHotel.includes(option.value))}
                  onChange={(selected) => {
                    const values = selected ? selected.map((opt) => opt.value) : []
                    setCategoryOfHotel(values)
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select Categories..."
                  styles={customStyles}
                />
              </div>

              {/* Rate Required for (Occupancy) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-1 mb-1">Rate Required for (Occupancy)</label>
                <div className="flex space-x-4 mt-5">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="single occupancy"
                      checked={occupancy.includes("single occupancy")}
                      onChange={() => handleCheckboxChange("single occupancy")}
                      className="form-checkbox bg-gray-50 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Single Occupancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="double occupancy"
                      checked={occupancy.includes("double occupancy")}
                      onChange={() => handleCheckboxChange("double occupancy")}
                      className="form-checkbox bg-gray-50 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Double Occupancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value="extra bed"
                      checked={occupancy.includes("extra bed")}
                      onChange={() => handleCheckboxChange("extra bed")}
                      className="form-checkbox bg-gray-50 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">Extra Bed</span>
                  </label>
                </div>
              </div>
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
                        <th className="px-4 py-2 text-left text-xs font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">No. of Rooms</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Room Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Occupancy</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Meal Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {room &&
                        room?.length > 0 &&
                        room.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">{row?.date}</td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">
                              <input
                                type="number"
                                value={row?.noOfRooms}
                                onChange={(e) => handleTableChange(room, setRoom, index, "noOfRooms", e.target.value)}
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              />
                            </td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">
                              <select
                                value={row?.roomCategory}
                                onChange={(e) =>
                                  handleTableChange(room, setRoom, index, "roomCategory", e.target.value)
                                }
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Category</option>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">
                              <select
                                value={row?.occupancy}
                                onChange={(e) => handleTableChange(room, setRoom, index, "occupancy", e.target.value)}
                                className="border border-gray-300 p-1 rounded w-full text-sm"
                              >
                                <option value="">Select Occupancy</option>
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Triple">Triple</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">
                              <select
                                onChange={(e) => handleMealPlanChange(room, setRoom, index, e.target.value)}
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
                                    ),
                                )}
                              </select>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {row &&
                                  row?.mealPlan?.length > 0 &&
                                  row.mealPlan.map((plan) => (
                                    <span key={plan} className="inline-block bg-gray-100 px-2 py-1 text-xs rounded">
                                      {plan}{" "}
                                      <button
                                        onClick={() => removeMealPlan(room, setRoom, index, plan)}
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
                </div>
                {/* Button for "Same for All Days" */}
                <button
                  type="button"
                  onClick={() => {
                    if (room?.length > 0) {
                      const filledRow = room.find(
                        (row) =>
                          (row.noOfRooms && Number.parseInt(row.noOfRooms) > 0) ||
                          row.roomCategory ||
                          row.occupancy ||
                          (row.mealPlan && row.mealPlan.length > 0),
                      )
                      if (filledRow) {
                        setRoom(
                          room.map((originalRow) => ({
                            ...filledRow,
                            date: originalRow.date,
                          })),
                        )
                      } else {
                        alert("Please fill in at least one row before applying to all days.")
                      }
                    } else {
                      alert("No room data available.")
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
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#0B2F46] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Session</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Seating Style</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">A/V Setup</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Menu Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Minimum No. of Pax</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Seating Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {banquet.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            {moment(row.date).format("YYYY-MM-DD")}
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="text"
                              value={row?.session}
                              onChange={(e) => handleTableChange(banquet, setBanquet, index, "session", e.target.value)}
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="text"
                              value={row?.seatingStyle}
                              onChange={(e) =>
                                handleTableChange(banquet, setBanquet, index, "seatingStyle", e.target.value)
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="text"
                              value={row?.avSetup}
                              onChange={(e) => handleTableChange(banquet, setBanquet, index, "avSetup", e.target.value)}
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="text"
                              value={row?.menuType}
                              onChange={(e) =>
                                handleTableChange(banquet, setBanquet, index, "menuType", e.target.value)
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="number"
                              value={row?.minPax}
                              onChange={(e) => handleTableChange(banquet, setBanquet, index, "minPax", e.target.value)}
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <input
                              type="text"
                              value={row?.seatingRequired}
                              onChange={(e) =>
                                handleTableChange(banquet, setBanquet, index, "seatingRequired", e.target.value)
                              }
                              className="border border-gray-300 p-1 rounded w-full text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                          (row.minPax && Number.parseInt(row.minPax) > 0) ||
                          row.seatingRequired,
                      )
                      if (filledRow) {
                        setBanquet(
                          banquet.map((originalRow) => ({
                            ...filledRow,
                            date: originalRow.date,
                          })),
                        )
                      } else {
                        alert("Please fill in at least one row before applying to all days.")
                      }
                    } else {
                      alert("No banquet data available.")
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 mt-3 rounded"
                >
                  Same for All Days
                </button>
              </div>
            </div>
          )}

          {/* Checkboxes to toggle visibility */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Function Type</label>
                    <select
                      name="functionType"
                      value={eventSetup.functionType}
                      onChange={(e) => handleEventDetailChange("functionType", e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select function type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Birthday Party">Birthday Party</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Required</label>
                    <select
                      value={eventSetup.setupRequired || ""}
                      onChange={(e) => handleEventDetailChange("setupRequired", e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select required (yes / no)</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {eventSetup.eventDates.map((date, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Start Date</label>
                      <input
                        type="date"
                        value={date && date?.startDate ? moment(date?.startDate).format("YYYY-MM-DD") : ""}
                        onChange={(e) => handleDateChange(index, "startDate", e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event End Date</label>
                      <input
                        type="date"
                        value={moment(date.endDate).format("YYYY-MM-DD")}
                        onChange={(e) => handleDateChange(index, "endDate", e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trip type</label>
                    <select
                      value={airTickets.tripType}
                      onChange={(e) => handleAirTicketChange("tripType", e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    >
                      <option value="">Select trip type</option>
                      <option value="One Way">One Way</option>
                      <option value="Round Trip">Round Trip</option>
                      <option value="Multi City">Multi City</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of passengers</label>
                    <input
                      type="number"
                      placeholder="Select passengers"
                      value={airTickets.numberOfPassengers}
                      onChange={(e) => handleAirTicketChange("numberOfPassengers", e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From City</label>
                    <select
                      value={airTickets.fromCity}
                      onChange={(e) => handleAirTicketChange("fromCity", e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">To City</label>
                    <select
                      value={airTickets.toCity}
                      onChange={(e) => handleAirTicketChange("toCity", e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Return date</label>
                      <input
                        type="date"
                        value={moment(airTickets.returnDate).format("YYYY-MM-DD")}
                        onChange={(e) => handleAirTicketChange("returnDate", e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full text-sm"
                      />
                    </div>
                  )}

                  {/* Multi City Fields */}
                  {airTickets.tripType === "Multi City" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From City</label>
                        <select
                          value={airTickets.multiFromCity}
                          onChange={(e) => handleAirTicketChange("multiFromCity", e.target.value)}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">To City</label>
                        <select
                          value={airTickets.multiToCity}
                          onChange={(e) => handleAirTicketChange("multiToCity", e.target.value)}
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        >
                          <option value="">Select To City</option>
                          {cityOptions
                            .filter((city) => city.value !== airTickets.multiFromCity)
                            .map((city) => (
                              <option key={city.value} value={city.value}>
                                {city.label}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure date</label>
                        <input
                          type="date"
                          value={moment(airTickets.multiDepartureDate).format("YYYY-MM-DD")}
                          onChange={(e) => handleAirTicketChange("multiDepartureDate", e.target.value)}
                          className="border border-gray-300 p-2 rounded w-full text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cab Table */}
          <div className="bg-white rounded shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-base">Cab</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Trip Type:</label>
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
                  <label className="text-sm font-medium text-gray-700">Approx Number of Passengers:</label>
                  <input
                    type="number"
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
                      <th className="px-4 py-2 text-left text-xs font-bold">Date</th>
                      {isOutOfStation && <th className="px-4 py-2 text-left text-xs font-medium">From City</th>}
                      {isOutOfStation && <th className="px-4 py-2 text-left text-xs font-medium">To City</th>}
                      <th className="px-4 py-2 text-left text-xs font-bold">No. of Vehicles</th>
                      <th className="px-4 py-2 text-left text-xs font-bold">Type of Vehicle</th>
                      <th className="px-4 py-2 text-left text-xs font-bold">Trip Type</th>
                      <th className="px-4 py-2 text-left text-xs font-bold">Meal Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cab.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                          <input
                            type="date"
                            value={moment(row?.date).format("YYYY-MM-DD") || row?.date}
                            onChange={(e) => handleTableChange(cab, setCab, index, "date", e.target.value)}
                            className="border border-gray-300 p-1 rounded w-full text-sm"
                          />
                        </td>

                        {isOutOfStation && (
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <Autocomplete
                              options={cityOptions}
                              getOptionLabel={(option) => option.label}
                              value={cityOptions.find((option) => option.value === row?.fromCity) || null}
                              onChange={(event, newValue) =>
                                handleTableChange(cab, setCab, index, "fromCity", newValue?.value || "")
                              }
                              isOptionEqualToValue={(option, value) => option.value === value.value}
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
                          <td className="px-4 py-2 text-sm border-b border-gray-200">
                            <Autocomplete
                              options={cityOptions}
                              getOptionLabel={(option) => option.label}
                              value={cityOptions.find((option) => option.value === row?.toCity) || null}
                              onChange={(event, newValue) =>
                                handleTableChange(cab, setCab, index, "toCity", newValue?.value || "")
                              }
                              isOptionEqualToValue={(option, value) => option.value === value.value}
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

                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                          <input
                            type="number"
                            value={row?.noOfVehicles}
                            onChange={(e) => handleTableChange(cab, setCab, index, "noOfVehicles", e.target.value)}
                            className="border border-gray-300 p-1 rounded w-full text-sm"
                          />
                        </td>

                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                          <Autocomplete
                            options={vehicleTypeOptions}
                            getOptionLabel={(option) => option.label}
                            value={vehicleTypeOptions.find((option) => option.value === row?.vehicleType) || null}
                            onChange={(event, newValue) =>
                              handleTableChange(cab, setCab, index, "vehicleType", newValue?.value || "")
                            }
                            isOptionEqualToValue={(option, value) => option.value === value.value}
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

                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                          <select
                            value={row?.tripType}
                            onChange={(e) => handleTableChange(cab, setCab, index, "tripType", e.target.value)}
                            className="border border-gray-300 p-1 rounded w-full text-sm"
                          >
                            <option value="">Select Trip Type</option>
                            <option value="Airport Transfer">Airport Transfer</option>
                            <option value="Hourly Rental">Hourly Rental</option>
                            <option value="Outstation">Outstation</option>
                          </select>
                        </td>

                        <td className="px-4 py-2 text-sm border-b border-gray-200">
                          <select
                            onChange={(e) => handleMealPlanChange(cab, setCab, index, e.target.value)}
                            className="border border-gray-300 p-1 rounded w-full text-sm"
                          >
                            <option value="">Select Meal Plan</option>
                            {mealPlanOptions.map(
                              (plan) =>
                                !row.mealPlan.includes(plan) && (
                                  <option key={plan} value={plan}>
                                    {plan}
                                  </option>
                                ),
                            )}
                          </select>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {row.mealPlan.map((plan) => (
                              <span key={plan} className="inline-block bg-gray-100 px-2 py-1 text-xs rounded">
                                {plan}{" "}
                                <button
                                  onClick={() => removeMealPlan(cab, setCab, index, plan)}
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

          {/* Billing Address and Submit Button */}
          <div className="bg-white rounded shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-base">Billing Address</h2>
            </div>
            <div className="p-4">
              <textarea
                name="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter Billing Address"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm"
            >
              Cancel
            </button>

            {((!id && canCreate) || (id && canUpdate)) && (
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm">
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEnquiryForm

