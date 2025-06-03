import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaTasks,
  FaColumns,
} from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  useLeadById,
  useAddLead,
  useUpdateLeadById,
  usedeleteLeadById,
  useLead,
  useConvertLeadToContact,
  addLeadExel,
  getExel,
  useConvertLeadToEnquiry,
} from "@/services/lead.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";

import AdvancedSearch, { SearchField } from "@/utils/advancedSearch";
import { Modal, Switch } from "@mui/material";
import { AiFillCloseSquare } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { SiConvertio } from "react-icons/si";
import { ClassNames } from "@emotion/react";
import { divide } from "lodash";

import { title } from "process";
import { Column } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Input } from "postcss";
import { FiEdit } from "react-icons/fi";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";
function Leads() {
  const navigate = useNavigate();

  // State for ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Export related states
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showExportCustomize, setShowExportCustomize] = useState(false);
  const [exportFields, setExportFields] = useState<string[]>([
    "firstName",
    "lastName",
    "email",
    "phone",
    "company",
    "leadSource",
    "leadStatus",
    "ownerName",
  ]);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Leads");

  console.log(
    canCreate,
    canDelete,
    canUpdate,
    canView,
    "canCreate, canDelete, canUpdate, canView"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [advancedSearchParams, setAdvancedSearchParams] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchObj = useMemo(
    () => ({
      ...(searchQuery && { query: searchQuery }),
      ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, searchQuery, advancedSearchParams]
  );

  const { data: leadData, refetch } = useLead(searchObj);
  const { mutateAsync: deleteLead } = usedeleteLeadById();
  const { mutateAsync: convertLead } = useConvertLeadToContact();
  const { mutateAsync: convertToEnquiry } = useConvertLeadToEnquiry();

  console.log("Lead Data---->", leadData);
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("#exportDropdown") && showExportOptions) {
        setShowExportOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportOptions]);

  const searchFields: SearchField[] = [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "company", label: "Company Name", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    {
      key: "leadSource",
      label: "Lead Source",
      type: "select",
      options: [
        { value: "website", label: "Website" },
        { value: "referral", label: "Referral" },
        { value: "social", label: "Social Media" },
        { value: "email", label: "Email Campaign" },
        { value: "other", label: "Other" },
      ],
    },
    {
      key: "leadStatus",
      label: "Lead Status",
      type: "select",
      options: [
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "qualified", label: "Qualified" },
        { value: "unqualified", label: "Unqualified" },
        { value: "converted", label: "Converted" },
      ],
    },
    { key: "createdAt", label: "Created Date", type: "date" },
    { key: "updatedAt", label: "Last Modified Date", type: "date" },
    { key: "ownerName", label: "Account Manager", type: "text" },
  ];

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this lead?")) {
        const { data: res } = await deleteLead(id);
        if (res) {
          toastSuccess(res.message);
          refetch();
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvert = async (id: string) => {
    try {
      const { data: res } = await convertLead(id);

      if (res) {
        toastSuccess(res.message);
        refetch();
        navigate(`/add-customer/${res.data.id}`, { replace: true });
        navigate(`/add-customer/${res.data.id}`, { replace: true });
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToEnquiry = async (id: string) => {
    try {
      const { data: res } = await convertToEnquiry(id);
      if (res) {
        toastSuccess(res.message);
        refetch();
        navigate(`/addEnquiry/${res.data.id}`, { replace: true });
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
      setIsUploading(true);

      // Check for allowed file extensions
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await addLeadExel(formData);

      // Check if the upload was successful
      if (response.status === 200) {
        toastSuccess("Leads imported successfully!");
        refetch();
      } else {
        toastError("Error importing file. Please try again.");
      }
    } catch (error: any) {
      toastError("An error occurred during import. Please try again.");
    } finally {
      setIsUploading(false);

      // Reset the file input value after upload attempt
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Export with format and fields options
  const handleExportEnquiries = async (
    format: string = "xlsx",
    fields?: string[]
  ) => {
    try {
      setIsExporting(true);

      // Prepare export parameters
      const exportParams = {
        ...(searchQuery && { query: searchQuery }),
        ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
        format,
        ...(fields && { fields }), // Include selected fields if provided
      };

      const { data: response } = await getExel(exportParams);

      // Create download link
      const url = generateFilePath("/" + response.filename);
      const link = document.createElement("a");
      link.href = url;

      // Set file name with appropriate extension
      const fileExtension =
        format === "csv" ? "csv" : format === "pdf" ? "pdf" : "xlsx";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.setAttribute(
        "download",
        `leads_export_${timestamp}.${fileExtension}`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      toastSuccess("Leads exported successfully!");
    } catch (error) {
      toastError("Failed to export leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Toggle all export fields selection
  const toggleAllExportFields = (checked: boolean) => {
    if (checked) {
      // Select all fields
      setExportFields(searchFields.map((field) => field.key));
    } else {
      // Deselect all fields
      setExportFields([]);
    }
  };
  const [data, setData] = useState<any[]>([]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log(selectedRows, "selectedRows", leadData, "check lead data");
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = [
    {
      name: "Contact Name",
      selector: (row: any) => (
        <h6 className=" text-[#1B6DE0] font-semibold  ">
          {row.firstName + " " + row.lastName}
        </h6>
      ),
      width: "180px",
    },
    // {
    //   name: "Account Manager",
    //   selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
    //   width: "15%",
    // },
    {
      name: "Mobile Number",
      selector: (row: any) => (
        <h6 className="flex gap-1">
          <FaMobileScreenButton className="text-[#938d8d]" />
          {row.phone}
        </h6>
      ),
      width: "190px",
    },
    {
      name: "Company Name",
      selector: (row: any) => <h6 className="flex gap-1 ">{row.company}</h6>,
      width: "200px",
    },
    {
      name: "Display Name",
      selector: (row: any) => <h6>{row.displayName}</h6>,
      width: "140px",
    },
    {
      name: "Email",
      selector: (row: any) => <h6>{row.email}</h6>,
      width: "230px",
    },

    // {
    //   name: "Action",
    //   width: "140px",
    //   selector: (row: any) => (
    //     <div className="flex gap-2">
    //       <button
    //         type="button"
    //         onClick={() => navigate(`/add-leads/${row._id}`)}
    //         className="text-black-500 text-lg "
    //       >
    //         <FaEye className="ml-1" />
    //       </button>
    //       <button
    //         type="button"
    //         onClick={() => handleDelete(row._id)}
    //         className=" text-black-400 text-lg"
    //       >
    //         <RiDeleteBin6Line />
    //       </button>
    //     </div>
    //   ),
    // },
    {
      name: "Convert to Contact",
      width: "140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleConvert(row._id)}
          className=" text-black-400 "
        >
          <SiConvertio />
        </button>
      ),
    },
    {
      name: "Generate Enquiry",
      width: "140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleConvertToEnquiry(row._id)}
          className=" text-black-400 "
        >
          <SiConvertio />
        </button>
      ),
    },

    // invisible column
    // {
    //   name: "Actions",
    //   width: "50px",

    //   selector: (row: any) => (
    //     <div>
    //       <button
    //         type="button"
    //         title="More Actions"
    //         onClick={(e) => {
    //           setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true),
    //             setSelectedRowId(row._id);
    //         }}
    //       >
    //         <span className="flex items-center justify-center w-4 h-4  rounded-full hover:bg-orange-500 ">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             viewBox="0 0 24 24"
    //             width="16"
    //             height="16"
    //             fill="rgba(255,255,255,1) "
    //           >
    //             <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
    //           </svg>
    //         </span>
    //       </button>

    //       {selectedRowId === row._id && isOpenAction && (
    //         <div className="absolute bg-white z-[100] shadow-lg rounded-md -ml-20 overflow-hidden border">
    //           <Link
    //             to={`/add-leads/${row._id}`}
    //             className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-2 border-b py-1 gap-2"
    //             title="View Vendor"
    //           >
    //             <FiEdit className="text-xs" />
    //             Edit
    //           </Link>
    //           <button
    //             type="button"
    //             onClick={() => handleDelete(row._id)}
    //             className="flex items-center  text-gray-600 hover:bg-blue-500 hover:text-white px-2 border-b py-1 gap-2"
    //             title="Delete Vendor"
    //           >
    //             <RiDeleteBin6Line className="text-xs" />
    //             Delete
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
       {
            name: "Actions",
            width: "50px",
            selector: (row: any) => (
              <div className="">
                <button
                  type="button"
                  
                  title="More Actions"
                  onClick={(e) =>{ setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true),setSelectedRowId(row._id )}}
                >
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,1)"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path></svg></span>
                </button>
                { selectedRowId === row._id   &&  (isOpenAction) && (
                  <div className="lead-dropdown absolute bg-white z-[10] mb-12 shadow-lg rounded-md overflow-hidden -ml-10 border">
      
                    <Link
                    to={`/add-leads/${row._id}`}
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

  // const handleChange = (state: any) => {
  //   setSelectedRows(state.selectedRows);
  //   console.log('Selected Rows: ', selectedRows);
  // };
  const [isOpenAssign, setIsOpenAssign] = useState(false);
  const [assignTaskName, setAssignTaskName] = useState("");
  const [assignTaskUsers, setAssignTaskUsers] = useState<string[]>([]);

  const handleAssignTask = async () => {
    try {
      if (tickRows.length === 0) {
        toastError("Please select at least one lead to assign.");
        return;
      }

      setIsOpenAssign(true);
    } catch (error) {
      toastError("An error occurred while assigning task. Please try again.");
    }
  };

  const handleAssignTaskNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignTaskName(e.target.value);
  };

  const handleAssignTaskNameSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (assignTaskName) {
      setAssignTaskUsers((prevUsers) => [...prevUsers, assignTaskName]);
      setAssignTaskName("");
    }
  };

  const handleRemoveAssignTaskUser = (user: string) => {
    setAssignTaskUsers((prevUsers) => prevUsers.filter((u) => u !== user));
  };

  const handleAssignTaskSubmit = async () => {
    try {
      if (selectedRows.length === 0 || assignTaskUsers.length === 0) {
        toastError("Please select at least one lead and one user to assign.");
        return;
      }

      // const { data: res } = await assignTask(selectedRows, assignTaskUsers);

      // if (res?.message) {
      //   toastSuccess(res.message);
      //   setIsOpen(false);
      //   setSelectedRows([]);
      //   setAssignTaskUsers([]);
      // }
    } catch (error) {
      toastError("An error occurred while assigning task. Please try again.");
    }
  };

  const filterColumns = columns.filter((item) => {
    if (item.name === "Delete") {
      return canDelete;
    } else if (item.name === "Edit") {
      return canView || (canView && canUpdate);
    } else {
      return true;
    }
  });

  const [showColumnSelector, setShowColumnSelector] = useState(false);
  // Toggle column visibility
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      "Contact Name": true,
      "Mobile Number": true,
      "Company Name": true,
      "Display Name": true,
      Email: true,
      Actions: canView || canUpdate || true,
      Edit: canView || canUpdate,
      Delete: canDelete,
      "Convert to Contact": true,
      "Generate Enquiry": true,
    }
  );

  useEffect(() => {
    const savedColumns = localStorage.getItem("enquiryTableColumnsLead");
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    if (canView !== undefined) {
      console.log(visibleColumns, "visibleColumns");
      localStorage.setItem(
        "enquiryTableColumnsLead",
        JSON.stringify(visibleColumns)
      );
    }
  }, [visibleColumns, canView, canUpdate, canDelete]);

  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnName as keyof typeof prev]: !prev[columnName as keyof typeof prev],
    }));
  };

  const ColumnSelector = () => (
    <div className="absolute z-50 bg-white shadow-lg p-4 rounded-md mt-2   border border-gray-200 right-0 w-72">
      <div className="flex flex-col gap-2 ]">
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

  // const calculateFixedWidths = (columnsArray: any[]) => {
  //   const totalWidth = columnsArray.length > 0 ? columnsArray.length * 180 : 1;
  //   const containerWidth = window.innerWidth - 100; // Adjust for padding/margins
  //   const columnsWithFixedWidth = columnsArray.map((column) => ({
  //     ...column,
  //     width:
  //       column.name === "Actions"
  //         ? "80px"
  //         : totalWidth > containerWidth
  //           ? "200px"
  //           : `${98 / columnsArray.length}%`,
  //   }));

  //   console.log(columnsWithFixedWidth, "check the column width");

  //   return columnsWithFixedWidth;
  // };

  // // Filter columns based on visibility
  // const visibleColumnsArray = columns.filter(
  //   (column) => visibleColumns[column.name as keyof typeof visibleColumns]
  // );

  // // Apply fixed widths to visible columns
  // const filteredColumns = calculateFixedWidths(visibleColumnsArray);

  const resetColumnVisibility = () => {
    setVisibleColumns({
      "Contact Name": true,
      "Mobile Number": true,
      "Company Name": true,
      "Display Name": true,
      Email: true,
      Edit: canView || canUpdate,
      Delete: canDelete,
      "Convert to contact": true,
      "Convert to Enquiry": true,
    });
  };

  // const columnsNew = [
  //   {
  //     title: "checkbox",
  //     width: 100,
  //     dataIndex: "checkbox",
  //     key: "checkbox",
  //     fixed: "left",
  //   },
  //   {
  //     title: "name",
  //     width: 150,
  //     dataIndex: "name",
  //     key: "1",
  //   },
  //   {
  //     title: "email",
  //     width: 200,
  //     dataIndex: "email",
  //     key: "2",
  //   },
  //   {
  //     title: "phone",
  //     width: 120,
  //     dataIndex: "phone",
  //     key: "3",
  //   },
  //   {
  //     title: "status",
  //     width: 120,
  //     dataIndex: "status",
  //     key: "4",

  //   },

  //   {
  //     title: "action",
  //     width: 120,
  //     dataIndex: "action",
  //     key: "action",
  //     fixed: "right",
  //   },
  //   {
  //     title: "new",
  //     width: 120,
  //     dataIndex: "action",
  //     key: "action",

  //   }, {
  //     title: "new",
  //     width: 120,
  //     dataIndex: "action",
  //     key: "action",
  //   }

  // ];
  const [tickRows, setTickRows] = useState<string[]>([]);

  const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setTickRows(selectedRows.map((row: any) => row._id));
  };

  console.log(tickRows, "tick rows");

  const commentFalse = false;
  return (
    <>







      <NewTable
        data={leadData?.data}
        columns={columns}
        selectableRows={true}
        loading={false}
        totalRows={leadData?.total}
        onChangeRowsPerPage={setPageSize}
        onChangePage={setPageIndex}
        page={pageIndex}
        rowsPerPageText={pageSize}
        isServerPropsDisabled={false}

        onSelectedRowsChange={handleChange}
        className={"leadtable"}
        //new fields
        TableName={"Leads List"}
        TableGetAllFunction={useLead}
        ExcelExportFunction={getExel}
        TableAddExcelFunction={addLeadExel}
        RouteName={"Leads"}
        AddButtonRouteName={"/add-leads"}
        AddButtonName={"New Lead"}
        placeholderSearch={"Search in Lead"}
      />



    </>
  );
}

export default Leads;