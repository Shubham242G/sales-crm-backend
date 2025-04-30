import React from "react";
import logo from "@/assets/mainlogo/logo.png";
function QuotesForVendorsView() {
  return (
    <div className="bg-gray-100 min-h-screen w-full ">
      <header className="text-left mb-8 relative bg-[#0B2F46] p-8 rounded-t-md">
        {/* <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 h-[100px] w-[106px] object-contain absolute top-4 left-6"
        /> */}
        <h1 className="text-[25px] font-bold text-white">
          Quotes for Vendor View
        </h1>
      </header>

      <div className="p-8">
        <h2 className="text-lg font-medium text-[#1a1a1a]">
          Vendor Information
        </h2>
        <section className="py-6 px-10 grid grid-cols-2 gap-4 mb-6 bg-white border border-gray-[#D1D1D1] rounded-lg">
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Quotes Id</p>:
            <p className="text-xl font-medium text-[#888888]">QOT127865</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">RFPs Id</p>:
            <p className="text-xl font-medium text-[#888888]">RFP7766554</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Vendor Name</p>:
            <p className="text-xl font-medium text-[#888888]">Pankaj Singh</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Amount</p>:
            <p className="text-xl font-medium text-[#888888]"> 5,00,000</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Service Type</p>:
            <p className="text-xl font-medium text-[#888888]">
              Hotel,Banquet,Transport
            </p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Received Date</p>:
            <p className="text-xl font-medium text-[#888888]">24 Oct 2024</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Attachment</p>:
            <p className="text-xl font-medium text-[#888888]">Some Pdf here</p>
          </div>
          <div className="flex flex-row gap-6 text-xl font-medium text-[#1A1A1A]">
            <p className="text-xl font-medium text-[#1A1A1A]">Status</p>:
            <p className="text-xl font-medium text-[#888888]">Pending</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default QuotesForVendorsView;
