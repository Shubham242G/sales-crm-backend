import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddQuotesFromVendors,
  useUpdateQuotesFromVendorsById,
  useQuotesFromVendorsById,
  useQuotesFromVendors,
} from "@/services/quotesFromVendors.service";
import { useVendor } from "@/services/vendor.service";
import Select from "react-select";
import { useRfp } from "@/services/rfp.service";
import { useRfpById } from "@/services/rfp.service";

interface IShipppingAddress {
  // attention: string;
  quotesId: string;
  vendorList: {
    label: string;
    value: string;
  };
  serviceType: string[];
  rfpId: string;
  amount: string;
  receivedDate: string;
  status: string;
  attachment: string[];
  eventDates: {
    startDate: string;
  }[];
}

const AddQuotesFromVendors = () => {
  const [formData, setFormData] = useState({
    //new fields
    quotesId: "",
    vendorList: {
      label: "",
      value: "",
    },
    serviceType: [] as string[],
    rfpId: "",
    amount: "",
    receivedDate: "",
    status: "",
    attachment: [] as string[],
    eventDates: [
      {
        startDate: "",
      },
    ],
  });

  const serviceTypeOptions = [
    { value: "Hotel", label: "Hotel" },
    { value: "Banquet", label: "Banquet" },
    { value: "Event", label: "Event" },
    { value: "Transport", label: "Transport" },
  ];

  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addQuotesFromVendors } = useAddQuotesFromVendors();
  const { mutateAsync: updateQuotesFromVendors } =
    useUpdateQuotesFromVendorsById();
  const { data: quotesFromVendorsDataById, isLoading } =
    useQuotesFromVendorsById(id || "");
  const { data: vendorData } = useVendor();
  const { data: quotesFromVendors } = useQuotesFromVendors();

  console.log("quotesFromVendors", quotesFromVendors);

  const [serviceTypeArr, setServiceTypeArr] = useState<any>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<any>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: "",
  });

  useEffect(() => {
    if (quotesFromVendorsDataById && quotesFromVendorsDataById?.data) {
      // console.log(
      //   quotesFromVendorsDataById.data.vendorList.label,
      //   "check vendor list label"
      // );
      setFormData({
        // quotesFromVendorsId: quotesFromVendorsDataById?.data?.quotesFromVendorsId || "",
        quotesId: quotesFromVendorsDataById?.data?.quotesId || "",
        vendorList: quotesFromVendorsDataById?.data?.vendorList,
        eventDates: quotesFromVendorsDataById?.data?.eventDates || [],
        rfpId: quotesFromVendorsDataById?.data?.rfpId || "",
        amount: quotesFromVendorsDataById?.data?.amount || "",
        receivedDate: quotesFromVendorsDataById?.data?.receivedDate || "",
        status: quotesFromVendorsDataById?.data?.status || "",
        attachment: quotesFromVendorsDataById?.data?.attachment || [],
        serviceType: quotesFromVendorsDataById?.data?.serviceType || [],
      });
    }
  }, [quotesFromVendorsDataById]);

  // console.log("vendorList", formData.vendorList);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { ...formData };

      if (id) {
        const { data: res } = await updateQuotesFromVendors({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesFromVendors");
          console.log(obj, "<<<<<<<check obj");
          console.log("Thisssss---->", selectedServiceType);
        }
      } else {
        const { data: res } = await addQuotesFromVendors(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesFromVendors");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleServiceTypeChange = (selectedOptions: any) => {
    const newServiceTypes = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setFormData((prev) => ({
      ...prev,
      serviceType: newServiceTypes,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "image/jpeg",
      ];
      const newFiles = Array.from(files).filter((file) =>
        validTypes.includes(file.type)
      );

      if (newFiles.length !== files.length) {
        toastError("Only PDF, Excel, and JPEG files are allowed.");
      }

      const fileReaders: Promise<string>[] = newFiles.map(
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
        .then((base64Files) => {
          setFormData((prev) => ({
            ...prev,
            attachment: [...prev.attachment, ...base64Files],
          }));
          toastSuccess(`${newFiles.length} file(s) uploaded successfully!`);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
          toastError("Error uploading files.");
        });

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, i) => i !== index),
    }));
    toastSuccess("File removed successfully!");
  };

  const handleChange = (selected: string[] | null) => {
    setFormData((prevData: any) => ({
      ...prevData,
      serviceType: selected || [],
    }));
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
    return `${firstName} ${lastname}`;
  };

  const rfpOptions = quotesFromVendors?.data?.map((el: any) => ({
    value: el.rfpId,

    label: el.rfpId,
  }));

  const handleChangeRfp = (selected: any) => {
    setSelectedOption(selected);
    console.log("Selected option:", selected);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Quotes From Vendors</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quotes Id:
            </label>
            <input
              name={"quotesId"}
              value={formData.quotesId}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Quotes Id"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Name:
            </label>
            <input
              name={"vendorList"}
              value={formData?.vendorList?.label}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Vendor Name"
            />
          </div>

          {/* Service Type and Event Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Service Type
              </label>

              {/* Multi-Select Dropdown for Service Type */}
              <Select
                isMulti
                options={serviceTypeOptions}
                value={serviceTypeOptions.filter((option) =>
                  formData.serviceType.includes(option.value)
                )}
                onChange={handleServiceTypeChange}
                className="w-full mt-2 border rounded-md"
                classNamePrefix="select"
                placeholder="Select service types"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFP ID
            </label>
            <Select
              options={rfpOptions}
              onChange={handleChangeRfp}
              isMulti={false}
            />
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
            <input
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter Status"
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Files (PDF, Excel, JPEG)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.xlsx,.xls,.jpeg,.jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Upload Files
            </button>

            {/* Display Uploaded Files */}
            {formData.attachment.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files:
                </h4>
                <div className="space-y-2">
                  {formData.attachment.map((file, index) => {
                    const fileName = file.split(";base64")[0].split("data:")[1]
                      ? // .includes("pdf")
                        `File_${index + 1}.pdf`
                      : file.split(";base64")[0].split("data:")[1]
                      ? // .includes("excel")
                        `File_${index + 1}.xlsx`
                      : `File_${index + 1}.jpg`;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {fileName}
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
                    );
                  })}
                </div>
              </div>
            )}
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
