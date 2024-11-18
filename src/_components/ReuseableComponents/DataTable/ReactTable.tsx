import { usePagination } from "@/hooks/usePagination";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "@/common/constant.common";
import { PaginationState } from "@tanstack/react-table";

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
      // backgroundColor: "#0B2F46",
      background: 'var(--Dark-Blue, #0B2F46)'
    },
  },

  headCells: {
    style: {
      fontSize: "13px",
      fontWeight: "500",
      // color: '#667085',
      paddingLeft: "10px",
  
      // border: "1px solid #e5e5e5",
      overflow: "unset",
      color: "#fff",
    },
  },

  cells: {
    style: {
      padding: "0px 8px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#667085",
      // border: "1px solid #e5e5e5",
    },
  },
  pagination: {
    style: {
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

  const location = useLocation();
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();

  const pagination = usePagination(true, pageIndexKey, pageSizeKey);

  console.log(totalRows,"totalRowstotalRowstotalRowstotalRows")
  onChangeRowsPerPage = (value:any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageIndexKey, String(pagination.pageIndex));
    params.set(pageSizeKey, String(value));
    navigate(location.pathname + "?" + params.toString());

  }
  onChangePage = (value:any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageIndexKey, String(value));
    params.set(pageSizeKey, String(pagination.pageSize));
    navigate(location.pathname + "?" + params.toString());
  }
  return (
    <DataTable
      progressPending={loading}
      customStyles={customStyles}
      columns={columns}
      data={data}
      paginationPerPage={pagination.pageSize}
      pagination
      paginationDefaultPage={pagination.pageIndex}
      paginationServer={!isServerPropsDisabled}
      paginationRowsPerPageOptions={[1, 5, 10, 20, 30,40, 50, 100, 200, 500]}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      paginationTotalRows={totalRows}
      responsive
    />
  )
}
  ;
