import {
  useAddCustomer,
  useCustomerById,
  useUpdateCustomerById,
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ICustomerForm {
  customerType: string;
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  email: string;
  workPhone: string;
  mobile: string;
  panNumber: string;
  placeOfSupply: string;
  prefersEmail: boolean;
  prefersSMS: boolean;
  gstTreatment: string;
  taxPreference: string;
  currency: string;
  paymentTerms: string;
  priceList: string;
  enablePortal: boolean;
  portalLanguage: string;
  attention: string;
  countryRegion: string;
  addressStreet1: string;
  addressStreet2: string;
  city: string;
  state: string;
  phoneNumber: string;
  pinCode: string;
  faxNumber: string;
  shippingAttention: string;
  shippingCountryRegion: string;
  shippingAddressStreet1: string;
  shippingAddressStreet2: string;
  shippingCity: string;
  shippingState: string;
  shippingPhoneNumber: string;
  shippingPinCode: string;
  shippingFaxNumber: string;
  // contactPersonsSalutation: string;
  // contactPersonsFirstName: string;
  // contactPersonsLastName: string;
  // contactPersonsEmail: string;
  // contactPersonsWorkPhone: string;
  // contactPersonsMobile: string;
  // contactPersonsCommunicationChannels: string[];
}

interface IContactPerson {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  communicationChannels: string[];
}

const AddCustomer = () => {
  const [activeTab, setActiveTab] = useState<
    "Other Details" | "Address" | "Contact Persons"
  >("Other Details");
  const [formData, setFormData] = useState<ICustomerForm>({
    customerType: "Business",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    workPhone: "",
    mobile: "",
    panNumber: "",
    placeOfSupply: "",
    prefersEmail: false,
    prefersSMS: false,
    gstTreatment: "",
    taxPreference: "Taxable",
    currency: "",
    paymentTerms: "",
    priceList: "",
    enablePortal: false,
    portalLanguage: "",
    attention: "",
    countryRegion: "",
    addressStreet1: "",
    addressStreet2: "",
    city: "",
    state: "",
    phoneNumber: "",
    pinCode: "",
    faxNumber: "",
    shippingAttention: "",
    shippingCountryRegion: "",
    shippingAddressStreet1: "",
    shippingAddressStreet2: "",
    shippingCity: "",
    shippingState: "",
    shippingPhoneNumber: "",
    shippingPinCode: "",
    shippingFaxNumber: "",
    // contactPersonsSalutation: "",
    // contactPersonsFirstName: "",
    // contactPersonsLastName: "",
    // contactPersonsEmail: "",
    // contactPersonsWorkPhone: "",
    // contactPersonsMobile: "",
    // contactPersonsCommunicationChannels: "",
  });

  const [contactPersons, setContactPersons] = useState<IContactPerson[]>([
    {
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      communicationChannels: [],
    },
  ]);

  const handleAddContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        workPhone: "",
        communicationChannels: [],
      },
    ]);
  };

  const handleDeleteContactPerson = (index: number) => {
    const newContacts = [...contactPersons];
    newContacts.splice(index, 1);
    setContactPersons(newContacts);
  };

  const handleContactPersonChange = (
    index: number,
    field: keyof IContactPerson,
    value: string | string[]
  ) => {
    const newContacts = [...contactPersons];
    newContacts[index][field] = value as never;
    setContactPersons(newContacts);
  };

  const handleChannelChange = (
    index: number,
    channel: string,
    checked: boolean
  ) => {
    const newContacts = [...contactPersons];
    if (checked) {
      newContacts[index].communicationChannels.push(channel);
    } else {
      newContacts[index].communicationChannels = newContacts[
        index
      ].communicationChannels.filter((c) => c !== channel);
    }
    setContactPersons(newContacts);
  };

  const [isEmailValid, setIsEmailValid] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: AddCustomer } = useAddCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomerById();
  const { data: customerDataById } = useCustomerById(id || "");

  // Update your useEffect to use optional chaining
  useEffect(() => {
    if (customerDataById) {
      const apiData = customerDataById.data;
      setFormData((prev) => ({
        ...prev,
        email: apiData?.email || "",
        workPhone: apiData?.workPhone || "",
        mobile: apiData?.mobile || "",
        panNumber: apiData?.panNumber || "",
        placeOfSupply: apiData?.placeOfSupply || "",
        companyName: apiData?.companyName || "",
        displayName: apiData?.displayName || "",
        customerType: "Business",
        salutation: "",
        firstName: "",
        lastName: "",
        taxPreference: "Taxable",
        currency: apiData?.currency || "",
        paymentTerms: apiData?.paymentTerms || "",
        priceList: apiData?.priceList || "",
        portalLanguage: apiData?.portalLanguage || "",
        attention: apiData?.attention || "",
        countryRegion: apiData?.countryRegion || "",
        addressStreet1: apiData?.addressStreet1 || "",
        addressStreet2: apiData?.addressStreet2 || "",
        city: apiData?.city || "",
        state: apiData?.state || "",
        phoneNumber: apiData?.phoneNumber || "",
        faxNumber: apiData?.faxNumber || "",
        shippingAttention: apiData?.shippingAttention || "",
        shippingCountryRegion: apiData?.shippingCountryRegion || "",
        shippingAddressStreet1: apiData?.shippingAddressStreet1 || "",
        shippingAddressStreet2: apiData?.shippingAddressStreet2 || "",
        shippingCity: apiData?.shippingCity || "",
        shippingState: apiData?.shippingState || "",
        shippingPinCode: apiData?.shippingPinCode || "",
        shippingPhoneNumber: apiData?.shippingPhoneNumber || "",
        shippingFaxNumber: apiData?.shippingFaxNumber || "",
        // contactPersonsSalutation: apiData?.contactPersonsSalutation || "",
        // contactPersonsFirstName: apiData?.contactPersonsFirstName || "",
        // contactPersonsLastName: apiData?.contactPersonsLastName || "",
        // contactPersonsEmail: apiData?.contactPersonsEmail || "",
        // contactPersonsWorkPhone: apiData?.contactPersonsWorkPhone || "",
        // contactPersonsMobile: apiData?.contactPersonsMobile || "",
        // contactPersonsCommunicationChannels: apiData?. contactPersonsCommunicationChannels || "",
      }));
    }
  }, [customerDataById]);

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsEmailValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isEmailValid) {
        toastError("Please enter a valid email address");
        return;
      }
      const obj = formData;
      // Your existing submission logic
    } catch (error) {
      toastError(error as string);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
        <form onSubmit={handleSubmit}>
          {/* Customer Type Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-base font-medium text-gray-700">
                Customer Type:
              </span>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="Business"
                    checked={formData.customerType === "Business"}
                    onChange={(e) =>
                      setFormData({ ...formData, customerType: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Business</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="customerType"
                    value="Individual"
                    checked={formData.customerType === "Individual"}
                    onChange={(e) =>
                      setFormData({ ...formData, customerType: e.target.value })
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-700">Individual</span>
                </label>
              </div>
            </div>
          </div>

          {/* Primary Contact Section */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <span className="text-base font-medium text-gray-700 mt-2">
                Primary Contact:
              </span>
              <div className="flex-1 space-y-4">
                <div className="flex gap-6">
                  <div className="w-32">
                    <select
                      value={formData.salutation}
                      onChange={(e) =>
                        setFormData({ ...formData, salutation: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="">Salutation</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Miss.">Miss.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="First Name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                  <div className="flex-1 max-w-[200px]">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Last Name"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-6">
                {/* Company Name */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Company Name:
                  </span>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Enter company name"
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>

                {/* Display Name */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Display Name:
                  </span>
                  <select
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option value="">Select Display Name</option>
                    <option value="company">Company Name</option>
                    <option value="contact">Contact Name</option>
                  </select>
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Email Address:
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setIsEmailValid(true);
                      }}
                      onBlur={(e) => validateEmail(e.target.value)}
                      placeholder="Enter email address"
                      className={`w-full border ${
                        !isEmailValid ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 text-sm pl-10`}
                    />
                    <svg
                      className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {!isEmailValid && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-center gap-6">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Phone:
                  </span>
                  <div className="flex-1 flex gap-4">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={formData.workPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workPhone: e.target.value,
                          })
                        }
                        placeholder="Work Phone"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm pl-10"
                      />
                      <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        placeholder="Mobile"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm pl-10"
                      />
                      <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Communication Channels */}
                <div className="flex items-center gap-6 mt-4">
                  <span className="text-base font-medium text-gray-700 mt-2">
                    Communication Channels:
                  </span>
                  <div className="flex gap-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.prefersEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prefersEmail: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.prefersSMS}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            prefersSMS: e.target.checked,
                          })
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>

                {/* Tab Menu */}
                <div className="mt-8">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                      {["Other Details", "Address", "Contact Persons"].map(
                        (tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                              activeTab === tab
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="pt-6">
                    {activeTab === "Other Details" && (
                      <div className="grid grid-cols-2 gap-6">
                        {/* GST Treatment */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700 mt-2">
                              GST Treatment:
                            </span>
                            <select
                              value={formData.gstTreatment}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gstTreatment: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select GST Treatment</option>
                              <option value="registered_regular">
                                Registered Business - Regular
                              </option>
                              <option value="registered_composite">
                                Registered Business - Composite
                              </option>
                              <option value="unregistered">
                                Unregistered Business
                              </option>
                              <option value="consumer">Consumer</option>
                              <option value="overseas">Overseas</option>
                              <option value="special_economic_zone">
                                Special Economic Zone
                              </option>
                              <option value="deemed_export">
                                Deemed Export
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Place of Supply */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Place of Supply:
                            </span>
                            <select
                              value={formData.placeOfSupply}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  placeOfSupply: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select State</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Uttar Pradesh">
                                Uttar Pradesh
                              </option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="West Bengal">West Bengal</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Andhra Pradesh">
                                Andhra Pradesh
                              </option>
                              <option value="Telangana">Telangana</option>
                            </select>
                          </div>
                        </div>

                        {/* PAN Number */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              PAN Number:
                            </span>
                            <input
                              type="text"
                              value={formData.panNumber}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  panNumber: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                        </div>
                        {/*Tax Preference*/}
                        <div className="mb-8">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-base font-medium text-gray-700">
                              Tax Prefernce:
                            </span>
                            <div className="flex gap-6">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="taxPreference"
                                  value="Taxable"
                                  checked={formData.taxPreference === "Taxable"}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      taxPreference: e.target.value,
                                    })
                                  }
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700">Taxable</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="taxPreference"
                                  value="Tax Exempt"
                                  checked={
                                    formData.taxPreference === "Tax Exempt"
                                  }
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      taxPreference: e.target.value,
                                    })
                                  }
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700">
                                  Tax Exempt
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Currency */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Currency:
                            </span>
                            <select
                              value={formData.currency}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  currency: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Currency</option>
                              <option value="INR - Indian Rupee">
                                INR - Indian Rupee
                              </option>
                              <option value="USD - United States Dollar">
                                USD - United States Dollar
                              </option>
                              <option value="EUR - Euro">EUR - Euro</option>
                              <option value="JPY - Japanese Yen">
                                JPY - Japanese Yen
                              </option>
                              <option value="GBP - British Pound Sterling">
                                GBP - British Pound Sterling
                              </option>
                              <option value="AUD - Australian Dollar">
                                AUD - Australian Dollar
                              </option>
                              <option value="CAD - Canadian Dollar">
                                CAD - Canadian Dollar
                              </option>
                              <option value="CHF - Swiss Franc">
                                CHF - Swiss Franc
                              </option>
                              <option value="CNY - Chinese Yuan">
                                CNY - Chinese Yuan
                              </option>
                              <option value="HKD - Hong Kong Dollar">
                                HKD - Hong Kong Dollar
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* Payment Terms */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Payment Terms:
                            </span>
                            <select
                              value={formData.paymentTerms}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentTerms: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Payment Terms</option>
                              <option value="Due on Receipt">
                                Due on Receipt
                              </option>
                              <option value="End of Month (EOM)">
                                End of Month (EOM)
                              </option>
                              <option value="Cash in Advance (CIA)">
                                Cash in Advance (CIA)
                              </option>
                              <option value="Cash on Delivery (COD)">
                                Cash on Delivery (COD)
                              </option>
                              <option value="Partial Payment">
                                Partial Payment
                              </option>
                              <option value="Progressive Payment">
                                Progressive Payment
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* Price List */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Price List:
                            </span>
                            <select
                              value={formData.priceList}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  priceList: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Price List</option>
                              <option value="Basic SEO Package">
                                Basic SEO Package
                              </option>
                              <option value="Social Media Management">
                                Social Media Management
                              </option>
                              <option value="Pay-Per-Click (PPC) Campaign Setup">
                                Pay-Per-Click (PPC) Campaign Setup
                              </option>
                              <option value="Content Writing">
                                Content Writing
                              </option>
                              <option value="Website Audit">
                                Website Audit
                              </option>
                            </select>
                          </div>
                        </div>
                        {/* Enable Portal */}
                        <div className="flex items-center gap-6 mt-4">
                          <span className="text-base font-medium text-gray-700 mt-2">
                            Enable Portal:
                          </span>
                          <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.enablePortal}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    enablePortal: e.target.checked,
                                  })
                                }
                                className="form-checkbox h-4 w-4 text-blue-600"
                              />
                              <span className="text-gray-700">
                                Allow portal access for this Customer
                              </span>
                            </label>
                          </div>
                        </div>
                        {/* Portal Language */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Portal Language:
                            </span>
                            <select
                              value={formData.portalLanguage}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  portalLanguage: e.target.value,
                                })
                              }
                              className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                            >
                              <option value="">Select Portal Language</option>
                              <option value="English (EN)">English (EN)</option>
                              <option value="Spanish (ES)">Spanish (ES)</option>
                              <option value="French (FR)">French (FR)</option>
                              <option value="German (DE)">German (DE)</option>
                              <option value="Hindi (HI)">Hindi (HI)</option>
                            </select>
                          </div>
                        </div>
                        {/* Documents Upload */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Documents:
                            </span>
                            <div className="flex-1">
                              <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mt-8"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Upload Document</span>
                              </button>
                              <p className="text-sm text-gray-500 mt-1">
                                You can upload a maximum of 10 files, 10MB each.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Address" && (
                      <div className="grid grid-cols-2 gap-8">
                        {/* Billing Address */}
                        <div className="col-span-1">
                          <h2 className="text-2xl font-bold mb-6">
                            Billing Address
                          </h2>
                          {/* Attention */}
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={formData.attention}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  attention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                          {/* Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              <select
                                value={formData.countryRegion}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    countryRegion: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">
                                  Select Country / Region
                                </option>
                                <option value="India">India</option>
                                <option value="United States">
                                  United States
                                </option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United Kingdom">
                                  United Kingdom
                                </option>
                              </select>
                            </div>
                          </div>
                          {/* Address */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Address:
                              </span>
                              <input
                                type="text"
                                value={formData.addressStreet1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    addressStreet1: e.target.value,
                                  })
                                }
                                placeholder="Street 1"
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <input
                                type="text"
                                value={formData.addressStreet2}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    addressStreet2: e.target.value,
                                  })
                                }
                                placeholder="Street 2"
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                City:
                              </span>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    city: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* State */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                State:
                              </span>
                              <select
                                value={formData.state}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    state: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                              </select>
                            </div>
                          </div>
                          {/* Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Pin Code:
                              </span>
                              <input
                                type="text"
                                value={formData.pinCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    pinCode: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Phone */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Phone:
                              </span>
                              <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phoneNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Fax Number */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Fax Number:
                              </span>
                              <input
                                type="text"
                                value={formData.faxNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    faxNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="col-span-1">
                          <h2 className="text-2xl font-bold mb-6">
                            Shipping Address
                          </h2>
                          {/* Shipping Attention */}
                          <div className="flex items-center gap-6">
                            <span className="text-base font-medium text-gray-700">
                              Attention:
                            </span>
                            <input
                              type="text"
                              value={formData.shippingAttention}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shippingAttention: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                          </div>
                          {/* Shipping Country / Region */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Country / Region:
                              </span>
                              <select
                                value={formData.shippingCountryRegion}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingCountryRegion: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">
                                  Select Country / Region
                                </option>
                                <option value="India">India</option>
                                <option value="United States">
                                  United States
                                </option>
                                <option value="France">France</option>
                                <option value="Germany">Germany</option>
                                <option value="United Kingdom">
                                  United Kingdom
                                </option>
                              </select>
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Address:
                              </span>
                              <input
                                type="text"
                                value={formData.shippingAddressStreet1}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingAddressStreet1: e.target.value,
                                  })
                                }
                                placeholder="Street 1"
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <input
                                type="text"
                                value={formData.shippingAddressStreet2}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingAddressStreet2: e.target.value,
                                  })
                                }
                                placeholder="Street 2"
                                className="w-full border border-gray-300 rounded-md p-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shippping City */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                City:
                              </span>
                              <input
                                type="text"
                                value={formData.shippingCity}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingCity: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping State */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                State:
                              </span>
                              <select
                                value={formData.shippingState}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingState: e.target.value,
                                  })
                                }
                                className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                              >
                                <option value="">Select State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                              </select>
                            </div>
                          </div>
                          {/* Shipping Pin Code */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Pin Code:
                              </span>
                              <input
                                type="text"
                                value={formData.shippingPinCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingPinCode: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Phone */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Phone:
                              </span>
                              <input
                                type="text"
                                value={formData.shippingPhoneNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingPhoneNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                          {/* Shipping Fax Number */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-6 mt-6">
                              <span className="text-base font-medium text-gray-700">
                                Fax Number:
                              </span>
                              <input
                                type="text"
                                value={formData.shippingFaxNumber}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    shippingFaxNumber: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Contact Persons" && (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Salutation
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  First Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Last Name
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Email Address
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Work Phone
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Communication Channels
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {contactPersons.map((person, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  {/* Salutation Dropdown */}
                                  <td className="px-4 py-2 border-b">
                                    <select
                                      value={person.salutation}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "salutation",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    >
                                      <option value="">Select</option>
                                      <option value="Mr.">Mr.</option>
                                      <option value="Mrs.">Mrs.</option>
                                      <option value="Ms.">Ms.</option>
                                      <option value="Dr.">Dr.</option>
                                    </select>
                                  </td>

                                  {/* First Name */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="text"
                                      value={person.firstName}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "firstName",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Last Name */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="text"
                                      value={person.lastName}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "lastName",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Email Address */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="email"
                                      value={person.email}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Work Phone */}
                                  <td className="px-4 py-2 border-b">
                                    <input
                                      type="tel"
                                      value={person.workPhone}
                                      onChange={(e) =>
                                        handleContactPersonChange(
                                          index,
                                          "workPhone",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border rounded p-1 text-sm"
                                    />
                                  </td>

                                  {/* Communication Channels */}
                                  <td className="px-4 py-2 border-b">
                                    <div className="flex gap-4">
                                      <label className="flex items-center space-x-1">
                                        <input
                                          type="checkbox"
                                          checked={person.communicationChannels.includes(
                                            "Email"
                                          )}
                                          onChange={(e) =>
                                            handleChannelChange(
                                              index,
                                              "Email",
                                              e.target.checked
                                            )
                                          }
                                          className="form-checkbox h-4 w-4"
                                        />
                                        <span className="text-sm">Email</span>
                                      </label>
                                      <label className="flex items-center space-x-1">
                                        <input
                                          type="checkbox"
                                          checked={person.communicationChannels.includes(
                                            "SMS"
                                          )}
                                          onChange={(e) =>
                                            handleChannelChange(
                                              index,
                                              "SMS",
                                              e.target.checked
                                            )
                                          }
                                          className="form-checkbox h-4 w-4"
                                        />
                                        <span className="text-sm">SMS</span>
                                      </label>
                                    </div>
                                  </td>

                                  {/* Delete Button */}
                                  <td className="px-4 py-2 border-b">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteContactPerson(index)
                                      }
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Add Row Button */}
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={handleAddContactPerson}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              Add Row
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;

// import {
//   useAddCustomer,
//   useCustomerById,
//   useUpdateCustomerById,
// } from "@/services/customer.service";
// import { toastError, toastSuccess } from "@/utils/toast";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// const AddCustomer = () => {
//   const [formData, setFormData] = useState({
//     contactName: "",
//     contactOwner: "",
//     companyName: "",
//     email: "",
//     phoneNumber: "",
//     panNumber: "",
//     placeOfSupply: "",
//     state: "",
//     city: "",
//     Area: "",
//     Address: "",
//     bankName: "",
//     bankAccountNumber: "",
//     bankIFSCCode: "",
//     salutation: "",
//     contactPersonName: "",
//     contactPersonEmail: "",
//     contactPersonPhoneNumber: "",
//   });

//   const { id } = useParams();

//   const navigate = useNavigate();
//   const { mutateAsync: AddCustomer } = useAddCustomer();
//   const { mutateAsync: updateCustomer } = useUpdateCustomerById();
//   const { data: customerDataById, isLoading } = useCustomerById(id || "");

//   useEffect(() => {
//     // Prefill form when editing
//     if (customerDataById) {
//       console.log(customerDataById, "getById/");
//       setFormData(customerDataById?.data || "");
//     }
//   }, [customerDataById]);
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const obj = formData;

//       if (id) {
//         const { data: res } = await updateCustomer({ id, obj });
//         if (res?.message) {
//           toastSuccess(res.message);
//           navigate("/customer-sale");
//         }
//       } else {
//         const { data: res } = await AddCustomer(obj);
//         console.log(res, "res");
//         if (res?.message) {
//           toastSuccess(res.message);
//           navigate("/customer-sales");
//         }
//       }
//     } catch (error) {
//       toastError(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
//         <h1 className="text-2xl font-bold mb-6">Add Customer</h1>
//         <form onSubmit={handleSubmit}>
//           {/* Contact Details Section */}
//           <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* Contact Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Name
//               </label>
//               <input
//                 value={formData.contactName}
//                 name={"contactName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, contactName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter contact name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Contact Owner */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Owner
//               </label>
//               <input
//                 value={formData.contactOwner}
//                 name={"contactOwner"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, contactOwner: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Auto fill"
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 disabled
//               />
//             </div>

//             {/* Company Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Name
//               </label>
//               <input
//                 value={formData.companyName}
//                 name={"companyName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, companyName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter company name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 value={formData.email}
//                 name={"email"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 type="email"
//                 placeholder="Enter email"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 value={formData.phoneNumber}
//                 name={"phoneNumber"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phoneNumber: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter phone number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* PAN Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 PAN Number
//               </label>
//               <input
//                 value={formData.panNumber}
//                 name={"panNumber"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, panNumber: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter PAN number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>

//             {/* Place of Supply */}
//             {/* city or state or option are coming from api */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Place of Supply
//               </label>
//               <select
//                 name={"placeOfSupply"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, placeOfSupply: e.target.value })
//                 }
//                 value={formData.placeOfSupply}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 defaultValue=""
//               >
//                 <option value="">Select place of supply</option>
//                 <option value="Gujarat">Gujarat</option>
//                 {/* Add options as needed */}
//               </select>
//             </div>
//           </div>

//           {/* Commented out other sections
//           <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 State
//               </label>
//               <input
//                 value={formData.state}
//                 name={"state"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, state: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter state"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 City
//               </label>
//               <input
//                 value={formData.city}
//                 name={"city"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, city: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter city"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Area
//               </label>
//               <input
//                 value={formData.Area}
//                 name={"Area"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, Area: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter area"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Address
//               </label>
//               <input
//                 value={formData.Address}
//                 name={"Address"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, Address: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter address"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           <h2 className="text-lg font-semibold mb-4">Bank Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bank Name
//               </label>
//               <input
//                 value={formData.bankName}
//                 name={"bankName"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, bankName: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter bank name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Bank Account Number
//               </label>
//               <input
//                 value={formData.bankAccountNumber}
//                 name={"bankAccountNumber"}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     bankAccountNumber: e.target.value,
//                   })
//                 }
//                 type="text"
//                 placeholder="Enter account number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 IFSC Code
//               </label>
//               <input
//                 value={formData.bankIFSCCode}
//                 name={"bankIFSCCode"}
//                 onChange={(e) =>
//                   setFormData({ ...formData, bankIFSCCode: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Enter IFSC code"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>

//           <h2 className="text-lg font-semibold mb-4">Contact Person</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Salutation
//               </label>
//               <select
//                 name="salutation"
//                 onChange={(e) =>
//                   setFormData({ ...formData, salutation: e.target.value })
//                 }
//                 value={formData.salutation}
//                 className="w-full border border-gray-300 rounded-md p-2"
//                 defaultValue=""
//               >
//                 <option value="">Select salutation</option>
//                 <option>Mr.</option>
//                 <option>Ms.</option>
//                 <option>Dr.</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Name
//               </label>
//               <input
//                 name="contactPersonName"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonName: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonName}
//                 type="text"
//                 placeholder="Enter name"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email
//               </label>
//               <input
//                 name="contactPersonEmail"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonEmail: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonEmail}
//                 type="email"
//                 placeholder="Enter email"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 name="contactPersonPhoneNumber"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     contactPersonPhoneNumber: e.target.value,
//                   })
//                 }
//                 value={formData.contactPersonPhoneNumber}
//                 type="text"
//                 placeholder="Enter phone number"
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//             </div>
//           </div>
//           */}

//           {/* Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-orange-500 text-white rounded-md"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;
