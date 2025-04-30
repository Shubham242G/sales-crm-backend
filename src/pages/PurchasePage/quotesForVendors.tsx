import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { SiConvertio } from "react-icons/si";
import {
  useConvertQuotesFromVendorToQuotesToCustomer,
  useQuotesFromVendors,
  useQuotesFromVendorsById,
  usedeleteQuotesFromVendorsById,
} from "@/services/quotesFromVendors.service";
import { toastError, toastSuccess } from "@/utils/toast";

function CustomerLedger() {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );
  const { data: quotesFromVendors, isLoading } = useQuotesFromVendors(searchObj);



  const { mutateAsync: convertQuotesFromVendorToQuotesToCustomer } =
    useConvertQuotesFromVendorToQuotesToCustomer();

  const { mutateAsync: deleteQuotesFromVendors } =
    usedeleteQuotesFromVendorsById();

  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this Quote?")) {
        const { data: res } = await deleteQuotesFromVendors(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToCustomerQuote = async (id: string) => {
    try {
      const { data: res } = await convertQuotesFromVendorToQuotesToCustomer(id);
      if (res?.message) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError("Failed to convert quote.");
    }
  };

  const columns = [
    {
      name: "Quotes Id",
      selector: (row: any) => <h6>{row?.quotesId}</h6>,
      width: "10%",
    },
    {
      name: "Vendor Name",
      selector: (row: any) => <h6>{row?.vendorList?.label}</h6>,
      width: "10%",
    },
    {
      name: "RPFs Id",
      selector: (row: any) => <h6>{row?.rfpId}</h6>,
      width: "10%",
    },
    {
      name: "Status",
      selector: (row: any) => <h6 className="" > { row?.status }</h6>,
    width: "15%",
    },
{
  name: "Service",
    selector: (row: any) => (
      <div className="flex-row  justify-around ">
        {row?.serviceType?.map((e: any, index: number) => (
          <div
            key={index}
            className="border border-b-purple-300 py-1 text-gray-900 px-3 bg-gray-200 mt-2 text-center rounded-md"
          >
            {e}
          </div>
        ))}
      </div>
    ),
      width: "10%",
    },
{
  name: "Amount",
    selector: (row: any) => <h6>{row?.amount}</h6>,
      width: "10%",
    },
{
  name: "Date Received",
    selector: (row: any) => <h6>{row?.receivedDate}</h6>,
      width: "12%",
    },
// {
//   name: "Status",
//   selector: (row: any) => (
//     <div
//       className={`p-2 rounded-md text-white ${
//         row.status === "Pending"
//           ? "bg-yellow-200 text-yellow-500"
//           : row.status === "Reviewed"
//           ? "bg-green-300 text-green-600"
//           : "bg-red-200 text-red-600"
//       }`}
//     >
//       <h6>{row?.status}</h6>
//     </div>
//   ),
//   width: "12%",
// },
{
  name: "Action",
    width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/addQuotesFromVendors/${row._id}`}
            className=" p-[3px] text-black-400 text-lg  hover:text-orange-500"
          >
            <FaEye />
          </Link>
          <button
            className=" text-black-400 text-lg "
            onClick={() => handleDelete(row._id)}
          >
            <RiDeleteBin6Line className="hover:text-red-500" />
          </button>
        </div>
      ),
    },
{
  name: "Convert to Customer Quote",
    width: "13%",
      selector: (row: any) => (
        <div>
          <button
            type="button"
            onClick={() => handleConvertToCustomerQuote(row._id)}
            className="text-lg text-black-400 hover:text-black-700 "
            title="Convert to Customer Quote"
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

return (
  <div className="container px-6">
    <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
      <div className="search_boxes flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Quotes from Vendor
        </h2>
        <div className="flex items-center justify-start gap-2">
          <div className="w-full">
            <input
              type="search"
              className="rounded-md w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
              placeholder="Search..."
            />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
            <FaFilter /> Filter
          </button>
          <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
            <FaFileExport /> Export
          </button>
          <button
            onClick={() => navigate("/addQuotesFromVendors")}
            className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
          >
            <FaPlus />
            <span>New quotes for vendors</span>
          </button>
        </div>
      </div>
      <ReactTable
        data={quotesFromVendors.data}
        columns={columns}
        loading={false}
        totalRows={0}
        onChangeRowsPerPage={setPageSize}
        onChangePage={setPageIndex}
        page={pageIndex}
        rowsPerPageText={pageSize}
        isServerPropsDisabled={false}
      />
    </div>
  </div>
);
}

export default CustomerLedger;