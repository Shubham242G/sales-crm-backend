import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import {
  useCustomer,
  usedeleteCustomerById,
  useAddCustomer,
  useUpdateCustomerById,
} from "@/services/customer.service";
import { toastError, toastSuccess } from "@/utils/toast";
// import { getPermissions } from "@/utils/permission";
import { checkPermissionsForButtons } from "@/utils/permission";

function CustomerSales() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ledger details modal

  // const permissions = getPermissions();
  // const canCreateCustomer = permissions.some(
  //   (Permission) =>
  //     Permission.routeName === "Customers" && Permission.permissions.create
  // );

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Customers");

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

  const { data: CustomerData } = useCustomer(searchObj);
  console.log(CustomerData, "check customerData");
  const { mutateAsync: deleteCustomer } = usedeleteCustomerById();
  const { mutateAsync: updateCustomer } = useUpdateCustomerById();

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this contact?")) {
        const { data: res } = await deleteCustomer(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateCustomer({ id, ...data });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "Customer Type",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.customerType}</h6>
        </div>
      ),
      width: "16%",
    },

    {
      name: "Customer Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.companyName}</h6>
        </div>
      ),
      width: "16%",
    },

    {
      name: "Display Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.displayName}</h6>
        </div>
      ),
      width: "16%",
    },

    {
      name: "Phone Number",
      selector: (row: any) => (
        <div className="flex gap-1">
          <FaMobileScreenButton className=" text-[#938d8d]" />
          {row.phoneNumber}
        </div>
      ),
      width: "16%",
    },

    {
      name: "Email",
      selector: (row: any) => row.email,
      width: "16%",
    },
    // {
    //   name: "Service",
    //   selector: (row: any) => (
    //     <>
    //       <div className="flex justify-around">
    //         {row.service.map((e: any, index: number) => (
    //           <div
    //             key={index}
    //             className="border border-b-purple-300 py-1 px-3 bg-gray-200 rounded-md"
    //           >
    //             {e.name}
    //           </div>
    //         ))}
    //       </div>
    //     </>
    //   ),
    //   width: "20%",
    // },
    // {
    //   name: "Lead Source",
    //   selector: (row: any) => (
    //     <div className="flex gap-1">
    //       <FaMobileScreenButton className=" text-[#938d8d]" />
    //       {row.company}
    //     </div>
    //   ),
    //   width: "20%",
    // },
    {
      name: "Edit",
      width: "10%",
      selector: (row: any) =>
        (canView || canUpdate) && (
          <div className="flex items-center gap-3">
            <Link
              to={`/add-customer/${row?._id}`}
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleDelete(row._id)}
              className="p-[6px] text-black-400 text-lg"
              title="Delete Customer"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        ),
    },
  ];

  // Sample data
  // const data = [
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "banquet" }, { name: "Event" }],
  //   },
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "Event" }, { name: "Banquet" }],
  //   },
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "banquet" }, { name: "Event" }],
  //   },
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "Event" }, { name: "Banquet" }],
  //   },
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "banquet" }, { name: "Event" }],
  //   },
  //   {
  //     name: "Ajay Kumar",
  //     contactno: "9968237063",
  //     email: "test@test.com",
  //     company: "Google",
  //     service: [{ name: "hotel" }, { name: "Event" }, { name: "Banquet" }],
  //   },
  // ];

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
              Customer List
            </h2>

            {/* Search and Buttons on the Right */}
            <div className="flex items-center justify-start gap-2">
              {/* Search Box */}
              <div className="w-full">
                <input
                  type="search"
                  className="rounded-sm w-full border px-4 border-gray-300 py-2  text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                  placeholder="Search..."
                />
              </div>
              {/* Buttons */}
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFilter /> Filter
              </button>
              <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
                <FaFileExport /> Export
              </button>

              {canCreate && (
                <button
                  onClick={() => navigate("/add-customer")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Customer</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={CustomerData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={CustomerData?.total}
            // loading={loading}
            // totalRows={data.length}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handleRowsPerPageChange}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>
    </>
  );
}

export default CustomerSales;
