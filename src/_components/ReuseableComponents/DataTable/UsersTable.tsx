import { colors } from '@mui/material';
import DataTable from 'react-data-table-component';

const customStyles: any = {
    table: {
        style: {
            marginTop: '25px',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            border: '1px solid #EAECF0',
            backgroundColor: '#FFF',
            boxShadow: '0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)',
            overflow: 'visible !important',
        
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
            borderBottomWidth: '0',
            borderBottomColor: 'transparent',
            borderBottomStyle: 'solid',
            backgroundColor: "#069096",

        },
    },

    headCells: {
        style: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#667085',
            paddingLeft: '10px',
            border: '1px solid #e5e5e5',
            overflow: 'unset',
           



        },
    },

    cells: {
        style: {
            padding: '12px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#667085',
            border: '1px solid #e5e5e5',
           
            

        },
    },
    pagination: {
        style: {
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            border: '1px solid #EAECF0',
            backgroundColor: '#FFF',
            boxShadow: ' 0px 0px 0px 0px rgba(16, 24, 40, 0.06), 0px 1px 8px 0px rgba(16, 24, 40, 0.10)',
        },
    },
};

export const UsersTable = ({ data, columns, ispaginate = true, }: { data: any, columns: any, ispaginate?: any }) => <DataTable data={data} columns={columns} pagination={ispaginate} customStyles={customStyles} selectableRows />



