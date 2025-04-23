import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaFileDownload, FaFilter, FaFileExport, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import {
    useZohoInvoices,
    useSyncZohoInvoices,
    useGenerateInvoicePdf,
    downloadZohoInvoicePdf
} from "@/services/zoho_invoice.service";
import { toastSuccess, toastError } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";

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

    // Combine all filters into one object
    const filters = useMemo(() => ({
        ...(query && { query }), // Using query param as defined in our controller
        ...(selectedStatus && { status: selectedStatus }),
        ...(dateRange.fromDate && { startDate: dateRange.fromDate }),
        ...(dateRange.toDate && { endDate: dateRange.toDate }),
    }), [query, selectedStatus, dateRange]);

    // Fetch invoices using our service hook
    const { data, isLoading, refetch } = useZohoInvoices(filters, false);

    // Mutation hooks for actions
    const syncInvoicesMutation = useSyncZohoInvoices();
    const { mutateAsync: generatePdfMutation } = useGenerateInvoicePdf();

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

    // Handle export functionality
    const handleExportInvoices = () => {
        toastSuccess("Export functionality will be implemented soon!");
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
                    <FaEye />
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
            width: "8%",
        },
    ];

    return (
        <div className="container px-6">
            <div className="bg-white rounded-xl shadow-xl p-6 -mt-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Zoho Invoice List
                    </h2>

                    <div className="flex items-center gap-2">
                        <input
                            type="search"
                            placeholder="Search customer..."
                            onChange={(e) => setQuery(e.target.value)}
                            className="border border-gray-300 px-4 py-2 rounded-sm placeholder-gray-500"
                        />
                        <select
                            className="border border-gray-300 px-4 py-2 rounded-sm"
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
                            onClick={handleSyncInvoices}
                            className="btn-primary"
                            disabled={syncInvoicesMutation.isPending}
                        >
                            <FaSync /> {syncInvoicesMutation.isPending ? "Syncing..." : "Sync Invoices"}
                        </button>
                        <button onClick={handleExportInvoices} className="btn-secondary">
                            <FaFileExport /> Export
                        </button>
                    </div>
                </div>

                <ReactTable
                    data={data?.data || []}
                    columns={columns}
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