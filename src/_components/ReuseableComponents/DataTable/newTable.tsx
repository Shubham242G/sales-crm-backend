import React, { useMemo, useRef, useState } from "react";
import { ReactTable } from "./ReactTable";
import { getTableHeadUtilityClass, Switch } from "@mui/material";
import {
  FaColumns,
  FaFileExport,
  FaFileImport,
  FaPlus,
  FaTasks,
} from "react-icons/fa";
import { Table } from "lucide-react";
import { toastError, toastSuccess } from "@/utils/toast";
import { IoMdArrowDropdown } from "react-icons/io";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";
import { Navigate, useNavigate } from "react-router-dom";

const NewTable = (props: any) => {
  const {
    data,
    columns,
    loading,
    totalRows,
    onChangeRowsPerPage,
    onChangePage,
    page,
    rowsPerPageText,
    isServerPropsDisabled,
    selectableRows,
    onSelectedRowsChange,
    className,
    TableName,

    TableGetAllFunction,
    ExcelExportFunction,
    TableAddExcelFunction,
    RouteName,
    AddButtonRouteName,
    AddButtonName,
    placeholderSearch = "Search Here",
  } = props;

  const navigate = useNavigate();

  const [advancedSearchParams, setAdvancedSearchParams] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchObj = useMemo(
    () => ({
      ...(searchQuery && { query: searchQuery }),
      ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, searchQuery, advancedSearchParams]
  );

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = ({ selectedRows }: any) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
    // setTickRows(selectedRows.map((row: any) => row._id));
  };

  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const visibleColumnObj = columns.reduce((obj: any, column: any) => {
    obj[column.name] = true;
    return obj;
  }, {} as Record<string, boolean>);
  const [visibleColumns, setVisibleColumns] = useState(visibleColumnObj);

  const resetColumnVisibility = () => {
    setVisibleColumns(
      columns.reduce((obj: any, column: any) => {
        obj[column.name] = true;
        return obj;
      }, {} as Record<string, boolean>)
    );
  };

  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns((prevVisibleColumns: any) => ({
      ...prevVisibleColumns,
      [columnName]: !prevVisibleColumns[columnName],
    }));
  };

  const ColumnSelector = () => (
    <div className="absolute z-50 bg-white shadow-lg p-4 rounded-md mt-2   border border-gray-200 right-0 w-72">
      <div className="flex flex-col gap-2 ]">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h3 className="font-medium">Customize Columns</h3>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={resetColumnVisibility}
          >
            Reset to Default
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {columns.map((column: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <span className="text-sm">{column.name}</span>
              <Switch
                checked={
                  visibleColumns[column.name as keyof typeof visibleColumns]
                }
                onChange={() => toggleColumnVisibility(column.name)}
                size="small"
                color="primary"
              />
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-end">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            onClick={() => setShowColumnSelector(false)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleColumnsArray = columns.filter(
    (column: any) => visibleColumns[column.name as keyof typeof visibleColumns]
  );

  const [isOpen, setIsOpen] = useState(false);

  // Apply fixed widths to visible columns
  const filteredColumns = visibleColumnsArray;

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const [tickRows, setTickRows] = useState<string[]>([]);

  const [isOpenAssign, setIsOpenAssign] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showExportCustomize, setShowExportCustomize] = useState(false);
  const handleAssignTask = async () => {
    try {
      if (tickRows.length === 0) {
        toastError("Please select at least one lead to assign.");
        return;
      }

      setIsOpenAssign(true);
    } catch (error) {
      toastError("An error occurred while assigning task. Please try again.");
    }
  };

  const handleExportEnquiries = async (
    format: string = "xlsx",
    fields?: string[]
  ) => {
    try {
      setIsExporting(true);

      // Prepare export parameters
      const exportParams = {
        ...(searchQuery && { query: searchQuery }),
        ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
        format,
        ...(fields && { fields }), // Include selected fields if provided
      };

      const { data: response } = await ExcelExportFunction(exportParams);

      // Create download link
      const url = generateFilePath("/" + response.filename);
      const link = document.createElement("a");
      link.href = url;

      // Set file name with appropriate extension
      const fileExtension =
        format === "csv" ? "csv" : format === "pdf" ? "pdf" : "xlsx";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.setAttribute(
        "download",
        `leads_export_${timestamp}.${fileExtension}`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      toastSuccess("Leads exported successfully!");
    } catch (error) {
      toastError("Failed to export leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Check for allowed file extensions
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await TableAddExcelFunction(formData);

      // Check if the upload was successful
      if (response.status === 200) {
        toastSuccess("Leads imported successfully!");
        refetch();
      } else {
        toastError("Error importing file. Please try again.");
      }
    } catch (error: any) {
      toastError("An error occurred during import. Please try again.");
    } finally {
      setIsUploading(false);

      // Reset the file input value after upload attempt
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons(RouteName);

  const { data: TableData, refetch } = TableGetAllFunction(searchObj);

  return (
    <>
      <div className="container top-0 bg-white sticky ">
        <div className=" table_container rounded-xl px-4    ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm -ml-4 -mt-5 mb-4">
            {/* Heading on the Left */}
            <h2 className="text-lg font-semibold text-gray-800 ">
              {TableName}
            </h2>
            {/* Search Input */}
            <div className="flex items-center w-full sm:w-auto flex-grow">
              <input
                type="search"
                className="rounded-md border px-3 py-1.5 w-[200px] border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500"
                placeholder={placeholderSearch}
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    refetch();
                  }
                }}
              />
              <div
                className="ml-2 cursor-pointer"
                onClick={() => refetch()}
              ></div>
            </div>

            {/* Columns Button */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 text-sm"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
              >
                <FaColumns className="text-xs" /> Columns
              </button>
              {showColumnSelector && <ColumnSelector />}
            </div>
            {/* Advanced Search */}
            <button
              onClick={handleModalOpen}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
            >
              Advanced Search
            </button>

            {/* Assign Lead */}
            {TableName === "Leads List" && (
              <button
                onClick={handleAssignTask}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
              >
                <FaTasks className="text-xs" /> Assign Lead
              </button>
            )}

            {TableName === "Enquiry List" && (
              <button
                className=" flex items-center gap-1  px-3 py-1.5  text-sm rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
                onClick={handleAssignTask}
              >
                <span className="whitespace-nowrap text-sm">
                  {" "}
                  Assign To Ops Team{" "}
                </span>
              </button>
            )}
            {/* Export */}
            <div className="relative" id="exportDropdown">
              <button
                className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-gray-700 border border-gray-300 ${
                  isExporting ? "opacity-75 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (!isExporting) setShowExportOptions(!showExportOptions);
                }}
                disabled={isExporting}
              >
                <FaFileExport />
                {isExporting ? "Exporting..." : "Export"}
                <IoMdArrowDropdown className="ml-1" />
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <ul className="py-1">
                    <li
                      className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("xlsx");
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5v2zM3 12v-2h2v2H3zm0 1h2v2H4a1 1 0 0 1-1-1v-1zm3 2v-2h3v2H6zm4 0v-2h2v1a1 1 0 0 1-1 1h-1zm2-3h-2v-2h2v2zm-3 0H6v-2h3v2zm-4-3h10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v5zm4 0H3V5h2v1h1V5h3v4z" />
                        </svg>
                      </span>
                      Export as Excel
                    </li>
                    <li
                      className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("csv");
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="blue"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.5 12.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L4.5 3.707V12.5zm-2-6a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm6 0a.5.5 0 0 1-.5.5H7a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm2 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm-4-3a.5.5 0 0 1-.5.5H3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-3 3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5zm-6 3a.5.5 0 0 1-.5.5H1a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zm8 0a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 .5.5zm0-3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z" />
                        </svg>
                      </span>
                      Export as CSV
                    </li>
                    <li
                      className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("pdf");
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="red"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                          <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" />
                        </svg>
                      </span>
                      Export as PDF
                    </li>
                    <li
                      className=" px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        setShowExportCustomize(true);
                      }}
                    >
                      <span className="w-6 h-6 mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                      </span>
                      Customize Export
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Import */}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <FaFileImport />
              {isUploading ? "Importing..." : "Import"}
            </button>
            {/* Add New Lead */}
            {canCreate && (
              <button
                onClick={() => navigate(AddButtonRouteName)}
                className="flex items-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 text-sm"
              >
                <FaPlus className="text-xs" /> {AddButtonName}
              </button>
            )}
          </div>
          {/* React Table */}
          <div className="overflow-x-auto -ml-8 -mr-2">
            <ReactTable
              data={TableData.data}
              columns={filteredColumns}
              loading={loading}
              totalRows={TableData.total}
              onChangeRowsPerPage={setPageSize}
              onChangePage={setPageIndex}
              page={page}
              rowsPerPageText={rowsPerPageText}
              isServerPropsDisabled={isServerPropsDisabled}
              selectableRows={selectableRows}
              onSelectedRowsChange={handleChange}
              className={className}
            />
          </div>
        </div>
      </div>

      {/* previous changes  */}
      {/* <h1> new Table </h1>
      <div className="overflow-x-auto -ml-8 -mr-2">
        <ReactTable
          data={data}
          columns={columns}
          loading={loading}
          totalRows={totalRows}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onChangePage={onChangePage}
          page={page}
          rowsPerPageText={rowsPerPageText}
          isServerPropsDisabled={isServerPropsDisabled}
          selectableRows={selectableRows}
          onSelectedRowsChange={onSelectedRowsChange}
          className={className}
        />
      </div> */}
    </>
  );
};

export default NewTable;
