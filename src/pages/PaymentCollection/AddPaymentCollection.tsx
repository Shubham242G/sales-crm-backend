import { useState } from "react";

import Select from "react-select";
import { customReactStylesSmall, customReactStylesSmall1 } from "../../utils/ReactSelectStyle";
import moment from "moment";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";



export default function AddPaymentCollection() {
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



 

  return (
    <>
      <Breadcrumb
        pageTitle="Add Payment Collection"
        pageCategory="Payment Collection"
        previouspageurl="/payment-collection"
        activePage="Add Invoice Payment"
       
        addbuttn={true}
        withLink={true}
        excelbuttn={false}
        filterbuttn={true}
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

            
          </div>
    
        </div>

         
     
         {/* <div className="w-full mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-secondarycolor w-[8%] text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Save Payment
                  </button>
                </div> */}
         


        </div>
      </div>
    </>
  );
}
