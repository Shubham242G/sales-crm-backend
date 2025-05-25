// Code
import { ReactTable } from "./ReactTable"; // Assuming ReactTable exports Row type
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  Dispatch,
  SetStateAction,
  FC,
  ReactNode,
} from "react";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaTasks,
  FaColumns,
} from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { toastError, toastSuccess } from "@/utils/toast";
import { generateFilePath } from "@/services/urls.service";
import { checkPermissionsForButtons } from "@/utils/permission";
import AdvancedSearch from "@/utils/advancedSearch"; // Assuming this component exists and is typed
import { Modal, Switch } from "@mui/material";
import { AiFillCloseSquare } from "react-icons/ai";
import { AdvancedSearchProps } from "@/utils/advancedSearch";
// Type Definitions

interface Column {
  name: string;
  selector?: (row: any) => any; // Adjust 'any' based on your data structure
  sortable?: boolean;
  cell?: (row: any) => ReactNode; // Adjust 'any'
  accessor?: string; // Used as a fallback if name isn't a direct accessor
  width?: string;
  // Add other potential column properties here
}

interface SearchField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select"; // Or other relevant types
  options?: { value: string | number; label: string }[]; // For select type
}

interface AdditionalButton {
  label: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

interface UseDataHookParams {
  query?: string;
  advancedSearch?: string; // Or a more specific type if known
  pageIndex: number;
  pageSize: number;
}

interface UseDataHookResponse<T> {
  data: T[];
  total: number;
  // Add other properties returned by your hook
}

interface ApiFunction<P = any, R = any> {
  (params: P): Promise<{ data: R; status?: number; message?: string }>; // Adjust R based on expected response
}

interface ReusableTableComponentProps<TData extends { _id: string | number }> {
  // Required props
  title: string;
  data?: TData[]; // Optional if useDataHook is provided
  columns: Column[];
  searchFields: SearchField[];
  permissionKey: string;

  // API functions
  useDataHook?: (params: UseDataHookParams) => {
    data: UseDataHookResponse<TData> | undefined;
    refetch: () => void;
    isLoading?: boolean;
  };
  deleteFunction?: ApiFunction<string | number, { message?: string }>;
  importFunction?: ApiFunction<FormData, { message?: string }>;
  exportFunction?: ApiFunction<any, { filename: string }>; // 'any' for params as it's dynamic

  // Navigation
  onAddNew?: () => void;
  onRowAction?: (action: string, row: TData) => void; // Example, adjust as needed

  // Optional props
  loading?: boolean;
  enableImport?: boolean;
  enableExport?: boolean;
  enableAdvancedSearch?: boolean;
  enableColumnSelector?: boolean;
  enableAssignTask?: boolean;
  searchPlaceholder?: string;
  defaultExportFields?: string[];
  additionalButtons?: AdditionalButton[];

  // Custom handlers
  onAssignTask?: (
    itemIds: (string | number)[],
    userNames: string[]
  ) => Promise<void>;
  onCustomAction?: (action: string, payload: any) => void; // Adjust 'any'
}

const ReusableTableComponent = <TData extends { _id: string | number }>({
  // Required props
  title,
  data,
  columns,
  searchFields,
  permissionKey,

  // API functions
  useDataHook,
  deleteFunction,
  importFunction,
  exportFunction,

  // Navigation
  onAddNew,
  onRowAction,

  // Optional props
  loading: propLoading = false,
  enableImport = true,
  enableExport = true,
  enableAdvancedSearch = true,
  enableColumnSelector = true,
  enableAssignTask = false,
  searchPlaceholder = "Search...",
  defaultExportFields = [],
  additionalButtons = [],

  // Custom handlers
  onAssignTask,
  onCustomAction,
}: ReusableTableComponentProps<TData>) => {
  // Permission checks
  const { canCreate, canDelete, canUpdate, canView } =
    checkPermissionsForButtons(permissionKey);

  // States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [advancedSearchParams, setAdvancedSearchParams] = useState<string>(""); // Or a more specific object type
  const [isOpenAdvancedSearch, setIsOpenAdvancedSearch] =
    useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Import/Export states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [showExportCustomize, setShowExportCustomize] =
    useState<boolean>(false);
  const [exportFields, setExportFields] =
    useState<string[]>(defaultExportFields);

  // Column visibility states
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => {
      const defaultVisibility: Record<string, boolean> = {};
      columns.forEach((col) => {
        defaultVisibility[col.accessor || col.name] = true;
      });
      return defaultVisibility;
    }
  );

  // Selection states
  const [tickRows, setTickRows] = useState<(string | number)[]>([]); // Array of IDs
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  ); // Assuming ID is string or number
  const [isOpenAction, setIsOpenAction] = useState<boolean>(false); // Assuming this was for a row action modal

  // Assignment states
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [assignTaskName, setAssignTaskName] = useState<string>("");
  const [assignTaskUsers, setAssignTaskUsers] = useState<string[]>([]);

  // Search object for API calls
  const searchObj = useMemo(
    (): UseDataHookParams => ({
      ...(searchQuery && { query: searchQuery }),
      ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, searchQuery, advancedSearchParams]
  );

  // Data fetching using provided hook
  const {
    data: hookResponse,
    refetch,
    isLoading: hookLoading,
  } = useDataHook
    ? useDataHook(searchObj)
    : { data: undefined, refetch: () => {}, isLoading: false };

  const tableData = hookResponse?.data || data;
  const totalRows = hookResponse?.total || data?.length || 0;
  const currentLoading = propLoading || hookLoading;

  // Load saved column preferences
  useEffect(() => {
    const savedColumns = localStorage.getItem(`tableColumns_${permissionKey}`);
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        if (typeof parsedColumns === "object" && parsedColumns !== null) {
          setVisibleColumns(parsedColumns as Record<string, boolean>);
        }
      } catch (error) {
        console.error("Failed to parse saved column preferences:", error);
      }
    }
  }, [permissionKey]);

  // Save column preferences
  useEffect(() => {
    // Check if canView is determined, to avoid saving default state before permissions are loaded
    if (canView !== undefined) {
      localStorage.setItem(
        `tableColumns_${permissionKey}`,
        JSON.stringify(visibleColumns)
      );
    }
  }, [visibleColumns, canView, permissionKey]);

  // Close export dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      // Use globalThis.MouseEvent for document events
      const target = event.target as HTMLElement;
      if (!target.closest("#exportDropdown") && showExportOptions) {
        setShowExportOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportOptions]);

  // Handlers
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Optional: Debounce refetch or refetch on blur/enter
  };

  const handleSearchSubmit = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    setPageIndex(1); // Reset to first page on new search
    refetch();
  };

  const handleDelete = async (id: string | number) => {
    if (!deleteFunction) return;
    try {
      if (window.confirm("Are you sure you want to delete this item?")) {
        const { data: res } = await deleteFunction(id);
        if (res) {
          toastSuccess(res.message || "Deleted successfully");
          refetch();
        }
      }
    } catch (error: any) {
      // It's good practice to type 'error' if possible, but 'any' is common for catch blocks
      toastError(error.message || "Failed to delete item.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!importFunction) return;
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const allowedExtensions = ["xlsx", "csv"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

      if (!allowedExtensions.includes(fileExtension)) {
        toastError("Invalid file type. Please upload an Excel or CSV file.");
        setIsUploading(false); // Reset uploading state
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const response = await importFunction(formData);

      if (response.status === 200 || response.data?.message) {
        // Check for successful status or message
        toastSuccess(response.data?.message || "Data imported successfully!");
        refetch();
      } else {
        toastError(
          response.data?.message || "Error importing file. Please try again."
        );
      }
    } catch (error: any) {
      toastError(
        error.message || "An error occurred during import. Please try again."
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleExport = async (
    format: "xlsx" | "csv" | "pdf" = "xlsx",
    fieldsToExport?: string[]
  ) => {
    if (!exportFunction) return;
    try {
      setIsExporting(true);
      const exportParams: any = {
        // Keep 'any' for flexibility or create a specific type
        ...(searchQuery && { query: searchQuery }),
        ...(advancedSearchParams && { advancedSearch: advancedSearchParams }),
        format,
        ...(fieldsToExport &&
          fieldsToExport.length > 0 && { fields: fieldsToExport }),
      };

      const { data: response } = await exportFunction(exportParams);
      if (response && response.filename) {
        const url = generateFilePath("/" + response.filename);
        const link = document.createElement("a");
        link.href = url;

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.setAttribute(
          "download",
          `${permissionKey.toLowerCase()}_export_${timestamp}.${format}`
        );

        document.body.appendChild(link);
        link.click();
        link.remove();
        toastSuccess("Data exported successfully!");
      } else {
        toastError("Export failed: No filename received.");
      }
    } catch (error: any) {
      toastError(error.message || "Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenAssignTask = () => {
    // Renamed to avoid conflict with prop
    if (tickRows.length === 0) {
      toastError("Please select at least one item to assign.");
      return;
    }
    setIsOpenAssign(true);
  };

  const handleAssignTaskSubmit = async () => {
    if (!onAssignTask) return;
    try {
      if (tickRows.length === 0 || assignTaskUsers.length === 0) {
        toastError("Please select at least one item and one user to assign.");
        return;
      }
      await onAssignTask(tickRows, assignTaskUsers);
      toastSuccess("Task assigned successfully!"); // Added success toast
      setIsOpenAssign(false);
      setTickRows([]);
      setAssignTaskUsers([]);
      setAssignTaskName(""); // Clear input field
    } catch (error: any) {
      toastError(
        error.message ||
          "An error occurred while assigning task. Please try again."
      );
    }
  };

  const toggleColumnVisibility = (columnIdentifier: string) => {
    // Use identifier (accessor or name)
    setVisibleColumns((prev) => ({
      ...prev,
      [columnIdentifier]: !prev[columnIdentifier],
    }));
  };

  const toggleAllExportFields = (checked: boolean) => {
    if (checked) {
      setExportFields(searchFields.map((field) => field.key));
    } else {
      setExportFields([]);
    }
  };

  const handleSelectedRowsChange = ({
    selectedRows,
  }: {
    selectedRows: TData[];
  }) => {
    setTickRows(selectedRows.map((row) => row._id));
  };

  // Calculate column widths
  const calculateFixedWidths = (columnsArray: Column[]): Column[] => {
    if (!columnsArray || columnsArray.length === 0) return [];
    const totalWidthEstimate = columnsArray.length * 180; // A simple estimation
    const containerWidth =
      typeof window !== "undefined" ? window.innerWidth - 100 : 1000; // SSR guard

    return columnsArray.map((column) => ({
      ...column,
      width:
        column.name === "Actions"
          ? "80px" // Keep actions column fixed if desired
          : totalWidthEstimate > containerWidth
          ? "200px" // Min width if content overflows
          : `${98 / columnsArray.length}%`, // Distribute width
    }));
  };

  const visibleTableColumns = useMemo(() => {
    return columns.filter(
      (column) => visibleColumns[column.accessor || column.name]
    );
  }, [columns, visibleColumns]);

  const memoizedFilteredColumns = useMemo(() => {
    return calculateFixedWidths(visibleTableColumns);
  }, [visibleTableColumns]);

  // Column Selector Component
  const ColumnSelectorComponent: FC = () => (
    // Typed as Functional Component
    <div className="absolute z-50 bg-white shadow-lg p-4 rounded-md mt-2 border border-gray-200 right-0 w-72">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <h3 className="font-medium">Customize Columns</h3>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => {
              const defaultVisibility: Record<string, boolean> = {};
              columns.forEach((col) => {
                defaultVisibility[col.accessor || col.name] = true;
              });
              setVisibleColumns(defaultVisibility);
            }}
          >
            Reset to Default
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {columns.map((column) => {
            const columnId = column.accessor || column.name;
            return (
              <div
                key={columnId}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <span className="text-sm">{column.name}</span>
                <Switch
                  checked={visibleColumns[columnId] || false}
                  onChange={() => toggleColumnVisibility(columnId)}
                  size="small"
                  color="primary"
                />
              </div>
            );
          })}
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

  return (
    <>
      <div className="container mx-auto top-0 bg-white sticky z-10">
        {" "}
        {/* Added mx-auto and z-index */}
        <div className="table_container rounded-xl px-4 py-5">
          {" "}
          {/* Added py-5 */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm mb-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

            {/* Action Buttons Container */}
            <div className="flex flex-wrap items-center gap-2">
              {" "}
              {/* Group buttons */}
              {/* Search Input */}
              <div className="flex items-center">
                <input
                  type="search"
                  className="rounded-md border px-3 py-1.5 w-[200px] border-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e); // Use the handler
                    }
                  }}
                />
              </div>
              {/* Column Selector */}
              {enableColumnSelector && (
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 text-sm"
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                    aria-expanded={showColumnSelector} // Accessibility
                    aria-controls="column-selector-dropdown" // Accessibility
                  >
                    <FaColumns className="text-xs" /> Columns
                  </button>
                  {showColumnSelector && <ColumnSelectorComponent />}
                </div>
              )}
              {/* Advanced Search */}
              {enableAdvancedSearch && (
                <button
                  onClick={() => setIsOpenAdvancedSearch(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
                >
                  <FaFilter className="text-xs" /> Advanced Search
                </button>
              )}
              {/* Assign Task */}
              {enableAssignTask &&
                canUpdate && ( // Assuming assign task requires update permission
                  <button
                    onClick={handleOpenAssignTask}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
                    disabled={tickRows.length === 0} // Disable if no rows selected
                  >
                    <FaTasks className="text-xs" /> Assign Task
                  </button>
                )}
              {/* Export */}
              {enableExport && exportFunction && (
                <div className="relative" id="exportDropdown">
                  <button
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 text-sm ${
                      isExporting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (!isExporting)
                        setShowExportOptions(!showExportOptions);
                    }}
                    disabled={isExporting}
                    aria-expanded={showExportOptions}
                    aria-controls="export-options-menu"
                  >
                    <FaFileExport />
                    {isExporting ? "Exporting..." : "Export"}
                    <IoMdArrowDropdown className="ml-1" />
                  </button>

                  {showExportOptions && (
                    <div
                      id="export-options-menu"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200"
                    >
                      {" "}
                      {/* Increased z-index */}
                      <ul className="py-1" role="menu">
                        <li
                          role="menuitem"
                          className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                          onClick={() => {
                            setShowExportOptions(false);
                            handleExport("xlsx");
                          }}
                        >
                          <span className="w-6 h-6 mr-2 flex items-center justify-center text-green-600">
                            📊
                          </span>
                          Export as Excel
                        </li>
                        <li
                          role="menuitem"
                          className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                          onClick={() => {
                            setShowExportOptions(false);
                            handleExport("csv");
                          }}
                        >
                          <span className="w-6 h-6 mr-2 flex items-center justify-center text-blue-600">
                            📋
                          </span>
                          Export as CSV
                        </li>
                        <li
                          role="menuitem"
                          className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                          onClick={() => {
                            setShowExportOptions(false);
                            handleExport("pdf");
                          }}
                        >
                          <span className="w-6 h-6 mr-2 flex items-center justify-center text-red-600">
                            📄
                          </span>
                          Export as PDF
                        </li>
                        <li
                          role="menuitem"
                          className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                          onClick={() => {
                            setShowExportOptions(false);
                            setShowExportCustomize(true);
                          }}
                        >
                          <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-600">
                            ⚙️
                          </span>
                          Customize Export
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {/* Import */}
              {enableImport &&
                importFunction &&
                canCreate && ( // Assuming import requires create permission
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileChange}
                    />
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
                      onClick={handleImportClick}
                      disabled={isUploading}
                    >
                      <FaFileImport />
                      {isUploading ? "Importing..." : "Import"}
                    </button>
                  </>
                )}
              {/* Additional Custom Buttons */}
              {additionalButtons.map((button, index) => (
                <button
                  key={index}
                  className={
                    button.className ||
                    "flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
                  }
                  onClick={button.onClick}
                  disabled={button.disabled}
                >
                  {button.icon}
                  {button.label}
                </button>
              ))}
              {/* Add New Button */}
              {canCreate && onAddNew && (
                <button
                  onClick={onAddNew}
                  className="flex items-center gap-1 px-3 py-1.5 text-white rounded-md bg-orange-500 hover:bg-orange-600 text-sm"
                >
                  <FaPlus className="text-xs" /> New{" "}
                  {permissionKey.endsWith("s")
                    ? permissionKey.slice(0, -1)
                    : permissionKey}
                </button>
              )}
            </div>
          </div>
          {/* React Table */}
          <div className="overflow-x-auto">
            {" "}
            {/* Removed negative margins, handle spacing via parent padding */}
            <ReactTable
              data={tableData || []}
              columns={memoizedFilteredColumns}
              loading={currentLoading ?? false}
              totalRows={totalRows}
              onChangeRowsPerPage={setPageSize}
              onChangePage={(page: number) => setPageIndex(page)}
              page={pageIndex}
              rowsPerPageText={pageSize ?? 10}
              isServerPropsDisabled={!useDataHook}
              selectableRows={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              className={`${permissionKey.toLowerCase()}table`}
            />
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      {isOpenAdvancedSearch && enableAdvancedSearch && (
        <>
          <div
            className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.5)]" // z-index lower than modal content
            onClick={() => setIsOpenAdvancedSearch(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-6 rounded-lg shadow-xl w-auto max-w-lg">
            {" "}
            {/* z-index higher */}
            <AdvancedSearch
              fields={searchFields as any[]}
              onSearch={(values: any) => {
                // Type 'values' if its structure is known
                setAdvancedSearchParams(
                  typeof values === "string" ? values : JSON.stringify(values)
                ); // Assuming AdvancedSearch might return object or string
                setIsOpenAdvancedSearch(false);
                setPageIndex(1); // Reset page on new search
                refetch();
              }}
              //   onClose={() => setIsOpenAdvancedSearch(false)} // Add onClose
              onClear={() => {
                setIsOpenAdvancedSearch(false);
                setAdvancedSearchParams("");
                setPageIndex(1); // Reset page on clear
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
            className="fixed inset-0 z-[999] bg-[rgba(0,0,0,0.5)]"
            onClick={() => setShowExportCustomize(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Customize Export Fields
            </h3>

            <div className="mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="select-all-fields"
                  checked={
                    searchFields.length > 0 &&
                    exportFields.length === searchFields.length
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    toggleAllExportFields(e.target.checked)
                  }
                  className="mr-2 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="select-all-fields"
                  className="font-medium text-sm"
                >
                  Select All Fields
                </label>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto pr-2">
              {" "}
              {/* Added pr-2 for scrollbar space */}
              {searchFields.map((field) => (
                <div key={field.key} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`export-${field.key}`}
                    checked={exportFields.includes(field.key)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        setExportFields((prev) => [...prev, field.key]);
                      } else {
                        setExportFields((prev) =>
                          prev.filter((f) => f !== field.key)
                        );
                      }
                    }}
                    className="mr-2 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor={`export-${field.key}`} className="text-sm">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 mb-4 border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2 text-sm">Export Format</h4>
              <div className="flex space-x-4">
                {(["xlsx", "csv", "pdf"] as const).map((format) => (
                  <div key={format} className="flex items-center">
                    <input
                      type="radio"
                      id={`format-${format}`}
                      name="exportFormat"
                      value={format}
                      defaultChecked={format === "xlsx"}
                      className="mr-1 h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                    />
                    <label htmlFor={`format-${format}`} className="text-sm">
                      {format.toUpperCase()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                onClick={() => setShowExportCustomize(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50"
                onClick={() => {
                  setShowExportCustomize(false);
                  const formatElement =
                    document.querySelector<HTMLInputElement>(
                      'input[name="exportFormat"]:checked'
                    );
                  const selectedFormat = (formatElement?.value || "xlsx") as
                    | "xlsx"
                    | "csv"
                    | "pdf";
                  if (exportFields.length > 0) {
                    handleExport(selectedFormat, exportFields);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          {" "}
          {/* Highest z-index */}
          <div className="bg-white p-6 rounded-md shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-700">Preparing your export...</p>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isOpenAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[1000] justify-center items-center">
          {" "}
          {/* Ensure this is above other modals if necessary */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            {" "}
            {/* Removed fixed height */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-semibold">Assign Task</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-2xl" // Larger close icon
                onClick={() => {
                  setIsOpenAssign(false);
                  setAssignTaskName(""); // Clear on close
                  setAssignTaskUsers([]); // Clear on close
                }}
              >
                <AiFillCloseSquare />
              </button>
            </div>
            <div className="mb-4">
              {" "}
              {/* Spacing for selected items */}
              <p className="text-sm text-gray-600 mb-1">
                Assigning {tickRows.length} item(s).
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="assignTaskUserInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter User Name or ID
              </label>
              <div className="flex gap-2">
                <input
                  id="assignTaskUserInput"
                  type="text"
                  value={assignTaskName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAssignTaskName(e.target.value)
                  }
                  placeholder="Type user and press Add"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && assignTaskName.trim()) {
                      e.preventDefault(); // Prevent form submission if any
                      setAssignTaskUsers(
                        (prev) =>
                          Array.from(
                            new Set([...prev, assignTaskName.trim()])
                          ) as string[]
                      );
                      setAssignTaskName("");
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-4 py-2 mt-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                  onClick={() => {
                    if (assignTaskName.trim()) {
                      setAssignTaskUsers(
                        (prev) =>
                          Array.from(
                            new Set([...prev, assignTaskName.trim()])
                          ) as string[]
                      ); // Avoid duplicates
                      setAssignTaskName("");
                    }
                  }}
                  disabled={!assignTaskName.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            {assignTaskUsers.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto p-2 border rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Users:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {assignTaskUsers.map((user, index) => (
                    <div
                      key={index} // Using index as key for display list is acceptable if users are unique strings
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {user}
                      <button
                        type="button"
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          setAssignTaskUsers((prev) =>
                            prev.filter((u) => u !== user)
                          )
                        }
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                onClick={() => {
                  setIsOpenAssign(false);
                  setAssignTaskName("");
                  setAssignTaskUsers([]);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50"
                onClick={handleAssignTaskSubmit}
                disabled={tickRows.length === 0 || assignTaskUsers.length === 0}
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReusableTableComponent;
