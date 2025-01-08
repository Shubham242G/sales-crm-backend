import React, { useState } from 'react';
import Select from 'react-select';

const AddContact = () => {
    const [formData, setFormData] = useState({
        // Basic Details
        displayName: '',
        companyName: '',
        salutation: '',
        firstName: '',
        lastName: '',
        phone: '',
        currencyCode: '',
        notes: '',
        website: '',
        status: '',
        openingBalance: '',
        openingBalanceExchangeRate: '',
        branchId: '',
        branchName: '',
        bankAccountPayment: '',
        portalEnabled: false,
        creditLimit: '',
        customerSubType: '',
        department: '',
        designation: '',
        priceList: '',
        paymentTerms: '',
        paymentTermsLabel: '',

        // Contact Information
        emailId: '',
        mobilePhone: '',
        skypeIdentity: '',
        facebook: '',
        twitter: '',

        // GST Details
        gstTreatment: '',
        gstin: '',
        taxable: false,
        taxId: '',
        taxName: '',
        taxPercentage: '',
        exemptionReason: '',

        // Billing Address
        billingAttention: '',
        billingAddress: '',
        billingStreet2: '',
        billingCity: '',
        billingState: '',
        billingCountry: '',
        billingCounty: '',
        billingCode: '',
        billingPhone: '',
        billingFax: '',

        // Shipping Address
        shippingAttention: '',
        shippingAddress: '',
        shippingStreet2: '',
        shippingCity: '',
        shippingState: '',
        shippingCountry: '',
        shippingCounty: '',
        shippingCode: '',
        shippingPhone: '',
        shippingFax: '',

        // Additional Details
        placeOfContact: '',
        placeOfContactWithStateCode: '',
        contactAddressId: '',
        source: '',
        ownerName: '',
        primaryContactId: '',
        contactId: '',
        contactName: '',
        contactType: '',
        lastSyncTime: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
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
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Add Contact</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Display Name*</label>
                                <input
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                    required
                                    type="text"
                                />
                            </div>
                            <div>
                                <label>Company Name</label>
                                <input
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Salutation</label>
                                <input
                                    name="salutation"
                                    value={formData.salutation}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>First Name</label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
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
                                <label>Currency Code</label>
                                <input
                                    name="currencyCode"
                                    value={formData.currencyCode}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Notes</label>
                                <input
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Website</label>
                                <input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Status</label>
                                <input
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Opening Balance</label>
                                <input
                                    name="openingBalance"
                                    value={formData.openingBalance}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Opening Balance Exchange Rate</label>
                                <input
                                    name="openingBalanceExchangeRate"
                                    value={formData.openingBalanceExchangeRate}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Branch ID</label>
                                <input
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Branch Name</label>
                                <input
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Bank Account Payment</label>
                                <input
                                    name="bankAccountPayment"
                                    value={formData.bankAccountPayment}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Portal Enabled</label>
                                <input
                                    type="checkbox"
                                    name="portalEnabled"
                                    checked={formData.portalEnabled}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label>Credit Limit</label>
                                <input
                                    name="creditLimit"
                                    value={formData.creditLimit}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Customer Sub Type</label>
                                <input
                                    name="customerSubType"
                                    value={formData.customerSubType}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Department</label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Designation</label>
                                <input
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Price List</label>
                                <input
                                    name="priceList"
                                    value={formData.priceList}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Payment Terms</label>
                                <input
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Payment Terms Label</label>
                                <input
                                    name="paymentTermsLabel"
                                    value={formData.paymentTermsLabel}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Email ID</label>
                                <input
                                    type="email"
                                    name="emailId"
                                    value={formData.emailId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Mobile Phone</label>
                                <input
                                    type="tel"
                                    name="mobilePhone"
                                    value={formData.mobilePhone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Skype Identity</label>
                                <input
                                    name="skypeIdentity"
                                    value={formData.skypeIdentity}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Facebook</label>
                                <input
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Twitter</label>
                                <input
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Billing Address */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Attention</label>
                                <input
                                    name="billingAttention"
                                    value={formData.billingAttention}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Address</label>
                                <input
                                    name="billingAddress"
                                    value={formData.billingAddress}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Street 2</label>
                                <input
                                    name="billingStreet2"
                                    value={formData.billingStreet2}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>City</label>
                                <input
                                    name="billingCity"
                                    value={formData.billingCity}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>State</label>
                                <input
                                    name="billingState"
                                    value={formData.billingState}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Country</label>
                                <input
                                    name="billingCountry"
                                    value={formData.billingCountry}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>County</label>
                                <input
                                    name="billingCounty"
                                    value={formData.billingCounty}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input
                                    name="billingCode"
                                    value={formData.billingCode}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input
                                    name="billingPhone"
                                    value={formData.billingPhone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Fax</label>
                                <input
                                    name="billingFax"
                                    value={formData.billingFax}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                        </div>
                    </section>


                    {/* GST Details */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">GST Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>GST Treatment</label>
                                <input
                                    name="gstTreatment"
                                    value={formData.gstTreatment}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>GSTIN</label>
                                <input
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Taxable</label>
                                <input
                                    type="checkbox"
                                    name="taxable"
                                    checked={formData.taxable}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label>Tax ID</label>
                                <input
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Tax Name</label>
                                <input
                                    name="taxName"
                                    value={formData.taxName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Tax Percentage</label>
                                <input
                                    name="taxPercentage"
                                    value={formData.taxPercentage}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Exemption Reason</label>
                                <input
                                    name="exemptionReason"
                                    value={formData.exemptionReason}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Shipping Address */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Attention</label>
                                <input
                                    name="shippingAttention"
                                    value={formData.shippingAttention}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Address</label>
                                <input
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Street 2</label>
                                <input
                                    name="shippingStreet2"
                                    value={formData.shippingStreet2}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>City</label>
                                <input
                                    name="shippingCity"
                                    value={formData.shippingCity}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>State</label>
                                <input
                                    name="shippingState"
                                    value={formData.shippingState}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Country</label>
                                <input
                                    name="shippingCountry"
                                    value={formData.shippingCountry}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>County</label>
                                <input
                                    name="shippingCounty"
                                    value={formData.shippingCounty}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Postal Code</label>
                                <input
                                    name="shippingCode"
                                    value={formData.shippingCode}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input
                                    name="shippingPhone"
                                    value={formData.shippingPhone}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Fax</label>
                                <input
                                    name="shippingFax"
                                    value={formData.shippingFax}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Additional Details */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label>Place of Contact</label>
                                <input
                                    name="placeOfContact"
                                    value={formData.placeOfContact}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Place of Contact with State Code</label>
                                <input
                                    name="placeOfContactWithStateCode"
                                    value={formData.placeOfContactWithStateCode}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Contact Address ID</label>
                                <input
                                    name="contactAddressId"
                                    value={formData.contactAddressId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Source</label>
                                <input
                                    name="source"
                                    value={formData.source}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Owner Name</label>
                                <input
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Primary Contact ID</label>
                                <input
                                    name="primaryContactId"
                                    value={formData.primaryContactId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Contact ID</label>
                                <input
                                    name="contactId"
                                    value={formData.contactId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Contact Name</label>
                                <input
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Contact Type</label>
                                <input
                                    name="contactType"
                                    value={formData.contactType}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full mt-1"
                                />
                            </div>
                            <div>
                                <label>Last Sync Time</label>
                                <input
                                    type="datetime-local"
                                    name="lastSyncTime"
                                    value={formData.lastSyncTime}
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

export default AddContact;




