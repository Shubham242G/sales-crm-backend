import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import {
  ICategory,
  useCategory,
  usedeleteCategoryById,
} from "@/services/category.service";
import { format } from "date-fns";
import { toastError, toastSuccess } from "@/utils/toast";
import { usedeleteHotelById, useHotel } from "@/services/hotel.service";
import { pageIndex, pageSize } from "@/common/constant.common";
import { checkPermissionsForButtons } from "@/utils/permission";
import { filter } from "lodash";

function HotelList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const { canCreate, canUpdate, canDelete, canView } =
    checkPermissionsForButtons("Add Hotel");

  const searchObj = useMemo(() => {
    let obj: any = {};

    if (query && query != "") {
      obj.query = query;
    }
    obj.pageIndex = pageIndex - 1;
    obj.pageSize = pageSize;
    return obj;
  }, [pageIndex, pageSize, query]);
  const handlePerRowsChange = (newPerPage: any) => {
    setPageSize(newPerPage);
  };

  const handlePageChange = (newPage: any) => {
    setPageIndex(newPage);
  };
  const { data: hotelData } = useHotel(searchObj);
  const { mutateAsync: deleteHotel } = usedeleteHotelById();
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleDelete = async (id: string) => {
    try {
      if (confirm("Are you sure you want to delete this Hotel?")) {
        const { data: res } = await deleteHotel(id);

        if (res) {
          toastSuccess(res.message);
          navigate("/hotel");
        }
      }
    } catch (error) {
      toastError(error);
    }
    // if (confirm("Are you sure you want to delete this Hotel?")) {
    //     deleteHotel(id, {
    //         onSuccess: () => {
    //             toastSuccess("Hotel deleted successfully!");
    //             // refetch(); // Refresh the data
    //         },
    //         onError: (error: any) => {
    //             console.error("Error deleting Hotel:", error.message);
    //             toastError("Failed to delete Hotel.");
    //         },
    //     });
    // }
  };

  // ledger details modal
  console.log(hotelData?.data, "hotelData");
  const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
  const handleLedgerDetailsModal = () => {
    setShowLedgerDetailsModal(true);
  };
  const columns = [
    {
      name: "Hotel Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.name}</h6>
        </div>
      ),
      width: "40%",
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
      width: "20%",
      selector: (row: ICategory) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/hotel/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "20%",
      selector: (row: ICategory) => (
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
              All Hotel List
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
                  onClick={() => navigate("/hotel")}
                  className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
                >
                  <FaPlus />
                  <span>New Hotel</span>
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <ReactTable
            data={hotelData?.data}
            columns={filterColumns}
            loading={false}
            totalRows={hotelData?.total}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            page={pageIndex}
            rowsPerPageText={pageSize}
            isServerPropsDisabled={false}
          />
        </div>
      </div>
    </>
  );
}

export default HotelList;
