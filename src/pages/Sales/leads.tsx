import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport, FaTasks, FaColumns } from "react-icons/fa";
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
    'firstName', 'lastName', 'email', 'phone', 'company', 'leadSource', 'leadStatus', 'ownerName'
  ]);

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Leads");

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
      if (!target.closest('#exportDropdown') && showExportOptions) {
        setShowExportOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportOptions]);

  const searchFields: SearchField[] = [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "company", label: "Company Name", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    {
      key: "leadSource", label: "Lead Source", type: "select", options: [
        { value: "website", label: "Website" },
        { value: "referral", label: "Referral" },
        { value: "social", label: "Social Media" },
        { value: "email", label: "Email Campaign" },
        { value: "other", label: "Other" }
      ]
    },
    {
      key: "leadStatus", label: "Lead Status", type: "select", options: [
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "qualified", label: "Qualified" },
        { value: "unqualified", label: "Unqualified" },
        { value: "converted", label: "Converted" }
      ]
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


      console.log(res.data.id, "check the id lead when convert to contact");

      if (res) {
        toastSuccess(res.message);
        refetch();
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
  const handleExportEnquiries = async (format: string = 'xlsx', fields?: string[]) => {
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
      const fileExtension = format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'xlsx';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute("download", `leads_export_${timestamp}.${fileExtension}`);

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
      setExportFields(searchFields.map(field => field.key));
    } else {
      // Deselect all fields
      setExportFields([]);
    }
  };
  const [data, setData] = useState<any[]>([]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log(selectedRows, "selectedRows", leadData, "check lead data");

  const columns = [
    {
      name: '',

      //   <input
      //     type="checkbox"
      //     onChange={(e) => {
      //       const isChecked = e.target.checked;
      //       if (isChecked) {
      //         setSelectedRows(leadData.data.map((row:any) => row._id));
      //       } else {
      //         setSelectedRows([]);
      //       }
      //     }}
      //   />


      cell: (row: any) => (
        <div className="ml-10"><input
          type="checkbox"
          checked={selectedRows.includes(row._id)}

          onChange={() => {
            if (selectedRows.includes(row._id)) {
              setSelectedRows(selectedRows.filter((id) => id !== row._id));
            } else {
              setSelectedRows([...selectedRows, row._id]);
            }
          }}
        />
        </div>

      ),
      width: "60px",
    },
    {
      name: "Contact Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6 className="text-blue-600">{row.firstName + " " + row.lastName}</h6>
        </div>
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
      selector: (row: any) => <h6 className="flex gap-1">{row.company}</h6>,
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
    {
      name: "Edit",
      width: " 140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => navigate(`/add-leads/${row._id}`)}
          className="text-black-500 text-lg "
        >
          <FaEye className="ml-1" />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          className=" text-black-400 text-lg"
        >
          <RiDeleteBin6Line />
        </button>
      ),
    },
    {
      name: "Convert to Contact",
      width: "140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleConvert(row._id)}
          className=" text-black-400 text-lg"
        >
          <SiConvertio />
        </button>
      ),
    },
    {
      name: "Generete Enquiry",
      width: "140px",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleConvertToEnquiry(row._id)}
          className=" text-black-400 text-lg"
        >
          <SiConvertio />
        </button>
      ),
    },
  ];

  const [isOpenAssign, setIsOpenAssign] = useState(false);
  const [assignTaskName, setAssignTaskName] = useState("");
  const [assignTaskUsers, setAssignTaskUsers] = useState<string[]>([]);

  const handleAssignTask = async () => {
    try {
      if (selectedRows.length === 0) {
        toastError("Please select at least one lead to assign.");
        return;
      }

      setIsOpenAssign(true);
    } catch (error) {
      toastError("An error occurred while assigning task. Please try again.");
    }
  };

  const handleAssignTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignTaskName(e.target.value);
  };

  const handleAssignTaskNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  const [visibleColumns, setVisibleColumns] = useState({
    "": true,
    "Contact Name": true,
    "Mobile Number": true,
    "Company Name": true,
    "Display Name": true,
    "Email": true,
    "Edit": canView || canUpdate || true,
    "Delete": canDelete || true,
    "Convert to contact": true,
    "Convert to Enquiry": true,
  });

  useEffect(() => {
    const savedColumns = localStorage.getItem('enquiryTableColumns');
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('enquiryTableColumns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName as keyof typeof prev]: !prev[columnName as keyof typeof prev]
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
  const calculateFixedWidths = (columnsArray: any[]) => {
    const columnsWithFixedWidth = columnsArray.map(column => ({ ...column }));



    console.log(columnsWithFixedWidth, "check the column width")

    return columnsWithFixedWidth;
  };

  // Filter columns based on visibility
  const visibleColumnsArray = columns.filter(column =>
    visibleColumns[column.name as keyof typeof visibleColumns]
  );

  // Apply fixed widths to visible columns
  const filteredColumns = calculateFixedWidths(visibleColumnsArray);

  const resetColumnVisibility = () => {
    setVisibleColumns({
      "": true,
      "Contact Name": true,
      "Mobile Number": true,
      "Company Name": true,
      "Display Name": true,
      "Email": true,
      "Edit": canView || canUpdate || true,
      "Delete": canDelete || true,
      "Convert to contact": true,
      "Convert to Enquiry": true,
    });
  };


  const [tripleDots, setTripleDots] = useState(true)



  return (
    <>
      <div className="container ">
        <div className=" table_container rounded-xl px-4 py-2   ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm -ml-4 -mt-5">
            {/* Heading on the Left */}
            <h2 className="text-lg font-semibold text-gray-800 ">Leads List</h2>
            {/* Search Input */}
            <div className="flex items-center w-full sm:w-auto flex-grow">
              <input
                type="search"
                className="rounded-md border px-3 py-1.5 w-[200px] border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500"
                placeholder="  Search by contact name"
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    refetch();
                  }
                }}
              />
              <div
                className="ml-2 cursor-pointer"
                onClick={() => refetch()}
              >
              </div>
            </div>

            {/* Columns Button */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 text-sm"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns className="text-xs" /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>
            {/* Advanced Search */}
            <button
              onClick={handleModalOpen}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
            >
              Advanced Search
            </button>

            {/* Assign Lead */}
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
              onClick={handleAssignTask}
            >
              <FaTasks className="text-xs" /> Assign Lead
            </button>
            {/* Export */}
            <div className="relative" id="exportDropdown">
              <button
                className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-gray-700 border border-gray-300 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={() => { if (!isExporting) setShowExportOptions(!showExportOptions); }}
                disabled={isExporting}
              >
                <FaFileExport />
                {isExporting ? 'Exporting...' : 'Export'}
                <IoMdArrowDropdown className="ml-1" />
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries('xlsx');
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" viewBox="0 0 16 16">
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h2v1a1 1 0 0 1-1 1h-1zm2-3h-2v-2h2v2zm-3 0H6v-2h3v2zm-4-3h10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v5zm4 0H3V5h2v1h1V5h3v4z" />
                        </svg>
                      </span>
                      Export as Excel
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries('csv');
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" viewBox="0 0 16 16">
                          <path d="M4.5 12.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L4.5 3.707V12.5zm-2-6a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm6 0a.5.5 0 0 1-.5.5H7a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm2 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-4-3a.5.5 0 0 1-.5.5H3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-3 3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-6 3a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm0-3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z" />
                        </svg>
                      </span>
                      Export as CSV
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries('pdf');
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" viewBox="0 0 16 16">
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                          <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" />
                        </svg>
                      </span>
                      Export as PDF
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        setShowExportCustomize(true);
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                      </span>
                      Customize Export
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Import */}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <FaFileImport />
              {isUploading ? "Importing..." : "Import"}
            </button>
            {/* Add New Lead */}
            {canCreate && (
              <button
                onClick={() => navigate("/add-leads")}
                className="flex items-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 text-sm"
              >
                <FaPlus className="text-xs" /> New Lead
              </button>
            )}
          </div>
        </div>
      </div >


      <div className=" table_container  shadow-xl -ml-5  text-sm   ">

        {/* React Table */}px
        {/* <ReactTable
          data={leadData?.data}
          columns={filteredColumns}
          loading={false}
          totalRows={leadData?.total}
          onChangeRowsPerPage={setPageSize}
          onChangePage={setPageIndex}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}

        /> */}

        <ReactTable
          data={leadData?.data}
          columns={filteredColumns}
          loading={false}
          totalRows={leadData?.total}
          onChangeRowsPerPage={setPageSize}
          onChangePage={setPageIndex}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}
        />
      </div>




      {/* Advanced Search Modal */}
      {
        isOpen && (
          <>
            <div className="fixed inset-0 z-[2] bg-[rgba(0,0,0,0.5)]"
              onClick={handleModalClose}>
            </div>

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
        )
      }

      {/* Export Customize Modal */}
      {
        showExportCustomize && (
          <>
            <div className="fixed inset-0 z-[2] bg-[rgba(0,0,0,0.5)]"
              onClick={() => setShowExportCustomize(false)}>
            </div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-6 rounded-lg w-96 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Customize Export Fields</h3>

              {/* Select/Deselect All */}
              <div className="mb-4 pb-2 border-b border-gray-200">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="select-all-fields"
                    checked={exportFields.length === searchFields.length}
                    onChange={(e) => toggleAllExportFields(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="select-all-fields" className="font-medium">Select All Fields</label>
                </div>
              </div>

              {/* Field list */}
              <div className="max-h-64 overflow-y-auto">
                {searchFields.map(field => (
                  <div key={field.key} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`export-${field.key}`}
                      checked={exportFields.includes(field.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExportFields([...exportFields, field.key]);
                        } else {
                          setExportFields(exportFields.filter(f => f !== field.key));
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`export-${field.key}`}>{field.label}</label>
                  </div>
                ))}
              </div>

              {/* Format selection */}
              <div className="mt-4 mb-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-2">Export Format</h4>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="format-xlsx"
                      name="exportFormat"
                      value="xlsx"
                      defaultChecked
                      className="mr-1"
                    />
                    <label htmlFor="format-xlsx">Excel</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="format-csv"
                      name="exportFormat"
                      value="csv"
                      className="mr-1"
                    />
                    <label htmlFor="format-csv">CSV</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio"
                      id="format-pdf"
                      name="exportFormat"
                      value="pdf"
                      className="mr-1"
                    />
                    <label htmlFor="format-pdf">PDF</label>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-md"
                  onClick={() => setShowExportCustomize(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-md"
                  onClick={() => {
                    setShowExportCustomize(false);
                    // Get selected format
                    const formatElement = document.querySelector('input[name="exportFormat"]:checked') as HTMLInputElement;
                    const selectedFormat = formatElement ? formatElement.value : 'xlsx';

                    // Only export if at least one field is selected
                    if (exportFields.length > 0) {
                      handleExportEnquiries(selectedFormat, exportFields);
                    } else {
                      toastError("Please select at least one field to export");
                    }
                  }}
                  disabled={exportFields.length === 0}
                >
                  Export
                </button>
              </div>
            </div>
          </>
        )
      }

      {/* Loading Overlay for Export */}
      {
        isExporting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-700">Preparing your export...</p>
            </div>
          </div>
        )
      }



      {
        isOpenAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assign Task to Multiple Users</h2>
                <button
                  type="button"
                  className="text-black-500 text-lg"
                  onClick={() => setIsOpenAssign(false)}
                >
                  <AiFillCloseSquare />
                </button>
              </div>
              <form onSubmit={handleAssignTaskNameSubmit}>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Enter User Name</label>
                  <input
                    type="text"
                    value={assignTaskName}
                    onChange={handleAssignTaskNameChange}
                    placeholder="Enter User Name"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  {assignTaskUsers.map((user) => (
                    <div
                      key={user}
                      className="bg-blue-100 px-2 py-1 rounded-full cursor-pointer"
                      onClick={() => handleRemoveAssignTaskUser(user)}
                    >
                      {user}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-700 disabled:bg-gray-300"
                    // disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      if (assignTaskName) {
                        setAssignTaskUsers((prevUsers) => [...prevUsers, assignTaskName]);
                        setAssignTaskName("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </form>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-700 disabled:bg-gray-300"
                  onClick={handleAssignTaskSubmit}
                // disabled={isLoading}
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        )
      }



    </>
  );
}

export default Leads;