import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";

import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { AiFillCloseSquare } from "react-icons/ai";
import { useState } from "react";
import {
  useAddBrand,
  useBrand,
  usedeleteBrandById,
  useUpdateBrandById,
} from "@/services/brand.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { RiDeleteBin5Line } from "react-icons/ri";

// import { useState } from "react";

function BrandList() {
  // const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const { mutateAsync: addBrand } = useAddBrand();
  const { mutateAsync: updateBrand } = useUpdateBrandById();
  const { mutateAsync: deleteBrand } = usedeleteBrandById();
  const { data: BrandData, isLoading } = useBrand();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };
  const handleSubmit = async () => {
    try {
      console.log(name, name == "", "namenamename");
      if (!name || name == "") {
        toastError("Name is mandatory !!!");
        return;
      }
      let obj = { name: name, status: status };

      if (isEditMode && selectedGroupId) {
        let { data: brandUpdateRes } = await updateBrand({
          id: selectedGroupId,
          obj,
        });
        if (brandUpdateRes.message) {
          toastSuccess(brandUpdateRes.message);
          console.log(`Brand with ID ${selectedGroupId} updated successfully`);
        }
      } else {
        const { data: brandAddRes } = await addBrand(obj);
        if (brandAddRes.message) {
          console.log(brandAddRes, "brandAddRes");
          toastSuccess(brandAddRes.message);
        }
      }
      setShowCreateModal(false);
      setName("");
      setIsEditMode(false);
      setStatus("");
      setSelectedGroupId("");
    } catch (error) {
      toastError(error);
      console.log(error, "Submit Error");
    }
  };


  const handleEdit = (group: any) => {
    setName(group.name);
    setSelectedGroupId(group._id);
    setStatus(group.status);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && !window.confirm("Are you sure you want to delete this item ?")) {
        return
      }
      let { data: res } = await deleteBrand(id);
      if (res.message) {
        toastSuccess(res.message)
      }
    } catch (error) {
      toastError(error)
    }
  };


  const columns = [
    {
      name: "Brand Name",
      selector: (row: any) => row.name,
      width: "50%",
    },

    {
      name: "Status",
      width: "15%",
      selector: (row: any) => (
        <h6
          className={`text-white text-[0.75rem] py-1 px-3 rounded-sm ${
            row.status ? "bg-greencolor" : "bg-red-500"
          }`}
        >
          {row.status ? "Active" : "Inactive"}
        </h6>
      ),
    },
    {
      name: "Created at",
      selector: (row: any) => row.createdAt,
      width: "20%",
    },

    {
      name: "Action",
      width: "15%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <button onClick={()=> handleEdit(row)} className="text-blue-400 text-lg">
            <FiEdit />
          </button>
          <button onClick={()=> handleDelete(row?._id)} className="text-red-500 text-lg">
            <RiDeleteBin5Line />
          </button>
        </div>
      ),
    },
  ];
  
  // Sample data

  // const totalRows = data.length;

  // const handlePageChange = (page:any) => {
  //   setCurrentPage(page);

  // };

  // const handleRowsPerPageChange = (newPerPage:any) => {
  //   setRowsPerPage(newPerPage);

  // };

  return (
    <>
      <Breadcrumb
        pageTitle="Brand"
        pageCategory="Settings"
        activePage="All Brand"
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
                name=""
                id=""
                className="rounded-sm w-full border border-buttnhover p-2  focus:outline-none focus:border-buttnhover"
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
                className="rounded-sm w-full border border-buttnhover p-2  placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
              />
            </div>
          </div>

          <ReactTable
            data={BrandData?.data}
            columns={columns}
            loading={isLoading}
            totalRows={BrandData.total} // loading={loading}
            // totalRows={totalRows}
            // onChangePage={handlePageChange}
            // onChangeRowsPerPage={handleRowsPerPageChange}
            // pagination
            // paginationPerPage={rowsPerPage}
            // paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* modal box for supplier group */}

      <>
        {showCreateModal ? (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
              onClick={() => setShowCreateModal(!showCreateModal)}
            ></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[27vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">
                  Create New Brand
                </h4>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  <AiFillCloseSquare className="text-white text-3xl" />
                </button>
              </div>

              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3">
                    <label
                      className="block  tracking-wide text-txtcolor text-sm font-medium mb-2"
                      htmlFor="grid-first-name"
                    >
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                      id="grid-first-name"
                      type="text"
                      placeholder="Enter Brand Name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                </div>
                <div className="w-full ">
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
                    <option value="Select Category">Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="w-full md:w-1/3 mt-3">
                  <button
                    onClick={() => handleSubmit()}
                    type="submit"
                    className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                  >
                    Add Brand
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

export default BrandList;
