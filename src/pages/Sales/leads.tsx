import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
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

import AdvancedSearch, { SearchField } from "@/utils/advancedSearch";

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
    { key: "leadSource", label: "Lead Source", type: "select", options: [
      { value: "website", label: "Website" },
      { value: "referral", label: "Referral" },
      { value: "social", label: "Social Media" },
      { value: "email", label: "Email Campaign" },
      { value: "other", label: "Other" }
    ]},
    { key: "leadStatus", label: "Lead Status", type: "select", options: [
      { value: "new", label: "New" },
      { value: "contacted", label: "Contacted" },
      { value: "qualified", label: "Qualified" },
      { value: "unqualified", label: "Unqualified" },
      { value: "converted", label: "Converted" }
    ]},
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

  const columns = [
    {
      name: "Contact Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col ">
          <h6 className="ml-2">{row.firstName + " " + row.lastName}</h6>
        </div>
      ),
      width: "20%",
    },
    // {
    //   name: "Account Manager",
    //   selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
    //   width: "15%",
    // },
    {
      name: "Mobile Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className="text-[#938d8d]" />
          {row.phone}
        </div>
      ),
      width: "18%",
    },
    {
      name: "Company Name",
      selector: (row: any) => <div className="flex gap-1">{row.company}</div>,
      width: "22%",
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      width: "24%",
    },
    {
      name: "Edit",
      width: " 8%",
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
      width: "8%",
      selector: (row: any) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          className=" text-black-400 text-lg"
        >
          <RiDeleteBin6Line/>
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
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800">Leads List</h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full flex items-center">
                <input
                  type="search"
                  className="rounded-md w-[250px] border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by contact name"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      refetch();
                    }
                  }}
                />
                <div 
                  className="relative right-8 cursor-pointer" 
                  onClick={() => refetch()}
                >
                  <IoSearchOutline />
                </div>
              </div>
              
              {/* Filter Button */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              
              {/* Export Button with Dropdown */}
              <div className="relative" id="exportDropdown">
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => !isExporting && setShowExportOptions(!showExportOptions)}
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
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h2v1a1 1 0 0 1-1 1h-1zm2-3h-2v-2h2v2zm-3 0H6v-2h3v2zm-4-3h10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v5zm4 0H3V5h2v1h1V5h3v4z"/>
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
                            <path d="M4.5 12.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L4.5 3.707V12.5zm-2-6a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm6 0a.5.5 0 0 1-.5.5H7a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm2 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-4-3a.5.5 0 0 1-.5.5H3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-3 3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-6 3a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm0-3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z"/>
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
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
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
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                          </svg>
                        </span>
                        Customize Export
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Import Button */}
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

              <button onClick={handleModalOpen} className="flex items-center adv-srch gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              AdvanceSearch
              </button>

              {/* Add New Lead Button */}
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
            data={leadData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={leadData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
        </div>
      </div>

      {/* Advanced Search Modal */}
      {isOpen && (
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
      )}

      {/* Export Customize Modal */}
      {showExportCustomize && (
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
      )}

      {/* Loading Overlay for Export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-700">Preparing your export...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Leads;