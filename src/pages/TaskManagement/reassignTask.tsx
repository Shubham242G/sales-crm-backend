import {
  useAddReassignTask,
  useReassignTaskById,
  useUpdateReassignTaskById,
} from "@/services/reassignTask.service";
import { useUser } from "@/services/user.service";
import { toastError, toastSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface IReassignTaskForm {
  reAssignedTo: string;
  department: string;
  remark: string;
  previousAssignee: string;
  description: string;
  reAssignmentDate: string;
  taskTitle: string;
}

const AddReassignTask = ({ taskData }: { taskData?: any }) => {
  const [formData, setFormData] = useState<IReassignTaskForm>({
    reAssignedTo: "",
    department: "",
    remark: "",
    previousAssignee: "",
    description: "",
    reAssignmentDate: "",
    taskTitle: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: addReassignTask } = useAddReassignTask();
  const { mutateAsync: updateReassignTask } = useUpdateReassignTaskById();
  const { data: ReassignTaskDataById } = useReassignTaskById(id || "");
  const { data: userData } = useUser();

  const usersOptions =
    userData?.data.map((user: any) => ({
      label: user.name,
      value: user._id,
    })) || [];

  useEffect(() => {
    if (ReassignTaskDataById?.data) {
      setFormData(ReassignTaskDataById.data);
    }
  }, [ReassignTaskDataById]);

  const handleChange =
    (field: keyof IReassignTaskForm) =>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   if (!formData.reAssignedTo) {
      //     toastError("Reassigned To is required");
      //     return;
      //   }
      //   if (!formData.department) {
      //     toastError("Department is required");
      //     return;
      //   }
      //   if (!formData.taskTitle) {
      //     toastError("Task Title is required");
      //     return;
      //   }
      //   if (!formData.reAssignmentDate) {
      //     toastError("Reassignment Date is required");
      //     return;
      //   }

      const obj = formData;

      if (id) {
        console.log(id, "cehck id ");
        const { data: res } = await updateReassignTask({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/TaskManagement");
        }
      } else {
        const { data: res } = await addReassignTask(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/TaskManagement");
        }
      }
    } catch (error) {
      toastError(error as string);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit" : "Add"} Reassignment Task
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter Department"
                value={formData.department}
                onChange={handleChange("department")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reassigned To
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.reAssignedTo}
                onChange={handleChange("reAssignedTo")}
              >
                <option value="">Select Employee</option>
                {usersOptions.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Assignee
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.previousAssignee}
                onChange={handleChange("previousAssignee")}
              >
                <option value="">Select Previous Assignee</option>
                {usersOptions.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
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
              placeholder="Enter task description"
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reassignment Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2"
                value={formData.reAssignmentDate}
                onChange={handleChange("reAssignmentDate")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter remark"
                value={formData.remark}
                onChange={handleChange("remark")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
              onClick={() => navigate("/ReassignTask")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReassignTask;
