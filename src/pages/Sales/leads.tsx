import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { useLeadById, useAddLead, useUpdateLeadById, usedeleteLeadById, useLead } from "@/services/lead.service";
import { toastError, toastSuccess } from "@/utils/toast";

function Leads() {
  const navigate = useNavigate()


  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const searchObj = useMemo(() => ({
    ...(query && { query }),
    pageIndex: pageIndex - 1,
    pageSize
  }), [pageIndex, pageSize, query]);

  const { data: LeadData } = useLead(searchObj);
  console.log(LeadData, "check leadData")
  const { mutateAsync: deleteLead } = usedeleteLeadById();








  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteLead(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };



  const columns = [
    {
      name: "Contact Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.firstName + " " + row.lastName}</h6>
        </div>
      ),
      width: "20%",
    },

    {
      name: "Contact Owner",
      selector: (row: any) => (
        <div className="flex gap-1">
          {/* <FaMobileScreenButton className=" text-[#938d8d]" /> */}
          {row.ownerName}
        </div>
      ),
      width: "20%",
    },
    {
      name: "Mobile Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.phone}
        </div>
      ),
      width: "10%",
    },
    {
      name: "Company Name",
      selector: (row: any) => (
        <div className="flex gap-1">
          {/* <FaMobileScreenButton className=" text-[#938d8d]" /> */}
          {row.company}
        </div>
      ),
      width: "20%",
    },

    {
      name: "Email",
      selector: (row: any) => row.email,
      width: "30%",
    },
    // {
    //   name: "Action",
    //   width: "10%",
    //   selector: () => (
    //     <div className="flex items-center gap-3">
    //       <button
    //         type="button"
    //         onClick={handleLedgerDetailsModal}
    //         className=" text-black-500 text-lg p-[6px]"
    //       >
    //         <FaEye />
    //       </button>
    //       <Link
    //         to="/update-ledger/id=1234"
    //         className=" p-[6px] text-black-400 text-lg"
    //       >
    //         <RiDeleteBin6Line />
    //       </Link>
    //     </div>
    //   ),
    // },
  ];

  // Sample data
  const data = [
    {
      name: "Ajay Kumar",
      ownerName: "Vandana Sharma",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      //   service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      ownerName: "Vandana Sharma",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      //   service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      ownerName: "Vandana Sharma",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      //   service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      ownerName: "Vandana Sharma",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      //   service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
    },
    {
      name: "Ajay Kumar",
      ownerName: "Vandana Sharma",
      contactno: "9968237063",
      email: "test@test.com",
      company: "Google",
      //   service: [{ name: "hotel" }, { name: "banquet" },{ name: "Event" }],
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
              Leads List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by contact name"
                />
                <div className="relative right-8"><IoSearchOutline /></div>
              </div>
              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              {/* <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button> */}

              <button onClick={() => navigate("/add-leads")} className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300">
                <FaPlus />
                <span>New Lead</span>
              </button>
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={LeadData?.data}
            columns={columns}
            loading={false}
            totalRows={LeadData?.total}
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

export default Leads;
