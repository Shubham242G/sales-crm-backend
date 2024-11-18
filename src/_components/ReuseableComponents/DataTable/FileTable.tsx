
import DataTable from 'react-data-table-component'

const filetableCustomStyles: any = {
    table: {
        style: {
            marginTop: '10px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            border: 'none',
            backgroundColor: '#FFF',
            boxShadow: 'none',
            overflow: 'visible!important',
        },
    },


    rows: {
        style: {
            '&:not(:last-of-type)': {
            	border: '1px solid #EAECF0',
            },

            // borderRight: '1px solid #000',
            borderBottom: '1px solid #e5e5e5',


        },
    },


    headRow: {
        style: {
            borderBottomWidth: '0',
            borderBottomColor: 'transparent',
            borderBottomStyle: 'solid',
            backgroundColor: "transparent",

        },
    },

    headCells: {
        style: {
            fontSize: '15px',
            fontWeight: '600',
            // color: '#667085',
            paddingLeft: '10px',
            borderBottom: '1px solid #e5e5e5',
            overflow: 'unset',
            color: '#000',



        },
    },

    cells: {
        style: {
            padding: '12px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#667085',
            border:'none',

        },
    },
    pagination: {
        style: {
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            borderTop:"none",
            border: '1px solid #EAECF0',
            backgroundColor: '#FFF',
            // boxShadow: ' 0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)',
            boxShadow:"none",
        },
    },
};

const paginationComponentOptions = {
	rowsPerPageText: 'Items Per Page',
	rangeSeparatorText: 'of',
	selectAllRowsItem: true,
	selectAllRowsItemText: 'Todos',
    rowsperPage:20,
};

export const FileTable:any = ({ data, columns, ispaginate = true, }: { data: any, columns: any, ispaginate?: any })=> <DataTable data={data} columns={columns} pagination={ispaginate} paginationComponentOptions={paginationComponentOptions} customStyles={filetableCustomStyles} selectableRows />
