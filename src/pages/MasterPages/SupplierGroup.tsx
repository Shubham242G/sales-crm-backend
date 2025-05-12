import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { RiDeleteBin5Line } from "react-icons/ri";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { AiFillCloseSquare } from "react-icons/ai";
import { useState } from "react";
import { usedeleteSupplierGroupById, useUpdateSupplierGroupById, useAddSupplierGroup, useSupplierGroup } from "@/services/supplierGroup.service";
import { toastError, toastSuccess } from "@/utils/toast";
import moment from "moment";
function SupplierGroup() {
  const { mutateAsync: addSupplierGroup } = useAddSupplierGroup();
  const { mutateAsync: updateSupplierGroup } = useUpdateSupplierGroupById();
  const { mutateAsync: deleteSupplierGroup } = usedeleteSupplierGroupById();
  const { data: SupplierGroupData, isLoading } = useSupplierGroup();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [name, setName] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  // Sample data
  // const totalRows = data.length;
  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (newPerPage:any) => {
    setRowsPerPage(newPerPage);
  };

  const handleSubmit = async () => {
    try {
      if (!name || name == "") {
        toastError("Name is mandatory !!!");
        return
      }
      let obj = { name: name };


      if (isEditMode && selectedGroupId) {
        let { data: supplierUpdateRes } = await updateSupplierGroup({ id: selectedGroupId, obj });
        if (supplierUpdateRes.message) {
          toastSuccess(supplierUpdateRes.message);
          
        }
      } else {
        const { data: SupplierAddRes } = await addSupplierGroup(obj);
        if (SupplierAddRes.message) {
          toastSuccess(SupplierAddRes.message);
        }
      }
      setShowCreateModal(false);
      setName("");
      setIsEditMode(false);
      setSelectedGroupId("");
    } catch (error) {
      toastError(error);
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setIsEditMode(false);
    setName("");
  };

  const handleEdit = (group: any) => {
    setName(group.name);
    setSelectedGroupId(group._id);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      if (window && !window.confirm("Are you sure you want to delete this item ?")) {
        return
      }
      let { data: res } = await deleteSupplierGroup(id);
      if (res.message) {
        toastSuccess(res.message)
      }
    } catch (error) {
      toastError(error)
    }
  };

  const columns = [
    {
      name: "Sr No",
      selector: (row: any, index: any) => <>{index + 1}</>,
      width: "15%",
    },
    {
      name: "Group Name",
      selector: (row: any) => row.name,
      width: "35%",
    },
    {
      name: "Created at",
      selector: (row: any) => moment(row.createdAt).format("DD-MM-YYYY"),
      width: "35%",
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

  return (
    <>
      <Breadcrumb pageTitle="Supplier Group" pageCategory="Supplier" activePage="All Supplier Group" handleOpenCreateModal={handleOpenCreateModal} addbuttn={true} excelbuttn={false} filterbuttn={false} />
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
            data={SupplierGroupData.data}
            columns={columns}
            loading={isLoading}
            totalRows={SupplierGroupData.total || 0}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={currentPage}
            rowsPerPageText={rowsPerPage}
            paginationRowsPerPageOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* modal box for Supplier group */}

      <>
        {
          showCreateModal &&
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowCreateModal(!showCreateModal)}></div>
            <div className="fixed bg-white rounded-md lg:w-[30rem] h-[20vh] xl:w-[30rem] 3xl:w-[38rem]  top-[35%] inset-0 mx-auto animate-slide-in  z-[99999]">
              <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
                <h4 className="text-white text-lg font-medium">Create New Supplier Group</h4>
                <button type="button" onClick={() => setShowCreateModal(false)}><AiFillCloseSquare className="text-white text-3xl" /></button>
              </div>
              <div className="modal_body py-3 px-4">
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3">
                    <label className="block  tracking-wide text-txtcolor text-sm font-medium mb-2" htmlFor="grid-first-name">
                      Group Name <span className="text-red-500">*</span>
                    </label>
                    <input className="appearance-none  text-sm font-normal block w-full  text-lightgray border border-inputborder rounded p-2  mb-2 leading-tight focus:outline-none focus:border-primarycolor" id="grid-first-name" type="text" placeholder="Enter Group Name" onChange={(e) => setName(e.target.value)} value={name} />
                  </div>
                </div>
                <div className="w-full md:w-1/3 mt-3">
                  <button type="button" onClick={() => handleSubmit()} className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor">   {isEditMode ? "Update Group" : "Add Group"}</button>
                </div>
              </div>
            </div>
          </>
        }
      </>
    </>
  );
}

export default SupplierGroup;
