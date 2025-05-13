import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaFileDownload, FaFilter, FaFileExport, FaSync, FaColumns } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    useZohoInvoices,
    useSyncZohoInvoices,
    useGenerateInvoicePdf,
    downloadZohoInvoicePdf
} from "@/services/zoho_invoice.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SearchField } from "@/utils/advancedSearch";
import { generateFilePath } from "@/services/urls.service";
import { IoMdArrowDropdown } from "react-icons/io";
import { Switch } from "@mui/material";

interface DateRange {
    fromDate: string;
    toDate: string;
}

function ZohoInvoiceView() {
    const { canView } = checkPermissionsForButtons("Zoho Invoices");

    // State for pagination and filtering
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [selectedStatus, setSelectedStatus] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Export related states
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [showExportCustomize, setShowExportCustomize] = useState(false);
    const [exportFields, setExportFields] = useState<string[]>([
        'firstName', 'lastName', 'email', 'phone', 'company', 'leadSource', 'leadStatus', 'ownerName'
    ]);

    // Combine all filters into one object
    const filters = useMemo(() => ({
        ...(query && { query }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(dateRange.fromDate && { startDate: dateRange.fromDate }),
        ...(dateRange.toDate && { endDate: dateRange.toDate }),
        page: pageIndex,
        limit: pageSize,
    }), [query, selectedStatus, dateRange, pageIndex, pageSize]);

    const [searchQuery, setSearchQuery] = useState("");
    const [advancedSearchParams, setAdvancedSearchParams] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Fetch invoices using our service hook
    const { data, isLoading, refetch } = useZohoInvoices(filters, false);

    // Mutation hooks for actions
    const syncInvoicesMutation = useSyncZohoInvoices();
    const { mutateAsync: generatePdfMutation } = useGenerateInvoicePdf();

    const searchObj = useMemo(
        () => ({
            ...(searchQuery && { query: searchQuery }),
            ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
            pageIndex: pageIndex - 1,
            pageSize,
        }),
        [pageIndex, pageSize, searchQuery, advancedSearchParams]
    );

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

    // Handle syncing invoices from Zoho
    const handleSyncInvoices = async () => {
        try {
            const result = await syncInvoicesMutation.mutateAsync();
            toastSuccess(`Successfully synced! Created: ${result.data.data.createdCount}, Updated: ${result.data.data.updatedCount}`);
            refetch(); // Refresh the data after sync
        } catch (error) {
            toastError("Failed to sync invoices");
        }
    };

    // Handle PDF download
    const handleDownloadPDF = (invoiceId: string) => {
        downloadZohoInvoicePdf(invoiceId);
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle export functionality
    const handleExportInvoices = () => {
        toastSuccess("Export functionality will be implemented soon!");
    };

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const handleModalClose = () => {
        setIsOpen(false);
    };


    // const handleFileChange = async (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const file = event.target.files?.[0];
    //     if (!file) return;

    //     try {
    //         setIsUploading(true);

    //         // Check for allowed file extensions
    //         const allowedExtensions = ["xlsx", "csv"];
    //         const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    //         if (!allowedExtensions.includes(fileExtension)) {
    //             toastError("Invalid file type. Please upload an Excel or CSV file.");
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append("file", file);

    //         const response = await addInvoiceExel(formData);

    //         // Check if the upload was successful
    //         if (response.status === 200) {
    //             toastSuccess("Leads imported successfully!");
    //             refetch();
    //         } else {
    //             toastError("Error importing file. Please try again.");
    //         }
    //     } catch (error: any) {
    //         toastError("An error occurred during import. Please try again.");
    //     } finally {
    //         setIsUploading(false);

    //         // Reset the file input value after upload attempt
    //         if (fileInputRef.current) {
    //             fileInputRef.current.value = "";
    //         }
    //     }
    // };

    // Handle Export with format and fields options
    // const handleExportEnquiries = async (format: string = 'xlsx', fields?: string[]) => {
    //     try {
    //         setIsExporting(true);

    //         // Prepare export parameters
    //         const exportParams = {
    //             ...(searchQuery && { query: searchQuery }),
    //             ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
    //             format,
    //             ...(fields && { fields }), // Include selected fields if provided
    //         };

    //         const { data: response } = await getExel(exportParams);

    //         // Create download link
    //         const url = generateFilePath("/" + response.filename);
    //         const link = document.createElement("a");
    //         link.href = url;

    //         // Set file name with appropriate extension
    //         const fileExtension = format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'xlsx';
    //         const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    //         link.setAttribute("download", `leads_export_${timestamp}.${fileExtension}`);

    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();

    //         toastSuccess("Leads exported successfully!");
    //     } catch (error) {
    //         toastError("Failed to export leads. Please try again.");
    //     } finally {
    //         setIsExporting(false);
    //     }
    // };

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

    // Format currency display
    const formatCurrency = (amount: number, symbol: string = "$") => {
        return `${symbol}${amount.toFixed(2)}`;
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        const baseClass = "px-2 py-1 text-xs rounded-full";
        const statusMap: Record<string, string> = {
            paid: "bg-green-100 text-green-800",
            overdue: "bg-red-100 text-red-800",
            sent: "bg-blue-100 text-blue-800",
            draft: "bg-gray-100 text-gray-800",
            partially_paid: "bg-yellow-100 text-yellow-800",
        };

        const badgeClass = `${baseClass} ${statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800"}`;
        return <span className={badgeClass}>{status}</span>;
    };

    // Table columns definition
    const columns = [
        {
            name: "Invoice #",
            selector: (row: any) => <h6>{row.invoice_number}</h6>,
            width: "12%",
        },
        {
            name: "Customer",
            selector: (row: any) => <h6>{row.customer_name}</h6>,
            width: "20%",
        },
        {
            name: "Date",
            selector: (row: any) => new Date(row.date).toLocaleDateString(),
            width: "12%",
        },
        {
            name: "Status",
            selector: (row: any) => <StatusBadge status={row.status} />,
            width: "12%",
        },
        {
            name: "Amount",
            selector: (row: any) => formatCurrency(row.total, row.currency_code),
            width: "12%",
        },
        {
            name: "Balance",
            selector: (row: any) => formatCurrency(row.balance, row.currency_code),
            width: "12%",
        },
        {
            name: "View",
            selector: (row: any) => (

                <Link to={`/invoicesById/${row.invoice_id}`} className="text-lg text-black-400 p-1">

                    <FaEye className=" hover:text-orange-500" />
                </Link>

            ),
            width: "8%",
        },
        {
            name: "Download",
            selector: (row: any) => (

                <button
                    className="text-lg text-black-400 p-1"
                    onClick={() => handleDownloadPDF(row.invoice_id)}
                // disabled={generatePdfMutation.isPending}
                >
                    <FaFileDownload />
                </button>

            ),
            width: "10%",
        },
    ];
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    // Toggle column visibility
       const canUpdate = true; // or false, depending on your logic
    const canDelete = true; // or false, depending on your logic
    const [visibleColumns, setVisibleColumns] = useState({
       "Invoice #": true,
        "Customer": true,
        "Date": true,
        "Status": true,
        "Amount": true,
        "Balance": true,
        "View": true,
        "Download": true
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
  
    const calculateDynamicWidths = (columnsArray: any[]) => {
      const visibleColumnsCount = columnsArray.length;
      
      if (visibleColumnsCount === 0) return columnsArray;
      
      const columnsWithDynamicWidth = columnsArray.map(column => ({...column}));
      
      const baseWidth = 100 / visibleColumnsCount; 
  
      const MIN_WIDTH = 8; 
      const MAX_WIDTH = 20; 
  
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
  
 
    const resetColumnVisibility = () => {
      setVisibleColumns({
        "Invoice #": true,
        "Customer": true,
        "Date": true,
        "Status": true,
        "Amount": true,
        "Balance": true,
        "View": true,
        "Download": true
      });
    };



    return (
        <div className="container px-6">
            <div className="bg-white rounded-xl shadow-xl p-6 -mt-5">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Zoho Invoice List
                    </h2>

                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            placeholder="Search customer..."
                            onChange={(e) => setQuery(e.target.value)}
                            className="px-4 py-2 rounded-md text-gray-700 border w[200px] border-gray-300"
                        />
                         <div className="relative">
                            <button
                              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
                              onClick={() => setShowColumnSelector(!showColumnSelector)}
                            >
                              <FaColumns/> Columns
                            </button>
                            {showColumnSelector && <ColumnSelector />}
                          </div>



                        <select
                            className="flex items-center gap-1 px-5 py-2.5 rounded-md text-gray-700 border border-gray-300"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option  value="">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="draft">Draft</option>
                            <option value="partially_paid">Partially Paid</option>
                        </select>
                        {/* <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                            <FaFilter /> Filter
                        </button> */}
                        <button
                            onClick={handleSyncInvoices}
                            className="flex items-center w-[140px] text-sm gap-1 px-4 py-2.5 rounded-md text-gray-700 border border-gray-300"
                            disabled={syncInvoicesMutation.isPending}
                        >
                            <FaSync className="pl-1" /> {syncInvoicesMutation.isPending ? "Syncing..." : "Sync Invoices"}
                        </button>
                        <div className="relative flex items-center " id="exportDropdown">
                            <button
                                className={`flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                onClick={() => !isExporting && setShowExportOptions(!showExportOptions)}
                                disabled={isExporting}
                            >
                                <FaFileExport />
                                {isExporting ? 'Exporting...' : 'Export'}
                                <IoMdArrowDropdown className="ml-1" />
                            </button>

                            {/* {showExportOptions && (
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
                            )} */}
                        </div>
                        <button onClick={handleModalOpen} className="flex items-center adv-srch gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                            Advance Search
                        </button>


                    </div>
                </div>

                <ReactTable
                    data={data?.data || []}
                    columns={filteredColumns}
                    loading={isLoading || syncInvoicesMutation.isPending}
                    totalRows={data?.total || 0}
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

export default ZohoInvoiceView;