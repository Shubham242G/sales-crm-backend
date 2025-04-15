import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import {
    useAllInvoices,
    useInvoiceById,
    useInvoiceToken
} from "@/services/zoho_invoice.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";
import { getExel } from "@/services/contactForAll.service";

// Dummy invoice data
const dummyInvoiceData = {
    data: [
        {
            _id: "inv001",
            invoiceNumber: "INV-2025-001",
            firstName: "John",
            lastName: "Smith",
            ownerName: "Sarah Johnson",
            phone: "+1 (555) 123-4567",
            company: "Tech Solutions Inc.",
            email: "john.smith@techsolutions.com",
            amount: 1250.00,
            status: "Paid",
            dueDate: "2025-04-20"
        },
        {
            _id: "inv002",
            invoiceNumber: "INV-2025-002",
            firstName: "Emma",
            lastName: "Williams",
            ownerName: "Michael Chen",
            phone: "+1 (555) 234-5678",
            company: "Creative Designs Co.",
            email: "emma.w@creativedesigns.com",
            amount: 3450.75,
            status: "Pending",
            dueDate: "2025-04-28"
        },
        {
            _id: "inv003",
            invoiceNumber: "INV-2025-003",
            firstName: "Robert",
            lastName: "Johnson",
            ownerName: "Sarah Johnson",
            phone: "+1 (555) 345-6789",
            company: "Global Logistics Ltd.",
            email: "r.johnson@globallogistics.com",
            amount: 5670.50,
            status: "Overdue",
            dueDate: "2025-04-10"
        },
        {
            _id: "inv004",
            invoiceNumber: "INV-2025-004",
            firstName: "Maria",
            lastName: "Garcia",
            ownerName: "David Wilson",
            phone: "+1 (555) 456-7890",
            company: "Retail Solutions LLC",
            email: "maria.g@retailsolutions.com",
            amount: 890.25,
            status: "Paid",
            dueDate: "2025-04-12"
        },
        {
            _id: "inv005",
            invoiceNumber: "INV-2025-005",
            firstName: "James",
            lastName: "Brown",
            ownerName: "Lisa Thompson",
            phone: "+1 (555) 567-8901",
            company: "Innovative Industries",
            email: "james.b@innovative.com",
            amount: 4250.00,
            status: "Pending",
            dueDate: "2025-05-02"
        },
        {
            _id: "inv006",
            invoiceNumber: "INV-2025-006",
            firstName: "Patricia",
            lastName: "Davis",
            ownerName: "Michael Chen",
            phone: "+1 (555) 678-9012",
            company: "Premier Services Group",
            email: "patricia.d@premierservices.com",
            amount: 1870.35,
            status: "Paid",
            dueDate: "2025-04-15"
        },
        {
            _id: "inv007",
            invoiceNumber: "INV-2025-007",
            firstName: "Michael",
            lastName: "Miller",
            ownerName: "David Wilson",
            phone: "+1 (555) 789-0123",
            company: "Advanced Engineering Co.",
            email: "m.miller@advancedeng.com",
            amount: 7520.80,
            status: "Overdue",
            dueDate: "2025-04-05"
        },
        {
            _id: "inv008",
            invoiceNumber: "INV-2025-008",
            firstName: "Elizabeth",
            lastName: "Wilson",
            ownerName: "Lisa Thompson",
            phone: "+1 (555) 890-1234",
            company: "Digital Marketing Experts",
            email: "e.wilson@digitalmarketing.com",
            amount: 2345.60,
            status: "Pending",
            dueDate: "2025-04-30"
        },
        {
            _id: "inv009",
            invoiceNumber: "INV-2025-009",
            firstName: "David",
            lastName: "Moore",
            ownerName: "Sarah Johnson",
            phone: "+1 (555) 901-2345",
            company: "Construction Pros Inc.",
            email: "d.moore@constructionpros.com",
            amount: 9650.00,
            status: "Paid",
            dueDate: "2025-04-18"
        },
        {
            _id: "inv010",
            invoiceNumber: "INV-2025-010",
            firstName: "Jennifer",
            lastName: "Taylor",
            ownerName: "Michael Chen",
            phone: "+1 (555) 012-3456",
            company: "Healthcare Solutions Ltd.",
            email: "j.taylor@healthcaresolutions.com",
            amount: 3780.45,
            status: "Pending",
            dueDate: "2025-05-05"
        }
    ],
    total: 45,
    pages: 5
};

// Dummy invoice detail data for the useInvoiceById hook
const dummyInvoiceByIdData = {
    _id: "inv001",
    invoiceNumber: "INV-2025-001",
    customer: {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@techsolutions.com",
        phone: "+1 (555) 123-4567",
        company: "Tech Solutions Inc.",
        address: "123 Tech Blvd, San Francisco, CA 94105"
    },
    owner: {
        name: "Sarah Johnson",
        email: "sarah.j@yourcompany.com",
        phone: "+1 (555) 987-6543"
    },
    items: [
        {
            name: "Web Development Services",
            description: "Frontend development and UI/UX design",
            quantity: 40,
            rate: 25,
            amount: 1000
        },
        {
            name: "Hosting Fee",
            description: "Annual hosting and maintenance",
            quantity: 1,
            rate: 250,
            amount: 250
        }
    ],
    subtotal: 1250.00,
    tax: 0,
    total: 1250.00,
    status: "Paid",
    issueDate: "2025-04-01",
    dueDate: "2025-04-20",
    paymentDate: "2025-04-15",
    notes: "Thank you for your business!"
};

function Invoices() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    // Mock the hook responses
    const [mockInvoiceData, setMockInvoiceData] = useState(dummyInvoiceData);
    const [mockInvoiceByIdData, setMockInvoiceByIdData] = useState(dummyInvoiceByIdData);
    
    // State variables
    const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
    const [showInvoicePdf, setShowInvoicePdf] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState("");
    
    const { canCreate, canDelete, canUpdate, canView } = {
        canCreate: true,
        canDelete: true,
        canUpdate: true,
        canView: true
    }; // Mocking permissions

    const searchObj = useMemo(
        () => ({
            ...(query && { query }),
            pageIndex: pageIndex - 1,
            pageSize,
        }),
        [pageIndex, pageSize, query]
    );

    // Mock the API hooks
    const { data: InvoiceData, refetch } = {
        data: mockInvoiceData,
        refetch: () => console.log("Refetching data...")
    };

    const { data: InvoiceDataById } = {
        data: mockInvoiceByIdData
    };

    const { data: res } = {
        data: { token: "mock-token" }
    };

    const handleLedgerDetailsModal = () => {
        setShowLedgerDetailsModal(true);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // Simulate file upload
            setTimeout(() => {
                toastSuccess("Invoices imported successfully!");
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }, 2000);
        } catch (error: any) {
            toastError("An error occurred during import. Please try again.");
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleExportEnquiries = async () => {
        try {
            // Simulate export
            setTimeout(() => {
                toastSuccess("Invoices exported successfully!");
            }, 1000);
        } catch (error) {
            toastError("Failed to export invoices. Please try again.");
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        
        // Filter the dummy data based on search query
        if (e.target.value) {
            const filteredData = dummyInvoiceData.data.filter(invoice => 
                (invoice.firstName + " " + invoice.lastName).toLowerCase().includes(e.target.value.toLowerCase()) ||
                invoice.company.toLowerCase().includes(e.target.value.toLowerCase()) ||
                invoice.email.toLowerCase().includes(e.target.value.toLowerCase())
            );
            
            setMockInvoiceData({
                ...dummyInvoiceData,
                data: filteredData,
                total: filteredData.length
            });
        } else {
            setMockInvoiceData(dummyInvoiceData);
        }
    };

    const showPdf = (invoice: any) => {
        setSelectedInvoice(invoice);
        setShowInvoicePdf(true);
    };

    const closePdf = () => {
        setShowInvoicePdf(false);
        setSelectedInvoice(null);
    };

    const columns = [
        {
            name: "Contact Name",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row.firstName + " " + row.lastName}</h6>
                </div>
            ),
            width: "18%",
        },
        {
            name: "Account Manager",
            selector: (row: any) => <div className="flex gap-1">{row.ownerName}</div>,
            width: "12%",
        },
        {
            name: "Mobile Number",
            selector: (row: any) => (
                <div className="flex gap-1">
                    <FaMobileScreenButton className="text-[#938d8d]" />
                    {row.phone}
                </div>
            ),
            width: "15%",
        },
        {
            name: "Company Name",
            selector: (row: any) => <div className="flex gap-1">{row.company}</div>,
            width: "18%",
        },
        {
            name: "Email",
            selector: (row: any) => row.email,
            width: "15%",
        },
        {
            name: "Edit",
            width: "5%",
            selector: (row: any) => (
                <button
                    type="button"
                    onClick={() => navigate(`/add-Invoices/${row._id}`)}
                    className="text-black-500 text-lg p-[6px]"
                >
                    <FaEye />
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
                        <h2 className="text-xl font-semibold text-gray-800">Invoices List</h2>

                        {/* Search and Buttons on the Right */}
                        <div className="flex items-center justify-start gap-2">
                            {/* Search Box */}
                            <div className="w-full flex items-center ">
                                <input
                                    type="search"
                                    className="rounded-md w-[250px] border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                                    placeholder="Search by contact name"
                                    onChange={handleSearchChange}
                                    value={query}
                                />
                                <div className="relative right-8">
                                    <IoSearchOutline />
                                </div>
                            </div>
                            {/* Buttons */}
                            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                                <FaFilter /> Filter
                            </button>

                            <button
                                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                                onClick={handleExportEnquiries}
                            >
                                <FaFileExport /> Export
                            </button>

                            <ConnectZohoButton onShowPdf={() => showPdf(mockInvoiceData.data[0])} />

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

                            {canCreate && (
                                <button
                                    onClick={() => navigate("/add-Invoices")}
                                    className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                                >
                                    <FaPlus />
                                    <span>New Invoice</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* React Table */}
                    <ReactTable
                        data={mockInvoiceData.data}
                        columns={filterColumns}
                        loading={false}
                        totalRows={mockInvoiceData.total}
                        onChangeRowsPerPage={setPageSize}
                        onChangePage={setPageIndex}
                        page={pageIndex}
                        rowsPerPageText={pageSize}
                        isServerPropsDisabled={false}
                    />
                </div>
            </div>

            {/* Invoice PDF Modal */}
            {showInvoicePdf && selectedInvoice && (
                <InvoicePdfModal invoice={selectedInvoice} onClose={closePdf} />
            )}
        </>
    );
}

export default Invoices;

const ConnectZohoButton = ({ onShowPdf }: { onShowPdf: () => void }) => {
    const handleConnect = () => {
        // Instead of redirecting, now we'll show the PDF
        onShowPdf();
    };

    return (
        <button
            onClick={handleConnect}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Connect to Zoho
        </button>
    );
};

// Invoice PDF Modal Component
const InvoicePdfModal = ({ invoice, onClose }: { invoice: any, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Invoice #{invoice.invoiceNumber}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                
                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                                <p className="text-gray-600">#{invoice.invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold text-gray-800">Your Company</h2>
                                <p className="text-gray-600">123 Business Road</p>
                                <p className="text-gray-600">San Francisco, CA 94107</p>
                                <p className="text-gray-600">contact@yourcompany.com</p>
                                <p className="text-gray-600">+1 (555) 555-5555</p>
                            </div>
                        </div>
                        
                        {/* Bill To & Ship To */}
                        <div className="flex justify-between mb-10">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
                                <p className="text-gray-700">{invoice.firstName} {invoice.lastName}</p>
                                <p className="text-gray-700">{invoice.company}</p>
                                <p className="text-gray-700">{invoice.email}</p>
                                <p className="text-gray-700">{invoice.phone}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-800 mb-2">Invoice Details:</h3>
                                <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                                <p className="text-gray-700"><span className="font-medium">Due Date:</span> {invoice.dueDate}</p>
                                <p className="text-gray-700"><span className="font-medium">Status:</span> <span className={`font-medium ${
                                    invoice.status === "Paid" ? "text-green-600" : 
                                    invoice.status === "Pending" ? "text-yellow-600" : "text-red-600"
                                }`}>{invoice.status}</span></p>
                            </div>
                        </div>
                        
                        {/* Items Table */}
                        <table className="min-w-full mb-10">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Qty</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Rate</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700">Web Development</td>
                                    <td className="py-3 px-4 text-gray-700">Frontend development and UI/UX design</td>
                                    <td className="py-3 px-4 text-right text-gray-700">40</td>
                                    <td className="py-3 px-4 text-right text-gray-700">$25.00</td>
                                    <td className="py-3 px-4 text-right text-gray-700">$1,000.00</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 text-gray-700">Hosting Fee</td>
                                    <td className="py-3 px-4 text-gray-700">Annual hosting and maintenance</td>
                                    <td className="py-3 px-4 text-right text-gray-700">1</td>
                                    <td className="py-3 px-4 text-right text-gray-700">$250.00</td>
                                    <td className="py-3 px-4 text-right text-gray-700">$250.00</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        {/* Summary */}
                        <div className="flex justify-end mb-10">
                            <div className="w-1/3">
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="font-medium text-gray-700">Subtotal:</span>
                                    <span className="text-gray-700">${invoice.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="font-medium text-gray-700">Tax (0%):</span>
                                    <span className="text-gray-700">$0.00</span>
                                </div>
                                <div className="flex justify-between py-2 font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${invoice.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Notes */}
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
                            <p className="text-gray-700">Thank you for your business! Payment is due within 15 days.</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t flex justify-end space-x-4">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => {
                            // In a real implementation, this would trigger a PDF download
                            alert("PDF download would start in a real implementation");
                        }}
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};