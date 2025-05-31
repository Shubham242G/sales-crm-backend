import React, { useMemo, useRef, useState } from "react";
import { ReactTable } from "./ReactTable";
import { getTableHeadUtilityClass, Select, Switch } from "@mui/material";
import {
  FaCog,
  FaColumns,
  FaEllipsisH,
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
import AdvancedSearch from "@/utils/advancedSearch";
import { l } from "vite/dist/node/types.d-aGj9QkWt";
import { camelCase } from "lodash";
import { AiFillCloseSquare } from "react-icons/ai";
import { useAddLeadManagement } from "@/services/leadManagement.service";
import { useUser } from "@/services/user.service";

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

    isImport = false,
  } = props;

  console.log(AddButtonName, "AddButtonName");
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

  const [exportedRows, setExportedRows] = useState([]);

  const handleChange = ({ selectedRows }: any) => {
    console.log("Selected Rows: ", selectedRows);

    setTickRows(selectedRows.map((row: any) => row._id));
    setExportedRows(selectedRows);
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
    <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl animate-fade-in">
      <div className="flex flex-col gap-2">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-800">Customize Columns</h3>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={resetColumnVisibility}
          >
            Reset
          </button>
        </div>

        {/* Column List */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {columns.map((column: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-gray-100 py-1"
            >
              <span className="text-sm text-gray-700">{column.name}</span>
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

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white shadow hover:bg-blue-700 transition"
            onClick={() => setShowColumnSelector(false)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );


  const fileInputRef = useRef<HTMLInputElement>(null);

  // const visibleColumnsArray = columns.filter(
  //   (column: any) => visibleColumns[column.name as keyof typeof visibleColumns]
  // );

  const [isOpen, setIsOpen] = useState(false);
  const calculateDynamicWidths = (columnsArray: any[]) => {
    const visibleColumnsCount = columnsArray.length;

    if (visibleColumnsCount === 0) return columnsArray;

    const columnsWithDynamicWidth = columnsArray.map(column => {
      const width =
        visibleColumnsCount < 7
          ? `${1200 / visibleColumnsCount}px`
          : column.name === "Email" || column.name === "Company Name"
            ? "260px"
            : column.name === "Vendor Name"
              ? "180px"
              : column.name === "Mobile Number"
                ? "180px"
                : column.name === "Services"
                  ? "280px"
                  : column.name === "Actions"
                    ? "100px"
                    : column.name === "Status" || column.name === "Service"
                      ? "210px"
                      : column.name === "Display Name"
                        ? "150px"
                        : column.name === "Service"
                          ? "380px"
                          : column.name === "Name"
                            ? "120px"
                            : `${1200 / visibleColumnsCount}px`;


      return { ...column, width };
    });

    console.log(columnsWithDynamicWidth, "check the column width")

    return columnsWithDynamicWidth;
  };
  const visibleColumnsArray = columns.filter((column: any) =>
    visibleColumns[column.name as keyof typeof visibleColumns]
  );
  // Apply dynamic widths to visible columns
  const filteredColumns = calculateDynamicWidths(visibleColumnsArray);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const { mutateAsync: addLeadManagement } = useAddLeadManagement();

  const [tickRows, setTickRows] = useState<string[]>([]);

  const [isOpenAssign, setIsOpenAssign] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showExportCustomize, setShowExportCustomize] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const { data: userData } = useUser(searchObj);

  console.log(userData, "check userData here");
  const handleAssignTask = async () => {
    try {
      if (tickRows.length === 0) {
        toastError("Please select at least one lead to assign.");
      }

      const obj = {
        leadIds: tickRows,
        userId: selectedUser,
      };

      const { data: res } = await addLeadManagement(obj);

      if (res?.message) {
        toastSuccess(res.message);
        setIsOpen(false);
        setTickRows([]);
        setSelectedUser("");
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
        ...(tickRows && { tickRows }),
        ...(fields && { fields }), // Include selected fields if provided
      };

      console.log(onSelectedRowsChange, "onSelectedRowsChange");

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

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons(RouteName);

  const { data: TableData, refetch } = TableGetAllFunction(searchObj);

  const searchFields = columns.map((field: any) => ({
    key: camelCase(field.name),
    label: field.name,
    type: field.type,
  }));

  const exportFieldsValue = searchFields.map((field: any) => field.key);
  const [exportFields, setExportFields] = useState<string[]>(exportFieldsValue);

  const toggleAllExportFields = (checked: boolean) => {
    if (checked) {
      // Select all fields
      setExportFields(searchFields.map((field: any) => field.key));
    } else {
      // Deselect all fields
      setExportFields([]);
    }
  };

  const [isOpenAssignOps, setIsOpenAssignOps] = useState(false);

  //   e.preventDefault();
  //   if (assignTaskName) {
  //     setAssignTaskUsers((prevUsers) => [...prevUsers, assignTaskName]);
  //     setAssignTaskName("");
  //   }
  // };

  // const handleAssignTaskNameChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setAssignTaskName(e.target.value);
  // };

  // const handleRemoveAssignTaskUser = (user: string) => {
  //   setAssignTaskUsers((prevUsers) => prevUsers.filter((u) => u !== user));
  // };

  // const handleAssignTaskSubmit = async () => {
  //   try {
  //     console.log(tickRows, "tickRows", assignTaskUser, "assignTaskUsers");
  //     if (tickRows.length === 0) {
  //       toastError("Please select at least one lead and one user to assign.");
  //       return;
  //     }

  // const { data: res } = await assignTask(selectedRows, assignTaskUsers);

  // if (res?.message) {
  //   toastSuccess(res.message);
  //   setIsOpen(false);
  //   setSelectedRows([]);
  //   setAssignTaskUsers([]);
  // }
  //   } catch (error) {
  //     toastError("An error occurred while assigning task. Please try again.");
  //   }
  // };
  return (
    <>

      <div className=" table_container rounded-xl  mt-16    ">
        <div className="flex flex-wrap items-center container justify-between gap-3 text-sm ">
          {/* Heading on the Left */}
          <h2 className="text-lg font-semibold text-gray-800 ml-2 ">
            {TableName}
          </h2>
          {/* Search Input */}
          <div className="flex items-center w-full sm:w-auto flex-grow ">
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
              className="flex items-center gap-1 p-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 text-sm"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              <FaColumns className="text-xs" /> Columns
            </button>
            {showColumnSelector && <ColumnSelector />}
          </div>
          {/* Advanced Search */}
          <button
            onClick={handleModalOpen}
            className="flex items-center gap-1 p-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
          >
            Advanced Search
          </button>

          {/* Assign Lead */}
          {TableName === "Leads List" && (
            <button
              onClick={() => setIsOpenAssign(true)}
              className="flex items-center gap-1 p-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
            >
              <FaTasks className="text-xs" /> Assign Lead
            </button>
          )}

          {TableName === "Enquiry List" && (
            <button
              className=" flex items-center gap-1  p-1.5  text-sm rounded-md text-gray-700 border border-gray-300 whitespace-nowrap"
              onClick={() => setIsOpenAssignOps(true)}
            >
              <span className="whitespace-nowrap text-sm">
                {" "}
                Assign To Ops Team{" "}
              </span>
            </button>
          )}
          {/* More Options */}
          {(ExcelExportFunction || TableAddExcelFunction) && (
            <div className="relative">
              <button
                className="flex items-center gap-1  px-3 rounded-md pt-0 pb-3  border bg-gray-50 text-gray-700 border-gray-300 text-sm"
                onClick={() => setShowExportOptions(!showExportOptions)}
              >
               ...
              </button>

              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <ul className="py-1">
                    <li
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("xlsx");
                      }}
                    >
                      <FaFileExport className="mr-2" />
                      Export as Excel
                    </li>
                    <li
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("csv");
                      }}
                    >
                      <FaFileExport className="mr-2" />
                      Export as CSV
                    </li>
                    <li
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleExportEnquiries("pdf");
                      }}
                    >
                      <FaFileExport className="mr-2" />
                      Export as PDF
                    </li>
                    <li
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        setShowExportCustomize(true);
                      }}
                    >
                      <FaCog className="mr-2" />
                      Customize Export
                    </li>
                    <li
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        setShowExportOptions(false);
                        handleImportClick();
                      }}
                    >
                      <FaFileImport className="mr-2" />
                      Import
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
          />
          {/* Add New Lead */}
          {canCreate && AddButtonName && AddButtonRouteName && (
            <button
              onClick={() => navigate(AddButtonRouteName)}
              className="flex mr-5 items-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-400 text-sm"
            >
              <FaPlus className="text-xs" /> {AddButtonName}
            </button>
          )}
        </div>
        {/* React Table */}
        <div className="mt-5">
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

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)]"
            onClick={handleModalClose}
          ></div>

          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99999]">
            <AdvancedSearch
              fields={searchFields}
              onSearch={(values) => {
                setAdvancedSearchParams(values);
                setIsOpen(false);
                refetch();
              }}
              onClear={() => {
                setIsOpen(false);
                setAdvancedSearchParams("");
                refetch();
              }}
            />
          </div>
        </>
      )}
      {/* Export Customize Modal */}
      {showExportCustomize && (
        <>
          <div
            className="fixed inset-0 z-[10] bg-[rgba(0,0,0,0.5)]"
            onClick={() => setShowExportCustomize(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Customize Export Fields
            </h3>

            {/* Select/Deselect All */}
            <div className="mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="select-all-fields"
                  checked={exportFields.length === searchFields.length}
                  onChange={(e) => toggleAllExportFields(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="select-all-fields" className="font-medium">
                  Select All Fields
                </label>
              </div>
            </div>

            {/* Field list */}
            <div className="max-h-64 overflow-y-auto">
              {searchFields.map((field: any) => (
                <div key={field.key} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`export-${field.key}`}
                    checked={exportFields.includes(field.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setExportFields([...exportFields, field.key]);
                      } else {
                        setExportFields(
                          exportFields.filter((f) => f !== field.key)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`export-${field.key}`}>{field.label}</label>
                </div>
              ))}
            </div>

            {/* Format selection */}
            <div className="mt-4 mb-4 border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Export Format</h4>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-xlsx"
                    name="exportFormat"
                    value="xlsx"
                    defaultChecked
                    className="mr-1"
                  />
                  <label htmlFor="format-xlsx">Excel</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-csv"
                    name="exportFormat"
                    value="csv"
                    className="mr-1"
                  />
                  <label htmlFor="format-csv">CSV</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="format-pdf"
                    name="exportFormat"
                    value="pdf"
                    className="mr-1"
                  />
                  <label htmlFor="format-pdf">PDF</label>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end mt-4 gap-1.5">
              <button
                className=" p-1.5 bg-gray-200 rounded-md"
                onClick={() => setShowExportCustomize(false)}
              >
                Cancel
              </button>
              <button
                className=" p-1.5 bg-orange-500 text-white rounded-md"
                onClick={() => {
                  setShowExportCustomize(false);
                  // Get selected format
                  const formatElement = document.querySelector(
                    'input[name="exportFormat"]:checked'
                  ) as HTMLInputElement;
                  const selectedFormat = formatElement
                    ? formatElement.value
                    : "xlsx";

                  // Only export if at least one field is selected
                  if (exportFields.length > 0) {
                    handleExportEnquiries(selectedFormat, exportFields);
                  } else {
                    toastError("Please select at least one field to export");
                  }
                }}
                disabled={exportFields.length === 0}
              >
                Export
              </button>
            </div>
          </div>
        </>
      )}
      {/* Loading Overlay for Export */}
      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-700">Preparing your export...</p>
          </div>
        </div>
      )}
      {isOpenAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[100] justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[400px] ]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assign Task to User</h2>
              <button
                type="button"
                className="text-black-500 text-lg"
                onClick={() => setIsOpenAssign(false)}
              >
                <AiFillCloseSquare />
              </button>
            </div>
            <form onSubmit={handleAssignTask}>
              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter User Name
                </label>
                <input
                  type="text"
                  value={assignTaskName}
                  onChange={handleAssignTaskNameChange}
                  placeholder="Enter User Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div> */}
              {/* <div className="mt-4 flex gap-1.5">
                {assignTaskUsers.map((user) => (
                  <div
                    key={user}
                    className="bg-blue-100 px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleRemoveAssignTaskUser(user)}
                  >
                    {user}
                  </div>
                ))}
              </div> */}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select User
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select User</option>
                  {userData.data
                    .filter((user: any) => user.role === "Sales")
                    .map((user: any) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500  p-1.5 rounded-md text-white hover:bg-blue-700 disabled:bg-gray-300"

                // disabled={isLoading}
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOpenAssignOps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[100] justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[400px] ]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assign Task to User</h2>
              <button
                type="button"
                className="text-black-500 text-lg"
                onClick={() => setIsOpenAssign(false)}
              >
                <AiFillCloseSquare />
              </button>
            </div>
            <form onSubmit={handleAssignTask}>
              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter User Name
                </label>
                <input
                  type="text"
                  value={assignTaskName}
                  onChange={handleAssignTaskNameChange}
                  placeholder="Enter User Name"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div> */}
              {/* <div className="mt-4 flex gap-1.5">
                {assignTaskUsers.map((user) => (
                  <div
                    key={user}
                    className="bg-blue-100 px-2 py-1 rounded-full cursor-pointer"
                    onClick={() => handleRemoveAssignTaskUser(user)}
                  >
                    {user}
                  </div>
                ))}
              </div> */}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select User
                </label>
                <select
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select User</option>
                  {userData.data
                    .filter((user: any) => user.role === "ops_Team")
                    .map((user: any) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-blue-500  p-1.5 rounded-md text-white hover:bg-blue-700 disabled:bg-gray-300"

                // disabled={isLoading}
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
