


export const customReactStyles = {
    control: (base: any) => ({
        ...base,
        // border: '1px solid #D9D9D9 !important',
        // boxShadow: '0 !important',
        // padding:'8px',
        zindex:'3',
        // height:"40px",
        // minHeight:'30px',
        // '&:hover': {
        //     border: '2px solid #D9D9D9 !important',
        //     bgColor:"#990a3e",
        // },
        
      
        
    })
  };

// export const customReactStylessmall = {
//     control: (base: any) => ({
//         ...base,
//         fontSize:13,
//         border: '1px solid #D9D9D9 !important',
//         boxShadow: '0 !important',
//         padding:'4px',
//         '&:hover': {
//             border: '1px solid #D9D9D9 !important',
//             bgColor:"#990a3e",
//         },
        
//     })
//   };

  export const customReactStylesSmall = {
    control: (base: any, state: any) => ({
        ...base,

        fontSize: 13,
        border: '1px solid #D9D9D9',
        boxShadow: '0 !important',
        padding: '4px',
        '&:hover': {
            border: '1px solid #D9D9D9',
            // You cannot use bgColor here directly; use backgroundColor instead
        },
        backgroundColor: '#fafafa', // Background on focus
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? '#990a3e' : state.isFocused ? '#f0f0f0' : 'white',
        color: state.isSelected ? 'white' : 'black',
        '&:hover': {
            backgroundColor: '#d1d1d1', // Change hover color here
            color: 'black',
        },
    }),
};
  export const customReactStylesSmall1 = {
    control: (base: any, state: any) => ({
        ...base,

        fontSize: 13,
        border: '1px solid #D9D9D9',
        boxShadow: '0 !important',
        padding: '4px',
        '&:hover': {
            border: '1px solid #D9D9D9',
            // You cannot use bgColor here directly; use backgroundColor instead
        },
        backgroundColor: state.isFocused ? '#f0f0f0' : 'white', // Background on focus
    }),
    option: (base: any, state: any) => ({
        ...base,
        fontSize:11,
        backgroundColor: state.isSelected ? '#990a3e' : state.isFocused ? '#f0f0f0' : 'white',
        color: state.isSelected ? 'white' : 'black',
        '&:hover': {
            backgroundColor: '#d1d1d1', // Change hover color here
            color: 'black',
        },
    }),
};



 export const filetableCustomStyles: any = {
    table: {
        style: {
            marginTop: '32px',
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
            // color: '#667085',
            paddingLeft: '10px',
           border:'1px solid #e5e5e5',
            overflow: 'unset',
			color:'#fff',
            

			
        },
    },

    cells: {
        style: {
            padding: '12px 12px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#667085',
			border:'1px solid #e5e5e5',
			
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


// export const MuiCustomStyles: any ={

//     "& .MuiOutlinedInput-root": {
//         color: "#787878",
//         height:"60px",
//         "& .MuiOutlinedInput-notchedOutline": {
//           borderColor: "#DADCDE",
//           borderWidth: "2px",
//         },
//         "&.Mui-focused": {
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#069096",
//             borderWidth: "2px",
//           },
//         },
//         "&:hover:not(.Mui-focused)": {
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#ccc",
//           },
//         },
//       },
//       "& .MuiInputLabel-outlined": {
//         color: "#787878",
//         fontWeight: "500",
//         "&.Mui-focused": {
//           color: "#121111",
//           fontWeight: "600",
//         },
     
//    }
// };





// export const MuiStylesMultipleSelect: any ={


//     "& .MuiOutlinedInput-root": {
//         color: "#787878",
//         minHeight:"60px",
//         "& .MuiOutlinedInput-notchedOutline": {
//           borderColor: "#DADCDE",
//           borderWidth: "2px",
//         },
//         "&.Mui-focused": {
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#069096",
//             borderWidth: "2px",
//           },
//         },
//         "&:hover:not(.Mui-focused)": {
//           "& .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#ccc",
//           },
//         },
//       },
//       "& .MuiInputLabel-outlined": {
//         color: "#787878",
//         fontWeight: "500",
//         "&.Mui-focused": {
//           color: "#121111",
//           fontWeight: "600",
//         },
     
//    }
// };


export const radioCustomStyles: any = {
  
    color: "#069096",
    fontWeight:"600",
    '&.Mui-checked': {
      color: "#069096",
    },
 
}


// multi select styles 


  