// import React, { useState, useEffect } from 'react';
// import {
//     FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight, FaSearch,
//     FaFilter, FaEllipsisH, FaDownload, FaUpload, FaSync
// } from 'react-icons/fa';

// // Types
// interface TableColumn {
//     name: string;
//     selector?: (row: any) => React.ReactNode;
//     cell?: (row: any) => React.ReactNode;
//     width?: string;
//     minWidth?: string;
//     maxWidth?: string;
//     sortable?: boolean;
// }

// interface TableProps {
//     data: any[];
//     columns: TableColumn[];
//     loading?: boolean;
//     totalRows: number;
//     onChangeRowsPerPage: (pageSize: number) => void;
//     onChangePage: (pageIndex: number) => void;
//     page: number;
//     rowsPerPageText: number;
//     isServerPropsDisabled?: boolean;
// }

// // Pagination options
// const pageSizeOptions = [10, 25, 50, 100];

// export default function ZohoStyleTable({
//     data,
//     columns,
//     loading = false,
//     totalRows,
//     onChangeRowsPerPage,
//     onChangePage,
//     page,
//     rowsPerPageText,
//     isServerPropsDisabled = false
// }: TableProps) {
//     // State
//     const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
//     const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
//     const [searchTerm, setSearchTerm] = useState('');
//     const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

//     // Pagination calculation
//     const totalPages = Math.ceil(totalRows / rowsPerPageText);
//     const startRow = (page - 1) * rowsPerPageText + 1;
//     const endRow = Math.min(page * rowsPerPageText, totalRows);

//     // Select all rows
//     const handleSelectAll = () => {
//         const allSelected = Object.keys(selectedRows).length === data.length &&
//             Object.values(selectedRows).every(value => value);

//         const newSelectedRows: Record<string, boolean> = {};

//         if (!allSelected) {
//             data.forEach((row, idx) => {
//                 newSelectedRows[idx] = true;
//             });
//         }

//         setSelectedRows(newSelectedRows);
//     };

//     // Select individual row
//     const handleSelectRow = (index: number) => {
//         setSelectedRows(prev => ({
//             ...prev,
//             [index]: !prev[index]
//         }));
//     };

//     // Handle sorting
//     const handleSort = (accessor: string) => {
//         let direction: 'asc' | 'desc' = 'asc';

//         if (sortConfig && sortConfig.key === accessor && sortConfig.direction === 'asc') {
//             direction = 'desc';
//         }

//         setSortConfig({ key: accessor, direction });
//     };

//     // Handle page change
//     const nextPage = () => {
//         if (page < totalPages) {
//             onChangePage(page + 1);
//         }
//     };

//     const prevPage = () => {
//         if (page > 1) {
//             onChangePage(page - 1);
//         }
//     };

//     // Handle page size change
//     const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         onChangeRowsPerPage(Number(e.target.value));
//     };

//     // Filtered data based on search
//     const filteredData = searchTerm.trim() === ''
//         ? data
//         : data.filter(row => {
//             return Object.values(row).some(value => {
//                 if (typeof value === 'string') {
//                     return value.toLowerCase().includes(searchTerm.toLowerCase());
//                 }
//                 return false;
//             });
//         });

//     return (
//         <div className="h-fullflex flex-col bg-white rounded-md shadow border border-gray-200">
//             {/* Table Header Tools */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-2">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                         <FaSearch className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
//                     </div>
//                     <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
//                         <FaFilter className="w-4 h-4" />
//                     </button>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                     <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
//                         <FaDownload className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
//                         <FaUpload className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
//                         <FaSync className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
//                         <FaEllipsisH className="w-4 h-4" />
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left ">
//                     <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
//                         <tr>
//                             <th className="w-12 py-3 px-4 fixed">
//                                 {/* Checkbox header is handled by first column */}
//                             </th>
//                             {columns.map((column, idx) => (
//                                 <th
//                                     key={idx}
//                                     className={`py-3 px-4 font-semibold cursor-pointer  ${column.width || ''
//                                         } ${column.minWidth ? `min-w-[${column.minWidth}]` : 'min-w-[120px]'
//                                         } ${column.maxWidth ? `max-w-[${column.maxWidth}]` : ''
//                                         }`}
//                                     onClick={() => column.sortable !== false && handleSort(`column-${idx}`)}
//                                     style={{ width: column.width }}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <span>{column.name}</span>
//                                         {column.sortable !== false && (
//                                             <span className="inline-flex flex-col ml-1">
//                                                 <FaChevronUp
//                                                     className={`h-3 w-3 ${sortConfig?.key === `column-${idx}` && sortConfig?.direction === 'asc'
//                                                         ? 'text-blue-600'
//                                                         : 'text-gray-400'
//                                                         }`}
//                                                 />
//                                                 <FaChevronDown
//                                                     className={`h-3 w-3 -mt-1 ${sortConfig?.key === `column-${idx}` && sortConfig?.direction === 'desc'
//                                                         ? 'text-blue-600'
//                                                         : 'text-gray-400'
//                                                         }`}
//                                                 />
//                                             </span>
//                                         )}
//                                     </div>
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody  >
//                         {loading ? (
//                             <tr>
//                                 <td colSpan={columns.length + 1} className="text-center py-4">
//                                     <div className="flex items-center justify-center">
//                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                                         <span className="ml-2">Loading...</span>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ) : filteredData.length === 0 ? (
//                             <tr>
//                                 <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
//                                     No data found
//                                 </td>
//                             </tr>
//                         ) : (
//                             filteredData.map((row, rowIndex) => (
//                                 <tr
//                                     key={rowIndex}
//                                     className={`border-b border-gray-200 hover:bg-blue-50 h-[100px] overflow-y-auto ${hoveredRowIndex === rowIndex ? 'bg-blue-50' : 'bg-white'
//                                         } ${selectedRows[rowIndex] ? 'bg-blue-100' : ''
//                                         }`}
//                                     onMouseEnter={() => setHoveredRowIndex(rowIndex)}
//                                     onMouseLeave={() => setHoveredRowIndex(null)}
//                                 >
//                                     <td className="py-3 px-4">
//                                         {/* Checkbox is handled in first column if present */}
//                                     </td>
//                                     {columns.map((column, colIndex) => (
//                                         <td
//                                             key={colIndex}
//                                             className="py-3 px-4 font-normal text-gray-900"
//                                         >

//                                             {column.selector ? column.selector(row) : (
//                                                 <div className="truncate">
//                                                     {column.cell ? column.cell(row) : row[column.accessor] || '-'}
//                                                 </div>
//                                             )}
//                                             {/* Uncomment if you want to use selector */}
//                                             {/* {column.selector ? column.selector({ value: row[column.accessor], row }) : row[column.accessor]} */}
//                                             {/* {column.selector ? column.selector({ value: row[column.accessor.split('.')[0]], row }) : row[column.accessor]} */}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between p-4 border-t border-gray-200">
//                 <div className="text-sm text-gray-600">
//                     Showing {totalRows > 0 ? startRow : 0} to {endRow} of {totalRows} entries
//                 </div>

//                 <div className="flex items-center space-x-2">
//                     <div className="flex items-center space-x-2 mr-4">
//                         <span className="text-sm text-gray-600">Rows per page:</span>
//                         <select
//                             className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 focus:ring-blue-500 focus:border-blue-500"
//                             value={rowsPerPageText}
//                             onChange={handlePageSizeChange}
//                         >
//                             {pageSizeOptions.map(option => (
//                                 <option key={option} value={option}>{option}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="flex items-center space-x-1">
//                         <button
//                             onClick={prevPage}
//                             disabled={page === 1}
//                             className={`p-1 rounded-md ${page === 1
//                                 ? 'text-gray-400 cursor-not-allowed'
//                                 : 'text-gray-700 hover:bg-gray-100'
//                                 }`}
//                         >
//                             <FaChevronLeft className="w-5 h-5" />
//                         </button>

//                         <div className="flex items-center text-sm">
//                             <span className="px-2 py-1 bg-blue-600 text-white rounded-md">{page}</span>
//                             <span className="px-2"> of {totalPages}</span>
//                         </div>

//                         <button
//                             onClick={nextPage}
//                             disabled={page >= totalPages}
//                             className={`p-1 rounded-md ${page >= totalPages
//                                 ? 'text-gray-400 cursor-not-allowed'
//                                 : 'text-gray-700 hover:bg-gray-100'
//                                 }`}
//                         >
//                             <FaChevronRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }