import { AiFillCloseSquare } from "react-icons/ai";
import { toastError } from "../../../utils/toast";
import { useState } from "react";



export default function CreateCustomer({showCreateModal,setShowCreateModal}:any) {

    const [customerName,setCustomerName] = useState("")
    const [mobileno,setMobileNo] = useState("")
    const [state,setState] = useState("")



 


    const handleCreateAccount = (e:any) =>
    {
        e.preventDefault
        try {

            if (customerName) {
                toastError("Please Enter Customer Name!");
                return;
            }

            if (mobileno.toString().length !== 10) {
                toastError("Phone number must be 10 digits long!");
                return;
            }

          

            
        } catch (error) {
            
        }
    }



  

  return (
   <>
   {
        showCreateModal ?

          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"  onClick={() => setShowCreateModal(!showCreateModal)}></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[73vh] xl:w-[30rem] 3xl:w-[38rem] 2xl:w-[36rem] 3xl:w-[48rem] top-[15%] inset-0 mx-auto animate-slide-in  z-[99999]">
         <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
<h4 className="text-white text-lg font-medium">Create New Customer Account</h4>
<button type="button" onClick={()=>setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
         </div>

         <div className="modal_body py-3 px-4">
            <div className="form_1 mb-3">
            <div className="flex items-baseline">
        <h5 className="text-secondarycolor font-semibold text-lg mb-2  ">Customer Details</h5>
        <div className="border border-[#ddd] w-[78%] ms-2"></div>
        </div>

            <div className="form">
            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        Customer Name
                                    </label>
                                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Customer Name" onChange={(e) => setCustomerName(e.target.value)} value={customerName} />

                                </div>
                                <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                    Mobile No.
                                    </label>
                                    <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Mobile No." onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                                <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                    Address
                                    </label>
                                    <input value={mobileno} className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Address" onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-3">

                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        State
                                    </label>
                                    <select onChange={(e) => setState(e.target.value)} value={state} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select State">
                                        <option value="Select Category">Select State</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Haryana">Haryana</option>
                                    
                                    </select>

                                </div>
                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        City
                                    </label>
                                    <select onChange={(e) => setState(e.target.value)} value={state} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select City">
                                        <option value="Select Category">Select City</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Haryana">Haryana</option>
                                    
                                    </select>

                                </div>

                                <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                    Pincode
                                    </label>
                                    <input value={mobileno} className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Pincode" onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                      
                    
                            </div>
                            <div className="flex flex-wrap -mx-3">

                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        PAN No
                                    </label>
                               
                                    <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter PAN No." onChange={(e) => setMobileNo(e.target.value)} />
                                </div>

                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                    Aadhaar No
                                    </label>
                               
                                    <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Aadhaar No." onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                    

                             
                      
                    
                            </div>
                         
            </div>
            </div>

            <div className="form_2">
            <div className="flex items-baseline">
        <h5 className="text-secondarycolor font-semibold text-lg mb-2  ">Company Details</h5>
        <div className="border border-[#ddd] w-[78%] ms-2"></div>
        </div>

            <div className="form">
            <div className="flex flex-wrap -mx-3">

            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        Company Name
                                    </label>
                                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter Company Name" onChange={(e) => setCustomerName(e.target.value)} value={customerName} />

                                </div>

<div className="w-full md:w-1/3 px-3">
        <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
            GST No
        </label>
   
        <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter GST No." onChange={(e) => setMobileNo(e.target.value)} />
    </div>

    <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        Membership
                                    </label>
                                    <select onChange={(e) => setState(e.target.value)} value={state} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select Membership">
                                        <option value="Select Category">Select Membership</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Diamond">Diamond</option>
                                    
                                    </select>

                                </div>


 


</div>

                            <div className="flex flex-wrap -mx-3">

                       
                       

                                <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                    Credit Days
                                    </label>
                                    <input value={mobileno} className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Credit Days" onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                      
                    
                            </div>
                            <div className="flex flex-wrap -mx-3">

                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                        Credit Limit
                                    </label>
                               
                                    <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Credit Limit" onChange={(e) => setMobileNo(e.target.value)} />
                                </div>

                            <div className="w-full md:w-1/3 px-3">
                                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                                   Special Discount
                                    </label>
                               
                                    <input value={mobileno} className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter  Special Discount " onChange={(e) => setMobileNo(e.target.value)} />
                                </div>
                    

                             
                      
                    
                            </div>

                            <div className="flex flex-wrap -mx-3">

<div className="w-full md:w-1/3 px-3">
        <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
            Agent
        </label>
        <select onChange={(e) => setState(e.target.value)} value={state} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select Agent">
            <option value="Select Category">Select Agent</option>
            <option value="Mukesh Mittal">Mukesh Mittal</option>
            <option value="Shree Ganpati Agency">Shree Ganpati Agency</option>
            <option value="NITIN JI">NITIN JI</option>
        
        </select>

    </div>

    <div className="w-full md:w-1/3 px-3">
        <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
        Commision
        </label>
        <input value={mobileno} className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-last-name" type="text" placeholder="Enter Commision" onChange={(e) => setMobileNo(e.target.value)} />
    </div>
<div className="w-full md:w-1/3 px-3">
        <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
            Sales Executive
        </label>
        <select onChange={(e) => setState(e.target.value)} value={state} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none  focus:border-primarycolor" defaultValue="Select">
            <option value="Select Category">Select</option>
            <option value="SMS-016">SMS-016</option>
            <option value="SMS-017">SMS-017</option>
            <option value="SMS-018">SMS-018</option>
        
        </select>

    </div>




</div>

<div className="w-full md:w-1/3 mt-3">
     
       <button type="submit" onClick={()=>handleCreateAccount} className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor">Create Account</button>

    </div>
                         
            </div>
            </div>
   
         </div>
            </div>

          </>
          : ''
      }
   
   </>
  )
}
