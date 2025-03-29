"use client";
import { FiEdit } from "react-icons/fi";
import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { RiDeleteBin5Line } from "react-icons/ri";
import Breadcrumb from "../../_components/Breadcrumb/Breadcrumb";
import { useCallback, useEffect, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import {
  useAddLedgerGroup,
  usedeleteLeadgerGroupById,
  useLedgerGroup,
  useUpdateLeadgerGroupById,
} from "../../services/ledgerGroup.service";
import { useLocation, useNavigate, useRoutes, useSearchParams } from "react-router-dom";
import moment from "moment";
import { toastSuccess } from "@/utils/toast";

function LedgerGroup() {
  const { mutateAsync: addLedgerGroup } = useAddLedgerGroup();
  const { mutateAsync: updateLedgerGroup } = useUpdateLeadgerGroupById();
  const { mutateAsync: deleteLedgerGroup } = usedeleteLeadgerGroupById();
  const { data: ledgerGroupData, isLoading } = useLedgerGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  
  const searchParams = useSearchParams()
  const navigate = useNavigate();
  const location = useLocation();




  const handleSubmit = async () => {
    try {
      let obj = { name: name };
      if (isEditMode && selectedGroupId) {
      let {data:res} = await updateLedgerGroup({ id: selectedGroupId, obj });
      if (res.message) {
        toastSuccess(res.message);
      }
      } else {
        const { data: res } = await addLedgerGroup(obj);
        if (res.message) {
          toastSuccess(res.message);
        }
      }
      setShowCreateModal(false);
      setName("");
      setIsEditMode(false);
      setSelectedGroupId("");
    } catch (error) {
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
     let {data:res} = await deleteLedgerGroup(id);
     if (res.message) {
      toastSuccess(res.message);
    }
    } catch (error) {
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
      <Breadcrumb
        pageTitle="Ledger Group"
        pageCategory="Ledger"
        activePage="All Ledger Group"
        handleOpenCreateModal={handleOpenCreateModal}
        addbuttn={true}
        excelbuttn={false}
        filterbuttn={false}
      />
      <div className="container px-6">
        <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5 ">
          <ReactTable
            data={ledgerGroupData.data}
            columns={columns}
            loading={isLoading}
            totalRows={ledgerGroupData.total || 0}
          />
        </div>
      </div>

      {/* modal box for creating/updating ledger group */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={() => setShowCreateModal(!showCreateModal)}
          ></div>
          <div className="fixed bg-white rounded-md lg:w-[30rem] h-[20vh] xl:w-[30rem] 3xl:w-[38rem] top-[35%] inset-0 mx-auto animate-slide-in z-[99999]">
            <div className="modal-header bg-custom-gradient p-2 px-4 flex justify-between">
              <h4 className="text-white text-lg font-medium">
                {isEditMode ? "Edit Ledger Group" : "Create New Ledger Group"}
              </h4>
              <button type="button" onClick={() => setShowCreateModal(false)}>
                <AiFillCloseSquare className="text-white text-3xl" />
              </button>
            </div>

            <div className="modal_body py-3 px-4">
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3">
                  <label
                    className="block tracking-wide text-txtcolor text-sm font-medium mb-2"
                    htmlFor="grid-first-name"
                  >
                    Group Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="appearance-none text-sm font-normal block w-full text-lightgray border border-inputborder rounded p-2 mb-2 leading-tight focus:outline-none focus:border-primarycolor"
                    type="text"
                    placeholder="Enter Group Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/3 mt-3">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-txtcolor text-white px-5 py-2 rounded-md text-text15 hover:bg-secondarycolor"
                >
                  {isEditMode ? "Update Group" : "Add Group"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LedgerGroup;
