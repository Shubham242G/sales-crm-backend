import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import {
  addpurchaseContactsExel,
  getExel,
  usepurchaseContact,
  usedeletepurchaseContactById,
  useConvert,
} from "@/services/purchaseContact.service";
import { toastSuccess, toastError } from "@/utils/toast";
import Modal from "react-select";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";

function PurchaseContactView() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { canCreate, canUpdate, canDelete, canView } =
    checkPermissionsForButtons("Purchase Contacts");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const { data: purchaseContactData } = usepurchaseContact(searchObj);

  const { mutateAsync: deletePurchaseContact } = usedeletepurchaseContactById();
  const { mutateAsync: convertPurchaseEnquiry } = useConvert();

  // Handle triggering file input click
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
      const formData = new FormData();
      formData.append("file", file);

      const response = await addpurchaseContactsExel(formData);

      toastSuccess("Pruchase Contacts imported successfully!");

      // Optionally refresh the data
      // You might want to add a refetch function from your useContact hook
    } catch (error) {
      toastError("Failed to import Purchase contacts. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Export Contacts
  const handleExportContacts = async () => {
    try {
      const { data: response } = await getExel();
      const url = generateFilePath("/" + response.filename);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contacts.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastSuccess("Purchase Contacts exported successfully!");
    } catch (error) {
      toastError("Failed to export contacts. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deletePurchaseContact(id);
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
      const { data: res } = await convertPurchaseEnquiry(id);
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "first Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>
            {row.salutation}.{row.firstName}
          </h6>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Last Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.lastName}</h6>
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
      name: "Edit",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/add-sales-contact/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button
            className="p-[6px] text-black-400 text-lg"
            onClick={() => handleDelete(row._id)}
          >
            <RiDeleteBin6Line className="hover:text-red-500" />
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
            to={`/add-purchase-contact/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          ></Link>
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
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Purchase Contact List
          </h2>

          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-md w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
 {/* <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button> */}

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
              {isUploading ? "Importing..." : "Import"}
            </button>

            {canCreate && (
              <button
                onClick={() => navigate("/add-purchase-contact")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Purchase Contact</span>
              </button>
            )}
          </div>
        </div>

        <ReactTable
          data={purchaseContactData?.data}
          columns={filterColumns}
          loading={false}
          totalRows={purchaseContactData?.total}
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

export default PurchaseContactView;
