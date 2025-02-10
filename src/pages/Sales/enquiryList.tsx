import { ReactTable } from "../../_components/ReuseableComponents/DataTable/ReactTable";
import { FaEye, FaMobileScreenButton } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  FaFilter,
  FaFileExport,
  FaPlus,
  FaFileImport,
  FaToggleOn,
} from "react-icons/fa";
import {
  addEnquiryExel,
  getExel,
  useEnquiry,
  usedeleteEnquiryById,
  useUpdateEnquiryById,
  useEnquiryById,
  useConvert,
} from "@/services/enquiry.service";
import { toastSuccess, toastError } from "@/utils/toast";

import { generateFilePath } from "@/services/urls.service";
import moment from "moment";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Switch } from "@mui/material";
import { SiConvertio } from "react-icons/si";
import { useConvertRfpById } from "@/services/rfp.service";

function EnquiryLIst() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const searchObj = useMemo(
    () => ({
      ...(query && { query }),
      pageIndex: pageIndex - 1,
      pageSize,
    }),
    [pageIndex, pageSize, query]
  );

  const { data: EnquiryData } = useEnquiry(searchObj);
  console.log(EnquiryData, "check EnquiryData");
  const { mutateAsync: deleteEnquiry } = usedeleteEnquiryById();
  const { mutateAsync: updateEnquiry } = useUpdateEnquiryById();
  const { mutateAsync: convertEnquiry } = useConvert();
  const { mutateAsync: convertRfq } = useConvertRfpById();

  // Handle triggering file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await addEnquiryExel(formData);

      console.log(response, "check response");
      toastSuccess("Enquries imported successfully!");

      // Optionally refresh the data
      // You might want to add a refetch function from your useContact hook
    } catch (error) {
      toastError("Failed to import enquiries. Please try again.");
      console.error("Import Error:", error);
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle Export Contacts
  const handleExportEnquiries = async () => {
    try {
      const { data: response } = await getExel();
      console.log(response, "check response");
      const url = generateFilePath("/" + response.filename);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "enquiries.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toastSuccess("Enquries exported successfully!");
    } catch (error) {
      toastError("Failed to export enquiries. Please try again.");
      console.error("Export Error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        const { data: res } = await deleteEnquiry(id);
        if (res) {
          toastSuccess(res.message);
          // Optionally refresh the data
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const { data: res } = await updateEnquiry({ id, ...data });
      if (res) {
        toastSuccess(res.message);
        // Optionally refresh the data
      }
    } catch (error) {
      toastError(error);
    }
  }; const handleConvertEnquery = async (id: any) => {

    try {
        const { data: res } = await convertRfq(id)
        if (res) {
            toastSuccess(res.message)

        }

    }
    catch (error) {
        toastError(error)
    }


}
  const columns = [
    {
      name: "Customer Name",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.firstName+ " " + row.lastName}</h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Enquiry Type",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.enquiryType}</h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Loaction",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{row.city}</h6>
        </div>
      ),
      width: "13%",
    },
    {
      name: "Level of Enquiry",
      selector: (row: any) => (
        <div
          className={`flex gap-1 flex-col p-2 rounded-md  ${
            row.levelOfEnquiry === "moderate"
              ? "bg-yellow-200 text-white-100"
              : row.levelOfEnquiry === "Not Urgent"
              ? "bg-green-300 text-white-600"
              : row.levelOfEnquiry === "urgent" && "bg-red-300 text-red-600"
          }`}
        >
          <h6>{row.levelOfEnquiry}</h6>
        </div>
      ),
      width: "12%",
    },
    {
      name: "Check-In",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{moment(row.checkIn).format("YYYY-MM-DD")}</h6>
        </div>
      ),
      width: "9%",
    },
    {
      name: "Check-Out",
      selector: (row: any) => (
        <div className="flex gap-1 flex-col">
          <h6>{moment(row.checkOut).format("YYYY-MM-DD")}</h6>
        </div>
      ),
      width: "8%",
    },
    {
      name: "Number of Rooms",
      selector: (row: any) => row.noOfRooms,
      width: "12%",
    },
    {
      name: "Status",
      selector: (row: any) => (
        <div className="flex gap-1">
          <Switch defaultChecked />
        </div>
      ),
      width: "8%",
    },
    {
      name: "Action",
      width: "6%",
      selector: (row: any) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/addEnquiry/${row?._id}`}
            className="p-[6px] text-black-400 text-lg flex items-center"
            onClick={() => handleUpdate(row._id, row.data)}
          >
            <FaEye />
          </Link>
        </div>
      ),
    },
    {
      name: "Delete",
      width: "6%", // Adjusted width
      selector: (row: any) => (
        <button
          className="p-[6px] text-black-400 text-lg"
          onClick={() => handleDelete(row._id)}
        >
          <RiDeleteBin6Line />
        </button>
      ),
    },
    {
      name: "Convert to Enquiry",
            width: "10%",
            selector: (row: any) => (
                <div className="flex items-center gap-3">
                    <Link
                        to={`/add-sales-contact/${row?._id}`}
                        className="p-[6px] text-black-400 text-lg flex items-center"
                    >

                    </Link>
                    <button
                        className="p-[6px] text-black-400 text-lg"
                        onClick={() => handleConvertEnquery(row._id)}
                    >
                        <SiConvertio />
                    </button>
                </div>
            ),
    }
  ];

  return (
    <div className="container px-6">
      <div className="bg-white table_container rounded-xl shadow-xl p-6 -mt-5">
        <div className="search_boxes flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Enquiry List</h2>

          <div className="flex items-center justify-start gap-2">
            <div className="w-full">
              <input
                type="search"
                className="rounded-sm w-full border px-4 border-gray-300 py-2 text-center placeholder-txtcolor focus:outline-none focus:border-buttnhover"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300">
              <FaFilter /> Filter
            </button>

            <button
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
              onClick={handleExportEnquiries}
            >
              <FaFileExport /> Export
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />

            <button
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 border border-gray-300"
              onClick={handleImportClick}
              disabled={isUploading}
            >
              <FaFileImport />
              {isUploading ? "Importing..." : "Import"}
            </button>

            <button
              onClick={() => navigate("/addEnquiry")}
              className="flex w-full items-center justify-center gap-1 px-3 py-2 text-white rounded-md bg-orange-500 border border-gray-300"
            >
              <FaPlus />
              <span>New Enquiry</span>
            </button>
          </div>
        </div>

        <ReactTable
          data={EnquiryData?.data}
          columns={columns}
          loading={false}
          totalRows={EnquiryData?.total}
          onChangeRowsPerPage={setPageSize}
          onChangePage={setPageIndex}
          page={pageIndex}
          rowsPerPageText={pageSize}
          isServerPropsDisabled={false}
        />
      </div>
    </div>
  );
}

export default EnquiryLIst;
