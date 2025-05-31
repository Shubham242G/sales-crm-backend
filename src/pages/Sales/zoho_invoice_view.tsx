import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaFileDownload, FaFilter, FaFileExport, FaSync, FaColumns } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import {
    useZohoInvoices,
    useSyncZohoInvoices,
    useGenerateInvoicePdf,
    downloadZohoInvoicePdf,
    addInvoicesExcel
} from "@/services/zoho_invoice.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SearchField } from "@/utils/advancedSearch";
import { generateFilePath } from "@/services/urls.service";
import { IoMdArrowDropdown } from "react-icons/io";
import { Switch } from "@mui/material";
import { getInvoicesExcel } from "@/services/zoho_invoice.service";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";


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
    const [tableData, setTableData] = useState<any[]>([]);

    const [showExportCustomize, setShowExportCustomize] = useState(false);
    const [exportFields, setExportFields] = useState<string[]>([
        "invoice_number",
        "customer_name",
        "date",
        "status",
        "total",
        "balance",
        "currency_code"
    ]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Export related states
    const [showExportOptions, setShowExportOptions] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [advancedSearchParams, setAdvancedSearchParams] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Mutation hooks for actions
    const syncInvoicesMutation = useSyncZohoInvoices();

    const searchObj = useMemo(
        () => ({
            ...(searchQuery && { query: searchQuery }),
            ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
            pageIndex: pageIndex - 1,
            pageSize,
        }),
        [pageIndex, pageSize, searchQuery, advancedSearchParams]
    );

    const { data: syncDataGetAll, isLoading, refetch } = useZohoInvoices(searchObj, true);

    console.log(syncDataGetAll, "syncDataGetAll");

    // Extract the actual data array from the API response
    const invoiceData = useMemo(() => {
        if (!syncDataGetAll) return [];

        // Handle different possible response structures
        if (Array.isArray(syncDataGetAll)) {
            return syncDataGetAll;
        }

        // Check for common API response patterns
        if (syncDataGetAll.data && Array.isArray(syncDataGetAll.data)) {
            return syncDataGetAll.data;
        }

        if (syncDataGetAll.data && Array.isArray(syncDataGetAll.data)) {
            return syncDataGetAll.data;
        }

        if (syncDataGetAll.data && Array.isArray(syncDataGetAll.data)) {
            return syncDataGetAll.data;
        }

        // If none of the above, return empty array to prevent errors
        console.warn('Unexpected data structure:', syncDataGetAll);
        return [];
    }, [syncDataGetAll]);

    const totalRows = useMemo(() => {
        if (!syncDataGetAll) return 0;

        // Handle different possible response structures for total count
        if (typeof syncDataGetAll.total === 'number') {
            return syncDataGetAll.total;
        }

        if (typeof syncDataGetAll.total === 'number') {
            return syncDataGetAll.total;
        }

        if (typeof syncDataGetAll.total === 'number') {
            return syncDataGetAll.total;
        }

        // Fallback to array length
        return invoiceData.length;
    }, [syncDataGetAll, invoiceData]);

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
    const { mutateAsync: sync } = useSyncZohoInvoices();
    const handleSyncInvoices = async () => {
        try {
            const { data: res } = await sync();
            if (res) {
                toastSuccess(res.message);
                refetch();
            }
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
    const handleExportInvoices = async (format: string = "xlsx", fields?: string[]) => {
        try {
            setIsExporting(true);

            // Prepare export parameters
            const exportParams = {
                ...(searchQuery && { query: searchQuery }),
                ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
                ...(selectedStatus && { status: selectedStatus }),
                format,
                ...(fields && { fields }), // Include selected fields if provided
            };

            const { data: response } = await getInvoicesExcel(exportParams);

            // Create download link
            const url = generateFilePath("/" + response.filename);
            const link = document.createElement("a");
            link.href = url;

            // Set file name with appropriate extension
            const fileExtension =
                format === "csv" ? "csv" :
                    format === "pdf" ? "pdf" : "xlsx";
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            link.setAttribute(
                "download",
                `invoices_export_${timestamp}.${fileExtension}`
            );

            document.body.appendChild(link);
            link.click();
            link.remove();

            toastSuccess("Invoices exported successfully!");
        } catch (error) {
            toastError("Failed to export invoices. Please try again.");
        } finally {
            setIsExporting(false);
            setShowExportOptions(false);
        }
    };

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const handleModalClose = () => {
        setIsOpen(false);
    };

    // Format currency display
    const formatCurrency = (amount: number, symbol: string = "$") => {
        return `${symbol} ${amount.toFixed(2)}`;
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
            selector: (row: any) => <h6 className="capitalize "><StatusBadge status={row.status} /></h6>,
            width: "12%",
        },
        {
            name: "Amount",
            selector: (row: any) => <h5>{formatCurrency(row.total, row.currency_code)}</h5>,
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
                >
                    <FaFileDownload />
                </button>
            ),
            width: "10%",
        },
    ];

    const [showColumnSelector, setShowColumnSelector] = useState(false);

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

        const columnsWithDynamicWidth = columnsArray.map(column => ({ ...column }));

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

    const [tickRows, setTickRows] = useState([]);

    const handleChange = ({ selectedRows }: any) => {
        // You can set state or dispatch with something like Redux so we can use the retrieved data
        console.log("Selected Rows: ", selectedRows);
        setTickRows(selectedRows.map((row: any) => row._id));
    };

    return (
        //         <div className=" rounded-xl  mt-10 p-6">
        //             <div className="flex justify-between items-center ">
        //                 <h2 className="text-xl  font-semibold text-gray-800">
        //                     Zoho Invoice List
        //                 </h2>

        //                 <div className="flex items-center  gap-2">
        //                     <input
        //                         type="search"
        //                         placeholder="Search customer..."
        //                         onChange={(e) => setQuery(e.target.value)}
        //                         className=" px-3 py-1.5 text-sm rounded-md text-gray-700 border w-[200px] border-gray-300"
        //                     />
        //                     <div className="relative">
        //                         <button
        //                             className="flex items-center gap-1 text-sm  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-50 whitespace-nowrap"
        //                             onClick={() => setShowColumnSelector(!showColumnSelector)}
        //                         >
        //                             <FaColumns /> Columns
        //                         </button>
        //                         {showColumnSelector && <ColumnSelector />}
        //                     </div>

        //                     <select
        //                         className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 border border-gray-300"
        //                         value={selectedStatus}
        //                         onChange={(e) => setSelectedStatus(e.target.value)}
        //                     >
        //                         <option value="">All Status</option>
        //                         <option value="sent">Sent</option>
        //                         <option value="paid">Paid</option>
        //                         <option value="overdue">Overdue</option>
        //                         <option value="draft">Draft</option>
        //                         <option value="partially_paid">Partially Paid</option>
        //                     </select>

        //                     <button
        //                         onClick={handleSyncInvoices}
        //                         className="flex items-center  text-sm gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300"
        //                         disabled={syncInvoicesMutation.isPending}
        //                     >
        //                         <FaSync />
        //                         <span className="w-[100px]">{syncInvoicesMutation.isPending ? "Syncing..." : "Sync Invoices"}</span>
        //                     </button>

        //                     <div className="relative flex items-center " id="exportDropdown">
        //                         <button
        //                             className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
        //                             onClick={() => !isExporting && setShowExportOptions(!showExportOptions)}
        //                             disabled={isExporting}
        //                         >
        //                             Export
        //                             <FaFileExport />
        //                             {showExportOptions && (
        //   <div className="absolute z-50 bg-white shadow-lg p-4 rounded-md mt-2 border border-gray-200 right-0 w-72">
        //     <div className="flex flex-col gap-2">
        //       <h3 className="font-medium mb-2">Export Options</h3>

        //       <div className="flex gap-2 mb-3">
        //         <button
        //           onClick={() => handleExportInvoices("xlsx")}
        //           className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        //         >
        //           Excel
        //         </button>
        //         <button
        //           onClick={() => handleExportInvoices("csv")}
        //           className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
        //         >
        //           CSV
        //         </button>
        //         <button
        //           onClick={() => handleExportInvoices("pdf")}
        //           className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        //         >
        //           PDF
        //         </button>
        //       </div>

        //       <button
        //         onClick={() => setShowExportCustomize(!showExportCustomize)}
        //         className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        //       >
        //         <FaColumns className="text-sm" />
        //         Customize Fields
        //       </button>

        //       {showExportCustomize && (
        //         <div className="mt-2 border-t pt-2">
        //           <div className="flex items-center justify-between mb-2">
        //             <span className="text-sm">Select All</span>
        //             <Switch
        //               checked={exportFields.length === searchFields.length}
        //               onChange={(e) => {
        //                 if (e.target.checked) {
        //                   setExportFields(searchFields.map(field => field.key));
        //                 } else {
        //                   setExportFields([]);
        //                 }
        //               }}
        //               size="small"
        //             />
        //           </div>

        //           <div className="max-h-40 overflow-y-auto">
        //             {searchFields.map((field) => (
        //               <div key={field.key} className="flex items-center justify-between py-1">
        //                 <span className="text-sm">{field.label}</span>
        //                 <Switch
        //                   checked={exportFields.includes(field.key)}
        //                   onChange={() => {
        //                     if (exportFields.includes(field.key)) {
        //                       setExportFields(exportFields.filter(f => f !== field.key));
        //                     } else {
        //                       setExportFields([...exportFields, field.key]);
        //                     }
        //                   }}
        //                   size="small"
        //                 />
        //               </div>
        //             ))}
        //           </div>

        //           <button
        //             onClick={() => handleExportInvoices("xlsx", exportFields)}
        //             className="mt-2 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        //           >
        //             Export Selected Fields
        //           </button>
        //         </div>
        //       )}
        //     </div>
        //   </div>
        // )}

        //                             <IoMdArrowDropdown className="ml-1 text-sm" />
        //                         </button>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* <div className="mt-5">
        //                 <ReactTable
        //                     data={invoiceData} // Use the extracted array data
        //                     columns={filteredColumns}
        //                     selectableRows={true}
        //                     loading={isLoading} // Use the actual loading state
        //                     totalRows={totalRows} // Use the extracted total count
        //                     onChangeRowsPerPage={setPageSize}
        //                     onChangePage={setPageIndex}
        //                     page={pageIndex}
        //                     rowsPerPageText={pageSize}
        //                     isServerPropsDisabled={false}
        //                 />
        //             </div> */}
        //         </div>


        <NewTable
            data={invoiceData} // Use the extracted array data
            columns={filteredColumns}
            selectableRows={true}
            loading={isLoading} // Use the actual loading state
            totalRows={totalRows} // Use the extracted total count
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}

            onSelectedRowsChange={handleChange}
            className={"leadtable"}
            //new fields
            TableName={"Zoho Invoices"}
            TableGetAllFunction={useZohoInvoices}
            ExcelExportFunction={getInvoicesExcel}
            TableAddExcelFunction={addInvoicesExcel}
            RouteName={"Invoices"}

            syncFunction={useSyncZohoInvoices}
            placeholderSearch={"Search in invoice"}
        />

    );
}

export default ZohoInvoiceView;