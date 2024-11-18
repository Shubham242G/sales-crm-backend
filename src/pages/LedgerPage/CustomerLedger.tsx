import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";

function CustomerLedger() {
  const navigate = useNavigate()
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
 
  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };
  const columns = [
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.name}</h6> 
        </div>
      ),
      width: "20%",
    },

    {
      name: "Company",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.company}
        </div>
      ),
      width: "20%",
    },
    {
      name: "Phone Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.contactno}
        </div>
      ),
      width: "10%",
    },

    {
      name: "Email",
      selector: (row: any) => row.email,
      width: "20%",
    },
    {
      name: "Service",
      selector: (row: any) => (
        <>
          <div className="flex justify-around">
            {row.service.map((e: any, index: number) => (
              <div
                key={index}
                className="border border-b-purple-300 py-1 px-3 bg-gray-200 rounded-md"
              >
                {e.name}
              </div>
            ))}
          </div>
        </>
      ),
      width: "20%",
    },
    {
      name: "Action",
      width: "10%",
      selector: () => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLedgerDetailsModal}
            className=" text-black-500 text-lg p-[6px]"
          >
            <FaEye />
          </button>
          <Link
            to="/update-ledger/id=1234"
            className=" p-[6px] text-black-400 text-lg"
          >
            <RiDeleteBin6Line />
          </Link>
        </div>
      ),
    },
  ];

  // Sample data
  const data = [
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "Event" },{ name: "Banquet" }],
    },
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "Event" },{ name: "Banquet" }],
    },
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      service: [{ name: "hotel" }, { name: "Event" },{ name: "Banquet" }]
    },
  ];


  return (
    <>
      {/* <Breadcrumb
        pageTitle="Customer Ledger"
        pageCategory="All Ledger"
        activePage="All Customer Ledger"
        previouspageurl="/"
        addbuttn={true}
        withLink={true}
        addbuttnurl="/add-ledger"
        excelbuttn={false}
        filterbuttn={false}
      /> */}

      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800">
              All Vendor List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full">
                <input
                  type="search"
                  className="rounded-sm w-full border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search..."
                />
              </div>
              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>
          
              <button onClick={()=> navigate("/add-vendor")} className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300">
                <FaPlus />
                <span>New Vendor</span>
              </button>
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={data}
            columns={columns}
            loading={false}
            totalRows={0} 
            // loading={loading}
            // totalRows={data.length}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handleRowsPerPageChange}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </>
  );
}

export default CustomerLedger;
