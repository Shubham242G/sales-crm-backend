import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddpurchaseContact,
  usepurchaseContactById,
  useUpdatepurchaseContactById,
} from "@/services/purchaseContact.service";
import { toastError, toastSuccess } from "@/utils/toast";
import Select from "react-select";

const AddPurchaseContact = () => {
  const [formData, setFormData] = useState({
    //new fields

    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    leadId: "",
    salutation: "",
  });
  const { id } = useParams();

  const navigate = useNavigate();
  const { mutateAsync: addPurchaseContact } = useAddpurchaseContact();
  const { mutateAsync: updatePurchaseContact } = useUpdatepurchaseContactById();
  const { data: purchaseContactDataById, isLoading } = usepurchaseContactById(
    id || ""
  );

  const salutationOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Ms", label: "Ms" },
    { value: "Mrs", label: "Mrs" },
  ];

  useEffect(() => {
    // Prefill form when editing
    if (purchaseContactDataById) {
      setFormData(purchaseContactDataById?.data || "");
      
    }
  }, [purchaseContactDataById]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.firstName) {
        toastError("First name is required");
        return;
      }
      if (!formData.lastName) {
        toastError("Last name is required");
        return;
      }
      if (!formData.phone) {
        toastError("Phone Number is required");
        return;
      }

      const obj = formData;

      if (id) {
        const { data: res } = await updatePurchaseContact({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/purchaseContact");
        }
      } else {
        const { data: res } = await addPurchaseContact(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/purchaseContact");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    firstName: string,
    lastName: string,
    name: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [firstName]: value,
      [lastName]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Purchase Contact</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* new fields */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <select
                  onChange={(val) =>
                    handleSelectChange(
                      "salutation",
                      "salutation",
                      "salutation",
                      val.target.value
                    )
                  }
                  value={formData.salutation}
                  className="border border-gray-300 rounded-md mt-6  px-3 py-1.5 w-20 mt-1"
                >
                  {salutationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Frist Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md  px-3 py-1.5 w-full mt-1"
                  required
                  type="text"
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md  px-3 py-1.5 w-full mt-1"
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
                  className="border border-gray-300 rounded-md  px-3 py-1.5 w-full mt-1"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md  px-3 py-1.5 w-full mt-1"
                />
              </div>
            </div>
          </section>

          {/* Submit Buttons */}
         <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
            <button
              type="button"
              className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseContact;
