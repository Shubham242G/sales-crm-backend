import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useCallback, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { FaCirclePlus } from "react-icons/fa6";
import { IHsn, useAddHsn, usedeleteHsnById, useHsn, useUpdateHsnById } from "@/services/hsnCode.service";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { usePagination } from "@/hooks/usePagination";
import { pageIndex, pageSize } from "@/common/constant.common";
import { toastError, toastSuccess } from "@/utils/toast";
import moment from "moment";
import { debounce } from "lodash";
import { IGstSlab, useGstSlab } from "@/services/gstSlab.service";

function HSNCode() {
  const { mutateAsync: addHsn } = useAddHsn();
  const { mutateAsync: updateHsn } = useUpdateHsnById();
  const { mutateAsync: deleteHsn } = usedeleteHsnById();
  const [queryObj, setQueryObj] = useState<any>({});
  const { data: HsnData, isLoading } = useHsn(queryObj);
  const { data:gstData } = useGstSlab({});




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
      let obj = { name: name,rangesArr, status: status == "Active" ? true : false };
      if (isEditMode && selectedGroupId) {
       let {data:res} = await updateHsn({ id: selectedGroupId, obj });
        if(res.message){
          toastSuccess(res.message);
        }
      } else {
        const { data: res } = await addHsn(obj);
        if(res.message){
          toastSuccess(res.message);
        }
      }
      setShowCreateModal(false);
      setName("");
      setRangesArr([
        {
          startFrom: 0,
          endAt: 0,
          taxId: "",
        },
      ])
      setStatus("");
      setIsEditMode(false);
      setSelectedGroupId("");0
    } catch (error) {
      toastError(error)
    }
  };
  
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setIsEditMode(false);
    setName("");
    setStatus("");
    setRangesArr([
      {
        startFrom: 0,
        endAt: 0,
        taxId: "",
      },
    ])
  };

  const handleEdit = (group: IHsn) => {
    setName(group.name);
    setRangesArr(group.rangesArr|| [
      {
        startFrom: 0,
        endAt: 0,
        taxId: "",
      },
    ]);
    setStatus(group.status ? "Active" : "Inactive");
    setSelectedGroupId(group._id);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && window.confirm("Are you sure you want to delete this item ?")) {
       let {data:res}= await deleteHsn(id);
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
      name: "HSN Code",
      selector: (row: any) => row.name,
      width: "40%",
    },

    {
      name: "Status",
      width: "20%",
      selector: (row: any) => (
        <h6 className={`${row.status == true ? "bg-greencolor" : "bg-red-400"} text-white text-[0.75rem] py-1 p-3 rounded-md`}>{row.status ? "Active" : "In-Active"}</h6>
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

 
  const [rangesArr, setRangesArr] = useState([
    {
      startFrom: 0,
      endAt: 0,
      taxId: "",
    },
  ]);

  const handleHSNTable = (index: number, target: any) => {
    let temparr: any[] = [...rangesArr];
    let tempobj = { ...temparr[index] };
    tempobj[target?.name] = target.value;
    temparr[index] = tempobj;
    setRangesArr(temparr);
  };

  const handleAddHsn = () => {
    setRangesArr((prev: any) => [
      ...prev,
      {
        startFrom: "",
        endAt: "",
        taxId: "",
      },
    ]);
  };
  const handleRemoveHsn = (index: any) => {
    if (rangesArr.length > 1) {
      setRangesArr((prev: any) => [
        ...prev.filter((_: any, ind: any) => index != ind),
      ]);
    }
  };


  const handleChangePageSize = (value:string)=> {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageIndex,String(pagination.pageIndex));
    params.set(pageSize,  String(value));
    navigate(location.pathname + "?" + params.toString());
  }

  const debounceFn = useCallback(
    debounce((e) =>   setQueryObj({query:e})),
    []
);
  return (
    <>
      <Breadcrumb
        pageTitle="HSN Code"
        pageHsn="Settings"
        activePage="All HSN Code"
        addbuttn={true}
        excelbuttn={false}
        filterbuttn={false}
        handleOpenCreateModal={handleOpenCreateModal}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
        <div className="search_boxes flex justify-between">
            <div className="w-[10%]">
              <select
                value={pagination.pageSize}
                onChange={(e:any)=> handleChangePageSize(e.target.value)}
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
                onChange={(e)=> debounceFn(e.target.value)}
              />
            </div>
          </div>

          <ReactTable
            data={HsnData.data}
            columns={columns}
            loading={isLoading}
            totalRows={HsnData.total || 0}
          />
        </div>
      </div>

      {/* feedback modal */}

      <>
        {showCreateModal &&
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowCreateModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[37vh] xl:w-[30rem] 3xl:w-[58rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Create HSN Code
                </h4>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      HSN/SAC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      type="text"
                      placeholder="Enter HSN/SAC Code"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
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
                      defaultValue="Status"
                    >
                      <option value="Select Hsn">Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="hsnheader mt-4 ">
                  <div className="bg-txtcolor rounded-lg p-3 px-5">
                    <div className="flex">
                      <div className="w-1/3">0
                        <div className="range-from">
                          <h5 className="text-white font-normal text-text15">
                            Range From
                          </h5>
                        </div>
                      </div>
                      <div className="w-1/3">
                        <div className="range-to">
                          <h5 className="text-white font-normal text-text15">
                            Range To
                          </h5>
                        </div>
                      </div>
                      <div className="w-1/3">
                        <div className="TaxId">
                          <h5 className="text-white font-normal text-text15">
                            TaxId
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table_content bg-[#f7f7f7] p-3 ">
                    {/* repeating div is flex flex-wrap */}

                    {rangesArr &&
                      rangesArr.map((_:any, index) => (
                        <div className="flex flex-wrap gap-3" key={index}>
                          <div className="w-full md:w-[32%]">
                            <input
                              className="appearance-none   font-normal block w-full  text-sm border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                              id="grid-first-name"
                              type="number"
                              placeholder="Range From"
                              name="startFrom"
                              onChange={(e: any) =>
                                handleHSNTable(index, e.target)
                              }
                              value={_.startFrom}
                            />
                          </div>
                          <div className="w-full md:w-[32%]">
                            <input
                              className="appearance-none   font-normal block w-full  text-sm border border-inputborder rounded p-3  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                              id="grid-first-name"
                              type="number"
                              name="endAt"
                              placeholder="Range To"
                              onChange={(e: any) =>
                                handleHSNTable(index, e.target)
                              }
                              value={_.endAt}
                            />
                          </div>
                          <div className="w-full md:w-[32%]">
                            <div className="flex">
                              <div className="w-3/4">
                                <select
                                  onChange={(e: any) =>
                                    handleHSNTable(index, e.target)
                                  }
                                  value={_.taxId}
                                  name="taxId"
                                  id="cars"
                                  className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-3  mb-2 leading-tight focus:outline-none text-[#9ca3af] focus:border-primarycolor"
                                  defaultValue="TaxId"
                                >
                                  <option value="TaxId">Please select a tax slab</option>
                                  {
                                    gstData && gstData.data && gstData.data.length > 0 && gstData.data.map((el:IGstSlab, index:number)=> {
                                      return (
                                        <option key={index} value={el._id}>{el.cgst}%</option>
                                      )
                                    })
                                  }
                                </select>
                              </div>
                              <div className="w-1/4 flex justify-center items-center gap-2">
                           {
                            index == 0 && 
                            <>
                                 {/* for add more */}
                                 <button type="button" onClick={handleAddHsn}>
                                  <FaCirclePlus className="text-[#009efb] text-lg" />
                                </button>
                            </>
                           }
                                {/* for delete */}
                                {
                                  index != 0 &&
                                  <button
                                  type="button"
                                  onClick={() => handleRemoveHsn(index)}
                                >
                    
                                  <RiDeleteBin5Line className="text-red-500 text-lg" />
                                </button>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="w-full md:w-1/3 mt-3">
                  <button
                    type="button"
                    onClick={()=> handleSubmit()}
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    {" "}
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </>
        }
      </>
    </>
  );
}

export default HSNCode;
