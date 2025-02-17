import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaToggleOn,
} from "react-icons/fa";
import {
  addEnquiryExel,
  getExel,
  useEnquiry,
  usedeleteEnquiryById,
  useUpdateEnquiryById,
  useEnquiryById,
 
  convertToRfp,
} from "@/services/enquiry.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import moment from "moment";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Switch } from "@mui/material";
import { SiConvertio } from "react-icons/si";
// import { useConvertRfpById } from "@/services/rfp.service";
import { checkPermissionsForButtons } from "@/utils/permission";

function EnquiryLIst() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Enquiry");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [selectedEnquiryType, setSelectedEnquiryType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      ...(selectedEnquiryType && { enquiryType: selectedEnquiryType }),
      ...(selectedLevel && { levelOfEnquiry: selectedLevel }),
      ...(selectedStatus && { status: selectedStatus }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [
      pageIndex,
      pageSize,
      query,
      selectedEnquiryType,
      selectedLevel,
      selectedStatus,
    ]
  );

  const { data: EnquiryData, refetch } = useEnquiry(searchObj);

  // useEffect(() => {
  //   const { data: EnquiryData } = useEnquiry(searchObj);
  //   setEnquiryData(EnquiryData);
  // }, [isUploading]);
  // console.log(EnquiryData, "check EnquiryData");
  useEffect(() => {
    setPageIndex(1);
  }, [selectedEnquiryType, selectedLevel, selectedStatus]);

  const { mutateAsync: deleteEnquiry } = usedeleteEnquiryById();
  const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();
 


  // Handle triggering file input click
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
      const response = await addEnquiryExel(formData);

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

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        const { data: res } = await deleteEnquiry(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateEnquiry({ id, ...data });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  };
 const handleConvertRpf = async (id: any) => {
    try {
      const { data: res } = await convertToRfp(id);
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };
  const columns = [
    {
      name: "Customer Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.firstName + " " + row.lastName}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Enquiry Type",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.enquiryType}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Loaction",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.city}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Level of Enquiry",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col p-2 rounded-md  ${
            row.levelOfEnquiry === "moderate"
              ? "bg-yellow-200 text-white-100"
              : row.levelOfEnquiry === "Not Urgent"
              ? "bg-green-300 text-white-600"
              : row.levelOfEnquiry === "urgent" && "bg-red-300 text-red-600"
          }`}
        >
          <h6>{row.levelOfEnquiry}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Check-In",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{moment(row.checkIn).format("YYYY-MM-DD")}</h6>
        </div>
      ),
      width: "9%",
    },
    {
      name: "Check-Out",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{moment(row.checkOut).format("YYYY-MM-DD")}</h6>
        </div>
      ),
      width: "8%",
    },
    {
      name: "Number of Rooms",
      selector: (row: any) => row.noOfRooms,
      width: "10%",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div className="flex gap-1">
          <Switch defaultChecked />
        </div>
      ),
      width: "8%",
    },
    {
      name: "Edit",
      width: "6%",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className="flex items-center gap-3">
            <Link
              to={`/addEnquiry/${row?._id}`}
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
      width: "6%", // Adjusted width
      selector: (row: any) =>
        canDelete && (
          <button
            className="p-[6px] text-black-400 text-lg"
            onClick={() => handleDelete(row._id)}
          >
            <RiDeleteBin6Line />
          </button>
        ),
    },
    {
      name: "Convert to Enquiry",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/add-sales-contact/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          ></Link>
          <button
            className="p-[6px] text-black-400 text-lg"
            onClick={() => handleConvertRpf(row._id)}
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

  const FilterDropdown = () => (
    <div className="absolute bg-white shadow-lg p-4 rounded-md mt-2 z-10 border border-gray-200">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Enquiry Type</label>
          <select
            className="p-2 border rounded-md"
            value={selectedEnquiryType}
            onChange={(e) => setSelectedEnquiryType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Corporate">Room</option>
            <option value="Individual">Banquet</option>
            <option value="Group">Both</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Level of Enquiry</label>
          <select
            className="p-2 border rounded-md"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="urgent">Urgent</option>
            <option value="moderate">Moderate</option>
            <option value="Not Urgent">Not Urgent</option>
          </select>
        </div>

        {/* <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Status</label>
          <select
            className="p-2 border rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div> */}

        <button
          className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          onClick={() => {
            setSelectedEnquiryType("");
            setSelectedLevel("");
            setSelectedStatus("");
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

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
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Enquiry List</h2>

          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filter
              </button>
              {showFilters && <FilterDropdown />}
            </div>

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
                onClick={() => navigate("/addEnquiry")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Enquiry</span>
              </button>
            )}
          </div>
        </div>

        <ReactTable
          data={EnquiryData?.data}
          columns={filterColumns}
          loading={false}
          totalRows={EnquiryData?.total}
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

export default EnquiryLIst;
