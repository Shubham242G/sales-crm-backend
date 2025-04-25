import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus, FaFileImport } from "react-icons/fa";
import {
  useZohoCustomers,
  useZohoCustomerById,
  useSyncZohoCustomers,
  updateCustomerById,
  deleteCustomerById
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkPermissionsForButtons } from "@/utils/permission";
import { useUpdateQuotesToCustomerById } from "@/services/quotesToCustomer.service";


function CustomerSales() {
  const navigate = useNavigate();
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Customers");

  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");



  const searchObj = useMemo(() => ({
    ...(query && { query }),
    pageIndex: pageIndex - 1,
    pageSize,
  }), [pageIndex, pageSize, query]);

  console.log(searchObj, "searchObj")

  const { data: CustomerData } = useZohoCustomers(searchObj);
  const { mutateAsync: syncData } = useSyncZohoCustomers();

  const handleSyncCustomer = async () => {
    try {
      const result = await syncData()
      toastSuccess(`Successfully synced! Created: ${result.data.data.createdCount}, Updated: ${result.data.data.updatedCount}`);
      // Refresh the data after sync
    } catch (error) {
      toastError("Failed to sync invoices");
    }
  };



  const { id } = useParams<{ id: string }>();

  const { mutateAsync: updateCustomer } = updateCustomerById();
  const { mutateAsync: deleteCustomer } = deleteCustomerById()

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteCustomer(id);
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
      const { data: res } = await updateCustomer({ id, ...data });
      if (res) toastSuccess(res.message);
    } catch (error) {
      toastError(error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => fileInputRef.current?.click();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPageIndex(1); // reset to first page when searching
    }
  };

  const columns = [
    {
      name: "Customer Type",
      selector: (row: any) => <h6>{row.contactType}</h6>,
      width: "16%",
    },
    {
      name: "Customer Name",
      selector: (row: any) => <h6>{row.companyName}</h6>,
      width: "16%",
    },
    {
      name: "Display Name",
      selector: (row: any) => <h6>{row.displayName}</h6>,
      width: "16%",
    },
    {
      name: "Branch location",
      selector: (row: any) => (
        <div className="flex gap-1">
          {row.branchName}
        </div>
      ),
      width: "16%",
    },
    {
      name: "Level of Enquiry",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col p-2 rounded-md  ${row.status === "Active"
            ? "bg-green-200 text-white-100"
            : "bg-red-300 text-red-600"}`}
        >
          <h6>{row.status}</h6>
        </div>
      ),
      width: "10%",
    },
    {
      name: "Edit",
      width: "10%",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className="flex items-center gap-3">
            <Link
              to={`/add-customer/${row._id}`}
              className="p-[6px] text-black-400 text-lg flex items-center"
              onClick={() => handleUpdate(row._id, row.data)}
            >
              <FaEye />
            </Link>
          </div>
        ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: any) =>
        canDelete && (
          <button
            onClick={() => handleDelete(row._id)}
            className="p-[6px] text-black-400 text-lg"
            title="Delete Customer"
          >
            <RiDeleteBin6Line />
          </button>
        ),
    },
  ];

  const filterColumns = columns.filter((item) => {
    if (item.name === "Delete") return canDelete;
    if (item.name === "Edit") return canView || canUpdate;
    return true;
  });

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Customer List</h2>
          <div className="flex items-center gap-2">
            <input
              type="search"
              className="rounded-sm border px-4 py-2 placeholder-txtcolor focus:outline-none focus:border-buttnhover"
              placeholder="Search..."
              value={query}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Export
            </button>
            <button onClick={handleSyncCustomer} className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Sync
            </button>
            <button
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
              onClick={handleImportClick}
            >
              <FaFileImport /> Import
            </button>
            {canCreate && (
              <button
                onClick={() => navigate("/add-customer")}
                className="flex items-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500"
              >
                <FaPlus /> <span>New Customer</span>
              </button>
            )}
          </div>
        </div>
        <ReactTable
          data={CustomerData?.data}
          columns={filterColumns}
          loading={false}
          totalRows={CustomerData?.total}
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

export default CustomerSales;


