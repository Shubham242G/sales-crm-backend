import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { useVendorById , useVendor, usedeleteVendorById, useUpdateVendorById} from "@/services/vendor.service";
import { toastError, toastSuccess } from "@/utils/toast";

function VendorList() {
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

  const { data: VendorData } = useVendor(searchObj);
  console.log(VendorData, "check leadData")
  const { mutateAsync: deleteVendor } = usedeleteVendorById();
  const {mutateAsync: updateVendor} = useUpdateVendorById();

  const handleDelete = async (id: string) => {
    try {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            const { data: res } = await deleteVendor(id);
            if (res) {
                toastSuccess(res.message);
                // Optionally refresh the data
            }
        }
    } catch (error) {
        toastError(error);
    }
};

// useEffect(()=>{
//     if(VendorData){
//         setVendorList(VendorData?.data)
//     } 
// },[VendorList])

const handleUpdate = async (id: string, data: any) => {
  try {
          const { data: res } = await updateVendor({
              id: id,
              obj: data // Add the required object data here
          });
          if (res) {
              toastSuccess(res.message);
              // Optionally refresh the data
          }
      
  } catch (error) {
      toastError(error);
  }
};



  const columns = [
    {
      name: "Vendor Name", 
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.vendor?.firstName}</h6> 
        </div>
      ),
      width: "20%",
    },

    {
      name: "Company",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.vendor?.companyName}
        </div>
      ),
      width: "20%",
    },
    {
      name: "Phone Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.vendor?.phoneNumber}
        </div>
      ),
      width: "10%",
    },

    {
      name: "Email",
      selector: (row: any) => row.vendor?.email,
      width: "20%",
    },
    {
      name: "Action",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/add-vendor/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
            onClick={() => handleUpdate(row._id, row.data)}
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="p-[6px] text-black-400 text-lg"
            title="Delete Customer"
          >
            <RiDeleteBin6Line />
          </button>
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
           data={VendorData?.data}
           columns={columns}
           loading={false}
           totalRows={VendorData?.total}
         // loading={loading}
          />
        </div>
      </div>
    </>
  );
}

export default VendorList;
