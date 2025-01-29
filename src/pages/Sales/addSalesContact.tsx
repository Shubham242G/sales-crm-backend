
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAddSalesContact, useSalesContactById, useUpdateSalesContactById } from "@/services/salesContact.service";
import { toastError, toastSuccess } from '@/utils/toast';



const AddSalesContact = () => {
    const [formData, setFormData] = useState({

        //new fields 

        firstName: '',
        lastName:'',
        phone: '',
        email: '',
        salutation:"",
        company:"",
    });
    const { id } = useParams();

    const navigate = useNavigate();
    const { mutateAsync: addSalesContact } = useAddSalesContact();
    const { mutateAsync: updateSalesContact } = useUpdateSalesContactById();
    const { data: salesContactDataById, isLoading } = useSalesContactById(id || "");

    const salutationOptions = [
        { value: "Mr", label: "Mr" },
        { value: "Ms", label: "Ms" },
        { value: "Mrs", label: "Mrs" },
    ];


    useEffect(() => {
        // Prefill form when editing
        if (salesContactDataById) {
            console.log(salesContactDataById, "getById/");
            setFormData(salesContactDataById?.data || "");
        }
    }, [salesContactDataById]);
    const handleSubmit = async (e: React.FormEvent) => {
        console.log(formData, "<-----formData");
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

                const { data: res } = await updateSalesContact({ id, obj });
                if (res?.message) {
                    toastSuccess(res.message);
                    navigate("/sales-contact-view")
                    console.log("formDataaaaaaa",formData)
                }
            } else {

                const { data: res } = await addSalesContact(obj);
                if (res?.message) {
                    toastSuccess(res.message);
                    navigate("/sales-contact-view")

                }
            }
        } catch (error) {
            toastError(error);
        }

        
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (firstName: string, lastName: string, name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [firstName]: value,
            [lastName]: value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Add Sales Contact</h1>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* new fields */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                                
                                
                               <select onChange={(val)=> handleSelectChange("salutation","salutation","salutation",val.target.value)} value={formData.salutation} className="border border-gray-300 rounded-md mt-6 px-4 py-2 w-20 mt-1">
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
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
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
                                <label>Comapny</label>
                                <input
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
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
                            Save Contact
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalesContact;




