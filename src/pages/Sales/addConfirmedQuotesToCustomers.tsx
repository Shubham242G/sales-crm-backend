import {
  useAddConfirmedQuotesToCustomer,
  useConfirmedQuotesToCustomerById,
  useUpdateConfirmedQuotesToCustomerById,
} from "@/services/confirmedQuotesToCutomers.service";
import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

interface IMarkupItem {
  label: string;
  markupAmount: number;
}

interface IConfirmedQuotesToCustomer {
  quotesId: string;
  customerName: string;
  serviceType: string[];
  amount: number;
  totalMarkupAmount: number;
  leadId: string;
  markupDetails: IMarkupItem[];
}

const AddConfirmedQuotesToCustomerForm = () => {
  const [formData, setFormData] = useState<IConfirmedQuotesToCustomer>({
    quotesId: "",
    customerName: "",
    leadId: "",
    serviceType: [],
    amount: 0,
    totalMarkupAmount: 0,
    markupDetails: [
      {
        label: "",
        markupAmount: 0,
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

  const { mutateAsync: addConfirmedQuotesToCustomer } = useAddConfirmedQuotesToCustomer();
  const { mutateAsync: updateConfirmedQuotesToCustomer } =
    useUpdateConfirmedQuotesToCustomerById();
  const { data: quotesToCustomerDataById, isLoading } = useConfirmedQuotesToCustomerById(
    id || ""
  );

  useEffect(() => {
    if (quotesToCustomerDataById && quotesToCustomerDataById?.data) {
      const data = quotesToCustomerDataById.data;
      setFormData({
        quotesId: data.quotesId || "",
        customerName: data.customerName || "",
        leadId: data.leadId || "",
        serviceType: Array.isArray(data.serviceType) ? data.serviceType : [],
        amount: data.amount || 0,
        totalMarkupAmount: data.totalMarkupAmount || 0,
        markupDetails:
          data?.markupDetails?.length > 0
            ? data?.markupDetails
            : [{ label: "", markupAmount: 0 }],
      });
    }
  }, [quotesToCustomerDataById]);

  // useEffect(() => {
  //   const totalMarkup = formData.markupDetails.reduce((acc, item) => {
  //     const markupValue = parseFloat(item.markupAmount) || 0;
  //     return acc + markupValue;
  //   }, 0);

  //   setFormData((prev) => ({
  //     ...prev,
  //     totalAmount: totalMarkup.toString(),
  //   }));
  // }, [formData.markupDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { ...formData, leadId: formData.leadId };

      if (id) {
        const { data: res } = await updateConfirmedQuotesToCustomer({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesToCustomer");
          console.log("leadId", formData.leadId);
        }
      } else {
        const { data: res } = await addConfirmedQuotesToCustomer(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/quotesToCustomer");
          console.log("leadId", formData.leadId);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: '1px solid #e5e7eb !important',
      boxShadow: '0 !important',
      color: "#000",
      padding: '1px',
      fontFamily: "inter, sans-serif",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleAddMarkupRow = () => {
    setFormData((prev) => ({
      ...prev,
      markupDetails: [...prev.markupDetails, { label: "", markupAmount: 0 }],
    }));
  };

  const handleRemoveMarkupRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      markupDetails: prev.markupDetails.filter((_, i) => i !== index),
    }));
  };

  const handleMarkupChange = (
    index: number,
    field: keyof IMarkupItem,
    value: string
  ) => {
    // if (field === "markupAmount") {
    //   const markupValue = parseFloat(value);
    //   if (!isNaN(markupValue) && (markupValue < 0 || markupValue > 100)) {
    //     toastError("Markup Amount must be a percentage between 0 and 100.");
    //     return;
    //   }
    // }

    setFormData((prev) => {
      const updatedMarkupDetails = [...prev.markupDetails];
      updatedMarkupDetails[index] = {
        ...updatedMarkupDetails[index],
        [field]: value,
      };
      return {
        ...prev,
        markupDetails: updatedMarkupDetails,
      };
    });
  };

  return (
    <div className="h-[90vh]  mt-16 ml-10 p-6 overflow-y-auto ">
      <div className="max-w-6xl rounded-md shadow-md p-6 ">
        <h1 className="text-2xl font-bold mb-6">Add Quotes To Customer</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Quotes ID
            </label>
            <input
              name="quotesId"
              value={formData.quotesId}
              onChange={handleInputChange}
              type="text"
              className="w-[30%]  border border-gray-300 rounded-md h-8 p-1.5"
              placeholder="Enter Quotes ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Customer Name
            </label>
            <input
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              type="text"
              className="w-[30%] border  border-gray-300 rounded-md h-8 p-1.5"
              placeholder="Enter Customer Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Service Type
            </label>
            <Select
              isMulti
              options={serviceTypeOptions}
              value={serviceTypeOptions.filter((option) =>
                formData.serviceType.includes(option.value)
              )}
              onChange={handleServiceTypeChange}
              className="w-[30%] h-8 text-xs rounded-md"
              classNamePrefix="select"
              placeholder="Select service types"

            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* <div>
              <label className="block text-sm font-medium text-blackmb-1">
                Amount
              </label>
              <input
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Amount"
              />
            </div> */}

            {/*markup table*/}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <button
                  type="button"
                  onClick={handleAddMarkupRow}
                  className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm  px-3 py-1.5 rounded-md flex items-center"
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
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-stone-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                        S.No.
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                        Label
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                        Charges
                      </th>
                      {formData.markupDetails.length > 1 && (
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 border-b">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.markupDetails.map((item, index) => (
                      <tr
                        key={index}
                        className="hover: transition duration-150"
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
                            className="w-full border border-gray-300 rounded-md p-1.5 text-black  focus:border-blue-500  transition duration-200"
                            placeholder="Enter label"
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
                            className="w-full border border-gray-300 rounded-md p-1.5 text-gray-600 focus:ring-2  focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Enter amount"
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
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Total Amount
              </label>
              <input
                name="totalAmount"
                value={formData.totalMarkupAmount}
                type="number"
                className="w-[60%] border border-gray-300  rounded-md p-1.5"
                readOnly
              />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
            <button
              type="button"
              className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
              onClick={() => navigate("/quotesToCustomer")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" px-3 py-1.5 bg-orange-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConfirmedQuotesToCustomerForm;
