import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import {
  useLeadById,
  useAddLead,
  useUpdateLeadById,
  usedeleteLeadById,
  useLead,
  convertToContact,
  addLeadExel,
  getExel,
} from "@/services/lead.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";

function Leads() {
  const navigate = useNavigate();

  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Leads");

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

  const { data: leadData, refetch } = useLead(searchObj);

  const { data: LeadData } = useLead(searchObj);
  console.log(LeadData, "check leadData");
  const { mutateAsync: deleteLead } = usedeleteLeadById();
  // const { mutateAsync: convert } = convertToContact();

  const handleConvertEnquery = async (id: any) => {
    try {
      const { data: res } = await convertToContact(id);
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("Starting upload, setting isUploading to true");
      setIsUploading(true); // Set uploading state

      // Check for allowed file extensions
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log("Calling addEnquiryExel with FormData");
      const response = await addLeadExel(formData);

      console.log(response, "check response ");

      // Check if the upload was successful
      if (response.status === 200) {
        console.log("Upload response:", response);
        toastSuccess("Enquiries imported successfully!");
        refetch(); // Trigger data refetch
      } else {
        toastError("Error importing file. Please try again.");
      }

      setIsUploading(false); // End uploading state
      console.log("set is uploading false inside try");
    } catch (error: any) {
      console.error("Import Error:", error);
      toastError("An error occurred during import. Please try again.");
    } finally {
      console.log("In finally block, setting isUploading to false");
      setIsUploading(false); // Always set uploading to false

      // Reset the file input value after upload attempt
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Export Contacts
  const handleExportEnquiries = async () => {
    try {
      const { data: response } = await getExel();
      console.log(response, "check response");
      const url = generateFilePath("/" + response.filename);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "enquiries.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastSuccess("Enquries exported successfully!");
    } catch (error) {
      toastError("Failed to export enquiries. Please try again.");
      console.error("Export Error:", error);
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
      width: "18%",
    },
    {
      name: "Account Manager",
      selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
      width: "12%",
    },
    {
      name: "Mobile Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className="text-[#938d8d]" />
          {row.phone}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Company Name",
      selector: (row: any) => <div className="flex gap-1">{row.company}</div>,
      width: "18%",
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      width: "15%",
    },
    {
      name: "Convertor",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleConvertEnquery(row._id)}
            className="text-black-500 text-lg p-[6px]"
          >
            Convert
          </button>
        </div>
      ),
    },
    {
      name: "Edit",
      width: "5%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-leads/${row._id}`)}
          className="text-black-500 text-lg p-[6px]"
        >
          <FaEye />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "8%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          className="p-[6px] text-black-400 text-lg"
        >
          <RiDeleteBin6Line />
        </button>
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
            <h2 className="text-xl font-semibold text-gray-800">Leads List</h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full flex items-center ">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by contact name"
                />
                <div className="relative right-8">
                  <IoSearchOutline />
                </div>
              </div>
              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              {/* <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button> */}

              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                onClick={handleExportEnquiries}
              >
                <FaFileExport /> Export
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />

              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                onClick={handleImportClick}
                disabled={isUploading}
              >
                <FaFileImport />
                {isUploading ? "Importing..." : "Import"}
              </button>

              {canCreate && (
                <button
                  onClick={() => navigate("/add-leads")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Lead</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={LeadData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={LeadData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
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
