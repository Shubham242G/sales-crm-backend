import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { toastError, toastSuccess } from "@/utils/toast";
import {
  useDepartmentMaster,
  usedeleteDepartmentMasterById,
  IDepartmentMaster,
} from "@/services/departmentMaster.service";
import { pageIndex, pageSize } from "@/common/constant.common";
import { checkPermissionsForButtons } from "@/utils/permission";

function DepartmentMasterListView() {
  const navigate = useNavigate();
  const { data: DepartmentData } = useDepartmentMaster({
    pageIndex: 0,
    pageSize: 1000,
  });
  const { mutateAsync: deleteDepartment } = usedeleteDepartmentMasterById();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons("Add Department");
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this Department?")) {
        const { data: res } = await deleteDepartment(id);

        if (res) {
          toastSuccess(res.message);
          navigate("/departmentMasterView");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  // ledger details modal
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };

  const columns = [
    {
      name: "Department Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.department}</h6>
        </div>
      ),
      width: "25%",
    },
    {
      name: "Sub Department Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.subDepartment}</h6>
        </div>
      ),
      width: "25%",
    },

    {
      name: "Date",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>
            {row.createdAt
              ? format(new Date(row.createdAt), "MMM dd, yyyy")
              : "-"}
          </h6>
        </div>
      ),
      width: "20%",
    },
    {
      name: "Edit",
      width: "15%",
      selector: (row: IDepartmentMaster) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/departmentMaster/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "15%",
      selector: (row: IDepartmentMaster) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDelete(row._id)}
            className="p-[6px] text-black-400 text-lg flex items-center"
          >
            <RiDeleteBin6Line />
          </button>
        </div>
      ),
    },
  ];

  // Sample data

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
              All Department List
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
                  onClick={() => navigate("/departmentMaster")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Department</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={DepartmentData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={DepartmentData?.total}
            onChangePage={setPageIndex}
            onChangeRowsPerPage={setPageSize}
            paginationRowsPerPageOptions={[5, 10, 20]}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
        </div>
      </div>
    </>
  );
}

export default DepartmentMasterListView;
