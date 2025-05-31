import { usePagination } from "@/hooks/usePagination";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "@/common/constant.common";
import { PaginationState } from "@tanstack/react-table";
import { colors } from "@mui/material";
import { spacing } from "react-select/dist/declarations/src/theme";
import { BorderRight, Margin, Padding, WidthFull } from "@mui/icons-material";
import { max, pad } from "lodash";
import { i, s } from "vite/dist/node/types.d-aGj9QkWt";
import { left } from "@popperjs/core";
import { grey } from "@mui/material/colors";
import { h } from "vue";
import { Bold } from "lucide-react";

// const customStyles: any = {


//   table: {
//     style: {
//       whiteSpace: 'nowrap',       
//       wordBreak: 'break-word',    
//       textAlign: 'center',
//       marginTop: "10px",
//       borderTopLeftRadius: "8px",
//       borderTopRightRadius: "8px",
//       border: "1px solid #EAECF0",
//       backgroundColor: "#FFF",
//       boxShadow:
//         "0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)",
//       overflow: "visible !important",
//     },

//   },



//   rows: {
//     style: {
//       // '&:not(:last-of-type)': {
//       // 	border: '1px solid #EAECF0',
//       // },
//       // borderRight: '1px solid #000',
//     },


//   },

//   headRow: {
//     style: {

//       borderBottomWidth: "0",
//       borderBottomColor: "transparent",
//       borderBottomStyle: "solid",
//       background: "linear-gradient(to right, #fef3c7, #fefce8, #fef3c7)",
//       justifyContent: "space-between",
      

//     },
//   },

 


//   headCells: {
//     style: {

//       color: "grey-700",
//       fontSize: '15px',
//       fontWeight: '600',
//       overflow: 'unset',
//       whiteSpace: 'nowrap',       
//       wordBreak: 'break-word',    
//       textAlign: 'center',
//       paddingTop: '5px',
      
//     },
//   },



//   cells: {
//     style: {
//       fontSize: "14px",
//       fontWeight: "500",
//       color: "#344054",
//       Padding: "6px",
//       h6: {
//           whiteSpace: "normal",       
//       },
//     },
//   },



//   pagination: {
//     style: {
//       color: '#f97316',
//       borderBottomLeftRadius: "8px",
//       borderBottomRightRadius: "8px",
//       border: "1px solid #EAECF0",
//       backgroundColor: "#FFF",
//       boxShadow:
//         " 0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)",
//     },

//   },
// };
const customStyles: any = {
  table: {
    style: {
      whiteSpace: 'nowrap',
      wordBreak: 'break-word',
      textAlign: 'center',
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      border: "1px solid #EAECF0",
      backgroundColor: "#FFFFFF",
      boxShadow: "0px 1px 8px rgba(16, 24, 40, 0.10)",
    fontFamily: "'Satoshi_Regular', 'Zoho_Puvi_SemiBold', Arial, sans-serif",
   
   
    },
  },

  rows: {
    style: {
     
      // borderBottom: '1px solid #F2F4F7',
      // '&:hover': {
      //   backgroundColor: '#F9FAFB',
      // },
    },
  },

  headRow: {
    style: {
      background: "#F2F4F7",
      borderBottom: "1px solid #EAECF0",
      fontFamily: "'Satoshi_Regular', 'Zoho_Puvi_SemiBold', Arial, sans-serif",
       fontSize: '12px',
       
    
    },
  },

  headCells: {
    style: {
      color: '#6C7A99' ,
      fontSize: '12px',
      fontWeight: 600,
      textAlign: 'center',
      padding: '8px',
      letterSpacing: '0.5px',
      
      
    },
  },

  cells: {
    style: {
      fontSize: "13px",
      color: "#000000",
      height: "40px", 
      textAlign: 'center',
      h6: {
        whiteSpace: "normal",
      },

    },
  },

  pagination: {
    style: {
      color: '#475467',
      borderTop: '1px solid #EAECF0',
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      backgroundColor: "#FFFFFF",
      boxShadow: "0px -1px 8px rgba(16, 24, 40, 0.10)",
      fontFamily: "'Inter', sans-serif",
     
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
  check,
  paginationRowsPerPageOptions,
  isServerPropsDisabled = false,
  pageIndexKey = String(pageIndex),
  pageSizeKey = String(pageSize),
  className="",
  selectableRows ,
  onSelectedRowsChange,
   
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
  check?: boolean;
  className?: string;
  selectableRows?: boolean;
  onSelectedRowsChange?: any;
  
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
      paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 200, 500]}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      paginationTotalRows={totalRows}
      responsive
      selectableRows= {selectableRows }
       fixedHeader
      fixedHeaderScrollHeight="75vh"
      className={className}
     
      onSelectedRowsChange={onSelectedRowsChange}
    />

  )
};
