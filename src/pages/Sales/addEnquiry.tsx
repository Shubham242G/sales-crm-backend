// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from "react-router-dom";
// import { useAddEnquiry, useEnquiryById, useUpdateEnquiryById } from "@/services/enquiry.service";
// import { toastError, toastSuccess } from '@/utils/toast';


// const AddEnquiry = () => {
//     const [formData, setFormData] = useState({

//         name: "",
//         phone: "",
//         email: "",
//         typeOfContact: "",
//         contactId: "",
//         subject: "",
//         details: "",
//         priority: "",

//         // // Basic Details
//         // displayName: '',
//         // companyName: '',
//         // salutation: '',
//         // firstName: '',
//         // lastName: '',
//         // phone: '',
//         // currencyCode: '',
//         // notes: '',
//         // website: '',
//         // status: '',
//         // openingBalance: '',
//         // openingBalanceExchangeRate: '',
//         // branchId: '',
//         // branchName: '',
//         // bankAccountPayment: '',
//         // portalEnabled: false,
//         // creditLimit: '',
//         // customerSubType: '',
//         // department: '',
//         // designation: '',
//         // priceList: '',
//         // paymentTerms: '',
//         // paymentTermsLabel: '',

//         // // Contact Information
//         // emailId: '',
//         // mobilePhone: '',
//         // skypeIdentity: '',
//         // facebook: '',
//         // twitter: '',

//         // // GST Details
//         // gstTreatment: '',
//         // gstin: '',
//         // taxable: false,
//         // taxId: '',
//         // taxName: '',
//         // taxPercentage: '',
//         // exemptionReason: '',

//         // // Billing Address
//         // billingAttention: '',
//         // billingAddress: '',
//         // billingStreet2: '',
//         // billingCity: '',
//         // billingState: '',
//         // billingCountry: '',
//         // billingCounty: '',
//         // billingCode: '',
//         // billingPhone: '',
//         // billingFax: '',

//         // // Shipping Address
//         // shippingAttention: '',
//         // shippingAddress: '',
//         // shippingStreet2: '',
//         // shippingCity: '',
//         // shippingState: '',
//         // shippingCountry: '',
//         // shippingCounty: '',
//         // shippingCode: '',
//         // shippingPhone: '',
//         // shippingFax: '',

//         // // Additional Details
//         // placeOfContact: '',
//         // placeOfContactWithStateCode: '',
//         // contactAddressId: '',
//         // source: '',
//         // ownerName: '',
//         // primaryContactId: '',
//         // contactId: '',
//         // contactName: '',
//         // contactType: '',
//         // lastSyncTime: ''
//     });
//     const { id } = useParams();

//     const navigate = useNavigate();
//     const { mutateAsync: addEnquiry } = useAddEnquiry();
//     const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();
//     const { data: enquiryDataById, isLoading } = useEnquiryById(id || "");


//     useEffect(() => {
//         // Prefill form when editing
//         if (enquiryDataById) {
//             console.log(enquiryDataById, "getById/");
//             setFormData(enquiryDataById?.data || "");
//         }
//     }, [enquiryDataById]);
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {


//             const obj = formData;

//             if (id) {

//                 const { data: res } = await updateEnquiry({ id, obj });
//                 if (res?.message) {
//                     toastSuccess(res.message);
//                     navigate("/enquiryList")

//                 }
//             } else {

//                 const { data: res } = await addEnquiry(obj);
//                 if (res?.message) {
//                     toastSuccess(res.message);
//                     navigate("/enquiryList")

//                 }
//             }
//         } catch (error) {
//             toastError(error);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value, type } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//         }));
//     };

//     const handleSelectChange = (name: string, value: any) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
//                 <h1 className="text-2xl font-bold mb-6">Edit Enquiry</h1>

//                 <form onSubmit={handleSubmit} className="space-y-8">

//                     {/* new fields */}
//                     <section>
//                         <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Name</label>
//                                 <input
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                     required
//                                     type="text"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Phone</label>
//                                 <input
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Email</label>
//                                 <input
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Type of Contact</label>
//                                 <select className='input mb-2' value={formData.typeOfContact} onChange={(e) => handleSelectChange('typeOfContact', e.target.value)}>
//                                     <option value="">Select contact type</option>

//                                     <option value="client">Client contact</option>
//                                     <option value="vendor">Vendor contact</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div>
//                             <label>ContactId</label>
//                             <input
//                                 name="contactId"
//                                 value={formData.contactId}
//                                 onChange={handleInputChange}
//                                 className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                             />
//                         </div>
//                         <div>
//                             <label>Subject</label>
//                             <input
//                                 name="subject"
//                                 value={formData.subject}
//                                 onChange={handleInputChange}
//                                 className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                             />
//                         </div>

//                         <div>
//                             <label>Prioriy</label>
//                             <input
//                                 name="prioriy"
//                                 value={formData.priority}
//                                 onChange={handleInputChange}
//                                 className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                             />
//                         </div>

//                         <div>
//                             <label>Details</label>
//                             <input
//                                 name="details"
//                                 value={formData.details}
//                                 onChange={handleInputChange}
//                                 className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                             />

//                         </div>
//                     </section>
//                     {/* Basic Information */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Display Name*</label>
//                                 <input
//                                     name="displayName"
//                                     value={formData.displayName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                     required
//                                     type="text"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Company Name</label>
//                                 <input
//                                     name="companyName"
//                                     value={formData.companyName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Salutation</label>
//                                 <input
//                                     name="salutation"
//                                     value={formData.salutation}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>First Name</label>
//                                 <input
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Last Name</label>
//                                 <input
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Phone</label>
//                                 <input
//                                     name="phone"
//                                     value={formData.phone}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Currency Code</label>
//                                 <input
//                                     name="currencyCode"
//                                     value={formData.currencyCode}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Notes</label>
//                                 <input
//                                     name="notes"
//                                     value={formData.notes}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Website</label>
//                                 <input
//                                     name="website"
//                                     value={formData.website}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Status</label>
//                                 <input
//                                     name="status"
//                                     value={formData.status}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Opening Balance</label>
//                                 <input
//                                     name="openingBalance"
//                                     value={formData.openingBalance}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Opening Balance Exchange Rate</label>
//                                 <input
//                                     name="openingBalanceExchangeRate"
//                                     value={formData.openingBalanceExchangeRate}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Branch ID</label>
//                                 <input
//                                     name="branchId"
//                                     value={formData.branchId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Branch Name</label>
//                                 <input
//                                     name="branchName"
//                                     value={formData.branchName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Bank Account Payment</label>
//                                 <input
//                                     name="bankAccountPayment"
//                                     value={formData.bankAccountPayment}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Portal Enabled</label>
//                                 <input
//                                     type="checkbox"
//                                     name="portalEnabled"
//                                     checked={formData.portalEnabled}
//                                     onChange={handleInputChange}
//                                     className="mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Credit Limit</label>
//                                 <input
//                                     name="creditLimit"
//                                     value={formData.creditLimit}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Customer Sub Type</label>
//                                 <input
//                                     name="customerSubType"
//                                     value={formData.customerSubType}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Department</label>
//                                 <input
//                                     name="department"
//                                     value={formData.department}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Designation</label>
//                                 <input
//                                     name="designation"
//                                     value={formData.designation}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Price List</label>
//                                 <input
//                                     name="priceList"
//                                     value={formData.priceList}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Payment Terms</label>
//                                 <input
//                                     name="paymentTerms"
//                                     value={formData.paymentTerms}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Payment Terms Label</label>
//                                 <input
//                                     name="paymentTermsLabel"
//                                     value={formData.paymentTermsLabel}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}

//                     {/* Contact Information */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Email ID</label>
//                                 <input
//                                     type="email"
//                                     name="emailId"
//                                     value={formData.emailId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Mobile Phone</label>
//                                 <input
//                                     type="tel"
//                                     name="mobilePhone"
//                                     value={formData.mobilePhone}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Skype Identity</label>
//                                 <input
//                                     name="skypeIdentity"
//                                     value={formData.skypeIdentity}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Facebook</label>
//                                 <input
//                                     name="facebook"
//                                     value={formData.facebook}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Twitter</label>
//                                 <input
//                                     name="twitter"
//                                     value={formData.twitter}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}

//                     {/* Billing Address */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Attention</label>
//                                 <input
//                                     name="billingAttention"
//                                     value={formData.billingAttention}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Address</label>
//                                 <input
//                                     name="billingAddress"
//                                     value={formData.billingAddress}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Street 2</label>
//                                 <input
//                                     name="billingStreet2"
//                                     value={formData.billingStreet2}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>City</label>
//                                 <input
//                                     name="billingCity"
//                                     value={formData.billingCity}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>State</label>
//                                 <input
//                                     name="billingState"
//                                     value={formData.billingState}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Country</label>
//                                 <input
//                                     name="billingCountry"
//                                     value={formData.billingCountry}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>County</label>
//                                 <input
//                                     name="billingCounty"
//                                     value={formData.billingCounty}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Postal Code</label>
//                                 <input
//                                     name="billingCode"
//                                     value={formData.billingCode}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Phone</label>
//                                 <input
//                                     name="billingPhone"
//                                     value={formData.billingPhone}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Fax</label>
//                                 <input
//                                     name="billingFax"
//                                     value={formData.billingFax}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}


//                     {/* GST Details */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">GST Details</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>GST Treatment</label>
//                                 <input
//                                     name="gstTreatment"
//                                     value={formData.gstTreatment}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>GSTIN</label>
//                                 <input
//                                     name="gstin"
//                                     value={formData.gstin}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Taxable</label>
//                                 <input
//                                     type="checkbox"
//                                     name="taxable"
//                                     checked={formData.taxable}
//                                     onChange={handleInputChange}
//                                     className="mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Tax ID</label>
//                                 <input
//                                     name="taxId"
//                                     value={formData.taxId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Tax Name</label>
//                                 <input
//                                     name="taxName"
//                                     value={formData.taxName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Tax Percentage</label>
//                                 <input
//                                     name="taxPercentage"
//                                     value={formData.taxPercentage}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Exemption Reason</label>
//                                 <input
//                                     name="exemptionReason"
//                                     value={formData.exemptionReason}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}

//                     {/* Shipping Address */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Attention</label>
//                                 <input
//                                     name="shippingAttention"
//                                     value={formData.shippingAttention}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Address</label>
//                                 <input
//                                     name="shippingAddress"
//                                     value={formData.shippingAddress}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Street 2</label>
//                                 <input
//                                     name="shippingStreet2"
//                                     value={formData.shippingStreet2}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>City</label>
//                                 <input
//                                     name="shippingCity"
//                                     value={formData.shippingCity}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>State</label>
//                                 <input
//                                     name="shippingState"
//                                     value={formData.shippingState}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Country</label>
//                                 <input
//                                     name="shippingCountry"
//                                     value={formData.shippingCountry}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>County</label>
//                                 <input
//                                     name="shippingCounty"
//                                     value={formData.shippingCounty}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Postal Code</label>
//                                 <input
//                                     name="shippingCode"
//                                     value={formData.shippingCode}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Phone</label>
//                                 <input
//                                     name="shippingPhone"
//                                     value={formData.shippingPhone}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Fax</label>
//                                 <input
//                                     name="shippingFax"
//                                     value={formData.shippingFax}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}

//                     {/* Additional Details */}
//                     {/* <section>
//                         <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <label>Place of Contact</label>
//                                 <input
//                                     name="placeOfContact"
//                                     value={formData.placeOfContact}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Place of Contact with State Code</label>
//                                 <input
//                                     name="placeOfContactWithStateCode"
//                                     value={formData.placeOfContactWithStateCode}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Contact Address ID</label>
//                                 <input
//                                     name="contactAddressId"
//                                     value={formData.contactAddressId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Source</label>
//                                 <input
//                                     name="source"
//                                     value={formData.source}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Owner Name</label>
//                                 <input
//                                     name="ownerName"
//                                     value={formData.ownerName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Primary Contact ID</label>
//                                 <input
//                                     name="primaryContactId"
//                                     value={formData.primaryContactId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Contact ID</label>
//                                 <input
//                                     name="contactId"
//                                     value={formData.contactId}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Contact Name</label>
//                                 <input
//                                     name="contactName"
//                                     value={formData.contactName}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Contact Type</label>
//                                 <input
//                                     name="contactType"
//                                     value={formData.contactType}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                             <div>
//                                 <label>Last Sync Time</label>
//                                 <input
//                                     type="datetime-local"
//                                     name="lastSyncTime"
//                                     value={formData.lastSyncTime}
//                                     onChange={handleInputChange}
//                                     className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
//                                 />
//                             </div>
//                         </div>
//                     </section> */}

//                     {/* Submit Buttons */}
//                     <div className="flex justify-end gap-4">
//                         <button
//                             type="button"
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
//                         >
//                             Save Enquiry
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddEnquiry;


// Define TypeScript Interfaces for State Management

interface UserDetails {
    clientName: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    enquiryType: string;
    levelOfEnquiry: string;
    hotelPreferences: string;
    city: string;
    area: string;
    numberOfRooms: string;
    checkIn: string;
    checkOut: string;
    categoryOfHotel: string[];
    rateRequiredForOccupancy: string[];
    billingAddress: string;
}

interface Room {
    date: string;
    numberOfRooms: string;
    category: string;
    occupancy: string;
    mealPlan: string[];
}

interface Banquet {
    date: string;
    session: string;
    seatingStyle: string;
    avSetup: string;
    menuType: string;
    minPax: string;
    seatingRequired: string;
}

interface Cab {
    date: string;
    fromCity: string;
    toCity: string;
    numberOfVehicles: string;
    vehicleType: string;
    tripType: string;
    mealPlan: string[];
}

interface EventSetup {
    functionType: string,
    setupRequired: string,
    eventName: string;
    eventDates: EventDates[]
    eventStartDate: string;
    eventEndDate: string;

}

interface EventDates {
    startDate: '',
    endDate: '',
}

interface AirTickets {
    tripType: string,
    numberOfPassengers: string,
    fromCity: string,
    toCity: string,
    departureDate: string,
    returnDate: string,
}

import { useAddEnquiry } from '@/services/enquiry.service';
import React, { useState, useEffect } from 'react';


const AddEnquiryForm = () => {
    // State for User Details
    const [userDetails, setUserDetails] = useState<UserDetails>({
        clientName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        enquiryType: '',
        levelOfEnquiry: '',
        hotelPreferences: '',
        city: '',
        area: '',
        numberOfRooms: '',
        checkIn: '',
        checkOut: '',
        categoryOfHotel: [],
        rateRequiredForOccupancy: [],
        billingAddress: ""
    });

    // State for Tables
    const [room, setRoom] = useState<Room[]>([]);
    const [banquet, setBanquet] = useState<Banquet[]>([]);
    const [cab, setCab] = useState<Cab[]>([]);
    const [isOutOfStation, setIsOutOfStation] = useState(false);

    

    // Meal Plan Options
    const mealPlanOptions = ['Breakfast Only', 'Half Board', 'Full Board', 'All Inclusive'];

    // State for Event Setup
    const [eventSetup, setEventSetup] = useState<EventSetup>({
        functionType: '',
        setupRequired: '',
        eventName: '',
        eventDates: [{
            startDate: '',
            endDate: ''
        }],
        eventStartDate: '',
        eventEndDate: '',
    });

    // State for Air Tickets
    const [airTickets, setAirTickets] = useState<AirTickets>({
        tripType: '',
        numberOfPassengers: '',
        fromCity: '',
        toCity: '',
        departureDate: '',
        returnDate: ''
    });
    // Generate Rows for Room, Banquet, and Cab Tables Based on Check-In and Check-Out Dates
    useEffect(() => {
        if (userDetails.checkIn && userDetails.checkOut) {
            const start = new Date(userDetails.checkIn);
            const end = new Date(userDetails.checkOut);
            const dates = [];

            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                dates.push({ date: new Date(d).toISOString().split('T')[0] });
            }

            setRoom(dates.map(date => ({ date: date.date, numberOfRooms: '', category: '', occupancy: '', mealPlan: [] })));
            setBanquet(dates.map(date => ({ date: date.date, session: '', seatingStyle: '', avSetup: '', menuType: '', minPax: '', seatingRequired: '' })));
            setCab(dates.map(date => ({ date: date.date, fromCity: '', toCity: '', numberOfVehicles: '', vehicleType: '', tripType: '', mealPlan: [] })));
        }
    }, [userDetails.checkIn, userDetails.checkOut]);

    // Add Meal Plan to Input and Remove from Dropdown

    const handleMealPlanChange = (
        table: Room[] | Cab[],
        setTable: any,
        index: number,
        value: string
    ): void => {
        const updatedTable: any = [...table];
        if (!updatedTable[index].mealPlan.includes(value)) {
            updatedTable[index].mealPlan.push(value);
        }
        setTable(updatedTable);
    };


    const removeMealPlan = (
        table: Room[] | Cab[],
        setTable: any,
        index: number,
        value: string
    ): void => {
        const updatedTable = [...table];
        updatedTable[index].mealPlan = updatedTable[index].mealPlan.filter(plan => plan !== value);
        setTable(updatedTable);
    };

    // Add a Row to the Cab Table
    const addCabRow = () => {
        setCab(prev => [...prev, { date: '', fromCity: '', toCity: '', numberOfVehicles: '', vehicleType: '', tripType: '', mealPlan: [] }]);
    };

    // Handle Input Changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    };

    // Handle Checkbox for Cab Type
    const handleCabTypeChange = () => {
        setIsOutOfStation(!isOutOfStation);
    };

    // Handle Table Input Changes
    const handleTableChange = <T,>(
        table: T[],
        setTable: React.Dispatch<React.SetStateAction<T[]>>,
        index: number,
        field: keyof T,
        value: string
    ): void => {
        const updatedTable: any = [...table];
        updatedTable[index][field] = value;
        setTable(updatedTable);
    };

    const handleEventDetailChange = (field: any, value: string) => {
        setEventSetup({ ...eventSetup, [field]: value });
    };

    const handleAirTicketChange = (field: any, value: string) => {
        setAirTickets({ ...airTickets, [field]: value });
    };

    const addEventDate = () => {
        let tempArray = [...eventSetup.eventDates];
        tempArray.push({ startDate: '', endDate: '' });
        setEventSetup({ ...eventSetup, eventDates: tempArray });
    };

    const handleDateChange = (
        index: number,
        field: keyof EventDates,  // Ensures that field is either "startDate" or "endDate"
        value: string  // Assuming value is a string (you can adjust it based on your requirements)
    ): void => {
        // Create a copy of the eventDates array
        const updatedDates = [...eventSetup.eventDates];

        // Update the specific field for the specified index
        updatedDates[index] = {
            ...updatedDates[index],  // Copy the existing object at the index
            [field]: value           // Update only the field that is passed
        };

        // Update the state with the new array
        setEventSetup(prevState => ({
            ...prevState,
            eventDates: updatedDates
        }));
    };

    // Submit Handler
    const handleSubmit = () => {
        console.log({
            userDetails,
            room,
            banquet,
            cab,
            eventSetup,
            airTickets,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Enquiry</h1>
                <form onSubmit={handleSubmit}>
                    {/* Grid Layout for Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Name
                            </label>

                            <input
                                type="text"
                                name="clientName"
                                value={userDetails.clientName}
                                onChange={handleInputChange}
                                placeholder="Client Name"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                value={userDetails.companyName}
                                onChange={handleInputChange}
                                placeholder="Company Name"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>

                            <input
                                type="number"
                                name="phoneNumber"
                                value={userDetails.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={userDetails.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>

                            <input
                                type="text"
                                name="area"
                                value={userDetails.area}
                                onChange={handleInputChange}
                                placeholder="Area"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Rooms
                            </label>

                            <input
                                type="number"
                                name="numberOfRooms"
                                value={userDetails.numberOfRooms}
                                onChange={handleInputChange}
                                placeholder="Number of Rooms"
                                className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enquiry Type
                            </label>

                            <select
                                name="enquiryType"
                                value={userDetails.enquiryType}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select Enquiry Type</option>
                                <option value="room">Room</option>
                                <option value="banquet">Banquet</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check In
                            </label>

                            <input
                                type="date"
                                name="checkIn"
                                value={userDetails.checkIn}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check Out
                            </label>
                            <input
                                type="date"
                                name="checkOut"
                                value={userDetails.checkOut}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check Out
                            </label>
                            <select
                                name="levelOfEnquiry"
                                value={userDetails.levelOfEnquiry}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-200"
                            >
                                <option value="">Select Enquiry Type</option>
                                <option value="urgent">Urgent</option>
                                <option value="moderate">Moderate</option>
                                <option value="not urgent">Not Urgent</option>
                            </select>
                        </div>

                    </div>

                    {/* Room Table */}
                    {(userDetails.enquiryType === 'room' || userDetails.enquiryType === 'both') && (
                        <div className="mt-8">
                            <h2 className="font-bold text-lg mb-4">Room Table</h2>
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Date</th>
                                        <th className="border border-gray-300 px-4 py-2">No. of Rooms</th>
                                        <th className="border border-gray-300 px-4 py-2">Room Category</th>
                                        <th className="border border-gray-300 px-4 py-2">Occupancy</th>
                                        <th className="border border-gray-300 px-4 py-2">Meal Plan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {room.map((row, index) => (
                                        <tr key={index} className="even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.numberOfRooms}
                                                    onChange={(e) =>
                                                        handleTableChange(room, setRoom, index, 'numberOfRooms', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <select
                                                    value={row.category}
                                                    onChange={(e) =>
                                                        handleTableChange(room, setRoom, index, 'category', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Standard">Standard</option>
                                                    <option value="Deluxe">Deluxe</option>
                                                    <option value="Suite">Suite</option>
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <select
                                                    value={row.occupancy}
                                                    onChange={(e) =>
                                                        handleTableChange(room, setRoom, index, 'occupancy', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                >
                                                    <option value="">Select Occupancy</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Double">Double</option>
                                                    <option value="Triple">Triple</option>
                                                </select>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <select
                                                    onChange={(e) =>
                                                        handleMealPlanChange(room, setRoom, index, e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                >
                                                    <option value="">Select Meal Plan</option>
                                                    {mealPlanOptions.map(
                                                        (plan) =>
                                                            !row.mealPlan.includes(plan) && <option key={plan} value={plan}>{plan}</option>
                                                    )}
                                                </select>
                                                <div className="mt-2">
                                                    {row.mealPlan.map((plan) => (
                                                        <span
                                                            key={plan}
                                                            className="inline-block bg-gray-200 px-3 py-1 text-sm rounded-full mr-2"
                                                        >
                                                            {plan}{' '}
                                                            <button
                                                                onClick={() => removeMealPlan(room, setRoom, index, plan)}
                                                                className="text-red-500 font-bold"
                                                            >
                                                                x
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Banquet Table */}
                    {(userDetails.enquiryType === 'banquet' || userDetails.enquiryType === 'both') && (
                        <div className="mt-8">
                            <h2 className="font-bold text-lg mb-4">Banquet Table</h2>
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Date</th>
                                        <th className="border border-gray-300 px-4 py-2">Session</th>
                                        <th className="border border-gray-300 px-4 py-2">Seating Style</th>
                                        <th className="border border-gray-300 px-4 py-2">A/V Setup</th>
                                        <th className="border border-gray-300 px-4 py-2">Menu Type</th>
                                        <th className="border border-gray-300 px-4 py-2">Minimum No. of Pax</th>
                                        <th className="border border-gray-300 px-4 py-2">Seating Required</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banquet.map((row, index) => (
                                        <tr key={index} className="even:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={row.session}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'session', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={row.seatingStyle}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'seatingStyle', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={row.avSetup}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'avSetup', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={row.menuType}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'menuType', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.minPax}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'minPax', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="text"
                                                    value={row.seatingRequired}
                                                    onChange={(e) =>
                                                        handleTableChange(banquet, setBanquet, index, 'seatingRequired', e.target.value)
                                                    }
                                                    className="border border-gray-300 p-2 rounded-md w-full"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Event Setup */}
                    <div className="border rounded-lg mt-8 p-6 shadow">
                        <h2 className="text-lg font-bold mb-4">Event Setup</h2>



                        <div className="grid grid-cols-2 gap-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Function Type
                            </label>
                            <select
                                value={eventSetup.functionType}
                                onChange={(e) => setEventSetup({ ...eventSetup, functionType: e.target.value })}
                                className="border border-gray-300 p-2 rounded-md w-full"
                            >
                                <option value="">Select function type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate Event">Corporate Event</option>
                                <option value="Birthday Party">Birthday Party</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Setup Required
                            </label>
                            <select
                                value={eventSetup.setupRequired}
                                onChange={(e) => handleEventDetailChange('setupRequired', e.target.value)}
                                className="border border-gray-300 p-2 rounded-md w-full"
                            >
                                <option value="">Select required (yes / no)</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>


                        {eventSetup.eventDates.map((date, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Start Date
                                </label>
                                <input
                                    type="date"
                                    value={date.startDate}
                                    onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Event End Date
                                </label>
                                <input
                                    type="date"
                                    value={date.endDate}
                                    onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>
                        ))}
                        <button
                            onClick={addEventDate}
                            className="bg-orange-500 text-white px-4 py-2 mt-4 rounded hover:bg-orange-600"
                        >
                            Add Date
                        </button>
                    </div>

                    {/* Air Ticket */}
                    <div className="border rounded-lg mt-8 p-6 shadow">
                        <h2 className="text-lg font-bold mb-4">Air Ticket</h2>
                        <div className="grid grid-cols-2 gap-4">


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trip type
                                </label>
                                <select
                                    value={airTickets.tripType}
                                    onChange={(e) => handleAirTicketChange('tripType', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                >
                                    <option value="">Select trip type</option>
                                    <option value="One Way">One Way</option>
                                    <option value="Round Trip">Round Trip</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of passengers
                                </label>
                                <input
                                    type="number"
                                    placeholder="Select passengers"
                                    value={airTickets.numberOfPassengers}
                                    onChange={(e) => handleAirTicketChange('passengers', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From city
                                </label>
                                <input
                                    type="text"
                                    placeholder="From City"
                                    value={airTickets.fromCity}
                                    onChange={(e) => handleAirTicketChange('fromCity', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To City
                                </label>
                                <input
                                    type="text"
                                    placeholder="To City"
                                    value={airTickets.toCity}
                                    onChange={(e) => handleAirTicketChange('toCity', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departure date
                                </label>
                                <input
                                    type="date"
                                    placeholder="Select departure date"
                                    value={airTickets.departureDate}
                                    onChange={(e) => handleAirTicketChange('departureDate', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Departure date
                                </label>
                                <input
                                    type="date"
                                    placeholder="Select return date"
                                    value={airTickets.returnDate}
                                    onChange={(e) => handleAirTicketChange('returnDate', e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cab Table */}

                    <div className="mt-8">
                        <h2 className="font-bold text-lg">Cab Table</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!isOutOfStation}
                                    onChange={handleCabTypeChange}
                                />
                                Local
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isOutOfStation}
                                    onChange={handleCabTypeChange}
                                />
                                Out of Station
                            </label>
                        </div>
                        <button onClick={addCabRow} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">Add a Date</button>
                        <table className="table-auto w-full border mt-4">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Date</th>
                                    {!isOutOfStation && <th className="border px-4 py-2">No. of Vehicles</th>}
                                    {isOutOfStation && <th className="border px-4 py-2">From City</th>}
                                    {isOutOfStation && <th className="border px-4 py-2">To City</th>}
                                    <th className="border px-4 py-2">Type of Vehicle</th>
                                    <th className="border px-4 py-2">Trip Type</th>
                                    <th className="border px-4 py-2">Meal Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cab.map((row, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="date"
                                                value={row.date}
                                                onChange={(e) =>
                                                    handleTableChange(cab, setCab, index, 'date', e.target.value)
                                                }
                                                className="border p-1 w-full rounded"
                                            />
                                        </td>
                                        {!isOutOfStation && (
                                            <td className="border px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={row.numberOfVehicles}
                                                    onChange={(e) =>
                                                        handleTableChange(cab, setCab, index, 'numberOfVehicles', e.target.value)
                                                    }
                                                    className="border p-1 w-full rounded"
                                                />
                                            </td>
                                        )}
                                        {isOutOfStation && (
                                            <>
                                                <td className="border px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={row.fromCity}
                                                        onChange={(e) =>
                                                            handleTableChange(cab, setCab, index, 'fromCity', e.target.value)
                                                        }
                                                        className="border p-1 w-full rounded"
                                                    />
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={row.toCity}
                                                        onChange={(e) =>
                                                            handleTableChange(cab, setCab, index, 'toCity', e.target.value)
                                                        }
                                                        className="border p-1 w-full rounded"
                                                    />
                                                </td>
                                            </>
                                        )}
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                value={row.vehicleType}
                                                onChange={(e) =>
                                                    handleTableChange(cab, setCab, index, 'vehicleType', e.target.value)
                                                }
                                                className="border p-1 w-full rounded"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select
                                                value={row.tripType}
                                                onChange={(e) =>
                                                    handleTableChange(cab, setCab, index, 'tripType', e.target.value)
                                                }
                                                className="border p-1 w-full rounded"
                                            >
                                                <option value="">Select Trip Type</option>
                                                <option value="Airport Transfer">Airport Transfer</option>
                                                <option value="Hourly Rental">Hourly Rental</option>
                                                <option value="Outstation">Outstation</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select
                                                onChange={(e) =>
                                                    handleMealPlanChange(cab, setCab, index, e.target.value)
                                                }
                                                className="border p-1 w-full rounded"
                                            >
                                                <option value="">Select Meal Plan</option>
                                                {mealPlanOptions.map(
                                                    (plan) =>
                                                        !row.mealPlan.includes(plan) && <option key={plan} value={plan}>{plan}</option>
                                                )}
                                            </select>
                                            <div className="mt-2">
                                                {row.mealPlan.map((plan) => (
                                                    <span key={plan} className="inline-block bg-gray-200 px-2 py-1 mr-1 rounded">
                                                        {plan}{' '}
                                                        <button
                                                            onClick={() => removeMealPlan(cab, setCab, index, plan)}
                                                            className="text-red-500 font-bold ml-1"
                                                        >
                                                            x
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Billing Address and Submit Button */}
                    <div className="mt-8">
                        <h2 className="font-bold text-lg">Billing Details</h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input
                                type="text"
                                name="billingAddress"
                                value={userDetails.billingAddress}
                                onChange={handleInputChange}
                                placeholder="Billing Address"
                                className="border border-gray-300 p-2 rounded-md w-full"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white px-6 py-2 mt-6 rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default AddEnquiryForm;