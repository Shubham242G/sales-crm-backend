import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { RiDeleteBin5Line } from "react-icons/ri";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
// import { toastError } from "../../utils/TOAST";
import { FaFileAlt } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";

export default function Agent() {
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [agentcode, setAgentCode] = useState("");
  const [broker, setBroker] = useState("");
  const [companyname, setCompanyName] = useState("");
  const [contactperson, setContactPerson] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [phone1, setPhone1] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [effectivedate, setEffectiveDate] = useState("");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [accountno, setAccountNo] = useState("");
  const [branch, setBranch] = useState("");
  const [ifsccode, setIFSCCode] = useState("");
  const [gstinno, setGSTINNo] = useState("");
  const [remark, setRemark] = useState("");

  const [status, setStatus] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleOpenFilterModal = () => {
    setShowFilterModal(true);
  };

  const columns = [
    {
      name: "Agent-Code",
      selector: (row: any) => row.code,
      width: "10%",
    },
    {
      name: "Company",
      selector: (row: any) => row.company,
      width: "20%",
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      width: "20%",
    },

    {
      name: "Mobile",
      selector: (row: any) => row.mobile,
      width: "15%",
    },

    {
      name: "Customer",
      selector: (row: any) => row.customer,
      width: "15%",
    },

    {
      name: "Status",
      width: "10%",
      selector: () => (
        <h6 className="bg-greencolor text-white text-[0.75rem] py-1 p-3 rounded-md">
          Active
        </h6>
      ),
    },
    {
      name: "Action",
      width: "10%",
      selector: () => (
        <div className="flex items-center gap-3">
          <button className="text-blue-400 text-lg">
            <FiEdit />
          </button>
          <button className="text-red-500 text-lg">
            <RiDeleteBin5Line />
          </button>
        </div>
      ),
    },
  ];

  // Sample data
  const data = [
    {
      code: "002",
      company: "Shyam Chopra",
      name: "Shyam Chopra",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "AG-003",
      company: "Associated Agency",
      name: "Associated Agency",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "002",
      company: "Shyam Chopra",
      name: "Shyam Chopra",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "AG-003",
      company: "Associated Agency",
      name: "Associated Agency",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "002",
      company: "Shyam Chopra",
      name: "Shyam Chopra",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "AG-003",
      company: "Associated Agency",
      name: "Associated Agency",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "002",
      company: "Shyam Chopra",
      name: "Shyam Chopra",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
    {
      code: "AG-003",
      company: "Associated Agency",
      name: "Associated Agency",
      mobile: "9968237063",
      customer: "2",
      status: "Active",
    },
  ];

  // const totalRows = data.length;

  // const handlePageChange = (page:any) => {
  //   setCurrentPage(page);

  // };

  // const handleRowsPerPageChange = (newPerPage:any) => {
  //   setRowsPerPage(newPerPage);

  // };

  return (
    <>
      {/* <Breadcrumb
        pageTitle="Agent"
        pageCategory="Agent"
        activePage="All Agent"
        addbuttn={true}
        excelbuttn={false}
        filterbuttn={true}
        handleOpenCreateModal={handleOpenCreateModal}
        handleOpenFilterModal={handleOpenFilterModal}
      /> */}
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

      <>
        {showCreateModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowCreateModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[72vh] xl:w-[30rem] 3xl:w-[40rem]  top-[18%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">Add Agent</h4>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 ps-3 pe-4">
                <div className="form_1 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2 flex items-center gap-2  ">
                      <FaFileAlt />
                      Personal Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Agent Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="AG-001"
                          onChange={(e) => setAgentCode(e.target.value)}
                          value={agentcode}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Broker <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={broker}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setBroker(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Company Name
                        </label>
                        <input
                          value={companyname}
                          className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Company"
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 -mx-3  px-3">
                      <div className="w-full md:w-[30%] ">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Name"
                          onChange={(e) => setContactPerson(e.target.value)}
                          value={contactperson}
                        />
                      </div>
                      <div className="w-full md:w-[65%] ">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 1 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={address1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          placeholder="Enter Address Line 1"
                          onChange={(e) => setAddress1(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Address 2 <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Address Line 2"
                          onChange={(e) => setAddress2(e.target.value)}
                          value={address2}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Phone 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={phone1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setPhone1(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Mobile 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={mobile1}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setMobile1(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Mobile 2
                        </label>
                        <input
                          value={mobile2}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Mobile No"
                          onChange={(e) => setMobile2(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter Email No."
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Effective Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={effectivedate}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="date"
                          placeholder="Enter Broker Name"
                          onChange={(e) => setEffectiveDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form_2 mb-3 border-l-4 border-[#ddd] ps-3">
                  <div className="flex items-baseline">
                    <h5 className="text-secondarycolor font-semibold text-lg mb-2 flex items-center gap-2  ">
                      <FaFileAlt />
                      Account Details
                    </h5>
                  </div>

                  <div className="form">
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Bank <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="AG-001"
                          onChange={(e) => setBank(e.target.value)}
                          value={bank}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Account No <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={accountno}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Account No"
                          onChange={(e) => setAccountNo(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Branch
                        </label>
                        <input
                          value={branch}
                          className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Company"
                          onChange={(e) => setBranch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2 py-[10px]  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-first-name"
                          type="text"
                          placeholder="Enter IFSC Code"
                          onChange={(e) => setIFSCCode(e.target.value)}
                          value={ifsccode}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Account No <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={gstinno}
                          className="appearance-none placeholder-[#9ca3af] text-sm font-normal block w-full    border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter GSTIN No"
                          onChange={(e) => setGSTINNo(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3">
                        <label
                          className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                          htmlFor="grid-first-name"
                        >
                          Remark
                        </label>
                        <input
                          value={remark}
                          className="appearance-none  text-sm font-normal block w-full   border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                          id="grid-last-name"
                          type="text"
                          placeholder="Enter Remark"
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/3 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    Add Agent
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </>

      {/* filter modal */}
      <>
        {showFilterModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowFilterModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[22vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium flex  items-center gap-2">
                  <MdOutlineFilterAlt className="text-white" /> Select and Apply
                  Filter
                </h4>
                <button type="button" onClick={() => setShowFilterModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3 ">
                    <label
                      className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
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

                <div className="w-full md:w-1/3 mt-3">
                  <button
                    type="submit"
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    Apply Filter
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
