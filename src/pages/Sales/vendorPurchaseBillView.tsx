import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaFileDownload, FaFilter, FaFileExport, FaSync } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
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

    const {id} = useParams<{ id: string }>()

    const filters = useMemo(() => ({
        ...(query && { query }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(dateRange.fromDate && { startDate: dateRange.fromDate }),
        ...(dateRange.toDate && { endDate: dateRange.toDate }),
    }), [query, selectedStatus, dateRange]);

    

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
        downloadVendorPurchaseBillPdf( billId );
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
                            onClick={handleSyncBills}
                            className="btn-primary"
                            disabled={syncBillsMutation.isPending}
                        >
                            <FaSync /> {syncBillsMutation.isPending ? "Syncing..." : "Sync Bills"}
                        </button>
                        <button onClick={handleExportBills} className="btn-secondary">
                            <FaFileExport /> Export
                        </button>
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