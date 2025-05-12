import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";

import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { AiFillCloseSquare } from "react-icons/ai";
import { useCallback, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { debounce } from "lodash";
import moment from "moment";
import { toastError, toastSuccess } from "@/utils/toast";
import { IGstSlab, useAddGstSlab, usedeleteGstSlabById, useGstSlab, useUpdateGstSlabById } from "@/services/gstSlab.service";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { usePagination } from "@/hooks/usePagination";
import { pageIndex, pageSize } from "@/common/constant.common";


// import { useState } from "react";

function GSTSlab() {

  const { mutateAsync: addGstSlab } = useAddGstSlab();
  const { mutateAsync: updateGstSlab } = useUpdateGstSlabById();
  const { mutateAsync: deleteGstSlab } = usedeleteGstSlabById();
  const [queryObj, setQueryObj] = useState<any>({});
  const { data: GstSlabData, isLoading } = useGstSlab(queryObj);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cgst, setCGST] = useState(0)
  const [sgst, setSGST] = useState(0)
  const [igst, setIGST] = useState(0)


  const location = useLocation();
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const pagination = usePagination(true, pageIndex, pageSize);



  const handleSubmit = async () => {
    try {
      if (cgst && cgst == 0) {
        toastError("CGST is mandatory !!!");
        return
      }
      if (sgst && sgst == 0) {
        toastError("SGST is mandatory !!!");
        return
      }
      if (igst && igst == 0) {
        toastError("IGST is mandatory !!!");
        return
      }
      let obj = {
        cgst,
        sgst,
        igst
      };
      if (isEditMode && selectedGroupId) {
        let { data: res } = await updateGstSlab({ id: selectedGroupId, obj });
        if (res.message) {
          toastSuccess(res.message);
        }
      } else {
        const { data: res } = await addGstSlab(obj);
        if (res.message) {
          toastSuccess(res.message);
        }
      }
      setShowCreateModal(false);
      setCGST(0);
      setSGST(0);
      setIGST(0);
      setIsEditMode(false);
      setSelectedGroupId("");
    } catch (error) {
      toastError(error)
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setIsEditMode(false);
    setCGST(0);
    setSGST(0);
    setIGST(0);
  };

  const handleEdit = (group: IGstSlab) => {
    setCGST(group.cgst);
    setSGST(group.sgst);
    setIGST(group.igst);
    setSelectedGroupId(group._id);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && window.confirm("Are you sure you want to delete this item ?")) {
        let { data: res } = await deleteGstSlab(id);
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
      name: "CGST",
      selector: (row: any) => row.cgst,
      width: "20%",
    },


    {
      name: "SGST",
      selector: (row: any) => row.sgst,
      width: "20%",
    },


    {
      name: "IGST",
      selector: (row: any) => row.igst,
      width: "20%",
    },

    {
      name: "Created at",
      selector: (row: any) => moment(row.createdAt).format("DD-MM-YYYY"),
      width: "20%",
    },

    {
      name: "Action",
      width: "20%",
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
    debounce((e) => {
      let regExp = new RegExp("^[0-9]*$");

      if (regExp.test(e)) {
        setQueryObj({ query: e })
      }
      else {
        return
      }
    }),
    []
  );


  return (
    <>
      <Breadcrumb pageTitle="Gst Slab" pageGstSlab="Settings" activePage="All Gst Slab" addbuttn={true} excelbuttn={false} filterbuttn={false} handleOpenCreateModal={handleOpenCreateModal} />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <div className="search_boxes flex justify-between">
            <div className="w-[10%]">
              <select
                value={pagination.pageSize}
                onChange={(e: any) => handleChangePageSize(e.target.value)}
                className="rounded-md w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
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
                className="rounded-md w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                value={queryObj?.query || ""}
                onChange={(e) => debounceFn(e.target.value)}
              />
            </div>
          </div>
          <ReactTable
            data={GstSlabData.data}
            columns={columns}
            loading={isLoading}
            totalRows={GstSlabData.total || 0}
          />
        </div>
      </div>

      <>
        {
          showCreateModal &&
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(!showCreateModal)}></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[20vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">Create New Gst Slab</h4>
                <button type="button" onClick={() => setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
              </div>
              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-1/3 px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      CGST <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="number" placeholder="" onChange={(e) => setCGST(Number(e.target.value))} value={cgst} />
                  </div>
                  <div className="w-full md:w-1/3 px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      SGST <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="number" placeholder="" onChange={(e) => setSGST(Number(e.target.value))} value={sgst} />
                  </div>
                  <div className="w-full md:w-1/3 px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      IGST <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="number" placeholder="" onChange={(e) => setIGST(Number(e.target.value))} value={igst} />
                  </div>
                </div>
                <div className="w-full mt-3">
                  <button type="button" onClick={() => handleSubmit()} className="bg-txtcolor text-white w-full px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"> Add Slab</button>
                </div>
              </div>
            </div>
          </>
        }
      </>
    </>
  );
}

export default GSTSlab;
