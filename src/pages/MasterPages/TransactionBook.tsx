import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiFillCloseSquare } from "react-icons/ai";
import { useCallback, useState } from "react";
import moment from "moment";
import { ITransaction, useAddTransaction, usedeleteTransactionById, useTransaction, useUpdateTransactionById } from "@/services/transaction.service";
import { debounce } from "lodash";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { pageIndex, pageSize } from "@/common/constant.common";
import { usePagination } from "@/hooks/usePagination";
import { toastError, toastSuccess } from "@/utils/toast";

export default function TranscationBook() {

  const [balance, setBalance] = useState("")



  const { mutateAsync: addTransaction } = useAddTransaction();
  const { mutateAsync: updateTransaction } = useUpdateTransactionById();
  const { mutateAsync: deleteTransaction } = usedeleteTransactionById();
  const [queryObj, setQueryObj] = useState<any>({});
  const { data: TransactionData, isLoading } = useTransaction(queryObj);

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
      let obj = { name: name, balance: Number(balance), status: status == "Active" ? true : false };
      if (isEditMode && selectedGroupId) {
        let { data: res } = await updateTransaction({ id: selectedGroupId, obj });
        if (res.message) {
          toastSuccess(res.message);
        }
      } else {
        const { data: res } = await addTransaction(obj);
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

  const handleEdit = (group: ITransaction) => {
    setName(group.name);
    setBalance(String(group.balance));
    setStatus(group.status ? "Active" : "Inactive");
    if(group._id){
      setSelectedGroupId(group._id);
    }
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        return
      }
      if (window && window.confirm("Are you sure you want to delete this item ?")) {
        let { data: res } = await deleteTransaction(id);
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
      name: "Bank Name",
      selector: (row: ITransaction) => row.name,
      width: "20%",
    },
    {
      name: "Opening Balance",
      selector: (row: ITransaction) => row.balance,
      width: "20%",
    },


    {
      name: "Status",
      width: "20%",
      selector: (row: ITransaction) => (
        <h6 className={`${row.status == true ? "bg-greencolor" : "bg-red-400"} text-white text-[0.75rem] py-1 p-3 rounded-sm`}>{row.status ? "Active" : "In-Active"}</h6>
      ),
    },
    {
      name: "Created at",
      selector: (row: ITransaction) => moment(row.createdAt).format("DD-MM-YYYY"),
      width: "20%",
    },
    {
      name: "Action",
      width: "20%",
      selector: (row: ITransaction) => (
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
      <Breadcrumb pageTitle="Transaction Book" pageTransaction="Master" activePage="Transaction Book" addbuttn={true} excelbuttn={false} filterbuttn={false} handleOpenCreateModal={handleOpenCreateModal} />
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
            data={TransactionData.data}
            columns={columns}
            loading={isLoading}
            totalRows={TransactionData.total || 0}
          />
        </div>
      </div>

      <>
        {
          showCreateModal &&

          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(!showCreateModal)}></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[27vh] xl:w-[30rem]  3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">Create New Payment Mode</h4>
                <button type="button" onClick={() => setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
              </div>

              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter Bank Name" onChange={(e) => setName(e.target.value)} value={name} />

                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Opening Balance <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter Opening Balance" onChange={(e) => setBalance(e.target.value)} value={balance} />

                  </div>


                  <div className="w-full md:w-1/2 px-3">
                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select onChange={(e) => setStatus(e.target.value)} value={status} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none text-[#9ca3af] focus:border-primarycolor" defaultValue="Status">
                      <option value="Select Transaction">Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>


                    </select>

                  </div>

                </div>


                <div className="w-full md:w-1/3 mt-3">

                  <button type="button" onClick={() => handleSubmit()} className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor">Submit</button>

                </div>





              </div>
            </div>

          </>

        }
      </>
    </>
  );
}




