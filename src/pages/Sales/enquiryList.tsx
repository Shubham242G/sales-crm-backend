import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { useStatusById } from "@/services/status.service";
import { RiDeleteBin6Line } from "react-icons/ri";
import AdvancedSearch, { SearchField } from "@/utils/advancedSearch";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaToggleOn,
  FaCog,
  FaColumns,
  FaTasks,
} from "react-icons/fa";
import {
  addEnquiryExel,
  getExel,
  useEnquiry,
  usedeleteEnquiryById,
  useUpdateEnquiryById,
  useEnquiryById,
  useConvertEnquiryToRfp,
  addEnquiryExcel,
  getEnquiryExcel,
} from "@/services/enquiry.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import moment from "moment";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Switch } from "@mui/material";
import { SiConvertio } from "react-icons/si";
import { checkPermissionsForButtons } from "@/utils/permission";
import { c } from "vite/dist/node/types.d-aGj9QkWt";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";
import { FiEdit } from "react-icons/fi";

export default function EnquiryLIst() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Enquiry");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [leadId, setLeadId] = useState("");
  const [selectedEnquiryType, setSelectedEnquiryType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { mutateAsync: convertEnquiryToRfp } = useConvertEnquiryToRfp();

  // Column visibility state
  // (Removed duplicate declaration of visibleColumns)
  const [isOpen, setIsOpen] = useState(false);
  const [advancedSearchParams, setAdvancedSearchParams] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      ...(selectedEnquiryType && { enquiryType: selectedEnquiryType }),
      ...(searchQuery && { query: searchQuery }),
      ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
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
      advancedSearchParams,
    ]
  );

  const { data: EnquiryData, refetch } = useEnquiry(searchObj);
  const { mutateAsync: deleteEnquiry } = usedeleteEnquiryById();
  const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();

  // Save column preferences to localStorage

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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reset column visibility to default
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const columns = [
    {
      name: "Customer Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.firstName + " " + row.lastName}</h6>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Assigned To",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.assignTo}</h6>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.displayName}</h6>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Enquiry Type",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6 className="capitalize">{row.enquiryType}</h6>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Loaction",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.city}</h6>
        </div>
      ),
      width: "150px",
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
          <h5 className="capitalize">{row.levelOfEnquiry}</h5>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Check-In",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h5>{moment(row.checkIn).format("YYYY-MM-DD")}</h5>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Check-Out",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{moment(row.checkOut).format("YYYY-MM-DD")}</h6>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Number of Rooms",
      selector: (row: any) => row.noOfRooms,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div className="flex gap-1">
          <h6>{row?.status}</h6>
        </div>
      ),
      width: "150px",
    },
    // {
    //   name: "Edit",
    //   width: "110px",
    //   selector: (row: any) =>
    //     (canView || canUpdate) && (
    //       <div className="flex items-center gap-3">
    //         <Link
    //           to={`/addEnquiry/${row?._id}`}
    //           className="text-black-400 text-lg flex items-center"
    //           onClick={() => handleUpdate(row._id, row.data)}
    //         >
    //           <FaEye />
    //         </Link>
    //       </div>
    //     ),
    // },
    // {
    //   name: "Delete",
    //   width: "110px",
    //   selector: (row: any) =>
    //     canDelete && (
    //       <button
    //         className="text-black-400 text-lg"
    //         onClick={() => handleDelete(row._id)}
    //       >
    //         <RiDeleteBin6Line />
    //       </button>
    //     ),
    // },
    {
      name: "Create an RFP",
      width: "150px",
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
    {
      name: "Actions",
      width: "20px",
      selector: (row: any) => (
        <div className="">
          <button
            type="button"
            title="More Actions"
            onClick={(e) => {
              setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true),
                setSelectedRowId(row._id);
            }}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="rgba(255,255,255,1)"
              >
                <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
              </svg>
            </span>
          </button>
          {selectedRowId === row._id && isOpenAction && (
            <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden -ml-10 border">
              <Link
                to={`/addEnquiry/${row?._id}`}
                className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                title="View Vendor"
              >
                <FiEdit className="text-xs" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(row._id)}
                className="flex items-center  text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                title="Delete Vendor"
              >
                <RiDeleteBin6Line className="text-xs" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Column selector
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState<{
    [key: string]: boolean;
  }>({
    "Customer Name": true,
    "Enquiry Type": true,
    Loaction: true,
    "Level of Enquiry": true,
    "Check-In": true,
    "Check-Out": true,
    "Number of Rooms": true,
    Status: true,
    Edit: canView || canUpdate || true,
    Delete: canDelete || true,
    "Convert to Enquiry": true,
    Actions: true || canDelete || canView || canUpdate,
  });
  // Removed duplicate declaration of visibleColumns
  useEffect(() => {
    const savedColumns = localStorage.getItem("enquiryTableColumns");
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("enquiryTableColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);
  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName as keyof typeof prev]: !prev[columnName as keyof typeof prev],
    }));
  };
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
            <div
              key={column.name}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <span className="text-sm">{column.name}</span>
              <Switch
                checked={
                  visibleColumns[column.name as keyof typeof visibleColumns] ||
                  false
                }
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

  const calculateDynamicWidths = (columnsArray: any[]) => {
    const visibleColumnsCount = columnsArray.length;

    if (visibleColumnsCount === 0) return columnsArray;

    const columnsWithDynamicWidth = columnsArray.map(column => ({
      ...column,
      width: column.name === "Email" ? "300px" : `${1600 / visibleColumnsCount}px`
    }));

    console.log(columnsWithDynamicWidth, "check the column width")

    return columnsWithDynamicWidth;
  };
  const visibleColumnsArray = columns.filter(column =>
    visibleColumns[column.name as keyof typeof visibleColumns]
  );


  // Apply dynamic widths to visible columns
  const filteredColumns = calculateDynamicWidths(visibleColumnsArray);


  const resetColumnVisibility = () => {
    setVisibleColumns({
      "Customer Name": true,
      "Enquiry Type": true,
      Loaction: true,
      "Level of Enquiry": true,
      "Check-In": true,
      "Check-Out": true,
      "Number of Rooms": true,
      Status: true,
      Edit: canView || canUpdate || true,
      Delete: canDelete || true,
      "Convert to Enquiry": true,
      Actions: true || canDelete || canView || canUpdate,
    });
  };

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
          className="mt-2  px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md"
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
  const searchFields: SearchField[] = [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "company", label: "Company Name", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    {
      key: "enquiryType",
      label: "Enquiry Type",
      type: "select",
      options: [
        { value: "Corporate", label: "Corporate" },
        { value: "Individual", label: "Individual" },
        { value: "Group", label: "Group" },
        { value: "Room", label: "Room" },
        { value: "Banquet", label: "Banquet" },
        { value: "Both", label: "Both" },
      ],
    },
    {
      key: "city",
      label: "Location",
      type: "text",
    },
    {
      key: "levelOfEnquiry",
      label: "Level of Enquiry",
      type: "select",
      options: [
        { value: "urgent", label: "Urgent" },
        { value: "moderate", label: "Moderate" },
        { value: "Not Urgent", label: "Not Urgent" },
      ],
    },

    {
      key: "checkIn",
      label: "Check-In",
      type: "date",
    },
    {
      key: "checkOut",
      label: "Check-Out",
      type: "date",
    },
    {
      key: "noOfRooms",
      label: "Number of Rooms",
      type: "number",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        // Add status options as needed
      ],
    },
  ];

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const [isOpenAssign, setIsOpenAssign] = useState(false);

  const handleAssignTask = () => {
    setIsOpenAssign(true);
  };

  return (
    <>
      {/* <div className=" table_container rounded-xl mt-10 p-6">
        <div className="search_boxes flex justify-between items-center ml-2 ">
          <h2 className="text-xl font-semibold text-gray-800">Enquiry List</h2>

          <div className="flex items-center justify-start gap-2 ">
            <div className="">
              <input
                type="search"
                className="rounded-md w-full border px-3 text-sm border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search by customer name"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* <div className="relative">
              {/* <button
                className="flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filter
              </button> 
              {showFilters && <FilterDropdown />}
            </div> */}
      {/* <button
              onClick={handleModalOpen}
              className="flex items-center  text-sm adv-srch gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300"
            >
              Advance Search
            </button>

            <button
              className=" flex items-center gap-1  px-3 py-1.5  text-sm rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
              onClick={handleAssignTask}
            >
              <span className="whitespace-nowrap text-sm">
                {" "}
                Assign To Ops Team{" "}
              </span>
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-1  px-3 py-1.5 rounded-md text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>

            <button
              className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
              onClick={handleExportEnquiries}
            >
              <FaFileExport /> Export
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden text-sm"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />

            <button
              className="flex items-center gap-1  text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <FaFileImport />
              {isUploading ? "Importing..." : "Import"}
            </button>

            {canCreate && (
              <button
                onClick={() => navigate("/addEnquiry")}
                className="flex items-center justify-center text-sm gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 border border-gray-300 whitespace-nowrap"
              >
                <FaPlus />
                <span>New Enquiry</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <ReactTable
            data={EnquiryData?.data}
            columns={filteredColumns}
            selectableRows={true}
            loading={false}
            totalRows={EnquiryData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
        </div> */}
      {/* Advanced Search Modal */}
      {/* {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[2] bg-[rgba(0,0,0,0.5)]"
              onClick={handleModalOpen}
            ></div>

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <AdvancedSearch
                fields={searchFields}
                onSearch={(values) => {
                  setAdvancedSearchParams(values);
                  setIsOpen(false);
                  refetch();
                }}
                onClear={() => {
                  setIsOpen(false);
                  setAdvancedSearchParams("");
                  refetch();
                }}
              />
            </div>
          </>
        )} 
      </div> */}

      <NewTable
        data={EnquiryData?.data}
        columns={filteredColumns}
        selectableRows={true}
        loading={false}
        totalRows={EnquiryData?.total}
        onChangeRowsPerPage={setPageSize}
        onChangePage={setPageIndex}
        page={pageIndex}
        rowsPerPageText={pageSize}
        isServerPropsDisabled={false}

        className="leadtable"
        //new fields
        TableName={"Enquiry List"}
        TableGetAllFunction={useEnquiry}
        ExcelExportFunction={getEnquiryExcel}
        TableAddExcelFunction={addEnquiryExcel}
        RouteName={"Enquiry"}
        AddButtonRouteName={"/addEnquiry"}
        AddButtonName={"New Enquiry"}
      />
    </>
  );
}
