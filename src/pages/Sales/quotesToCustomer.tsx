import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import {
  FaEdit,
  FaTrash,
  FaFilter,
  FaFileExport,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { checkPermissionsForButtons } from "@/utils/permission";
import {
  useQuotesToCustomer,
  usedeleteQuotesToCustomerById,
} from "@/services/quotesToCustomer.service";
import { toastError, toastSuccess } from "@/utils/toast";

interface IQuotesToCustomer {
  _id: string;
  quotesId: string;
  customerName: string;
  serviceType: string[];
  amount: number;
  status:string;
  totalAmount: number;
}

function QuotesForCustomer() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Quotes for Customer");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  useEffect(() => {
    // This will trigger a refetch whenever this component is rendered/re-rendered
    refetch();
  }, [location.pathname]);

  const {
    data: quotesToCustomerData,
    isLoading,
    refetch,
  } = useQuotesToCustomer(searchObj);
  const { mutateAsync: deleteQuote } = usedeleteQuotesToCustomerById();

  const handleDelete = async (id: string) => {
    try {
      const { data: res } = await deleteQuote(id);
      toastSuccess(res.message || "Quote deleted successfully");
      refetch(); // Refetch the data to update the table
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "Quotes Id",
      selector: (row: IQuotesToCustomer & { _id: string }) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.quotesId || "N/A"}</h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Customer Name",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.customerName || "N/A"}</h6>
        </div>
      ),
      width: "16%",
    },
    {
      name: "Service",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex justify-around gap-1 flex-col">
          {(row.serviceType || []).map((service: string, index: number) => (
            <div
              key={index}
              className="border border-b-purple-300 py-1 px-3 text-center  bg-gray-200 rounded-md"
            >
              {service}
            </div>
          ))}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Amount",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.amount || 0}</h6>
        </div>
      ),
      width: "12%",
    },
    {
      name: "Status",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.status || "N/A"}</h6>
        </div>
      ),
      width: "15%",
    },
    {
      name: "Total Amount",
      selector: (row: IQuotesToCustomer) => (
        <div className="flex gap-1  flex-col">
          <h6>{row.totalAmount || "N/A"}</h6>
        </div>
      ),
      width: "12%",
    },
    {
      name: "Edit",
      width: "7%",
      selector: (row: IQuotesToCustomer & { _id: string }) => (
        <button
          onClick={() => navigate(`/addQuotesToCustomer/${row._id}`)}
          className="text-black-500 text-lg  hover:bg-black-100 rounded-full transition duration-200 "
        >
          <FaEdit />
        </button>
      ),
    },
    {
      name: "Delete",
      width: "10%",
      selector: (row: IQuotesToCustomer & { _id: string }) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-black-500 text-lg  hover:bg-black-100 rounded-full transition duration-200"
        >
          <FaTrash />
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPageIndex(1);
  };

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            All Quotes for Customer List
          </h2>

          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                value={query}
                onChange={handleSearchChange}
              />
            </div>
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFileExport /> Export
            </button>

            {canCreate && (
              <button
                onClick={() => navigate("/addQuotesToCustomer")}
                className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
              >
                <FaPlus />
                <span>New Quotes</span>
              </button>
            )}
          </div>
        </div>

        <ReactTable
          data={quotesToCustomerData?.data || []}
          columns={filterColumns}
          loading={isLoading}
          totalRows={quotesToCustomerData?.total || 0}
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

export default QuotesForCustomer;
