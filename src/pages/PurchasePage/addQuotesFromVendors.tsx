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
import { customReactStylesSmall } from "@/utils/ReactSelectStyle";
import { S } from "vite/dist/node/types.d-aGj9QkWt";
import moment from "moment";

interface IMarkupItem {
  label: string;
  markupAmount: number;
  orignalAmount: number;
}

interface IShipppingAddress {
  // attention: string;
  quotesId: string;
  vendorList: {
    label: string;
    value: string;
  };
  serviceType: string[];
  rfpId: string;
  amount: number;
  leadId: string;
  displayName: string;
  receivedDate: string;
  attachment: string[];
  eventDates: {
    startDate: string;
  }[];
  markupDetails: IMarkupItem[];
  totalMarkupAmount: Number;
}

const AddQuotesFromVendors = () => {
  const [formData, setFormData] = useState<IShipppingAddress>({
    //new fields
    quotesId: "",
    vendorList: {
      label: "",
      value: "",
    },
    serviceType: [] as string[],
    rfpId: "",
    amount: 0,
    leadId: "",
    receivedDate: "",
    displayName: "",
    attachment: [] as string[],
    eventDates: [
      {
        startDate: "",
      },
    ],
    markupDetails: [
      {
        label: "",
        markupAmount: 0,
        orignalAmount: 0,
      },
    ],

    totalMarkupAmount: 0,

  });

  const serviceTypeOptions = [
    { value: "Hotel", label: "Hotel" },
    { value: "Banquet", label: "Banquet" },
    { value: "Event", label: "Event" },
    { value: "Transport", label: "Transport" },
  ];

  const { id } = useParams();

  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: '2px solid #e5e7eb !important',
      boxShadow: '0 !important',
      color: "#000",
      padding: '5px',
      fontFamily: "satoshi, sans-serif",
      backgroundColor: '#fafafa',
      zindex: '9',
      minHeight: '30px',
      '&:hover': {
        border: '2px solid #e5e7eb !important',

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
      fontFamily: "satoshi, sans-serif",
      zindex: '9',   // this was the mistake (I needed to remove this)
      "&:hover": {
        backgroundColor: "#687256",
        color: "#fff",
        fontFamily: "'inter', sans-serif",
      },
    })

  }

  const navigate = useNavigate();
  const { mutateAsync: addQuotesFromVendors } = useAddQuotesFromVendors();
  const { mutateAsync: updateQuotesFromVendors } =
    useUpdateQuotesFromVendorsById();
  const { data: quotesFromVendorsDataById, isLoading } =
    useQuotesFromVendorsById(id || "");
  const { data: vendorData } = useVendor();
  const { data: quotesFromVendors } = useQuotesFromVendors();



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
      setFormData({
        // quotesFromVendorsId: quotesFromVendorsDataById?.data?.quotesFromVendorsId || "",
        quotesId: quotesFromVendorsDataById?.data?.quotesId || "",
        vendorList: quotesFromVendorsDataById?.data?.vendorList,
        eventDates: quotesFromVendorsDataById?.data?.eventDates || [],
        rfpId: quotesFromVendorsDataById?.data?.rfpId || "",
        amount: quotesFromVendorsDataById?.data?.amount || "",
        leadId: quotesFromVendorsDataById?.data?.leadId || "",
        receivedDate: quotesFromVendorsDataById?.data?.receivedDate || "",
        attachment: quotesFromVendorsDataById?.data?.attachment || [],
        serviceType: quotesFromVendorsDataById?.data?.serviceType || [],
        displayName: quotesFromVendorsDataById?.data?.displayName || "",
        markupDetails:
          quotesFromVendorsDataById?.data?.markupDetails?.length > 0
            ? [...quotesFromVendorsDataById.data.markupDetails]
            : [
              {
                label: "",
                markupAmount: 0,
                orignalAmount: 0,
              },
            ],

        totalMarkupAmount: quotesFromVendorsDataById?.data?.totalMarkupAmount || "",


      });
    }
  }, [quotesFromVendorsDataById]);


  useEffect(() => {

    const amount = formData.markupDetails.reduce((total: number, item: any) => {
      const amount = Number(item?.orignalAmount) || 0;
      return total + amount;
    }, 0)


    setFormData((prev) => ({
      ...prev,
      amount: amount,
    }));

    const value = formData.markupDetails.reduce((total, item) => {
      const originalAmount = Number(item.orignalAmount) || 0;
      const markupPercentage = Number(item.markupAmount) || 0;
      const markupAmount = originalAmount * (markupPercentage / 100);
      return total + originalAmount + markupAmount;
    }, 0)


    setFormData((prev) => ({
      ...prev,
      totalMarkupAmount: value,
    }));
  }, [formData.markupDetails]);

  // console.log("vendorList", formData.vendorList);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const invalidMarkup = formData.markupDetails.some((item) => {
    //   const markupValue = parseFloat(item.markupAmount);
    //   return isNaN(markupValue) || markupValue > 100 || markupValue < 0;
    // });

    // if (invalidMarkup) {
    //   toastError("Markup Amount must be a percentage between 0 and 100.");
    //   return;
    // }




    try {
      const obj = { ...formData };
      if (id) {
        const { data: res } = await updateQuotesFromVendors({ id, obj });
        console.log("leadID===>", formData.leadId)
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesFromVendors");
          console.log("leadID===>", formData.leadId)
          console.log("rfpID===>", formData.rfpId)

        }
      } else {
        const { data: res } = await addQuotesFromVendors(obj);
        if (res?.message) {
          console.log("leadID===>", formData.leadId)
          toastSuccess(res.message);
          navigate("/quotesFromVendors");
          console.log("leadID===>", formData.leadId)
          console.log("rfpID===>", formData.rfpId)

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

  const handleRfpChange = (selected: any) => {
    setFormData((prev) => ({
      ...prev,
      rfpId: selected ? selected.value : "",
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
          toastError("Error uploading files.");
        });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
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


  const handleAddMarkupRow = () => {
    setFormData((prev) => ({
      ...prev,
      markupDetails: [
        ...prev.markupDetails,
        { label: "", markupAmount: 0, orignalAmount: 0 },
      ],
    }));
  };

  const handleRemoveMarkupRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      markupDetails: prev.markupDetails.filter((_, i) => i !== index),
    }));
  };



  console.log("formData", formData.markupDetails);
  const handleMarkupChange = (
    index: number,
    field: keyof IMarkupItem,
    value: string
  ) => {
    if (field === "markupAmount") {
      const markupValue = parseFloat(value);
      if (!isNaN(markupValue) && (markupValue < 0 || markupValue > 100)) {
        toastError("Markup Amount must be a percentage between 0 and 100.");
        return;
      }
    }

    setFormData((prev) => {
      const updatedMarkupDetails = [...prev.markupDetails];
      const updatedItem = { ...updatedMarkupDetails[index], [field]: value };

      // Convert fields to strings
      updatedItem.markupAmount = updatedItem.markupAmount;
      updatedItem.label = updatedItem.label.toString();

      updatedMarkupDetails[index] = updatedItem;
      return {
        ...prev,
        markupDetails: updatedMarkupDetails,
      };
    });
  };
  const handleOriginalChange = (
    index: number,
    field: keyof IMarkupItem,
    value: number
  ) => {
    console.log(`Changing ${field} at index ${index} to ${value}`);
    setFormData((prev) => {
      const updatedMarkupDetails = prev.markupDetails.map((item, i) =>
        i === index ? { ...item, [field]: Number(value) } : item
      );
      return {
        ...prev,
        markupDetails: updatedMarkupDetails,
      };
    });
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
    return `${firstName} ${lastname}`;
  };

  const rfpOptions = quotesFromVendors?.data?.map((el: any) => ({
    value: el.rfpId,

    label: el.rfpId,
  }));

  const handleChangeRfp = (selected: any) => {
    setSelectedOption(selected);
  };

  return (
    <div className="h-[85vh]  mt-14 p-6 overflow-y-auto">

      <h1 className="text-2xl font-bold mb-6">Add Quotes From Vendors</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
            <label className="block text-sm font-medium text-black mb-1">
              Quotes Id:
            </label>
            <input
              name={"quotesId"}
              value={formData.quotesId}
              onChange={handleInputChange}
              type="text"
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              placeholder="Enter Quotes Id"
            />
          </div> */}
        <div className="flex  gap-6 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Vendor Name:
            </label>
            <input
              name={"vendorList"}
              value={formData?.vendorList?.label}
              onChange={handleInputChange}
              type="text"
              className="w-full border  border-gray-300 rounded-md p-1.5"
              placeholder="Enter Vendor Name"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-black mb-1">
              Display Name
            </label>
            <input
              name={"displayName"}
              value={formData.displayName}
              onChange={handleInputChange}
              type="text"
              className="w-full border  border-gray-300 rounded-md p-1.5"
              placeholder="Enter Display Name"
            />
          </div>

          {/* Service Type and Event Date */}

          <div>
            <label className="block font-satoshi text-black font-xs">
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
              className="w-full text-xs rounded-md"
              classNamePrefix="select"
              placeholder="Select service types"

            />
          </div>
        </div>


        {/* <div className="mb-3">
            <label className="block text-sm font-medium text-black mb-2">
              RFP ID
            </label>
            <Select
              options={rfpOptions}
              value={
                rfpOptions.find(
                  (option: any) => option.value === formData.rfpId
                ) || null
              }
              onChange={handleRfpChange}
              className="text-gray-600"
              classNamePrefix="select"
              placeholder="Select RFP ID"
              isClearable
              styles={customStyles}
            />
          </div> */}

        {/* Event Details and Deadline */}
        <div className="flex gap-6 mb-4">
          {/* <div>
            <label className="block text-sm font-medium text-black mb-1">
              Amount
            </label>
            <input
              name={"amount"}
              value={formData.amount}
              onChange={handleInputChange}
              type="number"
              min={0}
              className="w-full  border border-gray-300 rounded-md p-2 "
              placeholder="Enter Amount"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Received Date
            </label>
            <input
              name={"receivedDate"}
              value={moment(formData.receivedDate).format("YYYY-MM-DD")}
              onChange={handleInputChange}
              onFocus={(e) => (e.target as HTMLInputElement).showPicker()}
              onClick={(e) => (e.target as HTMLInputElement).showPicker()}
              min={moment().format("YYYY-MM-DD")}
              className="w-full border text-xs  border-gray-300 rounded-md p-2"
              type="date"

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
        {/* <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <input
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              type="text"
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              placeholder="Enter Status"
            />
          </div> */}

        {/*markup table*/}
        {/*markup table*/}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-black">
              Markup Details
            </label>
            <button
              type="button"
              onClick={handleAddMarkupRow}
              className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white  p-1.5 text-sm rounded-md flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Row
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-stone-200 text-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Original Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                    Markup Amount (%)
                  </th>
                  {formData.markupDetails.length > 1 && (
                    <th className="px-6 py-3 text-left text-sm font-semibold  text-gray-800 border-b">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {formData.markupDetails.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 border-b text-gray-600">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleMarkupChange(index, "label", e.target.value)
                        }
                        className="w-full border bg-gray-50 border-gray-300 rounded-md p-3 text-gray-600 transition duration-200"
                        placeholder="Enter label"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="number"
                        min={0}
                        value={item.orignalAmount}
                        onChange={(e) =>
                          handleOriginalChange(
                            index,
                            "orignalAmount",
                            Number(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 bg-gray-50 rounded-md p-3 text-gray-600  transition duration-200"
                        placeholder="Enter original amount"
                      />
                    </td>
                    <td className="px-6 py-4 border-b">
                      <input
                        type="number"
                        min={0}
                        value={item.markupAmount}
                        onChange={(e) =>
                          handleMarkupChange(
                            index,
                            "markupAmount",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 bg-gray-50 rounded-md p-3 text-gray-600  transition duration-200"
                        placeholder="Enter markup percentage"
                      />
                    </td>
                    {formData.markupDetails.length > 1 && (
                      <td className="px-6 py-4 border-b">
                        <button
                          type="button"
                          onClick={() => handleRemoveMarkupRow(index)}
                          className="text-red-500 hover:text-red-700 transition duration-200"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation Section */}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Total Original Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}


                readOnly
                className="w-full border bg-gray-100 border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Total Amount (with Markup)
              </label>
              <input
                type="number"
                value={
                  Number(formData.totalMarkupAmount)

                }
                name="totalMarkupAmount"
                readOnly
                className="w-full border bg-gray-100 border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-4 mt-8">
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
            className=" px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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
                      className="flex items-center bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm text-gray-600 truncate max-w-xs">
                        {fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 mr-[10px]"
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
        <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t border-gray-200 py-3 px-6 flex justify-start gap-4 z-50">
          <button
            type="button"
            className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

  );
};

export default AddQuotesFromVendors;
