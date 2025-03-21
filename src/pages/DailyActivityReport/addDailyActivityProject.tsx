import { useAddDailyActivityReport, useDailyActivityReport, useDailyActivityReportById, useUpdateDailyActivityReportById } from "@/services/dailyActivityReport.service";
import { useCompanyName, useLeadById, useLeadName } from "@/services/lead.service";
import { ReactSelectFormat } from "@/services/urls.service";
import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const AddDailyActivityReport = () => {


  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState("");
  const [modeOfMeeting, setModeOfMeeting] = useState("");
  const [customerName, setCustomerName] = useState<ReactSelectFormat | null>(null);
  const [scheduleMeeting, setScheduleMeeting] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const { mutateAsync: addDailyActivityReport } = useAddDailyActivityReport();
  const { mutateAsync: updateDailyActivityReport } = useUpdateDailyActivityReportById();
  const { data: LeadNames } = useLeadName({ isForSelectInput: true });
  const { data: DailyActivityReportById } = useDailyActivityReportById(id || "")
  const { data: companyNameData } = useLeadById(customerName?.value || "", customerName?.value ? true : false);

  useEffect(() => {
    if (DailyActivityReportById) {
      setScheduleMeeting(DailyActivityReportById?.data?.scheduleMeeting)
      setDescription(DailyActivityReportById?.data?.description)
      setStatus(DailyActivityReportById?.data?.status)
      console.log(DailyActivityReportById?.data, "check DailyActivityReportById")
      setCompanyName(DailyActivityReportById?.data?.companyName)
      setSalesPerson(DailyActivityReportById?.data?.salesPerson)
      setPurposeOfVisit(DailyActivityReportById?.data?.purposeOfVisit)
      setDateOfVisit(DailyActivityReportById?.data?.dateOfVisit)
      setModeOfMeeting(DailyActivityReportById?.data?.modeOfMeeting)
      setCustomerName({
        label: DailyActivityReportById?.data?.customerName?.label,
        value: DailyActivityReportById?.data?.customerName?.value
      })


    }
  }
    , [DailyActivityReportById, id])

  const navigate = useNavigate()






  const customReactStyles = {
    control: (base: any) => ({
      ...base,
      border: "1px solid #e5e7eb !important",
      boxShadow: "0 !important",
      color: "#000",
      fontFamily: "satoshi, sans-serif",
      backgroundColor: "#fafafa",
      zIndex: "9",
      minHeight: "30px",
      '&:hover': {
        border: "1px solid #e5e7eb !important",
      },
    }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const obj = { status, companyName, salesPerson, purposeOfVisit, dateOfVisit, modeOfMeeting, customerName, scheduleMeeting, description };

      console.log(obj.status, "checking submit obj");

      if (id) {
        const { data: res } = await updateDailyActivityReport({ id, obj });

        if (res?.message) {
          toastSuccess(res.message);
          navigate("/DailyActivityReport");

        }
      } else {
        const { data: res } = await addDailyActivityReport(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/DailyActivityReport");
          console.log("OBj", obj)
        }
      }
    } catch (error) {
      toastError(error);
    }
  };
  console.log(LeadNames?.data, "check LeadNames")
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Report</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Sales Person
              </label>
              <select
                className="input bg-gray-50  mb-6 w-full border border-gray-300 rounded-md p-2"
                value={salesPerson}
                onChange={(e) => setSalesPerson(e.target.value)}
              >
                <option value="">Select Sales Person</option>
                <option>Anurag</option>
                <option>Vivek</option>
                <option>Bhawna</option>
                <option>Tushar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Visit
              </label>
              <input
                type="date"
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                value={dateOfVisit}
                onChange={(e) => setDateOfVisit(e.target.value)}
              />
            </div>

            <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Client Name
            </label>
            <Select
              styles={customReactStyles}
              className="w-full border border-gray-300 bg-gray-50 rounded-md shadow-sm"
              value={customerName}
              options={LeadNames?.data}
              onChange={(e: any) => setCustomerName(e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Company Name
            </label>
            <input
              type="text"
              readOnly
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              placeholder="Enter company name"
              value={companyNameData?.data?.company}
              onChange={(e) => setCompanyName(companyNameData?.data?.company || '')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Mode of Meeting
            </label>
            <select
              className="input mb-6 w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              value={modeOfMeeting}
              onChange={(e) => setModeOfMeeting(e.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="Going to be personal">Going to be personal</option>
              <option value="ON Call">ON Call</option>
              <option value="Virtual Meeting">Virtual Meeting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              className="input mb-6 w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Purpose of Visit
            </label>
            <input
              type="text"
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              placeholder="Enter purpose"
              value={purposeOfVisit}
              onChange={(e) => setPurposeOfVisit(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Schedule Follow-up Meeting
            </label>
            <input
              type="datetime-local"
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              value={scheduleMeeting}
              onChange={(e) => setScheduleMeeting(e.target.value)}
            />
          </div>

          </div>


          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <textarea
              className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
              placeholder="Enter additional details"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

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

export default AddDailyActivityReport;
