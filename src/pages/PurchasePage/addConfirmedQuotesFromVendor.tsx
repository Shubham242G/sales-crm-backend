import { toastError, toastSuccess } from "@/utils/toast";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddConfirmedQuotes,
  useConfirmedQuotesById,
  useConfirmedQuotesByIdData,
  useConfirmedQuotesId,
  useUpdateConfirmedQuotesById,
} from "@/services/confirmedQuotesFromVendor.service";
import { checkPermissionsForButtons } from "@/utils/permission";
import moment from "moment";
import { FiUpload } from "react-icons/fi";

interface IChecklistItem {
  srNo: string;
  checks: string;
  actions: string;
}

interface IVendorList {
  label: string;
  value: string;
}

interface IConfirmedQuotes {
  banquetEventOrders: {
    eventCoordinatorName: string;
    eventDate: string;
    hotelName: string;
    eventCoordinatorReportingTime: string;
    clientsCompanyName: string;
    leadId: string;
    onsiteClientName: string;
    salesPersonName: string;
    expectedPax: string;
    quotesId: string;
    rfpId: string;
    vendorList: IVendorList;
    serviceType: string[];
    amount: string;
    receivedDate: string;
    status: string;
    attachment: string[];
  };

  banquetEventOrdersSecond: {
    eventStartTime: string;
    eventEndTime: string;
    btr: string;
    venueHandoveTime: string;
    welcomeDrinkStartTime: string;
    venueName: string;
    setup: string;
    avVendorName: string;
    avVendorNo: string;
    expNumberOfSeating: string;
    hotelCoordinationName: string;
    hotelCoordinationNo: string;
    linerColor: string;
    startersPlacement: string;
    startersEventTime: string;
  };

  menuSelection: {
    srNo: string;
    veg: string;
    nonVeg: string;
    actions: string;
  };

  eventFlow: {
    srNo: string;
    text1: string;
    text2: string;
    actions: string;
  };

  audioVisual: {
    srNo: string;
    text1: string;
    text2: string;
    actions: string;
  };

  checklist: IChecklistItem[];
}

const AddConfirmedQuotesFromVendor = () => {
  //   const { canCreate, canUpdate } =
  //     checkPermissionsForButtons("ConfirmedQuotes");

  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createConfirmedQuotes } = useAddConfirmedQuotes();
  const { mutateAsync: updateConfirmedQuotes } = useUpdateConfirmedQuotesById();
  const { data: confirmedQuotesDataById, isLoading } = useConfirmedQuotesById(
    id || ""
  );

  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const { data: confirmedQuotesId } = useConfirmedQuotesId();

  const [formData, setFormData] = useState<IConfirmedQuotes>({
    banquetEventOrders: {
      eventCoordinatorName: "",
      eventDate: "",
      hotelName: "",
      leadId: "",
      eventCoordinatorReportingTime: "",
      clientsCompanyName: "",
      onsiteClientName: "",
      salesPersonName: "",
      expectedPax: "",
      quotesId: "",
      rfpId: "",
      vendorList: { label: "", value: "" },
      serviceType: [],
      amount: "",
      receivedDate: "",
      status: "",
      attachment: [],
    },
    banquetEventOrdersSecond: {
      eventStartTime: "",
      eventEndTime: "",
      btr: "",
      venueHandoveTime: "",
      welcomeDrinkStartTime: "",
      venueName: "",
      setup: "",
      avVendorName: "",
      avVendorNo: "",
      expNumberOfSeating: "",
      hotelCoordinationName: "",
      hotelCoordinationNo: "",
      linerColor: "",
      startersPlacement: "",
      startersEventTime: "",
    },
    menuSelection: {
      srNo: "",
      veg: "",
      nonVeg: "",
      actions: "",
    },
    eventFlow: {
      srNo: "",
      text1: "",
      text2: "",
      actions: "",
    },
    audioVisual: {
      srNo: "",
      text1: "",
      text2: "",
      actions: "",
    },
    checklist: [
      {
        srNo: "01",
        checks: "",
        actions: "false",
      },
    ],
  });

  const { data: res, refetch } = useConfirmedQuotesByIdData(
    formData?.banquetEventOrders.quotesId
  );

  useEffect(() => {
    if (id && confirmedQuotesDataById?.data) {
      const data = confirmedQuotesDataById.data;
      setFormData({
        banquetEventOrders: {
          eventCoordinatorName:
            data.banquetEventOrders?.eventCoordinatorName || "",
          eventDate: data.banquetEventOrders?.eventDate
            ? moment(data.banquetEventOrders.eventDate).format("YYYY-MM-DD")
            : "",
          hotelName: data.banquetEventOrders?.hotelName || "",
          eventCoordinatorReportingTime:
            data.banquetEventOrders?.eventCoordinatorReportingTime || "",
          clientsCompanyName: data.banquetEventOrders?.clientsCompanyName || "",
          onsiteClientName: data.banquetEventOrders?.onsiteClientName || "",
          leadId: data.banquetEventOrders?.leadId || "",
          salesPersonName: data.banquetEventOrders?.salesPersonName || "",
          expectedPax: data.banquetEventOrders?.expectedPax || "",
          quotesId: data.banquetEventOrders?.quotesId || "",
          rfpId: data.banquetEventOrders?.rfpId || "",
          vendorList: data.banquetEventOrders?.vendorList || {
            label: "",
            value: "",
          },
          serviceType: data.banquetEventOrders?.serviceType || [],
          amount: data.banquetEventOrders?.amount || "",
          receivedDate: data.banquetEventOrders?.receivedDate
            ? moment(data.banquetEventOrders.receivedDate).format("YYYY-MM-DD")
            : "",
          status: data.banquetEventOrders?.status || "",
          attachment: data.banquetEventOrders?.attachment || [],
        },
        banquetEventOrdersSecond: {
          eventStartTime: data.banquetEventOrdersSecond?.eventStartTime || "",
          eventEndTime: data.banquetEventOrdersSecond?.eventEndTime || "",
          btr: data.banquetEventOrdersSecond?.btr || "",
          venueHandoveTime:
            data.banquetEventOrdersSecond?.venueHandoveTime || "",
          welcomeDrinkStartTime:
            data.banquetEventOrdersSecond?.welcomeDrinkStartTime || "",
          venueName: data.banquetEventOrdersSecond?.venueName || "",
          setup: data.banquetEventOrdersSecond?.setup || "",
          avVendorName: data.banquetEventOrdersSecond?.avVendorName || "",
          avVendorNo: data.banquetEventOrdersSecond?.avVendorNo || "",
          expNumberOfSeating:
            data.banquetEventOrdersSecond?.expNumberOfSeating || "",
          hotelCoordinationName:
            data.banquetEventOrdersSecond?.hotelCoordinationName || "",
          hotelCoordinationNo:
            data.banquetEventOrdersSecond?.hotelCoordinationNo || "",
          linerColor: data.banquetEventOrdersSecond?.linerColor || "",
          startersPlacement:
            data.banquetEventOrdersSecond?.startersPlacement || "",
          startersEventTime:
            data.banquetEventOrdersSecond?.startersEventTime || "",
        },
        menuSelection: data.menuSelection || {
          srNo: "",
          veg: "",
          nonVeg: "",
          actions: "",
        },
        eventFlow: data.eventFlow || {
          srNo: "",
          text1: "",
          text2: "",
          actions: "",
        },
        audioVisual: data.audioVisual || {
          srNo: "",
          text1: "",
          text2: "",
          actions: "",
        },
        checklist:
          data.checklist?.length > 0
            ? data.checklist
            : [{ srNo: "01", checks: "", actions: "false" }],
      });
    }
  }, [id, confirmedQuotesDataById]);

  useEffect(() => {
    refetch();
  }, [formData.banquetEventOrders.quotesId]);


  useEffect(() => {
    if (res && res.data) {
      const apiData = res.data;
      setFormData((prev) => ({
        ...prev,
        banquetEventOrders: {
          ...prev.banquetEventOrders,
          rfpId: apiData?.rfpId || "",
          vendorList: {
            label: apiData?.vendorList?.label || "",
            value: apiData?.vendorList?.value || "",
          },
          amount: apiData?.amount || "",
          receivedDate: apiData?.receivedDate
            ? moment(apiData.receivedDate).format("YYYY-MM-DD")
            : "",
          status: apiData?.status || "",
          attachment: apiData?.attachment || [],
        },
      }));
    }
  }, [res]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        banquetEventOrders: {
          ...formData.banquetEventOrders,
          eventDate: new Date(formData.banquetEventOrders.eventDate),
          receivedDate: new Date(
            formData.banquetEventOrders.receivedDate.toString()
          ),
        },
      };

      let obj = payload;

      if (id) {
        const { data: res } = await updateConfirmedQuotes({ id, obj });
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/confirmedQuotes");
        }
      } else {
        const { data: res } = await createConfirmedQuotes(obj);
        if (res?.message) {
          toastSuccess(res.message);
          navigate("/confirmedQuotes");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleAddChecklistItem = () => {
    const newSrNo = String(formData.checklist.length + 1).padStart(2, "0");
    setFormData({
      ...formData,
      checklist: [
        ...formData.checklist,
        {
          srNo: newSrNo,
          checks: "",
          actions: "false",
        },
      ],
    });
  };

  const handleRemoveChecklistItem = (index: number) => {
    const newChecklist = formData.checklist.filter((_, i) => i !== index);

    const updatedChecklist = newChecklist.map((item, i) => ({
      ...item,
      srNo: String(i + 1).padStart(2, "0"),
    }));
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const handleChecklistChange = (
    index: number,
    field: keyof IChecklistItem,
    value: string
  ) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index][field] = value;
    setFormData({ ...formData, checklist: newChecklist });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
          toastError(
            `${file.name} is not a valid file type (PDF, JPG, PNG only)`
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toastError(`${file.name} exceeds 10MB size limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        const fileReaders: Promise<string>[] = validFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.result) resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        Promise.all(fileReaders)
          .then((base64Files) => {
            setFormData((prev) => ({
              ...prev,
              banquetEventOrders: {
                ...prev.banquetEventOrders,
                attachment: [
                  ...prev.banquetEventOrders.attachment,
                  ...base64Files,
                ],
              },
            }));
            toastSuccess(`${validFiles.length} file(s) uploaded successfully`);
          })
          .catch((error) => {

            toastError("Error uploading files");
          });
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      banquetEventOrders: {
        ...prev.banquetEventOrders,
        attachment: prev.banquetEventOrders.attachment.filter(
          (_, i) => i !== index
        ),
      },
    }));
    toastSuccess("File removed successfully");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen m-[35px] bg-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Confirmed Quotes" : "Add Confirmed Quotes"}
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Banquet Event Orders Section */}
          <div className="border bg-gray-50 rounded-lg mt-8 p-6 shadow">
            <div className="mb-4 ">
              <label className="font-semibold" >Select Quote Id</label>
              <select
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                value={formData.banquetEventOrders.quotesId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banquetEventOrders: {
                      ...formData.banquetEventOrders,
                      quotesId: e.target.value,
                    },
                  })
                }
              >
                <option value=""> Select Quote Id</option>
                {confirmedQuotesId.data.map((value, index) => (
                  <option key={index} value={value.quotesId}>
                    {value.quotesId}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm  font-semibold text-black mb-2">
                RFP Id
              </label>
              <input
                type="text"
                value={formData.banquetEventOrders.rfpId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banquetEventOrders: {
                      ...formData.banquetEventOrders,
                      rfpId: e.target.value,
                    },
                  })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-md p-3 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter RFP Id"
                disabled
              />
            </div>

            <div className="mb-4 ">
              <label className="block mb-2  text-sm font-semibold text-black">
                Vendor
              </label>
              <input
                type="text"
                value={formData.banquetEventOrders.vendorList.label}
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-3 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Vendor Name"
                disabled
              />
            </div>

            <div className="mb-4 ">
              <label className="block text-sm  font-semibold text-black mb-2">
                Amount
              </label>
              <input
                type="text"
                value={formData.banquetEventOrders.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banquetEventOrders: {
                      ...formData.banquetEventOrders,
                      amount: e.target.value,
                    },
                  })
                }
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-3 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter amount"
                disabled
              />
            </div>

            <div className="mb-4 ">
              <label className="block text-sm font-semibold text-black mb-2">
                Received Date
              </label>
              <input
                type="date"
                value={formData.banquetEventOrders.receivedDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banquetEventOrders: {
                      ...formData.banquetEventOrders,
                      receivedDate: e.target.value,
                    },
                  })
                }
                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-3 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                disabled
              />
            </div>

            <div className="mb-4 ">
              <label className="block text-sm font-semibold text-black mb-2">
                Status
              </label>
              <select
                value={formData.banquetEventOrders.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    banquetEventOrders: {
                      ...formData.banquetEventOrders,
                      status: e.target.value,
                    },
                  })
                }
                className="w-full border bg-gray-50 border-gray-300 rounded-md p-3 text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                disabled
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-span-2 mb-[20px]">
              <label className="block text-sm font-semibold text-black mb-2">
                Attachment
              </label>
              <div className="items-center gap-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                  <FiUpload className="w-5 h-5" />
                  Upload Files
                </button>
                <div className="text-sm mb-[10px] text-gray-500">
                  (PDF, JPG, PNG only, max 10MB each)
                </div>
                
              </div>
              
              {/* Display Uploaded Files */}
              {formData.banquetEventOrders.attachment.length > 0 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.banquetEventOrders.attachment.map((file, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
                    >
                      {file.includes("pdf") ? (
                        <svg
                          className="w-10 h-10 text-red-500 mb-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0013.414 5L10 2.586A2 2 0 008.586 2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <img
                          src={file}
                          alt="uploaded"
                          className="w-16 h-16 object-cover rounded mb-2"
                        />
                      )}
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {file.includes("pdf") ? "View PDF" : "View Image"}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Event Coordinator Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.eventCoordinatorName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          eventCoordinatorName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter coordinator name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.banquetEventOrders.eventDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          eventDate: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.hotelName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          hotelName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter hotel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Event Coordinator Reporting Time
                  </label>
                  <input
                    type="time"
                    value={
                      formData.banquetEventOrders.eventCoordinatorReportingTime
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          eventCoordinatorReportingTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Client's Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.clientsCompanyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          clientsCompanyName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Onsite Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.onsiteClientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          onsiteClientName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Sales Person Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.salesPersonName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          salesPersonName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter sales person name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Expected Pax
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrders.expectedPax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrders: {
                          ...formData.banquetEventOrders,
                          expectedPax: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter expected pax"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banquet Event Orders Second Section */}
          <div className="border rounded-lg mt-8 p-6 shadow">
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Event Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.banquetEventOrdersSecond.eventStartTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          eventStartTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Event End Time
                  </label>
                  <input
                    type="time"
                    value={formData.banquetEventOrdersSecond.eventEndTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          eventEndTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    BTR
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.btr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          btr: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter BTR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Venue Handover Time
                  </label>
                  <input
                    type="time"
                    value={formData.banquetEventOrdersSecond.venueHandoveTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          venueHandoveTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Welcome Drink Start Time
                  </label>
                  <input
                    type="time"
                    value={
                      formData.banquetEventOrdersSecond.welcomeDrinkStartTime
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          welcomeDrinkStartTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.venueName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          venueName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Setup
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.setup}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          setup: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter setup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    AV Vendor Name
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.avVendorName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          avVendorName: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter AV vendor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    AV Vendor Number
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.banquetEventOrdersSecond.avVendorNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          avVendorNo: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter AV vendor number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Expected Number of Seating
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.banquetEventOrdersSecond.expNumberOfSeating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          expNumberOfSeating: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter expected seating"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Hotel Coordination Name
                  </label>
                  <input
                    type="text"
                    value={
                      formData.banquetEventOrdersSecond.hotelCoordinationName
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          hotelCoordinationName: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter coordination name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Hotel Coordination Number
                  </label>
                  <input
                    type="number"
                    value={
                      formData.banquetEventOrdersSecond.hotelCoordinationNo
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          hotelCoordinationNo: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter coordination number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Liner Color
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.linerColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          linerColor: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter liner color"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Starters Placement
                  </label>
                  <input
                    type="text"
                    value={formData.banquetEventOrdersSecond.startersPlacement}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          startersPlacement: e.target.value,
                        },
                      })
                    }
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                    placeholder="Enter starters placement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">
                    Starters Event Time
                  </label>
                  <input
                    type="time"
                    value={formData.banquetEventOrdersSecond.startersEventTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        banquetEventOrdersSecond: {
                          ...formData.banquetEventOrdersSecond,
                          startersEventTime: e.target.value,
                        },
                      })
                    }
                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                    className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Selection Section */}
          <div className="mb-8 mt-8 border border-gray-300 p-6 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Menu Selection</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Sr. No.
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.menuSelection.srNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menuSelection: {
                        ...formData.menuSelection,
                        srNo: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter serial number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Veg
                </label>
                <input
                  type="text"
                  value={formData.menuSelection.veg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menuSelection: {
                        ...formData.menuSelection,
                        veg: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter veg menu"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Non-Veg
                </label>
                <input
                  type="text"
                  value={formData.menuSelection.nonVeg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menuSelection: {
                        ...formData.menuSelection,
                        nonVeg: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter non-veg menu"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Actions
                </label>
                <input
                  type="text"
                  value={formData.menuSelection.actions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menuSelection: {
                        ...formData.menuSelection,
                        actions: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter actions"
                />
              </div>
            </div>
          </div>

          {/* Event Flow Section */}
          <div className="mb-8 border border-gray-300 p-6 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Event Flow</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Sr. No.
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.eventFlow.srNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventFlow: {
                        ...formData.eventFlow,
                        srNo: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter serial number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Text 1
                </label>
                <input
                  type="text"
                  value={formData.eventFlow.text1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventFlow: {
                        ...formData.eventFlow,
                        text1: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter text 1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Text 2
                </label>
                <input
                  type="text"
                  value={formData.eventFlow.text2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventFlow: {
                        ...formData.eventFlow,
                        text2: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter text 2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Actions
                </label>
                <input
                  type="text"
                  value={formData.eventFlow.actions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventFlow: {
                        ...formData.eventFlow,
                        actions: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter actions"
                />
              </div>
            </div>
          </div>

          {/* Audio Visual Section */}
          <div className="mb-8 border border-gray-300 p-6 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">Audio Visual</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Sr. No.
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.audioVisual.srNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioVisual: {
                        ...formData.audioVisual,
                        srNo: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter serial number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Text 1
                </label>
                <input
                  type="text"
                  value={formData.audioVisual.text1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioVisual: {
                        ...formData.audioVisual,
                        text1: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter text 1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Text 2
                </label>
                <input
                  type="text"
                  value={formData.audioVisual.text2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioVisual: {
                        ...formData.audioVisual,
                        text2: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter text 2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">
                  Actions
                </label>
                <input
                  type="text"
                  value={formData.audioVisual.actions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioVisual: {
                        ...formData.audioVisual,
                        actions: e.target.value,
                      },
                    })
                  }
                  className="w-full border bg-gray-50 border-gray-300 rounded-md p-2"
                  placeholder="Enter actions"
                />
              </div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Checklist</h2>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Checklist Items</h3>
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-md flex items-center"
              >
                Add New Item
              </button>
            </div>
            <table className="min-w-full ">
              <thead className="bg-stone-200  ">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-stone-800 border-b">
                    Sr. No.
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-stone-800 border-b">
                    Checks
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-stone-800 border-b">
                    Checkbox
                  </th>
                  {formData.checklist.length > 1 && (
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white border-b">
                        Actions
                      </th>
                    )}
                </tr>
              </thead>
              <tbody>
                {formData.checklist.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{item.srNo}</td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="text"
                        value={item.checks}
                        onChange={(e) =>
                          handleChecklistChange(index, "checks", e.target.value)
                        }
                        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2"
                        placeholder="Enter checklist description"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="checkbox"
                        checked={item.actions === "true"}
                        onChange={(e) =>
                          handleChecklistChange(
                            index,
                            "actions",
                            e.target.checked ? "true" : "false"
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      {formData.checklist.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(index)}
                          className="text-red-500 bg-gray-50 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-black"
            >
              Cancel
            </button>
            {
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Save
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddConfirmedQuotesFromVendor;
