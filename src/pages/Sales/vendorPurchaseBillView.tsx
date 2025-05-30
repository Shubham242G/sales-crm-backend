import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaFileDownload, FaFilter, FaFileExport, FaSync } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import {
    useVendorPurchaseBills,
    useSyncVendorPurchaseBills,
    useGenerateVendorPurchaseBillPdf,
    downloadVendorPurchaseBillPdf,
    usedeleteVendorPurchaseBillById,
} from "@/services/vendorPurchaseBill.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdArrowDropdown } from "react-icons/io";

import AdvancedSearch, { SearchField } from "@/utils/advancedSearch";
import { generateFilePath } from "@/services/urls.service";

interface DateRange {
    fromDate: string;
    toDate: string;
}

function VendorPurchaseBillView() {
    const { canView } = checkPermissionsForButtons("Vendor Purchase Bills");

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [selectedStatus, setSelectedStatus] = useState("");
    const navigate = useNavigate()

    const { id } = useParams<{ id: string }>()

    const filters = useMemo(() => ({
        ...(query && { query }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(dateRange.fromDate && { startDate: dateRange.fromDate }),
        ...(dateRange.toDate && { endDate: dateRange.toDate }),
    }), [query, selectedStatus, dateRange]);


    const [searchQuery, setSearchQuery] = useState("");
    const [advancedSearchParams, setAdvancedSearchParams] = useState("");
    const [isOpen, setIsOpen] = useState(false);



    const searchObj = useMemo(
        () => ({
            ...(searchQuery && { query: searchQuery }),
            ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
            pageIndex: pageIndex - 1,
            pageSize,
        }),
        [pageIndex, pageSize, searchQuery, advancedSearchParams]
    );



    const syncBillsMutation = useSyncVendorPurchaseBills();


    const { data: vendorBills, refetch, isLoading } = useVendorPurchaseBills(filters, false);

    const { mutateAsync: deleteBill } = usedeleteVendorPurchaseBillById();

    const handleSyncBills = async () => {
        try {
            const result = await syncBillsMutation.mutateAsync();
            console.log(vendorBills)
            toastSuccess(`Successfully synced! Created: ${result.data.data.createdCount}, Updated: ${result.data.data.updatedCount}`);
            refetch();
        } catch (error) {
            toastError("Failed to sync vendor bills");
        }
    };

    const handleDownloadPDF = (billId: string) => {
        downloadVendorPurchaseBillPdf(billId);
    };


    const handleDelete = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete this Purchase Bill?")) {
                const { data: res } = await deleteBill(id);
                if (res) {
                    toastSuccess(res.message);
                    refetch();
                }
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleExportBills = () => {
        toastSuccess("Export functionality will be implemented soon!");
    };

    // const formatCurrency = (amount: number, symbol: string = "$") => {
    //     return `${symbol}${amount.toFixed(2)}`;
    // };
    const [isUploading, setIsUploading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const [showExportOptions, setShowExportOptions] = useState(false);
    const [showExportCustomize, setShowExportCustomize] = useState(false);
    const [exportFields, setExportFields] = useState<string[]>([
        'vendorName', 'billNumber', 'billDate', 'dueDate', 'amount', 'status'
    ]);


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
        { key: "billNumber", label: "Bill Number", type: "text" },
        { key: "vendorName", label: "Vendor Name", type: "text" },
        { key: "billDate", label: "Bill Date", type: "date" },
        { key: "dueDate", label: "Due Date", type: "date" },
        { key: "amount", label: "Amount", type: "number" },
        {
            key: "status", label: "Status", type: "select", options: [
                { value: "paid", label: "Paid" },
                { value: "overdue", label: "Overdue" },
                { value: "sent", label: "Sent" },
                { value: "draft", label: "Draft" },
                { value: "partially_paid", label: "Partially Paid" }
            ]
        },
    ];


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


    // const toggleAllExportFields = (checked: boolean) => {
    //     if (checked) {
    //         // Select all fields
    //         setExportFields(searchFields.map(field => field.key));
    //     } else {
    //         // Deselect all fields
    //         setExportFields([]);
    //     }
    // };

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

    const columns = [
        {
            name: "Bill Number",
            selector: (row: any) => <h6>{row.bill_number}</h6>,
            width: "12%",
        },
        {
            name: "Vendor",
            selector: (row: any) => <h6>{row.vendor_name}</h6>,
            width: "20%",
        },
        {
            name: "Bill Date",
            selector: (row: any) => new Date(row.date).toLocaleDateString(),
            width: "12%",
        },
        {
            name: "Status",
            selector: (row: any) => <StatusBadge status={row.status} />,
            width: "12%",
        },
        {
            name: "Total Amount",
            selector: (row: any) => <><h6>{row.currency_code}</h6><h6>{row.total}</h6></>,
            width: "20%",
        },
        // {
        //     name: "Balance Due",
        //     selector: (row: any) => formatCurrency(row.balance_due, row.currency_code),
        //     width: "12%",
        // },
        {
            name: "View",
            selector: (row: any) => (
                // <Link to={`/vendorPurchaseBill/${row._id}`} className="text-lg text-black-400 p-1">
                <button className="text-lg text-black-400 p-1" onClick={() => navigate(`/vendorPurchaseBill/${row._id}`)}>
                    <FaEye />
                </button>
                // </Link>
            ),
            width: "8%",
        },
        {
            name: "Download",
            selector: (row: any) => (
                <button
                    className="text-lg text-black-400 p-1"
                    onClick={() => handleDownloadPDF(row._id)}
                >
                    <FaFileDownload />
                </button>
            ),
            width: "8%",
        },
        {
            name: "Delete",
            width: "8%",
            selector: (row: any) => (
                <div className="flex items-center gap-3">
                    <button
                        className="p-[6px] text-black-400 text-lg"
                        onClick={() => handleDelete(row._id)}
                    >
                        <RiDeleteBin6Line />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container px-6">
            <div className="bg-white rounded-xl shadow-xl p-6 -mt-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Vendor Purchase Bills
                    </h2>

                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            placeholder="Search vendor..."
                            onChange={(e) => setQuery(e.target.value)}
                            className="border border-gray-300  px-3 py-1.5 rounded-md placeholder-gray-500"
                        />
                        <select
                            className="border border-gray-300  px-3 py-1.5 rounded-md"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="sent">Sent</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="draft">Draft</option>
                            <option value="partially_paid">Partially Paid</option>
                        </select>
                        <button className="btn-secondary">
                            <FaFilter /> Filter
                        </button>
                        <button
                            onClick={handleSyncBills}
                            className="btn-primary"
                            disabled={syncBillsMutation.isPending}
                        >
                            <FaSync /> {syncBillsMutation.isPending ? "Syncing..." : "Sync Bills"}
                        </button>
                        <button
                            className={`flex items-center gap-1  px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                                        className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                                        className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                                        className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                                        className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                </div>

                <ReactTable
                    data={vendorBills?.data || []}
                    columns={columns}
                    loading={isLoading || syncBillsMutation.isPending}
                    totalRows={vendorBills?.total || 0}
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

export default VendorPurchaseBillView; 