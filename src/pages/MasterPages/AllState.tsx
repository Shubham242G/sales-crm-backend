import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";

import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useCallback, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { IState, useAddState, usedeleteStateById, useStates, useUpdateStateById } from "@/services/state.service";
import { debounce } from "lodash";
import { toastError, toastSuccess } from "@/utils/toast";
import { usePagination } from "@/hooks/usePagination";
import { pageIndex, pageSize } from "@/common/constant.common";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";

function AllState() {

  const [queryObj, setQueryObj] = useState<any>({});

  const { mutateAsync: addState } = useAddState();
  const { mutateAsync: updateState } = useUpdateStateById();
  const { mutateAsync: deleteState } = usedeleteStateById();
  const { data: StateData, isLoading } = useStates(queryObj);

  const [stateCode, setStateCode] = useState("")
  const [status, setStatus] = useState("")
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [name, setName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const pagination = usePagination(true, pageIndex, pageSize);



  const handleSubmit = async () => {
    try {

      if (name && name == "") {
        toastError("Name is mandatory !!!");
        return
      }

      if (stateCode && stateCode == "") {
        toastError("State Code is mandatory !!!");
        return
      }

      let obj = { name: name, stateCode, status: status == "Active" ? true : false };

      if (isEditMode && selectedGroupId) {
        let { data: res } = await updateState({ id: selectedGroupId, obj });
        if (res.message) {
          toastSuccess(res.message);
        }
      }
      else {
        const { data: res } = await addState(obj);
        if (res.message) {
          toastSuccess(res.message);
        }
      }

      setShowCreateModal(false);
      setName("");
      setIsEditMode(false);
      setSelectedGroupId("");

    } catch (error) {
      toastError(error)
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setIsEditMode(false);
    setName("");
  };

  const handleEdit = (group: IState) => {
    setName(group.name);
    setStatus(group.status ? "Active" : "Inactive");
    setStateCode(group.stateCode);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && window.confirm("Are you sure you want to delete this item ?")) {
        let { data: res } = await deleteState(id);
        if (res.message) {
          toastSuccess(res.message);
        }
      }
    } catch (error) {
      toastError(error)
    }
  };
























  const columns = [
    {
      name: "Sr No",
      selector: (_: any, index: number) => index + 1,
      width: "5%",
    },
    {
      name: "State Name",
      selector: (row: IState) => row.name,
      width: "30%",
    },
    {
      name: "State Code",
      selector: (row: IState) => row.stateCode,
      width: "10%",
    },
    {
      name: "Status",
      width: "20%",
      selector: (row: any) => (
        <h6 className={`${row.status == true ? "bg-greencolor" : "bg-red-400"} text-white text-[0.75rem] py-1 p-3 rounded-sm`}>{row.status ? "Active" : "In-Active"}</h6>
      ),
    },
    {
      name: "Created at",
      selector: (row: any) => moment(row.createdAt).format("DD-MM-YYYY"),
      width: "30%",
    },
    {
      name: "Action",
      width: "15%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-400 text-lg"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 text-lg"
          >
            <RiDeleteBin5Line />
          </button>
        </div>
      ),
    },
  ];


  const handleChangePageSize = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageIndex, String(pagination.pageIndex));
    params.set(pageSize, String(value));
    navigate(location.pathname + "?" + params.toString());
  }

  const debounceFn = useCallback(
    debounce((e) => setQueryObj({ query: e })),
    []
  );


  return (
    <>
      <Breadcrumb pageTitle="State" pageState="Settings" activePage="All State" addbuttn={true} excelbuttn={false} filterbuttn={false} handleOpenCreateModal={handleOpenCreateModal} />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <div className="search_boxes flex justify-between">
            <div className="w-[10%]">
              <select
                value={pagination.pageSize}
                onChange={(e: any) => handleChangePageSize(e.target.value)}
                className="rounded-sm w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
              </select>
            </div>
            <div className="w-[10%]">
              <input
                type="search"
                className="rounded-sm w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                onChange={(e) => debounceFn(e.target.value)}
              />
            </div>
          </div>
          <ReactTable
            data={StateData.data}
            columns={columns}
            loading={isLoading}
            totalRows={StateData.total || 0}
          />
        </div>
      </div>
      <>
        {
          showCreateModal &&
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(!showCreateModal)}></div>
              <div className="fixed bg-white rounded-md lg:w-[30rem] h-[27vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
                <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                  <h4 className="text-white text-lg font-medium">Create New State</h4>
                  <button type="button" onClick={() => setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
                </div>
                <div className="modal_body py-3 px-4">
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                        State Name <span className="text-red-500">*</span>
                      </label>
                      <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter State Name" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                      <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                        State Code <span className="text-red-500">*</span>
                      </label>
                      <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter State Code" onChange={(e) => setStateCode(e.target.value)} value={stateCode} />
                    </div>
                  </div>
                  <div className="w-full ">
                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select onChange={(e) => setStatus(e.target.value)} value={status} className="text-sm font-normal block w-full border border-[#dfdfdf] rounded p-2 mb-2 leading-tight focus:outline-none text-[#9ca3af] focus:border-primarycolor" defaultValue="Status">
                      <option value="Select State">Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/3 mt-3">
                    <button type="button" onClick={() => handleSubmit()} className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor">Add State</button>
                  </div>
                </div>
              </div>
            </>
        }
      </>
    </>
  );
}

export default AllState;
