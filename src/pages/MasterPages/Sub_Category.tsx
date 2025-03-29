import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";

import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useCallback, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { usePagination } from "@/hooks/usePagination";
import { pageIndex, pageSize } from "@/common/constant.common";
import { ICategory, useCategory } from "@/services/category.service";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toastError, toastSuccess } from "@/utils/toast";
import moment from "moment";
import { debounce } from "lodash";
import { ISubCategory, useAddSubCategory, usedeleteSubCategoryById, useSubCategory, useUpdateSubCategoryById } from "@/services/subCategory.service";

// import { useState } from "react";

function SubCategory() {

  const [subcategory, setSubCategory] = useState("")


  const { mutateAsync: addCategory } = useAddSubCategory();
  const { mutateAsync: updateCategory } = useUpdateSubCategoryById();
  const { mutateAsync: deleteCategory } = usedeleteSubCategoryById();
  const [queryObj, setQueryObj] = useState<any>({});
  const { data: subCategoryData, isLoading } = useSubCategory(queryObj);
  const { data: categoryData } = useCategory({ isForSelectInput: true });

  const [status, setStatus] = useState("")
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<null | string>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const pagination = usePagination(true, pageIndex, pageSize);








  const handleSubmit = async () => {
    try {

      if (!categoryId || categoryId == "") {
        toastError("Category is mandatory !!!");
        return
      }
      if (name && name == "") {
        toastError("Name is mandatory !!!");
        return
      }

      let obj = { name: name, categoryId, status: status == "Active" ? true : false };
      if (isEditMode && selectedGroupId) {
        let { data: res } = await updateCategory({ id: selectedGroupId, obj });
        if (res.message) {
          toastSuccess(res.message);
        }
      } else {
        const { data: res } = await addCategory(obj);
        if (res.message) {
          toastSuccess(res.message);
        }
      }
      setShowCreateModal(false);
      setName("");
      setCategoryId(null);
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
    setCategoryId(null);
  };

  const handleEdit = (group: ISubCategory) => {
    setName(group.name);
    setCategoryId(group.categoryId);
    setStatus(group.status ? "Active" : "Inactive");
    setSelectedGroupId(group._id);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && window.confirm("Are you sure you want to delete this item ?")) {
        let {data:res} =await deleteCategory(id);
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
      name: "Sub Category Name",
      selector: (row: any) => row.name,
      width: "20%",
    },
    {
      name: "Category Name",
      selector: (row: any) => row.categoryName,
      width: "20%",
    },
    {
      name: "Status",
      width: "10%",
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
    debounce((e) => setQueryObj({ query: e })),
    []
  );

  return (
    <>
      <Breadcrumb pageTitle="Sub Category" pageCategory="Settings" activePage="All Sub Category" addbuttn={true} excelbuttn={false} filterbuttn={false} handleOpenCreateModal={handleOpenCreateModal} />
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
            data={subCategoryData.data}
            columns={columns}
            loading={isLoading}
            totalRows={subCategoryData.total || 0}
          />
        </div>
      </div>

      {/* modal box for supplier group */}

      <>
        {
          showCreateModal ?

            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(!showCreateModal)}></div>
              <div className="fixed bg-white rounded-md lg:w-[30rem] h-[34vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
                <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                  <h4 className="text-white text-lg font-medium">Create New Sub Category</h4>
                  <button type="button" onClick={() => setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
                </div>

                <div className="modal_body py-3 px-4">
                  <div className="flex flex-wrap -mx-3">

                    <div className="w-full px-3 ">
                      <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                        Select Category
                      </label>
                      <select onChange={(e) => setCategoryId(e.target.value)} value={categoryId || ""} name="categoryId" id="categoryId" className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none text-[#9ca3af] focus:border-primarycolor" defaultValue="Select Category">
                        <option value="">Select a Category</option>
                        {
                          categoryData && categoryData.data.length > 0 && categoryData.data.map((el: ICategory, index: any) => {
                            return (
                              <option value={el.value} key={index}>{el.label}</option>
                            )
                          })
                        }
                      </select>

                    </div>
                    <div className="w-full px-3">
                      <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                        Sub Category Name <span className="text-red-500">*</span>
                      </label>
                      <input className="appearance-none  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter Sub Category Name" onChange={(e) => setName(e.target.value)} value={name} />

                    </div>

                  </div>

                  <div className="w-full ">
                    <label className="block  tracking-wide text-secondarycolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Status
                    </label>
                    <select onChange={(e) => setStatus(e.target.value)} value={status} name="cars" id="cars" className="  text-sm font-normal block w-full  border border-[#dfdfdf] rounded p-2  mb-2 leading-tight focus:outline-none text-[#9ca3af] focus:border-primarycolor" defaultValue="Status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                  </div>

                  <div className="w-full md:w-1/2 mt-3">

                    <button type="button" onClick={handleSubmit} className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor">Add Sub Category</button>

                  </div>





                </div>
              </div>

            </>
            : ''
        }
      </>
    </>
  );
}

export default SubCategory;
