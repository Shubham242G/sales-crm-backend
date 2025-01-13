import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddRpf, useUpdateRpfById, useRpfById } from "@/services/rpf.service";

const AddRfpsForm = () => {

  const [formData, setFormData] = useState({

    //new fields 
    rpfId: '',
    serviceType: '',
    eventDate: '',
    eventDetails: '',
    deadlineOfProposal: '',
    vendorList: '',
    additionalInstructions: '',
  })


  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addRpf } = useAddRpf();
  const { mutateAsync: updateRpf } = useUpdateRpfById();
  const { data: rpfDataById, isLoading } = useRpfById(id || "");


  useEffect(() => {
    // Prefill form when editing
    if (rpfDataById) {
      console.log(rpfDataById, "getById/");
      setFormData(rpfDataById?.data || "");
    }
  }, [rpfDataById]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {


      const obj = formData;

      if (id) {

        const { data: res } = await updateRpf({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/rfps")

        }
      } else {

        const { data: res } = await addRpf(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/rfps")

        }
      }
    } catch (error) {
      toastError(error);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add RPFs</h1>
        <form onSubmit={handleSubmit}>
          {/* Service Type and Event Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select className="input mb-6" name={"serviceType"} value={formData.serviceType} onChange={(e) => handleSelectChange("serviceType", e.target.value)}>
                <option value="">Service Type</option>
                <option value="Hotel">Hotel</option>
                <option value="Banquet">Banquet</option>
                <option value="Event">Event</option>
                <option value="Transport">Transport</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                name={"eventDate"}
                value={formData.eventDate}
                onChange={handleInputChange}
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

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
            <div>
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
            </div>
          </div>

          {/* Vendor List */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor List
            </label>
            <input
              name={"vendorList"}
              value={formData.vendorList}
              onChange={handleInputChange}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter vendor name"
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
              onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
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

export default AddRfpsForm;
