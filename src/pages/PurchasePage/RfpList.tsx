
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";

import {
  useRfp,
  usedeleteRfpById,
  useAddRfp,
  useUpdateRfpById,
  useConvertRfpToQuotesFromVendor,
} from "@/services/rfp.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SiConvertio } from "react-icons/si";
import { Margin } from "@mui/icons-material";
import { l } from "vite/dist/node/types.d-aGj9QkWt";

function RfpList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };
  const { mutateAsync: convertRfp } = useConvertRfpToQuotesFromVendor();

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


  // const {data: useEnquiryByIdData} = useEnquiryById(enquiryId);

  const { data: RfpData, isLoading } = useRfp(searchObj);
  const { mutateAsync: deleteRfp } = usedeleteRfpById();
  const { mutateAsync: updateRfp } = useUpdateRfpById();

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("RFPS");

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateRfp({
        id: id,
        obj: data, // Add the required object data here
      });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  };

  // Handle file selection and upload
  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setIsUploading(true);
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const response = await addEnquiryExel(formData);

  //     console.log(response, "check response")
  //     toastSuccess("Enquries imported successfully!");

  //     // Optionally refresh the data
  //     // You might want to add a refetch function from your useContact hook

  //   } catch (error) {
  //     toastError("Failed to import enquiries. Please try again.");
  //     console.error("Import Error:", error);
  //   } finally {
  //     setIsUploading(false);
  //     // Clear the file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }
  //   }
  // };

  // Handle Export Contacts
  // const handleExportEnquiries = async () => {
  //   try {
  //     const { data: response } = await getExel();
  //     console.log(response, "check response")
  //     const url = generateFilePath("/" + response.filename);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "enquiries.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     toastSuccess("Enquries exported successfully!");
  //   } catch (error) {
  //     toastError("Failed to export enquiries. Please try again.");
  //     console.error("Export Error:", error);
  //   }
  // };

  //

  const handleConvertRfptoQuotesFromVendor = async (id: string) => {
    try {
      const { data: res } = await convertRfp(id);
      console.log("Thiss is rfp to vendor--->", res.message)
      toastSuccess(res.message);
    } catch (error: any) {
      console.log("error", error);
      toastError(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        const { data: res } = await deleteRfp(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "RFPID",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6>{row.rfpId}</h6>
        </div>
      ),
      width: "10%",
    },
    // {
    //   name: "Full Name",
    //   selector: (row: any) => (
    //     <div className="flex gap-1 flex-col">
    //       <h6>{row?.fullName}</h6>
    //       {/* {row.fullName} */}
    //     </div>
    //   ),
    //   width: "10%",
    // },
    {
      name: "Event Date",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>
            {row.eventDates?.length > 0
              ? new Date(row.eventDates[0].startDate).toDateString()
              : "No Dates"}
          </h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Deadline for proposal",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{new Date(row?.deadlineOfProposal).toDateString()}</h6>
          {/* {row.fullName} */}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Services",
      selector: (row: any) => (
        <div className="flex justify-around ml-1">{row.serviceType}</div>
      ),
      width: "10%",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div  className="flex  justify-around  "><h6 className="whitespace-normal break-words">{row.status}</h6></div>
      ),
      width: "26%",
    },
    {
      name: "Edit",
      width: "8%",
      selector: (row: any) => (
        <Link
          to={`/add-rfps/${row._id}`}
          className="p-[6px] text-black-400 text-lg flex items-center"
          onClick={() => handleUpdate(row._id, row.data)}
        >
          <FaEye />
        </Link>
      ),
    },
    {
      name: "Delete",
      width: "8%",
      selector: (row: any) => (
        <Link
          to="/rfps"
          className="p-[6px] text-black-400 text-lg"
          onClick={() => handleDelete(row._id)}
        >
          <RiDeleteBin6Line className="ml-3"/>
        </Link>
      ),
    },
    {
      name: "Convert to Quotes from Vendor",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/add-sales-contact/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          ></Link>
          <button
            className="p-[6px] text-black-400 text-lg"
            onClick={() => handleConvertRfptoQuotesFromVendor(row._id)}
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

  const filterColumns = columns.filter((item) => {
    if (item.name === "Delete") {
      return canDelete;
    } else if (item.name === "Edit") {
      return canView || (canView && canUpdate);
    } else {
      return true;
    }
  });

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
              All RFPs List
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
                onClick={() => navigate("/add-rfps")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-400 border border-gray-300"
              >
                <FaPlus />
                <span>New RFPs</span>
              </button>
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={RfpData.data}
            columns={filterColumns}
            loading={false}
            totalRows={RfpData?.total}
            onChangePage={setPageIndex}
            onChangeRowsPerPage={setPageSize}
          // pagination
          // paginationPerPage={rowsPerPage}
          // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </>
  );
}

export default RfpList;
