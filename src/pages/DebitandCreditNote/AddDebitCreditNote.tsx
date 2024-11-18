

import { useState } from "react";


import Select from "react-select";
import { customReactStylesSmall } from "../../utils/ReactSelectStyle";
import moment from "moment";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";


export default function AddDebitCreditNote() {

    const [isClearable] = useState(true);
    const [isSearchable] = useState(true);
    const [isDisabled] = useState(false);
    const [isLoading] = useState(false);
    const [isRtl] = useState(false);

    const [voucherno,setVoucherNo] = useState("CN/24-25-2873")
    const [voucherdate,setVoucherDate] = useState(new Date())
    const [selectednote,setSelectedNote] = useState("creditnote")


  // react select options
  const options = [
    { value: "AllState", label: "All State" },
    { value: "Delhi", label: "Delhi" },
    { value: "Haryana", label: "Haryana" },
    { value: "Rajasthan", label: "Rajasthan" },
  ];
  const formatoptions:any = [
    { value: "CN", label: "CN" },
    { value: "DN", label: "DN" },
 
  ];




  return (
    <>
        <Breadcrumb
        pageTitle="Debit/Credit Note"
        pageCategory="Debit/Credit Note"
        previouspageurl="/debit-credit-note"
        activePage="Add Debit/Credit Note"
        addbuttn={false}
        withLink={true}
        excelbuttn={false}
        filterbuttn={false}
      
      />
<div className="container px-6">
        
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
            <div className="flex mb-3">
                <div className="w-1/4 flex gap-2">
                <input type="radio" id="debitnote"
                 value="debitnote"
          checked={selectednote === 'debitnote'}
           onChange={()=>setSelectedNote("debitnote")}/>
                <label htmlFor="debitnote">
                Debit Note
                </label>
               
                </div>
                <div className="w-1/4 flex gap-2">
                <input type="radio" id="creditnote"
                 value="creditnote"
                 checked={selectednote === 'creditnote'}
                 onChange={()=>setSelectedNote("creditnote")}/>
                <label htmlFor="creditnote">
                Credit Note
                </label>
               
                </div>
            </div>
      
        <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/4 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
              Select Party <span className="text-red-500">*</span>
                        </label>
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
                      <div className="w-full md:w-1/4 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
              Select Format
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name="selectformat"
                          options={formatoptions}
                          styles={customReactStylesSmall}
                          value={selectednote == "creditnote" ? formatoptions[0] : formatoptions[1]}
                        />
                      </div>
                     
                      <div className="w-full md:w-1/4 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                         Voucher No. <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder=""
                          type="text"
                          onChange={(e) => setVoucherNo(e.target.value)}
                          value={voucherno}
                        />
                      </div>
                      <div className="w-full md:w-1/4 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                         Voucher Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          placeholder=""
                          type="date"
                          onChange={(e) => setVoucherDate(new Date(e.target.value))}
                          value={moment(voucherdate).format("YYYY-MM-DD")}
                        />
                      </div>
                     
                  
                    </div>
      
        </div>
      </div>
   
    </>
  );
}
