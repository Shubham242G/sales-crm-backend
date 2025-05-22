import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddRfp,
  useUpdateRfpById,
  useRfpById,
} from "@/services/rfp.service";
import { useVendor, useVendorName } from "@/services/vendor.service";
import Select from "react-select";
import { checkPermissionsForButtons } from "@/utils/permission";
import moment from "moment";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { PiCornersOutFill } from "react-icons/pi";
import { customReactStyles } from "@/utils/ReactSelectStyle";

interface IVendorList {
  label: string;
  value: string;
}
const AddRfpsForm = () => {
  const [formData, setFormData] = useState({
    //new fields
    rfpId: "",
    serviceType: [] as string[],
    leadId: "",
    displayName: "",
    eventDates: [
      {
        startDate: "",
        endDate: "",
      },
    ],
    eventDetails: "",
    deadlineOfProposal: "",
    vendorList: [] as IVendorList[],
    additionalInstructions: "",
  });

  const serviceTypeOptions = [
    { value: "Hotel", label: "Hotel" },
    { value: "Banquet", label: "Banquet" },
    { value: "Event", label: "Event" },
    { value: "Transport", label: "Transport" },
  ];

  const { id } = useParams();

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("RFPS");

  const navigate = useNavigate();
  const { mutateAsync: addRfp } = useAddRfp();
  const { mutateAsync: updateRfp } = useUpdateRfpById();
  const { data: rfpDataById, isLoading } = useRfpById(id || "");
  const { data: vendorData } = useVendor();
  const [vendorArr, setVendorArr] = useState<any>([]);
  const [selectedVendors, setSelectedVendors] = useState<any>([]);

  const { data: vendorNames } = useVendorName();


  console.log(vendorNames, "vendorNames");

  const option = vendorNames?.data?.map((el: any) => ({
    value: el._id || el.Name, // Use _id if available, else displayName for uniqueness
    label: el.Name, // Show only displayName
  })) || [];

  useEffect(() => {
    if (!isLoading && rfpDataById?.data) {
      setFormData({
        rfpId: rfpDataById.data.rfpId || "",
        serviceType: rfpDataById.data.serviceType || [],
        eventDates: rfpDataById.data.eventDates || [
          { startDate: "", endDate: "" },
        ],
        displayName: rfpDataById.data.displayName || "",
        leadId: rfpDataById.data.leadId || "",
        eventDetails: rfpDataById.data.eventDetails || "",
        deadlineOfProposal: rfpDataById.data.deadlineOfProposal || "",
        vendorList: [...rfpDataById.data.vendorList],
        additionalInstructions: rfpDataById.data.additionalInstructions || "",
      });

      setSelectedVendors(rfpDataById?.data?.vendorList);
    }
  }, [rfpDataById, isLoading, vendorArr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { ...formData };

      if (id) {
        const { data: res } = await updateRfp({ id, obj });

        if (res?.message) {
          toastSuccess(res.message);
          console.log("leadID===>", formData.leadId)
          navigate("/rfps");
        }
      } else {
        const { data: res } = await addRfp(obj);
        if (res?.message) {
          toastSuccess(res.message);
          console.log("leadID===>", formData.leadId)
          navigate("/rfps");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      serviceType: Array.from(
        new Set([...prev.serviceType, ...selectedValues])
      ),
    }));
  };

  const removeOption = (optionToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.filter(
        (option) => option !== optionToRemove
      ),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleInputChangeEventDates = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "start" | "end"
  ) => {
    const { value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      eventDates: prevFormData.eventDates.map((el, i) =>
        i === index
          ? type === "start"
            ? { ...el, startDate: value }
            : { ...el, endDate: value }
          : el
      ),
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

  useEffect(() => {
    if (vendorData && vendorData.data) {
      setVendorArr(
        vendorData.data.map((el: any) => ({
          value: el._id,
          label: el.vendor?.displayName,
        }))
      );
    }
  }, [vendorData]);
  const optionConvertor = (displayName: string) => {
    return { displayName };
  };

  return (
    <div className="p-6 m-[60px]">
      <h1 className="text-2xl font-bold mb-6">Add RPFs</h1>

      <div className="mx-auto border border-gray-300 bg-gray-50 shadow-lg rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-black font-500">
                Service Type
              </label>
              <Select
                isMulti
                options={serviceTypeOptions}
                value={serviceTypeOptions.filter((option) =>
                  formData.serviceType.includes(option.value)
                )}
                onChange={handleServiceTypeChange}
                className="w-full border border-gray-300 bg-gray-50 rounded-md"
                classNamePrefix="select"
                styles={customReactStyles}
                placeholder="Select service types"
              />
            </div>

            {Array.isArray(formData.eventDates) &&
              formData.eventDates.map((el: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium black mb-1">
                    Event Date
                  </label>
                  <input
                    name="eventDates"
                    value={moment(el.startDate).format("YYYY-MM-DD") || el.startDate || ""}
                    onChange={(e) => handleInputChangeEventDates(e, index, "start")}
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    type="date"
                    className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
                  />
                </div>
              ))}
          </div>


          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Display Name
            </label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
              placeholder="Enter display name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Event Details
              </label>
              <input
                name="eventDetails"
                value={formData.eventDetails}
                onChange={handleInputChange}
                type="text"
                className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
                placeholder="Enter event details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Deadline for Proposal
              </label>
              <input
                name="deadlineOfProposal"
                value={formData.deadlineOfProposal ? moment(formData.deadlineOfProposal).format("YYYY-MM-DD") : ""}
                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                onChange={handleInputChange}
                type="date"
                className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Vendor List
            </label>
            <Select
              styles={customReactStyles}
              className="w-full  border border-gray-300 bg-gray-50 rounded-md shadow-sm"
              isMulti
              value={formData?.vendorList}
              options={option}
              onChange={(val) => {
                setFormData((prev: any) => ({
                  ...prev,
                  vendorList: val,
                }));
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Additional Instructions
            </label>
            <textarea
              name="additionalInstructions"
              value={formData.additionalInstructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  additionalInstructions: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-gray-50 rounded-md p-2"
              placeholder="Enter additional instructions"
              rows={4}
            ></textarea>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
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

export default AddRfpsForm;