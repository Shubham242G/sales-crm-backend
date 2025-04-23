import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiDeleteBin6Line, RiH6 } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import {
  useVendorById,
  useVendor,
  usedeleteVendorById,
  useUpdateVendorById,
  useConvertVendorToSalesContact,
  useBulkUpload,
} from "@/services/vendor.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { SiConvertio } from "react-icons/si";

function VendorList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

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

  const { data: VendorData, refetch } = useVendor(searchObj);

  const { mutateAsync: deleteVendor } = usedeleteVendorById();
  const { mutateAsync: updateVendor } = useUpdateVendorById();
  const { mutateAsync: convertVendorToSalesContact } =
    useConvertVendorToSalesContact();

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Vendors");

  const { mutateAsync: BulkUpload } = useBulkUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Import button click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const { data: response } = await BulkUpload(formData);
      if (response.data) {
        toastSuccess(`${response.data.successCount} cities imported successfully!
              ${response.data.errorCount} cities failed to import. Please check the file for errors.
              ${response.data.errorArr.map((item: any) => item.error)}
              `);
      }
    } catch (error) {
      toastError(error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteVendor(id);
        if (res) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateVendor({
        id: id,
        obj: data,
      });
      if (res) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleConvertToSalesContact = async (id: string) => {
    try {
      const { data: res } = await convertVendorToSalesContact(id);
      if (res?.message) {
        toastSuccess(res.message);
      }
    } catch (error) {
      toastError("Failed to convert vendor to Sales Contact.");
    }
  };

  const columns = [
    {
      name: "Vendor Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.vendor?.firstName}</h6>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Company",
      selector: (row: any) => (
        <div className="flex gap-1 ">
          <h6>{row.vendor?.companyName}</h6>
          
        </div>
      ),
      width: "15%",
    },
    {
      name: "Location",
      selector: (row: any) => (
        <div className="flex gap-1 whitespace-pre-wrap">
          <h6>{row?.location?.state}</h6>
        </div>
      ),
      width: "12%",
    },
    {
      name: "Phone",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className="text-[#938d8d]" />
          {row.vendor?.phoneNumber}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Email",
      selector: (row: any) => ( <h6>{row.vendor?.email}</h6> ),
      width: "23%",
    },
    {
      name: "Update",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-4">
          <Link to={`/add-vendor/${row?._id}`} title="View Vendor">
            <FaEye className="text-lg text-gray-600 hover:text-orange-500 ml-4" />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleDelete(row._id)}
            className="text-lg  text-gray-600 hover:text-black ml-2"
            title="Delete Vendor"
          >
            <RiDeleteBin6Line className="ml-2" />
          </button>
        </div>
      ),
    }
    // {
    //   name: "Convert to Sales Contact",
    //   width: "14%",
    //   selector: (row: any) => (
    //     <div className="flex justify-center">
    //       <button
    //         type="button"
    //         onClick={() => handleConvertToSalesContact(row._id)}
    //         className="text-lg text-blue-500 hover:text-blue-700"
    //         title="Convert to Sales Contact"
    //       >
    //         <SiConvertio />
    //       </button>
    //     </div>
    //   ),
    // },
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

  useEffect(() => {
    refetch();
  }, [searchObj, refetch]);

  // Sample data

  return (
    <>
      {/* <Breadcrumb
        pageTitle="Customer Ledger"
        pageCategory="All Ledger"
        activePage="All Customer Ledger"
        previouspageurl="/"
        addbuttn={true}
        withLink={true}
        addbuttnurl="/add-ledger"
        excelbuttn={false}
        filterbuttn={false}
      /> */}

      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
          <div className="search_boxes flex justify-between items-center">
            {/* Heading on the Left */}
            <h2 className="text-xl font-semibold text-gray-800">
              All Vendor List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box (updated to filter by location.state) */}
              <div className="w-full">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search by Location (State)..."
                />
              </div>
              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              {/* Import Button */}
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
                onClick={handleImportClick}
              >
                <FaFileImport />
                Import
              </button>



              {/* Hidden File Input for Import */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />

              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>


              {canCreate && (
                <button
                  onClick={() => navigate("/add-vendor")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Vendor</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            
            data={VendorData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={VendorData?.total}
            onChangeRowsPerPage={setPageSize}
            onChangePage={setPageIndex}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
        </div>
      </div>

    </>
  );
}

export default VendorList;
