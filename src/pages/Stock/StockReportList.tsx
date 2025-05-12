
// import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { AiFillCloseSquare } from "react-icons/ai";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";

import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";


import { useState } from "react";

export default function StockReportList() {

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };


  const [openingstockqty,setOpeningStockQty] = useState("")







  const columns = [
  

    {
      name: "Date",
      selector: (row: any) =>
       row.date,
      width: "40%",
    },
    {
      name: "Ref No",
      selector: (row: any) =>
      <>
      <h6 className="text-green-500 text-wrap">{row.refno}</h6>
      </>
      ,
      width: "40%",
    },
 
    {
      name: "Quantity",
      selector: (row: any) =>
<>

      <h6 className="text-green-500 text-wrap">{row.qty}</h6>
</>,
      width: "20%",
    },



   
  ];

  // Sample data
  const data = [
    {
      
      date:"2024-10-30 11:19:05",
      refno:"Challan No : 5825 , Ref No: #12599 VENUS CREATION-SURAT",
      qty:"+6",
    
   
    },
   
   
  
  ];






  return (
    <>
      <Breadcrumb
        pageTitle="SP-184-VNS-MALAMAL / 6001149432" // product code ayega jis bhi product pr click hogi 
        pageCategory="All Product"
        activePage="HSN: 540752 /
VENUS CREATION-SURAT /
Stock: 6" // in active page its all about the product data dynamically from the table
        addbuttn={true}
        withLink={false}
        previouspageurl="/all-product"
         additionaltext="Opening"
        excelbuttn={false}
        filterbuttn={false}
        handleOpenCreateModal={handleOpenFilterModal}
        
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <div className="search_boxes flex justify-between">
            <div className="w-[10%]">
              <select
                name=""
                id=""
                className="rounded-md w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>
            <div className="w-[10%]">
              <input
                type="search"
                className="rounded-md w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
              />
            </div>
          </div>

          <ReactTable
            data={data}
            columns={columns} loading={false} totalRows={0}            // loading={loading}
            // totalRows={totalRows}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handleRowsPerPageChange}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>



       
    {/* filter modal */}
    <>
        {showFilterModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowFilterModal(!showFilterModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[24vh] xl:w-[40rem] 3xl:w-[50rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
               +  Add Opening Stock
                </h4>
                <button type="button" onClick={() => setShowFilterModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body  p-4">
                <div className="flex flex-wrap -mx-3 mb-3">
               
          
                <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Openning Stock Qty
                    </label>

                    <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="AG-001"
                          onChange={(e) => setOpeningStockQty(e.target.value)}
                          value={openingstockqty}
                        />
               

                </div>

                </div>
             

       
         
  
                <div className="w-full mt-3 ">
                  <button
                    type="submit"
                    className="bg-txtcolor w-full text-white  py-[9px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Add Stock
                  </button>
               
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>
    
    

  
     
    
    </>
  );
}
