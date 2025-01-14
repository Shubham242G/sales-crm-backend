import React, { useState } from "react";
import logo from "@/assets/mainlogo/logo.png";
import { useNavigate, useParams } from "react-router-dom";
function QuotesForCustomerView() {


  const [formData, setFormData] = useState({




    contactName: "",
    contactOwner: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    panNumber: "",
    placeOfSupply: "",
    state: "",
    city: "",
    Area: "",
    Address: "",
    bankName: "",
    bankAccountNumber: "",
    bankIFSCCode: "",
    salutation: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhoneNumber: "",





  });


  const { id } = useParams();

  const navigate = useNavigate();
  // const { mutateAsync: AddCustomer } = useAddCustomer();
  // const { mutateAsync: updateCustomer } = useUpdateCustomerById();
  // const { data: customerDataById, isLoading } = useCustomerById(id || "");


  // useEffect(() => {
  //   // Prefill form when editing
  //   if (customerDataById) {
  //     console.log(customerDataById, "getById/");
  //     setFormData(customerDataById?.data || "");

  //   }
  // }, [customerDataById]);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {

  //     const obj = formData;

  //     if (id) {

  //       const { data: res } = await updateCustomer({ id, obj });
  //       if (res?.message) {
  //         toastSuccess(res.message);
  //         navigate("/customer-sale")

  //       }
  //     } else {

  //       const { data: res } = await AddCustomer(obj);
  //       console.log(res, "res");
  //       if (res?.message) {
  //         toastSuccess(res.message);
  //         navigate("/customer-sales")

  //       }
  //     }
  //   } catch (error) {
  //     toastError(error);
  //   }
  // };







  return (
    <div className="bg-gray-100 min-h-screen w-full ">
      <header className="text-left mb-8 relative bg-[#0B2F46] p-8 rounded-t-md">
        {/* <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 h-[100px] w-[106px] object-contain absolute top-4 left-6"
        /> */}
        <h1 className="text-[25px] font-bold text-white">Vendor Information</h1>
      </header>
      <div className="p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a]">
          Quotes For Customer View
        </h2>
        <section className="py-6 px-10 grid grid-cols-2 gap-4 mb-6 bg-white border border-gray-[#D1D1D1] rounded-lg">
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Customer Name</p>:
            <p className="text-xl font-medium text-[#888888]">
              Virendra Sharma
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Company Name</p>:
            <p className="text-xl font-medium text-[#888888]">
              JRB Nirman pvt. Ltd.
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Email Address</p>:
            <p className="text-xl font-medium text-[#888888]">
              pankaj.singh012@gmaul.com
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Location</p>:
            <p className="text-xl font-medium text-[#888888]">Delhi</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Phone Number</p>:
            <p className="text-xl font-medium text-[#888888]">8855445566</p>
          </div>
        </section>

        <h2 className="text-lg font-medium text-[#1a1a1a]">RFPs Information</h2>
        <section className="py-6 px-10 grid grid-cols-2 gap-4 mb-6 bg-white border border-gray-[#D1D1D1] rounded-lg">
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">RFPs Id</p>:
            <p className="text-xl font-medium text-[#888888]">RFP 1765543</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Event Date</p>:
            <p className="text-xl font-medium text-[#888888]">15 Nov 2024</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Service Type</p>:
            <p className="text-xl font-medium text-[#888888]">
              Hotel,Banquet,Transport
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">
              Submission Date
            </p>
            :<p className="text-xl font-medium text-[#888888]">28 Oct 2024</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Event Details</p>:
            <p className="text-xl font-medium text-[#888888]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}


export default QuotesForCustomerView;
