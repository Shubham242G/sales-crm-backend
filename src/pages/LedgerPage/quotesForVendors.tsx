import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { useQuotesFromVendors, useQuotesFromVendorsById } from "@/services/quotesFromVendors.service";

function CustomerLedger() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {data: quotesFromVendors, isLoading} = useQuotesFromVendors();  
  // const {data: quotesFromVendorsIdData,} = useQuotesFromVendorsById(); 


  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const navigate = useNavigate();
  const columns = [
    {
      name: "Quotes Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row? console.log(row, "row") : row.quotesId}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.vendorName}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "RPFs Id",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.rfqId}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Service",
      selector: (row: any) => (
        <>
          <div className="flex justify-around">
            {row.serviceType
.map((e: any, index: number) => (
              <div
                key={index}
                className="border border-b-purple-300 py-1 px-3 bg-gray-200 rounded-md"
              >
                {e}
              </div>
            ))}
          </div>
        </>
      ),
      width: "25%",
    },
    {
      name: "Amount",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.amount}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Date Received",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.submissionDate}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col p-2 rounded-md text-white ${row.status === "Pending"
            ? "bg-yellow-200 text-yellow-500"
            : row.status === "Reviewed"
              ? "bg-green-300 text-green-600"
              : "bg-red-200 text-red-600"
            }`}
        >
          <h6>{row.status}</h6>
        </div>
      ),
      width: "15%",
    },

    {
      name: "Action",
      width: "10%",
      selector: () => (
        <div className="flex items-center gap-3">
          <Link
            to="/view-quotesFromVendor"
            className="  p-[6px] text-black-400 text-lg"
          >
            <FaEye />
          </Link>

          <Link
            to="/update-ledger/id=1234"
            className="  p-[6px] text-black-400 text-lg"
          >
            <RiDeleteBin6Line />
          </Link>
        </div>
      ),
    },
  ];

  // Sample data
  

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
              Quotes from  Vendor
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
              <button 
              onClick={() => navigate("/addQuotesFromVendors")}
              className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300">
                <FaPlus />
                <span>New quotes for vendors</span>
              </button>
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={quotesFromVendors.data}
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
