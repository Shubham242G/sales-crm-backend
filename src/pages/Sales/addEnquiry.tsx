import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAddEnquiry, useEnquiryById, useUpdateEnquiryById } from "@/services/enquiry.service";
import { toastError, toastSuccess } from '@/utils/toast';


// import from {@tanstack/}


const AddEnquiry = () => {

    const [tasks, setTasks] = useState([
        { date: '2025-05-19', hours: '', category: '', frequency: '', startTime: '', endTime: '' },
        { date: '2025-09-18', hours: '', category: '', frequency: '', startTime: '', endTime: '' },
        { date: '2025-05-11', hours: '', category: '', frequency: '', startTime: '', endTime: '' },
        { date: '2025-05-19', hours: '', category: '', frequency: '', startTime: '', endTime: '' }
    ]);


    // const [eventSetup, setEventSetup] = useState({
    //     functionType: '',
    //     startDate: '',
    //     endDate: '',
    //     setupRequired: ''
    // });

    // const [airTicket, setAirTicket] = useState({
    //     tripType: '',
    //     fromCity: '',
    //     toCity: '',
    //     departureDate: '',
    //     returnDate: '',
    //     passengers: ''
    // });

    const addTask = () => {
        setTasks([...tasks, { date: '', hours: '', category: '', frequency: '', startTime: '', endTime: '' }]);
    };

    const handleChange = (index: number, field: any, value: any) => {
        const updatedTasks = tasks.map((task, i) => (
            i === index ? { ...task, [field]: value } : task
        ));
        setTasks(updatedTasks);
    };





    // const handleEventChange = (field: any, value: any) => {
    //     setEventSetup({ ...eventSetup, [field]: value });
    // };

    // const handleAirTicketChange = (field: any, value: any) => {
    //     setAirTicket({ ...airTicket, [field]: value });
    // };


    interface Banquet {
        date: string;
        session: string;
        seatingStyle: string;
        avSetup: string;
        menuType: string;
        noOfPax: string;
        seatingRequired: string;
    }[]

    interface Room {
        date: string;
        noOfRooms: string;
        roomCategory: string;
        occupancy: string;
        mealPlan: string[];
    }[]

    interface Cab {
        date: string,
        noOfVehicle: string,
        typeOfVehicle: string,
        cabTripType: string,
        mealPlan: string[],
        fromCity: string,
        toCity: string,
        tripType: string,
        approxNumberOfPassengers: string;
    }[]

    interface EventSetup {
        functiontype: string;
        eventDates: {
            eventStart: string;
            eventEndDate: string;
            conference: {
                Date: string;
                startTime: string;
                endTime: string;
            };
        };
        eventSetupRequired: string;
    }

    interface UserDetails{
        name: string;
        phone: string;
        email: string;
        companyName: string;
        typeOfContact: string;
        levelOfEnquiry: string;
        enquiryType: string;
        hotelPreferences: string;
        area:string;
        checkIn:string;
        checkOut: string;
        city: string;
        numberOfRooms: string;
        contactId: string;
        subject: string;
        details: string;
        priority: string;
        billingDetails:string;
        categoryOfHotel:CategoryOfHotelOption[];
        occupancy:string[];
    };

    interface AirTicket {
        tripType: string;
        numberOfPassenger: string;
        fromCity: string;
        toCity: string;
        departureDate: string;
        returnDate: string;
    }

    interface CategoryOfHotelOption {
        label: string;
        value: string;
        hotelName: string[];
    }[]



    const [cabType, setCabType] = useState('LOCAL');

    const [cabData, setCabData] = useState( {
        date: "",
        noOfVehicle: "",
        typeOfVehicle: "",
        cabTripType: "",
        mealPlan: [],
        fromCity: "",
        toCity: "",
        tripType: "",
        approxNumberOfPassengers: ""
    })

    const [eventSetup, setEventSetup] = useState<EventSetup>({
        functiontype: "",
        eventDates: {
            eventStart: "",
            eventEndDate: "",
            conference: {
                Date: "",
                startTime: "",
                endTime: ""
            }
        },
        eventSetupRequired: ""
    });

    

    const [airTicketData, setAirTicketData] = useState({
        tripType: "",
        numberOfPassenger: "",    
        fromCity: "",
        toCity: "",
        departureDate: "",
        returnDate: "",
    })

    const [roomData, setRoomData ]= useState<Room>({
        date: "",
        noOfRooms: "",
        roomCategory: "",
        occupancy: "",
        mealPlan: [],
    });

    const [banquet, setBanquet] = useState<Banquet[]>([{
        date: "",
        session: "",
        seatingStyle: "",
        avSetup: "",        
        menuType: "",
        noOfPax: "",
        seatingRequired: "",
    }]);

    

    const [airTicket, setAirTicket] = useState<AirTicket>({
        tripType: "",
        numberOfPassenger: "",    
        fromCity: "",
        toCity: "",
        departureDate: "",
        returnDate: "",
    })

    

    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: "",
        phone: "",
        email: "",
        companyName: "",
        typeOfContact: "",
        levelOfEnquiry: "",
        enquiryType: "",
        hotelPreferences: "",
        area:"",
        checkIn: 
        '',
        checkOut: 
        '',
        city: "",
        numberOfRooms: "",
        contactId: "",
        subject: "",
        details: "",
        priority: "",
        billingDetails:"",
        categoryOfHotel:[],
        occupancy:[]
        
    });
        
    
    useEffect(() => {

    }, [])

    

    const [isCategoryOfHotelOpen, setIsCategoryOfHotelOpen] = useState(false);

    const categories: CategoryOfHotelOption[] = [
        { label: '3 star', value: '3star', hotelName:["pataya","hotel jamshed"]},
        { label: '4 star', value: '4star' , hotelName:["hotel dharavi","lila hotel"] },
        { label: '5 star', value: '5star' , hotelName:["abu dubai hotel","seaven seas hotel"] },
    ];

    const handleCategoryOfHotelSelect = (categoryOfHotel: CategoryOfHotelOption) => {
        if (!formData.categoryOfHotel.find(c => c.value === categoryOfHotel.value)) {
            setFormData({ ...formData, categoryOfHotel: [...formData.categoryOfHotel, categoryOfHotel] });
        }
    };
    const handleCategoryOfHotelRemove = (categoryOfHotelRemove: CategoryOfHotelOption) => {
        setFormData({
            ...formData,
            categoryOfHotel: formData.categoryOfHotel.filter(
                category => category.value !== categoryOfHotelRemove.value
            )
        });
    };

    type InitialRoom = {
        date: string;
        noOfRooms: string;
        roomCategory: string;
        occupancy: string;
        mealPlan: string[];
    };
    const initialRoom: InitialRoom = {
        date: '',
        noOfRooms: '',
        roomCategory: '',
        occupancy: '',
        mealPlan: []

    }

    const mealOptions = ['general meal plan', 'special meal plan', 'extra special meal plan'];
    const areaOptions = ['delhi','mumbai','goa']

    const [roomRows, setRoomRows] = useState([initialRoom]);
    const handleRoomChange = (index: number, e: any) => {
        const { name, value } = e.target;
        const updatedRows = [...roomRows];
        updatedRows[index] = {
            ...updatedRows[index],
            [name]: value
        };
        setRoomRows(updatedRows);
    }

    const handleAddRoomRow = () => {
        setRoomRows([...roomRows, ...[initialRoom]]);
    };

    const deleteRoomRow = (i: number) => {
        const tempArr = roomRows.filter((el: any, index: number) => (
            index !== i
        ))
        setRoomRows(tempArr)
    }

    const MealPlanSelector: React.FC<{
        selectedPlans: string[];
        allOptions: string[];
        onSelect: (plan: string) => void;
        onRemove: (plan: string) => void;
    }> = ({ selectedPlans, onSelect, onRemove, allOptions }) => {
        const availableOptions = allOptions.filter(option => !selectedPlans.includes(option));
        return (
            <div className="relative inline-block w-full">
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedPlans.map((plan) => (
                        <div key={plan} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                            {plan}
                            <button
                                onClick={() => onRemove(plan)}
                                className="ml-1 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <select
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value) onSelect(value);
                    }}
                    className="w-full border rounded p-1"
                >
                    <option value={selectedPlans}>Select Meal Plan</option>
                    {availableOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    };









    const handleSelectMealPlan = (index: number, plan: string) => {
        const updatedRows = [...roomRows];
        updatedRows[index].mealPlan.push(plan);
        setRoomRows(updatedRows);
    };



    


    // const initialBanquet = 
    // type initialBanquet = {
    //     date: string;
    //     session: string;
    //     seatingStyle: string;
    //     avSetup: boolean;
    //     menuType: string;
    //     numberOfPax: string;
    //     seatingRequired: string;
    // };

    const sessionOptions = ['morning', 'evening', 'night'];
    const seatingStyleOptions = ['outside seating', 'inside seating', 'luxury seating'];
    const menuTypeOptions = ['vegetarian', 'non-vegetarian', 'eggitarian', 'no meal'];
    const seatingRequiredOptions = ['100 seater', '200 seater', '300 seater'];


    const [banquetRows, setBanquetRows] = useState([{ date: '', session: '', seatingStyle: "", avSetup: false, menuType: '', numberOfPax: '', seatingRequired: '' }]);

    const handleBanquetChange = (index: number, e: any) => {
        const { name, value } = e.target;
        console.log("name--->",name, value );
        const updatedRows = [...banquetRows];
        console.log("index--->",index);
        updatedRows[index] = {
            ...updatedRows[index],
            [name]: value
        };
        setBanquetRows(updatedRows);

    
      console.log("updatedRows--->",updatedRows);
    }

    const handleAvSetupChange = (index: number, value: string) => {
        const updatedRows = [...banquetRows];
        updatedRows[index].avSetup = value === 'Yes';
        setBanquetRows(updatedRows);
    };

    const handleAddBanquet = () => {
        setBanquetRows([...banquetRows, { date: '', session: '', seatingStyle: "", avSetup: false, menuType: '', numberOfPax: '', seatingRequired: '' }]);
    };

    const handleDeleteBanquetRow = (index: number) => {
        const updatedRows = banquetRows.filter((_, i) => i !== index);
        setBanquetRows(updatedRows);
    };

    const { id } = useParams();

    const navigate = useNavigate();
    const { mutateAsync: addEnquiry } = useAddEnquiry();
    const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();
    const { data: enquiryDataById, isLoading } = useEnquiryById(id || "");


    useEffect(() => {
        // Prefill form when editing
        if (enquiryDataById) {
            console.log(enquiryDataById, "getById/");
            // setFormData(enquiryDataById?.data || "");
        }
    }, [enquiryDataById]);
    const handleSubmit = async (e: React.FormEvent) => {


        // const obj = [ ...formData, {
        //     banquet: [...banquetRows],
        //     room: [...roomRows],
        //     eventSetup: 
                
        //     }
        // }]

        // }]

      


        e.preventDefault();
        console.log("Check form data--->", formData);
        // try {


        //     const obj = formData;

        //     if (id) {

        //         const { data: res } = await updateEnquiry({ id, obj });
        //         if (res?.message) {
        //             toastSuccess(res.message);
        //             navigate("/enquiryList")

        //         }
        //     } else {

        //         const { data: res } = await addEnquiry(obj);
        //         if (res?.message) {
        //             toastSuccess(res.message);
        //             navigate("/enquiryList")

        //         }
        //     }
        // } catch (error) {
        //     toastError(error);
        // }
    };

    const handleEventSetupRequiredChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            eventSetup: {
                ...prevState.eventSetup,
                setupRequired: value  // Updates 'setupRequired' with 'Yes' or 'No'
            }
        }));

    }

    const handleFunctionTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            eventSetup: {
                ...prev.eventSetup,
                functiontype: value
            }
        }
        ))

    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCabInputChange = (index: number, field: string, value: string | string[]) => {
        setFormData((prev) => ({
            ...prev,
            cab: prev.cab.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const functionTypeOptions = ['marriage', 'engagement', 'conference', 'meeting'];

    type CabRow = {
        date: string;
        noOfVehicle: string;
        typeOfVehicle: string;
        tripType: string;
        mealPlan: never[];
    };

    const handleSelectCabMealPlan = (index: number, plan: string) => {
        const updatedRows = formData.cab.map((item, i) =>
            i === index
                ? { ...item, mealPlan: [...item.mealPlan, plan] }
                : item
        );
        setFormData({ ...formData, cab: updatedRows });

    };

    const handleRemoveCabMealPlan = (index: number, plan: string) => {
        const updatedRows = formData.cab.map((item, i) =>
            i === index
                ? { ...item, mealPlan: item.mealPlan.filter((p) => p !== plan) }
                : item
        );
        setFormData({ ...formData, cab: updatedRows });

    };




    type OutStationCabRow = CabRow & {
        fromCity: string;
        toCity: string;
    };

    const initialRow: CabRow = { date: '', noOfVehicle: '', typeOfVehicle: '', tripType: '', mealPlan: [] };
    const initialOutStationRow: OutStationCabRow = { date: '', fromCity: '', toCity: '', noOfVehicle: '', typeOfVehicle: '', tripType: '', mealPlan: [] };

    const [localRows, setLocalRows] = useState<CabRow[]>([initialRow]);
    const [outStationRows, setOutStationRows] = useState<OutStationCabRow[]>([initialOutStationRow]);
    const [billingAddress, setBillingAddress] = useState('');
    const [approxPassengers, setApproxPassengers] = useState('');
    const [tripType, setTripType] = useState({ local: true, outStation: false });


    const handleCabAddRow = (isOutStation: boolean) => {
        if (isOutStation) {
            setOutStationRows([...outStationRows, initialOutStationRow]);
        } else {
            setLocalRows([...localRows, initialRow]);
        }
    };
   

    const handleRowChange = (index: number, field: keyof CabRow, value: string, isOutStation: boolean) => {
        if (isOutStation) {
            const updatedRows = [...outStationRows];
            updatedRows[index] = { ...updatedRows[index], [field]: value };
            setOutStationRows(updatedRows);
        } else {
            const updatedRows = [...localRows];
            updatedRows[index] = { ...updatedRows[index], [field]: value };
            setLocalRows(updatedRows);
        }
    };

    // const handleMealPlanChange = (index: number, option: string, isOutStation: boolean) => {
    //     const updatedRows = isOutStation ? [...outStationRows] : [...localRows];
    //     const mealPlan: string[] = updatedRows[index].mealPlan || [];

    //     if ( mealPlan && mealPlan.includes(option)) {
    //       updatedRows[index] = {
    //         ...updatedRows[index],
    //         mealPlan: mealPlan.filter(item => item !== option)
    //       };
    //     } else {
    //       updatedRows[index] = {
    //         ...updatedRows[index],
    //         mealPlan: [...mealPlan, option]
    //       };
    //     }

    //     isOutStation ? setOutStationRows(updatedRows) : setLocalRows(updatedRows);
    //   };

    const handleDeleteRow = (index: number, isOutStation: boolean) => {
        if (isOutStation) {
            setOutStationRows(outStationRows.filter((_, i) => i !== index));
        } else {
            setLocalRows(localRows.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Enquiry</h1>



                <form onSubmit={handleSubmit} className="space-y-8">


                    {/* enquiry */}

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Name
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={userDetails.name}
                                onChange={(e)=>setUserDetails({...userDetails, name: e.target.value})}
                                placeholder="Enter client name"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={userDetails.companyName}
                                onChange={(e)=>setUserDetails({...userDetails, companyName: e.target.value})}
                                placeholder="Enter company name"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={(e)=>setUserDetails({...userDetails, email: e.target.value})}
                                placeholder="Enter email address"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={userDetails.phone}
                                onChange={(e)=>setUserDetails({...userDetails, phone: e.target.value})}
                                placeholder="Enter phone number"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Enquiry Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enquiry Type
                            </label>
                            <select
                                name="enquiryType"
                                value={userDetails.enquiryType}
                                onChange={(e)=>setUserDetails({...userDetails, enquiryType: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                {
                                    functionTypeOptions && functionTypeOptions.map((el, index) =>
                                    (
                                        <option key={index} value={el}>{el}</option>
                                    )
                                    )
                                }
                            </select>
                        </div>

                        {/* Level of Enquiry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Level Of Enquiry
                            </label>
                            <select
                                name="levelOfEnquiry"
                                value={userDetails.levelOfEnquiry}
                                onChange={(e)=>setUserDetails({...userDetails, levelOfEnquiry: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                <option value="">Select</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={userDetails.city}
                                onChange={(e)=>setUserDetails({...userDetails, city: e.target.value})}
                                placeholder="Enter city"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Hotel Preferences */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hotel Preferences
                            </label>
                            <input
                                type="text"
                                name="hotelPreferences"
                                value={userDetails.hotelPreferences}
                                onChange={(e)=>setUserDetails({...userDetails, hotelPreferences: e.target.value})}
                                placeholder="Enter hotel preferences"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Area
                            </label>
                            <select
                                name="area"
                                value={userDetails.area}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, area: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            >
                                {
                                    areaOptions && areaOptions.map((el, index)=>(
                                        <option key={index} value={el}>{el}</option>
                                    ))
                                }
                                
                                
                            </select>
                        </div>

                        {/* Check-In */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check-In
                            </label>
                            <input
                                type="date"
                                name="checkIn"
                                value={userDetails.checkIn}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, checkIn: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Check-Out */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check-Out
                            </label>
                            <input
                                type="date"
                                name="checkOut"
                                value={userDetails.checkOut}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, checkIn: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Number of Rooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Rooms
                            </label>
                            <input
                                type="number"
                                name="numberOfRooms"
                                value={userDetails.numberOfRooms}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, numberOfRooms: e.target.value })}
                                placeholder="Enter number of rooms"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>

                        {/* Category of Hotel */}
                        <div>
                            <div className="relative w-full max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category of Hotel
                            </label>
                                <div
                                    className="min-h-[40px] w-full border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 cursor-pointer"
                                    onClick={() => setIsCategoryOfHotelOpen(!isCategoryOfHotelOpen)}
                                >
                                    {userDetails.categoryOfHotel.length === 0 ? (
                                        <span className="text-gray-500">Category Of Hotel</span>
                                    ) : (
                                        userDetails.categoryOfHotel.map((category) => (
                                            <span
                                                key={category.value}
                                                className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                                            >
                                                {category.label}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCategoryOfHotelRemove(category);
                                                    }}
                                                    className="hover:bg-gray-200 rounded-full p-0.5"
                                                >
                                                   ×
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>

                                {isCategoryOfHotelOpen && (
                                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                        {categories.map((category) => (
                                            <div
                                                key={category.value}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    handleCategoryOfHotelSelect(category);
                                                    setIsCategoryOfHotelOpen(false);
                                                }}
                                            >
                                                {category.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rate Required */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rate Required (Occupancy)
                            </label>
                            <input
                                type="text"
                                name="rateRequired"
                                // value={formData.rateRequired.join(", ")}
                                onChange={(e) =>
                                    setUserDetails({ ...userDetails, occupancy: [...userDetails.occupancy, e.target.value] })}
                                placeholder="Enter rates (e.g., Single, Double)"
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                    </section>

                    {/* new fields */}
                    {/* <section>
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                    required
                                    type="text"
                                />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Type of Contact</label>
                                <select className='input mb-2' value={formData.typeOfContact} onChange={(e) => handleSelectChange('typeOfContact', e.target.value)}>
                                    <option value="">Select contact type</option>

                                    <option value="client">Client contact</option>
                                    <option value="vendor">Vendor contact</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label>ContactId</label>
                            <input
                                name="contactId"
                                value={formData.contactId}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                            />
                        </div>
                        <div>
                            <label>Subject</label>
                            <input
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                            />
                        </div>

                        <div>
                            <label>Prioriy</label>
                            <input
                                name="prioriy"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                            />
                        </div>

                        <div>
                            <label>Details</label>
                            <input
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                            />

                        </div>
                    </section> */}



                    {/* banquet */}


                    <section>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Banquet</h2>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className='bg-[#0B2F46] text-white'>
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Session</th>
                                        <th className="border p-2">Seating Style</th>
                                        <th className="border p-2">A/V Setup</th>
                                        <th className="border p-2">Menu Type</th>
                                        <th className="border p-2">Minimum No. of Pax</th>
                                        <th className="border p-2">Seating Required</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {banquetRows.map((row, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={row.date}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>

                                            <td className="border p-2">
                                                <select
                                                    name="session"
                                                    value={row.session}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                >
                                                    <option value="">Select session</option>
                                                    {sessionOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="border p-2">
                                                <select
                                                    name="seatingStyle"
                                                    value={row.seatingStyle}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                >
                                                    <option value="">Select seating style</option>
                                                    {seatingStyleOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="border p-2">
                                                <select
                                                    value={row.avSetup ? 'Yes' : 'No'}
                                                    onChange={(e) => handleAvSetupChange(index, e.target.value)}
                                                    className="w-full border rounded p-1"
                                                >
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </td>

                                            <td className="border p-2">
                                                <select
                                                    name="menuType"
                                                    value={row.menuType}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                >
                                                    <option value="">Select menu type</option>
                                                    {menuTypeOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    name="numberOfPax"
                                                    value={row.numberOfPax}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>

                                            <td className="border p-2">
                                                <select
                                                    name="seatingRequired"
                                                    value={row.seatingRequired}
                                                    onChange={(e) => handleBanquetChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                >
                                                    <option value="">Select seating required</option>
                                                    {seatingRequiredOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            <td className="border p-2 text-center">
                                                <button
                                                    onClick={() => handleDeleteBanquetRow(index)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                type='button'
                                onClick={handleAddBanquet}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                + Add New Row
                            </button>
                        </div>

                    </section>

                    {/* Rooms Table */}

                    <section>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Room</h2>
                            <table className="w-full border-collapse">
                                {/* <button onClick={}>Add Date</button> */}
                                <thead>
                                    <tr className="bg-[#0B2F46] text-white">
                                        <th className="border px-4 py-2">Date</th>
                                        <th className="border px-4 py-2">No. of Rooms</th>
                                        <th className="border px-4 py-2">Room Category</th>
                                        <th className="border px-4 py-2">Occupancy</th>
                                        <th className="border px-4 py-2">Meal Plan</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {roomRows.map((row: any, index: number) => (
                                        <tr key={index}>

                                            <td className="border p-2">
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={row.date}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoomChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>

                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    name='noOfRooms'
                                                    value={row.noOfRooms}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoomChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    name='roomCategory'
                                                    value={row.roomCategory}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoomChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>
                                            <td className="border p-2">
                                                <input
                                                    type="number"
                                                    name='occupancy'
                                                    value={row.occupancy}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRoomChange(index, e)}
                                                    className="w-full border rounded p-1"
                                                />
                                            </td>

                                            <td className="border p-2">
                                                <MealPlanSelector
                                                    allOptions={mealOptions}
                                                    selectedPlans={row.mealPlan}
                                                    onSelect={(plan) => handleSelectMealPlan(index, plan)}
                                                    onRemove={(plan) => handleRemoveCabMealPlan(index, plan)}
                                                />
                                            </td>
                                            <td className="border p-2 text-center">
                                                <button
                                                    onClick={() => deleteRoomRow(index)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={handleAddRoomRow}
                                type='button'
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                + Add New
                            </button>
                        </div>

                        {/* {Event setup} */}
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6">Event</h2>
                            <main className="space-y-6">


                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Function Type</label>
                                    <select
                                        name="functionType"
                                        value={eventSetup.functiontype}
                                        onChange={(e) =>setEventSetup({ ...eventSetup, functiontype: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select function type</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Seminar">Seminar</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Event Start Date</label>
                                        <input
                                            type="date"
                                            name="eventStartDate"
                                            value={eventSetup.eventDates.eventStart}
                                            onChange={(e) => setEventSetup((prev) => ({
                                                ...prev,
                                                eventDates: {
                                                    ...prev.eventDates,
                                                    eventStart: e.target.value
                                                }
                                                    
                                            }))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Event End Date</label>
                                        <input
                                            type="date"
                                            name="eventEndDate"
                                            value={eventSetup.eventDates.eventStart}
                                            onChange={(e) => setEventSetup((prev) => ({
                                                ...prev,
                                                eventDates: {
                                                    ...prev.eventDates,
                                                    eventEnd: e.target.value
                                                }
                                            }))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Conference Date</label>
                                    <input
                                        type="date"
                                        name="Date"
                                        value={eventSetup.eventDates.conference.Date}
                                        onChange={(e) => setEventSetup((prev) => ({
                                            ...prev,
                                            eventDates: {
                                                ...prev.eventDates,
                                                conference: {
                                                    ...prev.eventDates.conference,
                                                    Date: e.target.value
                                                }
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Event Start Time</label>
                                        <input
                                            type="time"
                                            name="eventStartTime"
                                            value={eventSetup.eventDates.conference.startTime}
                                            onChange={(e) => setEventSetup((prev) => ({
                                                ...prev,
                                                eventDates: {
                                                    ...prev.eventDates,
                                                    conference: {
                                                        ...prev.eventDates.conference,
                                                        startTime: e.target.value
                                                    }
                                                }
                                            }))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">Event End Time</label>
                                        <input
                                            type="time"
                                            name="eventEndTime"
                                            value={eventSetup.eventDates.conference.endTime}
                                            onChange={(e) => setEventSetup((prev) => ({
                                                ...prev,
                                                eventDates: {
                                                    ...prev.eventDates,
                                                    conference: {
                                                        ...prev.eventDates.conference,
                                                        endTime: e.target.value
                                                    }
                                                }
                                            }))}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Event Setup Required</label>
                                    <select
                                        name="eventSetupRequired"
                                        value={eventSetup.eventDates.conference.endTime}
                                        onChange={(e) => setEventSetup((prev) => ({
                                            ...prev,
                                            eventDates: {
                                                ...prev.eventDates,
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select required (yes/no)</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </main>
                        </div>

                    </section>


                    {/* Air Tickets */}
                    <section>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6">Air Ticket</h2>
                            <main className="grid grid-cols-2 gap-6">
                                {/* <!-- Trip Type --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Trip Type</label>
                                    <select
                                        name="tripType"
                                        value={formData.airTicket.tripType}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                tripType: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select trip type (one way / round trip)</option>
                                        <option value="One Way">One Way</option>
                                        <option value="Round Trip">Round Trip</option>
                                    </select>
                                </div>

                                {/* <!-- Number of Passengers --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Number Of Passengers</label>
                                    <select
                                        name="numberOfPassenger"
                                        value={formData.airTicket.numberOfPassenger}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                numberOfPassenger: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select passengers</option>
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* <!-- From City --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">From City</label>
                                    <select
                                        name="fromCity"
                                        value={formData.airTicket.fromCity}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                fromCity: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select city</option>
                                        <option value="New York">New York</option>
                                        <option value="Los Angeles">Los Angeles</option>
                                        <option value="Chicago">Chicago</option>
                                    </select>
                                </div>

                                {/* <!-- To City --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">To City</label>
                                    <select
                                        name="toCity"
                                        value={formData.airTicket.toCity}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                toCity: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select city</option>
                                        <option value="New York">New York</option>
                                        <option value="Los Angeles">Los Angeles</option>
                                        <option value="Chicago">Chicago</option>
                                    </select>
                                </div>

                                {/* <!-- Departure Date --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Departure Date</label>
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={formData.airTicket.departureDate}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                departureDate: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* <!-- Return Date --> */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Return Date</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={formData.airTicket.returnDate}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            airTicket: {
                                                ...prev.airTicket,
                                                returnDate: e.target.value
                                            }
                                        }))}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </main>
                        </div>
                    </section>
                    {/* cab & billing statement*/}

                    <section>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6">Cab</h2>
                            <div className="flex items-center gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                    <input type="radio" value={'LOCAL'} checked={formData.cabType == 'LOCAL'}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            cabType: 'LOCAL'
                                        }))}

                                    />
                                    <label>Local</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input value={'OUT_STATION'} type="radio" checked={formData.cabType == 'OUT_STATION'}
                                        onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            cabType: 'OUT_STATION'
                                        }))}
                                    />
                                    <label>Out-Station</label>
                                </div>
                                <input
                                    type="number"
                                    placeholder="Enter number of passenger"
                                    value={approxPassengers}
                                    onChange={(e) => setApproxPassengers(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
                                />
                                <button
                                    type='button'
                                    onClick={(e) => setFormData((prev) => ({
                                        ...prev,
                                        cab: [
                                            ...prev.cab,
                                            {
                                                date: new Date().toISOString().split('T')[0],
                                                noOfVehicle: "",
                                                typeOfVehicle: "",
                                                cabTripType: "",
                                                mealPlan: [],
                                                fromCity: '',
                                                toCity: "",
                                                tripType: "",
                                                approxNumberOfPassengers: ""
                                            }
                                        ]
                                    }))}
                                    // onClick={()=>handleAddRow()}
                                    className="ml-auto px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                >
                                    Add Date
                                </button>
                            </div>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="px-4 py-2">Date</th>
                                        {
                                            formData.cabType == 'OUT_STATION' && (<>
                                                <th className="px-4 py-2">Form City</th>
                                                <th className="px-4 py-2">To City</th>
                                            </>
                                            )}
                                        <th className="px-4 py-2">No. Of Vehicle</th>
                                        <th className="px-4 py-2">Type of Vehicle</th>
                                        <th className="px-4 py-2">Trip Type</th>
                                        <th className="px-4 py-2">Meal Plan</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.cab && formData.cab.map((row, index) => (
                                        <tr key={index} className="text-center border-b">
                                            <td>
                                                <input
                                                    type="date"
                                                    value={row.date}

                                                    onChange={(e) => handleCabInputChange(index, 'date', e.target.value)}
                                                    className="border border-gray-300 rounded-md px-2 py-1"
                                                />
                                            </td>
                                            {
                                                formData.cabType == 'OUT_STATION' && (
                                                    <>
                                                        <td>
                                                            <select
                                                                value={row.noOfVehicle}
                                                                onChange={(e) => handleCabInputChange(index, 'noOfVehicle', e.target.value)}
                                                                className="border border-gray-300 rounded-md px-2 py-1"
                                                            >
                                                                <option value="">Select no. of vehicles</option>
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                value={row.typeOfVehicle}
                                                                onChange={(e) => handleCabInputChange(index, 'typeOfVehicle', e.target.value)}
                                                                className="border border-gray-300 rounded-md px-2 py-1"
                                                            >
                                                                <option value="">Select category</option>
                                                                <option value="Sedan">Sedan</option>
                                                                <option value="SUV">SUV</option>
                                                            </select>
                                                        </td>
                                                    </>
                                                )
                                            }
                                            <td>
                                                <select
                                                    value={row.noOfVehicle}
                                                    onChange={(e) => handleCabInputChange(index, 'noOfVehicle', e.target.value)}
                                                    className="border border-gray-300 rounded-md px-2 py-1"
                                                >
                                                    <option value="">Select no. of vehicles</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={row.typeOfVehicle}
                                                    onChange={(e) => handleCabInputChange(index, 'typeOfVehicle', e.target.value)}
                                                    className="border border-gray-300 rounded-md px-2 py-1"
                                                >
                                                    <option value="">Select category</option>
                                                    <option value="Sedan">Sedan</option>
                                                    <option value="SUV">SUV</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={row.tripType}
                                                    onChange={(e) => handleCabInputChange(index, 'tripType', e.target.value)}
                                                    className="border border-gray-300 rounded-md px-2 py-1"
                                                >
                                                    <option value="">Select trip type</option>
                                                    <option value="4 hrs 40 km">4 hrs 40 km</option>
                                                    <option value="Airport Transfer">Airport Transfer</option>
                                                </select>
                                            </td>
                                            <td className="flex gap-1 justify-center">
                                                <MealPlanSelector
                                                    allOptions={mealOptions}
                                                    selectedPlans={row.mealPlan}
                                                    onSelect={(plan) => handleSelectCabMealPlan(index, plan)}
                                                    onRemove={(plan) => handleRemoveCabMealPlan(index, plan)}
                                                />

                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({
                                                        ...prev,
                                                        cab: prev.cab.filter((_, i) => i !== index)
                                                    }))}
                                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-600">Billing Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter Billing Address"
                                    value={billingAddress}
                                    onChange={(e) => setUserDetails({...userDetails, billingDetails: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                            </div>
                        </div>

                    </section>



                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        >
                            Save Enquiry
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default AddEnquiry;




