import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import { addSalesContactsExel, getExel, useSalesContact, usedeleteSalesContactById, useConvert } from "@/services/salesContact.service";
import { toastSuccess, toastError } from "@/utils/toast";
import Modal from 'react-select';
import { generateFilePath } from "@/services/urls.service";

function SalesContactView() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [query, setQuery] = useState("");

    const searchObj = useMemo(() => ({
        ...(query && { query }),
        pageIndex: pageIndex - 1,
        pageSize
    }), [pageIndex, pageSize, query]);

    const { data: SalesContactData } = useSalesContact(searchObj);
    console.log(SalesContactData, "check ContactData")
    const { mutateAsync: deleteContact } = usedeleteSalesContactById();
    const { mutateAsync: convertEnquiry } = useConvert();

    // Handle triggering file input click
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    

    // Handle file selection and upload
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            const response = await addSalesContactsExel(formData);

            console.log(response, "check response")
            toastSuccess("Contacts imported successfully!");

            // Optionally refresh the data
            // You might want to add a refetch function from your useContact hook

        } catch (error) {
            toastError("Failed to import contacts. Please try again.");
            console.error("Import Error:", error);
        } finally {
            setIsUploading(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Handle Export Contacts
    const handleExportContacts = async () => {
        try {
            const { data: response } = await getExel();
            console.log(response, "check response")
            const url = generateFilePath("/" + response.filename);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "contacts.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
            toastSuccess("Sales Contacts exported successfully!");
        } catch (error) {
            toastError("Failed to export contacts. Please try again.");
            console.error("Export Error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete this contact?")) {
                const { data: res } = await deleteContact(id);
                if (res) {
                    toastSuccess(res.message);
                    // Optionally refresh the data
                }
            }
        } catch (error) {
            toastError(error);
        }
    };

    const handleConvertEnquery = async (id: any) => {

        try {
            const { data: res } = await convertEnquiry(id)
            if (res) {
                toastSuccess(res.message)

            }

        }
        catch (error) {
            toastError(error)
        }


    }

    const columns = [
        {
            name: "Name",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row.firstName+ " " +row.lastName}</h6>
                </div>
            ),
            width: "20%",
        },
        {
            name: "Company",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row.company}</h6>
                </div>
            ),
            width: "20%",
        },
        {
            name: "Phone Number",

            selector: (row: any) => (
                <div className="flex gap-1">
                    <FaMobileScreenButton className="text-[#938d8d]" />
                    {row.phone}
                </div>
            ),
            width: "10%",
        },
        {
            name: "Email",
            selector: (row: any) => row.email,
            width: "20%",
        },
        // {
        //     name: "Lead Source",
        //     selector: (row: any) => (
        //         <div className="flex gap-1">
        //             <FaMobileScreenButton className="text-[#938d8d]" />
        //             {row.companyName}
        //         </div>
        //     ),
        //     width: "20%",
        // },
        {
            name: "Action",
            width: "10%",
            selector: (row: any) => (
                <div className="flex items-center gap-3">
                    <Link
                        to={`/add-sales-contact/${row?._id}`}
                        className="p-[6px] text-black-400 text-lg flex items-center"
                    >
                        <FaEye />
                    </Link>
                    <button
                        className="p-[6px] text-black-400 text-lg"
                        onClick={() => handleDelete(row._id)}
                    >
                        <RiDeleteBin6Line />
                    </button>
                </div>
            ),
        },
        {
            name: "Convert to Enquiry",
            width: "10%",
            selector: (row: any) => (
                <div className="flex items-center gap-3">
                    <Link
                        to={`/add-sales-contact/${row?._id}`}
                        className="p-[6px] text-black-400 text-lg flex items-center"
                    >

                    </Link>
                    <button
                        className="p-[6px] text-black-400 text-lg"
                        onClick={() => handleConvertEnquery(row._id)}
                    >
                        <SiConvertio />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container px-6">
            <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
                <div className="search_boxes flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Sales Contact List
                    </h2>

                    <div className="flex items-center justify-start gap-2">
                        <div className="w-full">
                            <input
                                type="search"
                                className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                                placeholder="Search..."
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                            <FaFilter /> Filter
                        </button>

                        <button
                            className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                            onClick={handleExportContacts}
                        >
                            <FaFileExport /> Export
                        </button>

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
                            {isUploading ? 'Importing...' : 'Import'}
                        </button>

                        <button
                            onClick={() => navigate("/add-sales-contact")}
                            className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                        >
                            <FaPlus />
                            <span>New Sales Contact</span>
                        </button>
                    </div>
                </div>

                <ReactTable
                    data={SalesContactData?.data}
                    columns={columns}
                    loading={false}
                    totalRows={SalesContactData?.total}
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

export default SalesContactView;