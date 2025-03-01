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

interface IVendorList {
  label: string;
  value: string;
}
const AddRfpsForm = () => {
  const [formData, setFormData] = useState({
    //new fields
    rfpId: "",
    serviceType: [] as string[],
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

  // console.log(res, "check the data of vendor Names");
  // useEffect(() => {
  //   if (vendorNames?.data?.length  > 0) {
  //     console.log(vendorNames.data[1]?.fullName || "No second vendor found");

  //     const formattedVendors = vendorNames.data.map((el: any) => ({
  //       value: el.fullName,
  //       label: el.fullName,
  //     }));

  //     console.log(formattedVendors, "check formatted");
  //     setVendorArr(formattedVendors);
  //   }
  // }, [vendorNames]);

  const option = vendorNames.data.map((el: any) => ({
    value: el.fullName,
    label: el.fullName,
  }));

  console.log(vendorArr, "check vendorArr");

  useEffect(() => {
    if (!isLoading && rfpDataById?.data) {
      console.log(rfpDataById, "<<-------rfpDataById");
      setFormData({
        rfpId: rfpDataById.data.rfpId || "",
        serviceType: rfpDataById.data.serviceType || [],
        eventDates: rfpDataById.data.eventDates || [
          { startDate: "", endDate: "" },
        ],
        eventDetails: rfpDataById.data.eventDetails || "",
        deadlineOfProposal: rfpDataById.data.deadlineOfProposal || "",
        vendorList: [...rfpDataById.data.vendorList],
        additionalInstructions: rfpDataById.data.additionalInstructions || "",
      });

      console.log(
        rfpDataById?.data?.vendorList,
        "check rfpDataById fgsdfffgdsgg"
      );

      setSelectedVendors(rfpDataById?.data?.vendorList);

      // const prefilledVendors = (rfpDataById.data.vendorList || []).map(
      //   (vendorId: string) => vendorArr.find((v: any) => v.value === vendorId)
      // ).filter(Boolean); // Remove any undefined values

      // setSelectedVendors(prefilledVendors);
    }
  }, [rfpDataById, isLoading, vendorArr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const obj = { ...formData };

      console.log(obj, "checking submit obj");

      if (id) {
        const { data: res } = await updateRfp({ id, obj });

        if (res?.message) {
          toastSuccess(res.message);
          navigate("/rfps");
          console.log(obj, "<<<<<<<check obj");
          console.log("Thisssss---->", selectedVendors);
        }
      } else {
        const { data: res } = await addRfp(obj);
        if (res?.message) {
          toastSuccess(res.message);
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
    index: number
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      eventDates: prevFormData.eventDates.map((el, i) =>
        i === index ? { ...el, startDate: value } : el
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

  // const handleChange = (selected: string[] | null) => {
  //   setFormData((prevData) => ({ ...prevData, vendorList: selected || [] }));
  // };
  // const handleSelectChange = (name: string, value: any) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  console.log(vendorData.data, "vendorData");
  useEffect(() => {
    if (vendorData && vendorData.data) {
      setVendorArr(
        vendorData.data.map((el: any) => ({
          value: el._id,
          label: el.vendor?.firstName + " " + el.vendor?.lastName,
        }))
      );
    }
  }, [vendorData]);
  const optionConvertor = (firstName: string, lastname: string) => {
    console.log("firstname", firstName, "lastname", lastname);
    return `${firstName} ${lastname}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add RPFs</h1>
        <form onSubmit={handleSubmit}>
          {/* Service Type and Event Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Service Type
              </label>

              {/*Dropdown for Service Type */}
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

            {Array.isArray(formData.eventDates) &&
              formData.eventDates.map((el: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    name="eventDates"
                    value={
                      moment(el.startDate).format("YYYY-MM-DD") ||
                      el.startDate ||
                      ""
                    }
                    onChange={(e) => handleInputChangeEventDates(e, index)}
                    type="date"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFP ID
            </label>
            <input
              name={"rfpId"}
              value={formData.rfpId}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div> */}

          {/* Event Details and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Details
              </label>
              <input
                name={"eventDetails"}
                value={formData.eventDetails}
                onChange={handleInputChange}
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter event details"
              />
            </div>

            {Array.isArray(formData.eventDates) &&
              formData.eventDates.map((el: any, index: number) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline for Proposal
                  </label>
                  <input
                    name="eventDates"
                    value={
                      moment(el.endDate).format("YYYY-MM-DD") ||
                      el.startDate ||
                      ""
                    }
                    onChange={(e) => handleInputChangeEventDates(e, index)}
                    type="date"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline for Proposal
              </label>
              <input
                name={"deadlineOfProposal"}
                value={formData.deadlineOfProposal}
                onChange={handleInputChange}
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div> */}
          </div>

          {/* Vendor List */}
          <div className="w-96">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor List
            </label>
            <Select
              className="w-full border"
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

          {/* Additional Instructions */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions
            </label>
            <textarea
              name={"additionalInstructions"}
              value={formData.additionalInstructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  additionalInstructions: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter additional instructions"
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
            {((!id && canCreate) || (id && canUpdate)) && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md"
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
