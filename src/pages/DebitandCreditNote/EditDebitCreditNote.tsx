import { useState } from "react";

import Select from "react-select";
import { customReactStylesSmall } from "../../utils/ReactSelectStyle";
import moment from "moment";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import {
  FaCirclePlus,
  FaLocationDot,
  FaMobileScreenButton,
} from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function EditDebitCreditNote() {
  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [voucherno, setVoucherNo] = useState("CN/24-25-2873");
  const [invoiceno, setInvoiceNo] = useState("");
  const [voucherdate, setVoucherDate] = useState(new Date());
  const [invoicedate, setInvoiceDate] = useState(new Date());
  const [selectassets, setSelectAssets] = useState("");
  const [rate, setRate] = useState("");
  const [tax, setTax] = useState("");
  const [assetamount, setAssetAmount] = useState("");
  const [description, setDescription] = useState("");

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

  const [selectAssetsArr, setSelectAssetsArr] = useState([
    {
      selectassetsinput: formatoptions,
      rateamount: rate,
      tax: tax,
      assetAmount: assetamount,
    },
  ]);

  return (
    <>
      <Breadcrumb
        pageTitle="Debit/Credit Note"
        pageCategory="Debit/Credit Note"
        previouspageurl="/debit-credit-note"
        activePage="Edit Debit/Credit Note"
        addbuttn={true}
        withLink={true}
        excelbuttn={false}
        filterbuttn={true}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          {/* <div className="flex mb-3">
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
            </div> */}

          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block  tracking-wide text-txtcolor  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                Select Customer
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
                className="block  tracking-wide text-txtcolor  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                Voucher No. <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3   mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                id="grid-first-name"
                placeholder=""
                type="text"
                onChange={(e) => setVoucherNo(e.target.value)}
                value={voucherno}
                disabled
              />
            </div>
            <div className="w-full md:w-1/4 px-3">
              <label
                className="block  tracking-wide text-txtcolor  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                Voucher Date <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                id="grid-first-name"
                placeholder=""
                type="date"
                onChange={(e) => setVoucherDate(new Date(e.target.value))}
                value={moment(voucherdate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/4 px-3">
              <label
                className="block  tracking-wide text-txtcolor  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                Invoice No. <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3   mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                id="grid-first-name"
                placeholder=""
                type="text"
                onChange={(e) => setInvoiceNo(e.target.value)}
                value={invoiceno}
              />
            </div>
            <div className="w-full md:w-1/4 px-3">
              <label
                className="block  tracking-wide text-txtcolor font-medium mb-2"
                htmlFor="grid-first-name"
              >
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                id="grid-first-name"
                placeholder=""
                type="date"
                onChange={(e) => setInvoiceDate(new Date(e.target.value))}
                value={moment(invoicedate).format("YYYY-MM-DD")}
              />
            </div>

            <div className="w-full md:w-1/4 px-3">
              <label
                className="flex gap-2 items-center  tracking-wide text-[#938d8d]  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                <FaLocationDot className="text-lg text-[#938d8d]" /> Address
              </label>
              <h6 className="text-[0.8rem] text-[#938d8d] px-3">
                70, MOHALLA SITAV RAY, GHATA GHAR Uttar Pradesh Achhalda -
                243301
              </h6>
            </div>
            <div className="w-full md:w-1/4 px-3">
              <label
                className="flex gap-2 items-center  tracking-wide text-[#938d8d] text-text15  font-medium mb-2"
                htmlFor="grid-first-name"
              >
                <FaMobileScreenButton className="text-lg text-[#938d8d]" />{" "}
                9258400000
              </label>
              <h6 className="text-[0.8rem] text-[#938d8d] flex gap-2 items-center ">
                <span className="text-lg"> % </span> GSTIN NO 09ACUPG4713E1ZJ
              </h6>
            </div>
          </div>

          <table className="border p-2 border-[#e5e5e5] w-full">
            <tr>
              <th className="bg-[#fafbfb] text-[0.85rem] border-r border-b font-semibold text-secondarycolor border-[#e5e5e5] px-4 py-2 w-[35%]  ">
                Design
              </th>

              <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[15%]  ">
                Rate
              </th>
              <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-4 py-2 w-[35%] ">
                Tax
              </th>
              <th className="text-[0.85rem] border-r border-b border-[#e5e5e5] px-3 py-2 w-[15%]  ">
                Amount
              </th>
            </tr>

            {selectAssetsArr &&
              selectAssetsArr?.map((_: any, index: number) => (
                <tr>
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                    <input
                      className="appearance-none  text-sm font-normal block w-full   bg-[#fefbfb] text-secondarycolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="Select Assets"
                      type="text"
                      onChange={(e) => setSelectAssets(e.target.value)}
                      value={selectassets}
                    />
                  </td>

                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                    <input
                      className="appearance-none  text-sm font-normal block w-full   bg-[#fefbfb] text-secondarycolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                      placeholder="Select Assets"
                      type="text"
                      onChange={(e) => setRate(e.target.value)}
                      value={rate}
                    />
                  </td>
                  <td className="text-green-600 font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-1 text-center">
                    Tax
                  </td>
                  <td className="text-secondarycolor font-medium border-r border-b border-[#e5e5e5] text-[0.75rem] py-3 px-3 text-center">
                    Amount
                    {index == 0 && (
                      <>
                        {/* for add more */}
                        <button type="button">
                          <FaCirclePlus className="text-[#009efb] text-lg" />
                        </button>
                      </>
                    )}
                    {/* for delete */}
                    {index != 0 && (
                      <button type="button">
                        <RiDeleteBin5Line className="text-red-500 text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

          
          </table>

          <div className="flex">
            <div className="w-2/3 border-b border-r border-[#e5e5e5]">
            
            <div className="text-secondarycolor font-medium    py-3 px-3 ">
                {/* <Select
                          className="basic-single"
                          classNamePrefix="select"
                          isDisabled={isDisabled}
                          isLoading={isLoading}
                          isClearable={isClearable}
                          isRtl={isRtl}
                          isSearchable={isSearchable}
                          name=""
                          options={options}
                          styles={customReactStylesSmall}
                         value={formatoptions[0]}
                        /> */}
                <textarea
                rows={5}
                  className="appearance-none  text-sm font-normal block w-full   bg-[#fefbfb] text-txtcolor rounded p-3 mb-2 focus:outline-none focus:border-transparent"
                  placeholder="MELA SCHEME 2024-25 + 1367 DISCOUNT"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>
              </div>
              <div className="w-1/3">
<div className="amount flex ">
<div className="w-1/2">
<p className="text-secondarycolor font-medium  text-[0.8rem] py-3 px-3 text-center">
                Subtotal
              </p>
<p className=" font-medium text-[#6d6d6d] text-[0.8rem] py-3 px-3 text-center">
IGST (+)
              </p>
<p className="text-secondarycolor font-medium  text-[0.8rem] py-3 px-3 text-center">
Round off (+/-)
              </p>
<p className="text-secondarycolor font-semibold border border-[#e5e5e5]  mt-[26px] py-3 px-3 text-center">
Total (₹)           </p>
</div>
<div className="w-1/2">
<p className="text-secondarycolor font-medium  text-[0.8rem] py-3 px-3 text-center">
10149.00
              </p>
<p className="text-red-500 font-medium  text-[0.8rem] py-3 px-3 text-center">
1217.88
              </p>
<p className="text-red-500 font-medium  text-[0.8rem] py-3 px-3 text-center">
0.12
              </p>
<p className="text-secondarycolor font-semibold  border border-[#e5e5e5]  mt-[26px]  py-3 px-3 text-center">
11367.00
              </p>
</div>
</div>
              </div>
      

          
           
            
     

        
          </div>
        </div>
      </div>
    </>
  );
}
