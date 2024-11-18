import { useState } from "react";

import Select from "react-select";
import { customReactStylesSmall, customReactStylesSmall1 } from "../../utils/ReactSelectStyle";
import moment from "moment";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import {
  
  FaLocationDot,
  FaMobileScreenButton,
} from "react-icons/fa6";


export default function EditPaymentCollection() {
  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [amountreceived, setAmountReceived] = useState("");
  const [paymentdate, setPaymentDate] = useState(new Date());
  const [receiptno, setReceiptNo] = useState("");
  const [remarks, setRemarks] = useState("");

  const [chequeno, setChequeNo] = useState("");
  const [paymenttablecheck, setPaymentTableCheck] = useState("");

  // react select options
  const options = [
    {
      value:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
      label:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
    },
    {
      value: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
      label: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
    },
    {
      value:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
      label:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
    },
    {
      value: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
      label: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
    },
    {
      value:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
      label:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
    },
    {
      value: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
      label: "(CS-1314)  GIRIRAJ KAILASH CHAND-CHANDANI CHOWK - Delhi - Delhi",
    },
  ];
  const formatoptions: any = [
    {
      value: "Discount/Scheme Sales @630790",
      label: "Discount/Scheme Sales @630790",
    },
  ];

  // array for the select assets rate tax amount

  const invoicetableArr = [
    {
      checkbox: paymenttablecheck,
     date:"17/04/2024",
     invoiceNo:"PD/24-25-1279",
     invoiceAmount:"120026.00",
     paidAmount:"0.00",
     amountDue:"120026.00",
     payment:"Amount",
    },
    {
      checkbox: paymenttablecheck,
     date:"17/04/2024",
     invoiceNo:"PD/24-25-1279",
     invoiceAmount:"120026.00",
     paidAmount:"0.00",
     amountDue:"120026.00",
     payment:"Amount",
    },
    {
      checkbox: paymenttablecheck,
     date:"17/04/2024",
     invoiceNo:"PD/24-25-1279",
     invoiceAmount:"120026.00",
     paidAmount:"0.00",
     amountDue:"120026.00",
     payment:"Amount",
    },
  ]

  return (
    <>
      <Breadcrumb
        pageTitle="Payment Collection"
        pageCategory="Payment Collection"
        previouspageurl="/payment-collection"
        activePage="Edit Invoice Payment"
       
        addbuttn={false}
        withLink={true}
        excelbuttn={false}
        filterbuttn={false}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
        

        <div className="top_sec bg-[#F9F9F9] p-2">
          <div className="flex gap-4">
            <div className="w-1/3">
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
                Select Party 
              </label>
              </div>

              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
             
             <Select
               className="basic-single"
               classNamePrefix="select"
               isDisabled={isDisabled}
               isLoading={isLoading}
               isClearable={isClearable}
               isRtl={isRtl}
               isSearchable={isSearchable}
               name="color"
               options={options}
               styles={customReactStylesSmall1}
             />
           </div>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
                Amount Received 
              </label>
              </div>
              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
              <input
                      className="appearance-none  text-sm font-normal block w-full   bg-white text-txtcolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="40805"
                      type="text"
                      onChange={(e) => setAmountReceived(e.target.value)}
                      value={amountreceived}
                    />
           
           </div>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
              Transaction Book 
              </label>
              </div>

              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
             
             <Select
               className="basic-single"
               classNamePrefix="select"
               isDisabled={isDisabled}
               isLoading={isLoading}
               isClearable={isClearable}
               isRtl={isRtl}
               isSearchable={isSearchable}
               name="color"
               options={options}
               styles={customReactStylesSmall}
             />
           </div>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
              Cheque No
              </label>
              </div>
              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
              <input
                      className="appearance-none  text-sm font-normal block w-full   bg-white text-txtcolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="006435"
                      type="text"
                      onChange={(e) => setChequeNo(e.target.value)}
                      value={chequeno}
                    />
           
           </div>
              </div>
            </div>
            </div>
            <div className="w-1/3">
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
                Payment Date  
              </label>
              </div>

              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
             
              <input
                className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                id="grid-first-name"
                placeholder=""
                type="date"
                onChange={(e) => setPaymentDate(new Date(e.target.value))}
                value={moment(paymentdate).format("YYYY-MM-DD")}
              />
           </div>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
              Receipt No
              </label>
              </div>
              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
              <input
                      className="appearance-none  text-sm font-normal block w-full border border-[#e5e5e5]   bg-white text-txtcolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="007969"
                      type="text"
                      onChange={(e) => setReceiptNo(e.target.value)}
                      value={receiptno}
                    />
           
           </div>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
              <label
                className="block  tracking-wide text-txtcolor  font-medium text-text15 "
                htmlFor="grid-first-name"
              >
              Remarks
              </label>
              </div>
              <span>:</span>
              <div className="w-4/5">
              <div className=" w-full px-3">
              <input
                      className="appearance-none  text-sm font-normal block w-full border border-[#e5e5e5]  bg-white text-txtcolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="006435"
                      type="text"
                      onChange={(e) => setRemarks(e.target.value)}
                      value={remarks}
                    />
           
           </div>
              </div>
            </div>

           
            </div>

            <div className="w-1/4">
            <div className="address_info border rounded-md border-[#e5e5e5] p-3">
<p className="flex mb-2 text-sm gap-2 items-center text-[#b3b3b3]"><FaLocationDot className="text-lg" />Rampur - 244924</p>
<p className="flex mb-2 text-sm gap-2 items-center text-[#b3b3b3]"><FaMobileScreenButton className="text-lg" />9045643351</p>
<p className="flex mb-2 text-sm gap-2 items-center text-[#b3b3b3]"><FaLocationDot className="text-lg" />GSTIN NO 09AAOFD7803J1Z1</p>
<h6 className="text-red-500 text-text15">Tally Name: Missing</h6>
            </div>
            </div>
          </div>
    
        </div>

         
         <div className="border-b border-[#e5e5e5] pb-5">
         <table className=" p-2  w-full">
            <tr>
              <th className="bg-[#efebeb]  border-r border-b border-[#e5e5e5] w-[5%]">
               
              </th>
              <th className="bg-[#efebeb]  border-r border-b border-[#e5e5e5] text-[0.75rem]  font-semibold text-secondarycolor  px-4 py-2 w-[25%]  ">
                Date
              </th>

              <th className="text-[0.75rem]  bg-[#efebeb] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] text-secondarycolor font-semibold  ">
                Invoice No
              </th>
              <th className="text-[0.75rem]  bg-[#efebeb] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] text-secondarycolor font-semibold  ">
                Invoice Amount
              </th>
              <th className="text-[0.75rem]  bg-[#efebeb] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%] text-secondarycolor font-semibold  ">
                Paid Amount
              </th>
              <th className="text-[0.75rem]  bg-[#efebeb] border-r border-b border-[#e5e5e5] px-3 py-2 w-[15%] text-secondarycolor font-semibold  ">
                Amount Due
              </th>
            
              <th className="text-[0.75rem]  bg-[#efebeb] border-r border-b border-[#e5e5e5] px-3 py-2 w-[20%] text-secondarycolor font-semibold  ">
                Payment
              </th>
            </tr>

         
              

                  {
                    invoicetableArr && invoicetableArr.map((el,index)=>
                    (
<tr key={index}>
<td className="border-r border-b border-[#e5e5e5] px-4">
                  <input type="checkbox" value={paymenttablecheck} onChange={(e)=>setPaymentTableCheck(e.target.value)}/>
                  </td>
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                 {el.date}
                  </td>

                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                {el.invoiceNo}
                  </td>
               
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                  {el.invoiceAmount}
                  </td>
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                  {el.paidAmount}
                  </td>
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                  {el.amountDue}
                  </td>
                  <td className="text-lightgrayy font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-2 px-3 text-center">
                  {el.payment}
                  </td>
</tr>
                    ))
                  }
                  
                 
               
       
             
             

          
          </table>



          <div className="flex justify-end mt-4">
           
              <div className="w-1/3">
<div className="amount flex items-center justify-between bg-[#F9F9F9] p-3 ">
<div className="w-1/2">
<p className="text-secondarycolor font-semibold  text-[0.85rem] py-1 mb-2 ">
                SubTotal
              </p>
<p className=" font-medium text-lightgrayy text-[0.8rem] py-1 ">
Amount Received
              </p>
<p className="text-lightgrayy font-medium  text-[0.8rem] py-1 ">
Amount Used for Payments
              </p>
<p className="text-lightgrayy font-medium  text-[0.8rem] py-1 ">
Amount Refunded
              </p>
<p className="text-lightgrayy font-medium  text-[0.8rem] py-1 ">
Amount in Excess
              </p>

</div>
<div className="w-1/2">
<p className="text-secondarycolor font-semibold  text-[0.8rem] py-1 text-end mb-2">
0
              </p>
<p className="text-secondarycolor font-semibold  text-[0.8rem] py-1 text-end">
40805.00
              </p>
<p className="text-secondarycolor font-semibold  text-[0.8rem] py-1 text-end">
0.00
              </p>
<p className="text-secondarycolor font-semibold  text-[0.8rem] py-1 text-end">

              </p>

<p className="text-secondarycolor font-semibold  text-[0.8rem] py-1 text-end">
40805.00

              </p>

</div>
</div>
              </div>
      

          
           
            
     

        
          </div>

         </div>
         <div className="w-full mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-secondarycolor w-[8%] text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Save Payment
                  </button>
                </div>
         


        </div>
      </div>
    </>
  );
}
