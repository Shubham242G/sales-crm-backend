import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddQuotesFromVendors, useUpdateQuotesFromVendorsById, useQuotesFromVendorsById, useQuotesFromVendors } from "@/services/quotesFromVendors.service";
import { useVendor } from "@/services/vendor.service";
import Select from 'react-select';
import { useRfp } from "@/services/rfp.service";
import { useRfpById } from "@/services/rfp.service";



interface IShipppingAddress {
    // attention: string;
    vendorName: string;
    serviceType: string[];
    rfpId: string;
    amount: string;
    receivedDate: string;
    status: string;
    attachment: string;
    eventDates: {
        startDate: string;}[];
  }


  


const AddQuotesFromVendors= () => {

  const [formData, setFormData] = useState({

    //new fields 
    // quotesId: "",
    vendorName: "",
    serviceType : [] as string[],
    rfpId: "",
    amount: "",
    receivedDate: "",
    status: "",
    attachment: "",
    eventDates: [{
            startDate: "",
        }],
  })

  const serviceTypeOptions:string[] = ["Hotel", "Banquet", "Event", "Transport"];




  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addQuotesFromVendors } = useAddQuotesFromVendors();
  const { mutateAsync: updateQuotesFromVendors } = useUpdateQuotesFromVendorsById();
  const { data: quotesFromVendorsDataById, isLoading } = useQuotesFromVendorsById(id || "");
  const { data: vendorData } = useVendor();
   const {data: quotesFromVendors} = useQuotesFromVendors();  


   console.log("quotesFromVendors", quotesFromVendors)
  
  const [serviceTypeArr, setServiceTypeArr] = useState<any>([]);
  const [selectedServiceType , setSelectedServiceType] = useState<any>([]);
 

  useEffect(() => {
    // Prefill form when editing
    if (quotesFromVendorsDataById && quotesFromVendorsDataById?.data) {

      setFormData({
        // quotesFromVendorsId: quotesFromVendorsDataById?.data?.quotesFromVendorsId || "",
        vendorName: quotesFromVendorsDataById?.data?.serviceType || "",
        eventDates:quotesFromVendorsDataById?.data?.eventDates || [],
        rfpId: quotesFromVendorsDataById?.data?.rfpId || "",
        amount: quotesFromVendorsDataById?.data?.amount || "",
        receivedDate: quotesFromVendorsDataById?.data?.receivedDate || "",
        status: quotesFromVendorsDataById?.data?.status || "",
        attachment: quotesFromVendorsDataById?.data?.attachment || "",
        serviceType: quotesFromVendorsDataById?.data?.serviceType || [],
      })
    }

  }, [quotesFromVendorsDataById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {


      const obj = {...formData, serviceType:selectedServiceType};

      if (id) {

        const { data: res } = await updateQuotesFromVendors({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesFromVendors")
          console.log(obj, "<<<<<<<check obj");
          console.log("Thisssss---->",selectedServiceType)

        }
      } else {

        const { data: res } = await addQuotesFromVendors(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesFromVendors")

        }

        
      }
     
    } catch (error) {
      toastError(error);
    }
  };




  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    setFormData((prev:any) => ({
      ...prev,
      serviceType: Array.from(new Set([...prev.serviceType, ...selectedValues])), // Prevent duplicates
    }));
  };

  const removeOption = (optionToRemove:string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.filter((option) => option !== optionToRemove),
    }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };


  const handleChange = (selected: string [] | null) => {
    setFormData((prevData:any) => ({ ...prevData, serviceType: selected || [] }));
  };
  // const handleSelectChange = (name: string, value: any) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };


//   useEffect(() => {
//       if(rfpData && rfpData.data){
//         setServiceTypeArr(rfpData.data.map((el: any) => ({
//           value: el._id,
//           label: el.vendor?.firstName + " " + el.vendor?.lastName
//         })));
//       }
//   },[vendorData])
  const optionConvertor = (firstName: string, lastname: string) => {

    console.log("firstname", firstName, "lastname", lastname);
    return `${firstName} ${lastname}`
  }



  const rfpOptions = quotesFromVendors?.data?.map((el: any) => ({
    value: el.rfpId,

    label: el.rfpId
  }))


 
  const handleChangeRfp = (selected: any) => {
    setSelectedOption(selected);
    console.log("Selected option:", selected);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Quotes From Vendors</h1>
        <form onSubmit={handleSubmit}>
          {/* Service Type and Event Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 font-medium">Service Type</label>

              {/* Selected Options as Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.serviceType.map((option) => (
                  <span key={option} className="bg-gray-200 px-2 py-1 rounded-md text-sm flex items-center">
                    {option}
                    <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => removeOption(option)}>
                      ✖
                    </button>
                  </span>
                ))}
              </div>

              {/* Dropdown */}
              <select multiple onChange={handleSelectChange} className="w-full mt-2 border px-2 py-2 rounded-md">
                {serviceTypeOptions
                  .filter((option) => !formData.serviceType.includes(option)) // Hide already selected options
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              {/* <input
                placeholder="Contact Person"
                type="date"
                className="input"
              /> */}
              {/* <select
                className="w-full border border-gray-300 rounded-md p-2"
                multiple
              >
                <option>Hotel</option>
                <option>Banquet</option>
                <option>Event</option>
                <option>Transport</option>
              </select> */}
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                name={"eventDates"}
                value={formData.eventDates}
                onChange={handleInputChange}
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div> */}
          </div>

          <div>


            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFP ID
            </label>
            <Select options={rfpOptions} onChange={handleChangeRfp} isMulti={false} />
          </div>

          {/* Event Details and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                name={"amount"}
                value={formData.amount}
                onChange={handleInputChange}
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter event details"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Received Date
              </label>
              <input
                name={"receivedDate"}
                value={formData.receivedDate}
                onChange={handleInputChange}
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Vendor List */}
          {/* <div className="w-96">

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name
            </label>
            <Select
                className="w-full border "
                isMulti
                // defaultValue={selectedOption}
                value={formData.vendorName}
                options={vendorName}
                onChange={handleInputChange}
        
            />
          </div> */}

          {/* Additional Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <textarea
              name={"status"}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Status"
              rows={4}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuotesFromVendors;
