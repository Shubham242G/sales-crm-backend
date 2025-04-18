import { usePagination } from "@/hooks/usePagination";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "@/common/constant.common";
import { PaginationState } from "@tanstack/react-table";
import { colors } from "@mui/material";
import { spacing } from "react-select/dist/declarations/src/theme";

const customStyles: any = {
  table: {
    style: {
      marginTop: "15px",
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
      background: "linear-gradient(to right, #fef3c7, #fefce8, #fef3c7)"
      // backgroundColor: "#0B2F46",
      // background: 'var(--Light Grayish Blue)',
      
    },
  },

  headCells: {
    style: {
      fontSize: "15px",
      fontWeight: "600",
      // color: '#667085',
      paddingLeft: "10px",

      // border: "1px solid #e5e5e5",
      overflow: "unset",
      color: "grey-700",
    },
  },

  cells: {
    style: {
      padding: "0px 8px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#grey-700",
      
      
      // border: "1px solid #e5e5e5",
    },
  },
  pagination: {
    style: {
      color:'#f97316',
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
      paginationRowsPerPageOptions={[1,5, 10, 20, 30, 40, 50, 100, 200, 500]}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      paginationTotalRows={totalRows}
      responsive
    />
  )
};
