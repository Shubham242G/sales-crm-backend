import { usePagination } from "@/hooks/usePagination";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "@/common/constant.common";
import { PaginationState } from "@tanstack/react-table";
import { colors } from "@mui/material";
import { spacing } from "react-select/dist/declarations/src/theme";
import { BorderRight, Margin, Padding, WidthFull } from "@mui/icons-material";
import { max } from "lodash";
import { s } from "vite/dist/node/types.d-aGj9QkWt";
import { left } from "@popperjs/core";

const customStyles: any = {


  table: {
    style: {
      whiteSpace: 'nowrap',       // ✅ Allows wrapping
      wordBreak: 'break-word',    // ✅ Breaks long words
      textAlign: 'center',
      marginTop: "10px",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      border: "1px solid #EAECF0",
      backgroundColor: "#FFF",
      boxShadow:
        "0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)",
      overflow: "visible !important",
    },

  },



  rows: {
    style: {
      // '&:not(:last-of-type)': {
      // 	border: '1px solid #EAECF0',
      // },
      // borderRight: '1px solid #000',
    },


  },

  headRow: {
    style: {

      borderBottomWidth: "0",
      borderBottomColor: "transparent",
      borderBottomStyle: "solid",
      background: "linear-gradient(to right, #fef3c7, #fefce8, #fef3c7)",
      justifyContent: "space-between",
      // backgroundColor: "#0B2F46",
      // background: 'var(--Light Grayish Blue)',

    },
  },

  headCells: {
  style: {
    color: "#1f2937", // Tailwind's gray-800
    fontSize: "15px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    wordBreak: "break-word",
    textAlign: "center",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "12px",
    paddingRight: "12px",
    borderBottom: "2px solid #e5e7eb", // Tailwind gray-200
  },
},

cells: {
  style: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#344054", // Consistent dark gray
    padding: "10px 12px", // Corrected "Padding" to "padding" and made spacing even
    whiteSpace: "normal",
    lineHeight: "1.6",
    backgroundColor: "#ffffff", // Clean background
    borderBottom: "1px solid #f3f4f6", // Soft bottom border
    display: "flex",
    alignItems: "center",
    h6: {
               whiteSpace: "normal",       
         },
  },
},
  // headCells: {
  //   style: {


  //     // borderRight: "1px solid #e5e5e5",
  //     // overflow: "unset",
  //     color: "grey-700",
  //     fontSize: '15px',
  //     fontWeight: '600',
  //     overflow: 'unset',
  //     whiteSpace: 'nowrap',       // ✅ Allows wrapping
  //     wordBreak: 'break-word',    // ✅ Breaks long words
  //     textAlign: 'center',
  //     paddingTop: '5px',
  //     // Optional: for centered text
  //   },
  // },



  // cells: {
  //   style: {
  //     fontSize: "14px",
  //     fontWeight: "500",
  //     color: "#344054",
  //     Padding: "6px",
  //     h6: {
  //         whiteSpace: "normal",       
  //     },
  //   },
  // },



  pagination: {
    style: {
      color: '#f97316',
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      border: "1px solid #EAECF0",
      backgroundColor: "#FFF",
      boxShadow:
        " 0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)",
    },

  },
};

export const ReactTable = ({
  columns,
  data,
  loading = false,
  totalRows,
  onChangeRowsPerPage,
  onChangePage,
  rowsPerPageText,
  page,
  paginationRowsPerPageOptions,
  isServerPropsDisabled = false,
  pageIndexKey = String(pageIndex),
  pageSizeKey = String(pageSize),
}: {
  data: any;
  columns: any;
  loading: boolean;
  totalRows: number;
  onChangeRowsPerPage?: any;
  onChangePage?: any;
  rowsPerPageText?: number;
  page?: number;
  paginationRowsPerPageOptions?: any[],
  isServerPropsDisabled?: boolean;
  pageIndexKey?: string;
  pageSizeKey?: string;
}) => {

  return (

    <DataTable
      progressPending={loading}
      customStyles={customStyles}
      columns={columns}
      data={data}
      paginationPerPage={rowsPerPageText}
      pagination
      paginationDefaultPage={page}
      paginationServer={!isServerPropsDisabled}
      paginationRowsPerPageOptions={[1, 5, 10, 20, 30, 40, 50, 100, 200, 500]}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      paginationTotalRows={totalRows}
      responsive
    />

  )
};
