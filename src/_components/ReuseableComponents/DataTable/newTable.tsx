import React, { useMemo, useRef, useState } from "react";
import { ReactTable } from "./ReactTable";
import { getTableHeadUtilityClass, Select, Switch } from "@mui/material";
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

  console.log(  AddButtonName, "AddButtonName");
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
    setTickRows(selectedRows.map((row: any) => row._id));
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
      <div className="flex flex-col gap-1.5 ]">
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

  // const visibleColumnsArray = columns.filter(
  //   (column: any) => visibleColumns[column.name as keyof typeof visibleColumns]
  // );

  const [isOpen, setIsOpen] = useState(false);
  const calculateDynamicWidths = (columnsArray: any[]) => {
    const visibleColumnsCount = columnsArray.length;

    if (visibleColumnsCount === 0) return columnsArray;

    const columnsWithDynamicWidth = columnsArray.map(column => {
      const width =
        visibleColumnsCount <= 6
          ? `${1050 / visibleColumnsCount}px`
          : column.name === "Email"
          ? "300px"
          : `${1600 / visibleColumnsCount}px`;

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

  // const handleAssignTaskNameSubmit = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
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
     
        <div className=" table_container rounded-xl px-6 mt-[60px]   ">
          <div className="flex flex-wrap items-center container justify-between gap-3 text-sm ">
            {/* Heading on the Left */}
            <h2 className="text-lg font-semibold text-gray-800 ml-2">
              {TableName}
            </h2>
            {/* Search Input */}
            <div className="flex items-center w-full sm:w-auto flex-grow ">
              <input
                type="search"
                className="rounded-md border p-1.5 w-[200px] border-gray-300 placeholder-gray-500 text-sm focus:outline-none "
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
          {/* Export */}
          {ExcelExportFunction && 
    TableAddExcelFunction && <div className="relative" id="exportDropdown">
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
                    className=" p-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                    className=" p-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                    className=" p-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
                    className=" p-1.5 hover:bg-gray-100 cursor-pointer flex items-center"
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
          </div>}
          {/* Import */}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
            <button
              className="flex items-center gap-1 p-1.5 rounded-md text-gray-700 border border-gray-300 text-sm"
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
                className="flex items-center gap-1 p-1.5 text-white rounded-md bg-orange-500 text-sm"
              >
                <FaPlus className="text-xs" /> {AddButtonName}
              </button>
            )}
          </div>
          {/* React Table */}
          <div className="mt-[12px]">
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
            className="fixed inset-0 z-[2] bg-[rgba(0,0,0,0.5)]"
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
