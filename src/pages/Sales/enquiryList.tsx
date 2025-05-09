import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { useStatusById } from "@/services/status.service";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaToggleOn,
  FaCog,
  FaColumns,
} from "react-icons/fa";
import {
  addEnquiryExel,
  getExel,
  useEnquiry,
  usedeleteEnquiryById,
  useUpdateEnquiryById,
  useEnquiryById,
  useConvertEnquiryToRfp,
} from "@/services/enquiry.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import moment from "moment";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Switch } from "@mui/material";
import { SiConvertio } from "react-icons/si";
import { checkPermissionsForButtons } from "@/utils/permission";
import { c } from "vite/dist/node/types.d-aGj9QkWt";



function EnquiryLIst() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Enquiry");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [selectedEnquiryType, setSelectedEnquiryType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { mutateAsync: convertEnquiryToRfp } = useConvertEnquiryToRfp();

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    "Customer Name": true,
    "Enquiry Type": true,
    "Loaction": true,
    "Level of Enquiry": true,
    "Check-In": true,
    "Check-Out": true,
    "Number of Rooms": true,
    "Status": true,
    "Edit": canView || canUpdate,
    "Delete": canDelete,
    "Convert to Enquiry": true
  });

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
  const { mutateAsync: deleteEnquiry } = usedeleteEnquiryById();
  const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();

  // Save column preferences to localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumns');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('enquiryTableColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await addEnquiryExel(formData);

      if (response.status === 200) {
        toastSuccess("Enquiries imported successfully!");
      } else {
        toastError("Error importing file. Please try again.");
      }

      setIsUploading(false);
    } catch (error: any) {
      toastError("An error occurred during import. Please try again.");
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExportEnquiries = async () => {
    try {
      const { data: response } = await getExel();
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
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        const { data: res } = await deleteEnquiry(id);
        if (res) {
          toastSuccess(res.message);
          refetch();
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
        refetch();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToRfp = async (enquiryId: string) => {
    try {
      const { data: res } = await convertEnquiryToRfp(enquiryId);
      if (res) {
        toastSuccess(res.message);
        refetch();
        navigate(`/add-rfps/${res.data.id}`, { replace: true });
      }
    } catch (error) {
      toastError(error);
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName as keyof typeof prev]: !prev[columnName as keyof typeof prev]
    }));
  };

  // Reset column visibility to default
  const resetColumnVisibility = () => {
    setVisibleColumns({
      "Customer Name": true,
      "Enquiry Type": true,
      "Loaction": true,
      "Level of Enquiry": true,
      "Check-In": true,
      "Check-Out": true,
      "Number of Rooms": true,
      "Status": true,
      "Edit": canView || canUpdate,
      "Delete": canDelete,
      "Convert to Enquiry": true
    });
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
      name: "Assigned To",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.assignTo}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.displayName}</h6>
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
      width: "9%",
    },
    {
      name: "Loaction",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.city}</h6>
        </div>
      ),
      width: "11%",
    },
    {
      name: "Level of Enquiry",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col font-bold p-2 rounded-md  ${row.levelOfEnquiry === "moderate"
            ? "bg-yellow-300 text-white-100"
            : row.levelOfEnquiry === "Not Urgent"
              ? "bg-green-400 text-white-600"
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
      width: "10%",
    },
    {
      name: "Number of Rooms",
      selector: (row: any) => row.noOfRooms,
      width: "8%",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div className="flex gap-1">
          <h6>{row?.status}</h6>
        </div>
      ),
      width: "9%",
    },
    {
      name: "Edit",
      width: "6%",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className="flex items-center gap-3">
            <Link
              to={`/addEnquiry/${row?._id}`}
              className="text-black-400 text-lg flex items-center"
              onClick={() => handleUpdate(row._id, row.data)}
            >
              <FaEye />
            </Link>
          </div>
        ),
    },
    {
      name: "Delete",
      width: "8%",
      selector: (row: any) =>
        canDelete && (
          <button
            className="text-black-400 text-lg"
            onClick={() => handleDelete(row._id)}
          >
            <RiDeleteBin6Line />
          </button>
        ),
    },
    {
      name: "Generate RFP",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center">
          <Link
            to={`/add-sales-contact/${row?._id}`}
            className="text-black-400 text-lg flex items-center"
          ></Link>
          <button
            className="text-black-400 text-lg"
            onClick={() => handleConvertToRfp(row._id)}
          >
            <SiConvertio />
          </button>
        </div>
      ),
    },
  ];

  const calculateDynamicWidths = (columnsArray: any[]) => {
    const visibleColumnsCount = columnsArray.length;

    if (visibleColumnsCount === 0) return columnsArray;


    const columnsWithDynamicWidth = columnsArray.map(column => ({ ...column }));


    const baseWidth = 100 / visibleColumnsCount;

    console.log(visibleColumnsCount, "visibleColumnsCount")


    const MIN_WIDTH = 8;
    const MAX_WIDTH = 20;

    // Adjust column widths based on content type
    columnsWithDynamicWidth.forEach(column => {
      let allocatedWidth = baseWidth;

      // Columns that typically need less space
      if (column.name === "Delete" || column.name === "Edit") {
        allocatedWidth = Math.max(MIN_WIDTH, baseWidth);
      }
      // Columns that might need more space
      else if (column.name === "Customer Name" || column.name === "Level of Enquiry") {
        allocatedWidth = Math.min(MAX_WIDTH, baseWidth);
      }

      column.width = `${allocatedWidth}%`;
    });

    console.log(columnsWithDynamicWidth, "check the column width")

    return columnsWithDynamicWidth;
  };

  // Filter columns based on visibility
  const visibleColumnsArray = columns.filter(column =>
    visibleColumns[column.name as keyof typeof visibleColumns]
  );

  // Apply dynamic widths to visible columns
  const filteredColumns = calculateDynamicWidths(visibleColumnsArray);

  const ColumnSelector = () => (
    <div className="absolute bg-white shadow-lg p-4 rounded-md mt-2 z-10 border border-gray-200 right-0 w-72">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h3 className="font-medium">Customize Columns</h3>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={resetColumnVisibility}
          >
            Reset to Default
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {columns.map((column) => (
            <div key={column.name} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm">{column.name}</span>
              <Switch
                checked={visibleColumns[column.name as keyof typeof visibleColumns] || false}
                onChange={() => toggleColumnVisibility(column.name)}
                size="small"
                color="primary"
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-end">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            onClick={() => setShowColumnSelector(false)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="container px-6 w-full">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 w-full">
        <div className="search_boxes flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 w-full gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Enquiry List</h2>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <div className="min-w-[200px] flex-grow sm:flex-grow-0 sm:w-64">
              <input
                type="search"
                className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filter
              </button>
              {showFilters && <FilterDropdown />}
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>

            <button
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
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
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <FaFileImport />
              {isUploading ? "Importing..." : "Import"}
            </button>

            {canCreate && (
              <button
                onClick={() => navigate("/addEnquiry")}
                className="flex items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300 whitespace-nowrap"
              >
                <FaPlus />
                <span>New Enquiry</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <ReactTable
            data={EnquiryData?.data}
            columns={filteredColumns}
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
    </div>
  );
}

export default EnquiryLIst;