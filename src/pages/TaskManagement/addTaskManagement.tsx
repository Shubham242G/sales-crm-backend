import {
  IReassignment,
  useAddTaskManagement,
  useTaskManagementById,
  useUpdateTaskManagementById,
} from "@/services/tastManagement.service";
import { useUser, useUserName } from "@/services/user.service";
import { getAuth } from "@/utils/auth";
import { toastError, toastSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { checkPermissionsForButtons } from "@/utils/permission";

const AddTaskManagement = ({ taskData }: { taskData?: any }) => {
  // Declare initial state for all form fields
  const [formData, setFormData] = useState({
    assignedTo: "",
    department: "",
    taskType: "",
    taskTitle: "",
    description: "",
    leadId: "",
    startDate: "",
    startTime: "",
    timeType: "",
    completionTime: "",
    options: [] as number[],
    reassignments: [] as IReassignment[],
  });

  const [newReassignment, setNewReassignment] = useState<IReassignment>({
    reAssignedTo: "",
    remark: "",
    previousAssignee: "",
    reAssignmentDate: new Date().toISOString().split("T")[0],
    assignedName: "",
    previousAssigneeName: "",
  });

  const [value, setValue] = useState(Boolean);

  let { canView, canUpdate, canCreate } = checkPermissionsForButtons("Task Management");

  let {
    canView: canVieweMyTask,
    canUpdate: canUpdateMyTask,
    canCreate: canCreateMyTask,
    canDelete: canDeleteMyTask,
  } = checkPermissionsForButtons("My Tasks");

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addTaskManagement } = useAddTaskManagement();
  const { mutateAsync: updateTaskManagement } = useUpdateTaskManagementById();
  const { data: TaskManagementDataById } = useTaskManagementById(id || "");

  const { data: userData } = useUserName();


  console.log(userData, "check userData");

  const usersOptions =
    userData?.data.map((user: any) => ({
      label: user.label,
      value: user.value,
    })) || [];

  const previousAssigneeArr = formData.reassignments.map(
    (item) => item.previousAssignee
  );


  const reassigningOptions = usersOptions.filter(
    (user:any) =>
      user.value !== formData.assignedTo &&
      !previousAssigneeArr.includes(user.value)
  );


  // const reassigningOptions = usersOptions.filter((user) => {
  //   const isAssigned =
  //     user.value === formData.assignedTo &&
  //     user.value === newReassignment.previousAssignee;

  //   return !isAssigned;
  // });

  // Populate initial state when taskData is available
  useEffect(() => {
    if (TaskManagementDataById && TaskManagementDataById?.data) {

      
      setFormData((prev: any) => ({
        ...prev,

        department: TaskManagementDataById.data.department || "",
        assignedTo: TaskManagementDataById.data.assignedTo,
        taskType: TaskManagementDataById.data.taskType || "",
        taskTitle: TaskManagementDataById.data.taskTitle || "",
        description: TaskManagementDataById.data.description || "",
        startDate: TaskManagementDataById.data.startDate || "",
        startTime: TaskManagementDataById.data.startTime || "",
        timeType: TaskManagementDataById.data.timeType || "",
        timeValue: TaskManagementDataById.data.timeValue || "",
        completionTime: TaskManagementDataById.data.completionTime || "",
        options: [],
        reassignments: TaskManagementDataById.data.reassignments || [],
      }));

      //   setFormData({
      //     ...formData,
      //     assignedTo: TaskManagementDataById?.data?.assignedTo || "",
      //     department: TaskManagementDataById?.data?.department || "",
      //     taskType: TaskManagementDataById?.data?.taskType || "",
      //     taskTitle: TaskManagementDataById?.data?.taskTitle || "",
      //     description: TaskManagementDataById?.data?.description || "",
      //     startDate: TaskManagementDataById?.data?.startDate || "",
      //     startTime: TaskManagementDataById?.data?.startTime || "",
      //     timeType: TaskManagementDataById?.data?.timeType || "",
      //     completionTime: TaskManagementDataById?.data?.completionTime || "",
      //     options: [],
      //   });
    }
  }, [TaskManagementDataById]);

 

  // Update timeType options when timeType changes
  useEffect(() => {
    if (formData.timeType === "days") {
      setFormData((prevState) => ({
        ...prevState,
        options: Array.from({ length: 31 }, (_, i) => i + 1),
      }));
    } else if (formData.timeType === "hours") {
      setFormData((prevState) => ({
        ...prevState,
        options: Array.from({ length: 24 }, (_, i) => i),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        options: [],
      }));
    }
  }, [formData.timeType]);

  const handleChange =
    (field: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleReassignChange =
    (field: keyof IReassignment) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setNewReassignment({
        ...newReassignment,
        [field]: event.target.value,
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   if (!formData.) {
      //     toastError("First Name is required");
      //     return;
      //   }

      //   if (!formData.lastName) {
      //     toastError("Last Name is required");
      //     return;
      //   }

      //   if (!formData.phone) {
      //     toastError("Phone Number is required");
      //     return;
      //   }


      let obj = { ...formData };

      if (newReassignment.reAssignedTo && formData.reassignments.length < 3) {
        newReassignment.previousAssignee = formData.assignedTo;
        newReassignment.reAssignmentDate = new Date()
          .toISOString()
          .split("T")[0];

        obj = {
          ...obj,
          reassignments: [...formData.reassignments, newReassignment],
          assignedTo: newReassignment.reAssignedTo,
        };
      }

      if (id) {
        const { data: res } = await updateTaskManagement({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/TaskManagement");
        }
      } else {
        const { data: res } = await addTaskManagement(obj);
        if (res?.message) {
          setFormData(obj);
          toastSuccess(res.message);
          navigate("/TaskManagement");
        }
      }
      
    } catch (error) {
      toastError(error);
    }
  };

  // const isEditable = Boolean(id);
  const isEditable = async () => {
    const decodedToken = await getAuth();
    const role = decodedToken.role;
    if (role === "ADMIN") {
      return true;
    }
    return false;
  };

  // let value;

  useEffect(() => {
    const fetchEditableStatus = async () => {
      const editableStatus = await isEditable();
      setValue(editableStatus);
    };

    fetchEditableStatus();
  }, [getAuth]);



  console.log(canCreate, canUpdate , "check can create")


  return (
    <div className="h-[90vh]  mt-16 p-6 overflow-y-auto">
      <div className="">
        <h1 className="text-2xl font-bold mb-6">
          {value ? "Task Content" : "Add New Task"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                className="input mb-6"
                value={formData.assignedTo}
                onChange={handleChange("assignedTo")}
              >
                <option value="">Selet Employee</option>
                {usersOptions.map((user:{label:string,value:string}) => (
                  <option key={user.value} value={user.value}>
                    {user?.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Task
              </label>
              <select
                className="input mb-6"
                value={formData.taskType}
                disabled={!value}
                onChange={handleChange("taskType")}
              >
                <option value="">Type of Task</option>
                <option value="Purpose of Visit">Purpose of Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled={!value}
                placeholder="Enter Task Title"
                value={formData.taskTitle}
                onChange={handleChange("taskTitle")}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              disabled={!value}
              placeholder="Enter additional instructions"
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled={!value}
                value={formData.startDate}
                  onClick={(e) =>
                          (e.target as HTMLInputElement).showPicker()
                        }
                onChange={handleChange("startDate")}
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-md p-2"
                disabled={!value}
                value={formData.startTime}
                onChange={handleChange("startTime")}
              />
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task to be completed in
              </label>
              <select
                disabled={!value}
                className="input mb-3"
                value={formData.timeType}
                onChange={handleChange("timeType")}
              >
                <option value="">Select Type</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>

              {formData.timeType && (
                <select
                  disabled={!value}
                  className="input"
                  value={formData.completionTime}
                  onChange={handleChange("completionTime")}
                >
                  <option value="">Select {formData.timeType}</option>
                  {formData.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {value && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              {
                <button
                  type="submit"
                  className=" px-3 py-1.5 bg-orange-500 text-white rounded-md"
                >
                  Submit
                </button>
              }
            </div>
          )}
        </form>
      </div>

      {id && (
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-12">
          <h1 className="text-2xl font-bold mb-6">{"Reassign Task"}</h1>
          <form onSubmit={handleSubmit}>
            {id && (
              <div className="border p-4 rounded-md mt-4 mb-10">
                <div className="mb-14">
                  <h2 className="text-xl font-semibold mb-4">
                    Reassignment History
                  </h2>
                  {/* List previous   reassignments */}
                  <div className="mb-10">
                    {formData.reassignments.length > 0 ? (
                      formData.reassignments.map((item, index) => (
                        <div
                          key={index}
                          className="border p-4 rounded-md mb-2 bg-gray-100"
                        >
                          <p>
                            <strong>Reassigned To:</strong> {item.assignedName}
                          </p>
                          <p>
                            <strong>Remark:</strong> {item.remark}
                          </p>
                          <p>
                            <strong>Previous Assignee:</strong>{" "}
                            {item.previousAssigneeName}
                          </p>
                          <p>
                            <strong>Reassignment Date:</strong>{" "}
                            {item.reAssignmentDate}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No reassignments yet.</p>
                    )}
                  </div>

                  {/* new reassignment*/}
                  {canUpdateMyTask && formData.reassignments.length < 3 ? (
                    <div className="border p-4 rounded-md mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        New Reassignment
                      </h3>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reassign To
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md p-2"
                          value={newReassignment.reAssignedTo}
                          onChange={handleReassignChange("reAssignedTo")}
                        >
                          <option value="">Select Employee</option>
                          {reassigningOptions.map((user: { label: string; value: string }) => (
                            <option key={user.value} value={user.value}>
                              {user.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remark
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2"
                          placeholder="Enter remark for reassignment"
                          rows={3}
                          value={newReassignment.remark}
                          onChange={handleReassignChange("remark")}
                        ></textarea>
                      </div>

                      <p className="text-sm text-gray-500">
                        <strong>Previous Assignee:</strong>{" "}
                        {TaskManagementDataById &&
                          TaskManagementDataById.data?.reassignments &&
                          TaskManagementDataById.data.reassignments.length >
                            0 &&
                          TaskManagementDataById.data.reassignments[
                            TaskManagementDataById.data.reassignments.length - 1
                          ].previousAssigneeName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Reassignment Date:</strong>{" "}
                        {new Date().toISOString().split("T")[0]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-600 mt-4">
                      {formData.reassignments.length >= 3
                        ? "This task has reached the maximum number of reassignments."
                        : "You do not have permission to reassign this task."}
                    </p>
                  )}
                </div>
              </div>
            )}

           <div className="fixed bottom-0 left-0 w-[85%] ml-[15%] bg-white border-t  border-gray-200  py-3 px-6 flex justify-start space-x-3 z-50">
              <button
                type="button"
                className=" px-3 py-1.5 border border-gray-300 rounded-md text-gray-700"
                onClick={() => navigate("/TaskManagement")}
          
              >
                Cancel
              </button>
              {((!id && canCreate) || (id && canUpdateMyTask)) && (
                <button
                  type="submit"
                  className=" px-3 py-1.5 bg-orange-500 text-white rounded-md"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTaskManagement;
