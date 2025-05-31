import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFilter, FaFileExport, FaPlus } from "react-icons/fa";
import { addDailyActivityReportViewExcel, getDailyActivityReportViewExcel, useDailyActivityReport, useDeleteDailyActivityReportById, useUpdateDailyActivityReportById } from "@/services/dailyActivityReport.service";
import { toastError, toastSuccess } from "@/utils/toast";
import NewTable from "@/_components/ReuseableComponents/DataTable/newTable";
import { FiEdit } from "react-icons/fi";

function DailyActivityReport() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);



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

    const { data: DailyActivityReport, isLoading } = useDailyActivityReport(
        searchObj
    );
    const { mutateAsync: deleteDailyActivityReport } = useDeleteDailyActivityReportById();




    const handleDelete = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete this contact?")) {
                const { data: res } = await deleteDailyActivityReport(id);
                if (res) {
                    toastSuccess(res.message);
                    // Optionally refresh the data
                }
            }
        } catch (error) {
            toastError(error);
        }
    };

    // State for action dropdown
    const [isOpenAction, setIsOpenAction] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    // ledger details modal
    const [showLedgerDetailsModal, setShowLedgerDetailsModal] = useState(false);
    const handleLedgerDetailsModal = () => {
        setShowLedgerDetailsModal(true);
    };
    const columns = [
        // {
        //     name: "Sales Person Name",
        //     selector: (row: any) => (
        //         <div className="flex gap-1 flex-col">
        //             <h6>{ row.salesPerson}</h6>
        //         </div>
        //     ),
        //     width: "10%",
        // },

        {
            name: "Date",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row.dateOfVisit}</h6>
                </div>
            ),
            width: "10%",
        },
        {
            name: "Customer Visited",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row?.customerName?.label}</h6>
                </div>
            ),
            width: "20%",
        },
        {
            name: "Purpose Of Visit",
            selector: (row: any) => (
                <div className="flex gap-1 flex-col">
                    <h6>{row.purposeOfVisit}</h6>
                </div>
            ),
            width: "20%",
        },
        // {
        //     name: "Visit Outcome",
        //     selector: (row: any) => (
        //         <div className="flex gap-1 flex-col">
        //             <h6>{row.visitOutcome}</h6>
        //         </div>
        //     ),
        //     width: "20%",
        // },
        {
            name: "Status",
            selector: (row: any) => (
                <div
                    className={`flex gap-1 flex-col p-2 rounded-md text-white ${row.status === "Pending"
                        ? "bg-yellow-200 text-yellow-500"
                        : row.status === "Completed"
                            ? "bg-green-400 text-green-600"
                            : "bg-red-200 text-red-600"
                        }`}
                >
                    <h6>{row.status}</h6>
                </div>
            ),
            width: "10%",
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
        //   width: "30%",
        // },

          {
              name: "Actions",
              width: "20px",
              selector: (row: any) => (
                <div className="">
                  <button
                    type="button"
        
                    title="More Actions"
                    onClick={(e) => { setIsOpenAction(selectedRowId === row._id ? !isOpenAction : true), setSelectedRowId(row._id) }}
                  >
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 "><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,1)"><path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path></svg></span>
                  </button>
                  {selectedRowId === row._id && (isOpenAction) && (
                    <div className="absolute bg-white z-10 shadow-lg rounded-md overflow-hidden -ml-10 border">
        
                       <Link
                           to={(`/add-DailyActivityReport/${row._id}`)}
                           className="flex items-center text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                           title="View Vendor"
                         >
                           <FiEdit className="text-xs" />
                           Edit
                         </Link> 
                      <button
                        type="button"
                        onClick={() => handleDelete(row._id)}
                        className="flex items-center  text-gray-600 hover:bg-blue-500 hover:text-white px-4 border-b py-2 gap-2"
                        title="Delete Vendor"
                      >
                        <RiDeleteBin6Line className="text-xs" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ),
            },
        // {
        //     name: "Action",
        //     width: "10%",
        //     selector: (row: any) => (
        //         <div className="flex items-center gap-3">
        //             <button
        //                 type='button'
        //                 className="p-[6px] text-black-400 text-lg flex items-center"
        //                 onClick={() => navigate(`/add-DailyActivityReport/${row._id}`)}
        //             >
        //                 <FaEye />
        //             </button>

        //             {/* </button> */}
        //             <Link
        //                 to="/DailyActivityReport"
        //                 className=" p-[6px] text-Black-400 text-lg"
        //             >
        //                 <RiDeleteBin6Line onClick={() => handleDelete(row._id)} />
        //             </Link>
        //         </div>
        //     ),
        // },
    ];

const [tickRows, setTickRows] = useState([]);

 const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    setTickRows(selectedRows.map((row: any) => row._id));
  };


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

            {/* <div className="container p-6 mt-14">
                <div className="bg-white table_container rounded-xl ">
                    <div className="search_boxes flex justify-between items-center">
                        {/* Heading on the Left */}
                        {/* <h2 className="text-xl font-semibold text-gray-800">
                            All Daily Activity List
                        </h2> */}

                        {/* Search and Buttons on the Right */}
                        {/* <div className="flex items-center justify-start gap-2">
                            Search Box
                            <div className="w-full">
                                <input
                                    type="search"
                                    className="rounded-md w-full border px-3 text-sm border-gray-300 py-1.5 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                                    placeholder="Search..."
                                />
                            </div>
                            {/* Buttons */}
                            {/* <button className="flex items-center gap-1  px-3 py-1.5 rounded-md  text-gray-700 border text-sm border-gray-300">
                                <FaFilter /> Filter
                            </button>
                            <button className="flex items-center gap-1  px-3 py-1.5 rounded-md text-sm text-gray-700 border border-gray-300">
                                <FaFileExport /> Export
                            </button>
                            <button
                                onClick={() => navigate("/add-DailyActivityReport")}
                                className="flex w-full items-center justify-center gap-1 px-3 py-1.5 text-sm text-white rounded-md bg-orange-500 border border-gray-300"
                            >
                                <FaPlus />
                                <span>New Report</span>
                            </button>
                        </div> */}
                    
                    {/* React Table */}
                    {/* <div className="mt-5"> */}
                        {/* <ReactTable
                            data={DailyActivityReport.data}
                            columns={columns}
                            loading={false}
                            totalRows={0}
                            selectableRows={true}
                            onChangePage={setPageIndex}
                            onChangeRowsPerPage={setPageSize}
                            page={pageIndex}
                            isServerPropsDisabled={false}
                            rowsPerPageText={pageSize}
                            paginationRowsPerPageOptions={[5, 10, 20]}
                        />
                    </div>

                </div>
            </div> */}
            <NewTable

                data={DailyActivityReport.data}
                columns={columns}
                loading={false}
                totalRows={0}
                selectableRows={true}
                onChangePage={setPageIndex}
                onChangeRowsPerPage={setPageSize}
                page={pageIndex}
                isServerPropsDisabled={false}
                rowsPerPageText={pageSize}
             
                onSelectedRowsChange={handleChange}
                className={"leadtable"}
                //new fields
                TableName={" All Daily Activity List"}
                TableGetAllFunction={useDailyActivityReport}
                ExcelExportFunction={getDailyActivityReportViewExcel}
                TableAddExcelFunction={addDailyActivityReportViewExcel}
                RouteName={"Daily Activity Report View"}
                AddButtonRouteName={"/DailyActivityReport"}
                AddButtonName={"New Report"}
                placeholderSearch={"Search by report"}
            />
        </>
    );
}

export default DailyActivityReport;
