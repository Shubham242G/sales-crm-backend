import { useState } from "react";

import Select from "react-select";
import {
  customReactStylesSmall1,
} from "../../utils/ReactSelectStyle";

import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";

export default function UpdateProduct() {
  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);
  const [isDisabled] = useState(false);
  const [isLoading] = useState(false);
  const [isRtl] = useState(false);

  const [productname, setProductName] = useState("SP-196-SRIKANTA-1");
  const [purchase, setPurchase] = useState("3190");
  const [ws, setWS] = useState("0");
  const [mrp, setMRP] = useState("4190");
  const [barcode,setBarCode] = useState("6001149435");
  // const [subcategory, setSubCategory] = useState("");
  // const [hsncode, setHSNCode] = useState("");
  const [status, setStatus] = useState("inactive");

  // react select options
  const options = [
    {
      value:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
      label:
        "(CS-3719)  PRAKASH SAREE CEnter   - anand nagar  - Uttar Pradesh - Mahrajganj",
    },
  ];
  const categoryoptions = [
    {
      value: "BRIDAL LEHENGAS",
      label: "BRIDAL LEHENGAS",
    },
  ];

  return (
    <>
      <Breadcrumb
        pageTitle="Update Item SP-196-SRIKANTA-1" // product ka code ayega yha pr
        pageCategory="Product"
        previouspageurl="/all-product"
        activePage="Update Item"
        addbuttn={true}
        withLink={true}
        excelbuttn={false}
        filterbuttn={true}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <div className="top_sec ">
            <div className="flex gap-4">
              <div className="w-3/4">
                <div className="flex items-center mb-2">
                  <div className="w-1/6">
                    <label
                      className="block  tracking-wide text-txtcolor  font-medium "
                      htmlFor="grid-first-name"
                    >
                      Party <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="w-2/3">
                    <div className=" w-full ">
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

                <div className="flex gap-5 mt-6">
                  <div className="w-1/2">
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Category <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            defaultValue={categoryoptions[0]}
                            options={categoryoptions}
                            styles={customReactStylesSmall1}
                          />
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Brand <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                  
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            defaultValue={categoryoptions[0]}
                            options={categoryoptions}
                            styles={customReactStylesSmall1}
                          />
                      
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Product Name <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                            id="grid-first-name"
                            type="text"
                            placeholder="Enter Product Name"
                            onChange={(e) => setProductName(e.target.value)}
                            value={productname}
                          />
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Purchase <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                            id="grid-first-name"
                            type="text"
                            placeholder="Enter Purchase Rate"
                            onChange={(e) => setPurchase(e.target.value)}
                            value={purchase}
                          />
                   
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          WS <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                        
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                            id="grid-first-name"
                            type="text"
                            placeholder="Enter Purchase Rate"
                            onChange={(e) => setWS(e.target.value)}
                            value={ws}
                          />
                        
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                         Sub Category <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            defaultValue={categoryoptions[0]}
                            options={categoryoptions}
                            styles={customReactStylesSmall1}
                            // value={subcategory}
                          />
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          HSN Code <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                  
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            isClearable={isClearable}
                            isRtl={isRtl}
                            isSearchable={isSearchable}
                            name="color"
                            defaultValue={categoryoptions[0]}
                            options={categoryoptions}
                            styles={customReactStylesSmall1}
                            // value={hsncode}
                          />
                      
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Barcode <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                            id="grid-first-name"
                            type="text"
                            placeholder="Enter Product Name"
                            onChange={(e) => setBarCode(e.target.value)}
                            value={barcode}
                          />
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          MRP <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                            id="grid-first-name"
                            type="text"
                            placeholder="Enter MRP Price"
                            onChange={(e) => setMRP(e.target.value)}
                            value={mrp}
                          />
                   
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-1/4">
                        <label
                          className="block  tracking-wide text-txtcolor  font-medium "
                          htmlFor="grid-first-name"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-3/4">
                      <select
                      onChange={(e) => setStatus(e.target.value)}
                      value={status}
                      name="cars"
                      id="cars"
                      className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor"
                      defaultValue="All Status"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                         
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-1/4">
              <div className="ip_box relative cursor-pointer">
                <label htmlFor="forfile" className="text-[#ccd0db] cursor-pointer font-semibold text-xl absolute flex items-center justify-center top-[25%] left-[12%] bg-white w-[80%] h-[50%]">Drop File Here or click to upload</label>
                <input type="file" id="forfile" className="border-2 border-dashed cursor-pointer border-[#009578] p-20 rounded-3xl" />
              </div>

              <div className="flex mt-4 gap-4">

               <button type="button" className="text-secondarycolor text-text15 flex items-center gap-3">
                
               Original Image - <span className="block w-[80px] h-[80px] border "></span>
                </button> 
               <button type="button" className="text-secondarycolor text-text15 flex items-center gap-3">
                
               Compress Image - <span className="block w-[80px] h-[80px] border "></span>
                </button> 
              </div>
  
              
              </div>
            </div>
          </div>

          <div className="w-full mt-3 ">
                  <button
                    type="submit"
                    className="bg-secondarycolor w-[8%] text-white  py-[10px] text-text15 rounded-md hover:bg-secondarycolor"
                  >
                    Update Product
                  </button>
                </div>
        </div>
      </div>
    </>
  );
}
