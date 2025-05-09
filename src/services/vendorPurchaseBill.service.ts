import { jsPDF } from "jspdf";

import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/vendorPurchaseBill";

export interface IBillModel { 
    bill_id: string;
    vendor_id: string;
    vendor_name: string;
    status: string;
    color_code?: string;
    current_sub_status_id?: string;
    current_sub_status?: string;
    bill_number: string;
    reference_number?: string;
    date: string; // Consider Date type if you want: `Date`
    due_date: string; // same here
    due_days?: string;
    currency_id: string;
    currency_code: string;
    price_precision: number;
    exchange_rate: number;
    total: number;
    tds_total: number;
    balance: number;
    unprocessed_payment_amount: number;
    created_time: string;
    last_modified_time: string;
    attachment_name?: string;
    has_attachment: boolean;
    tags: string[];
    is_uber_bill: boolean;
    is_tally_bill: boolean;
    cf_sales_person?: string;
    cf_sales_person_unformatted?: string;
    cf_customer_name_branch?: string;
    cf_customer_name_branch_unformatted?: string;
    cf_invoice_status?: string;
    cf_invoice_status_unformatted?: string;
    entity_type: string;
    client_viewed_time?: string;
    is_viewed_by_client: boolean;
    branch_id: string;
    branch_name: string;
    location_id: string;
    is_bill_reconciliation_violated: boolean;
  }

export const useVendorPurchaseBillApiHook = () => {
  // Get all purchase bills with filtering and pagination
  const getAllBills = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();

    return axios.get<GeneralApiResponsePagination<IBillModel>>(`${BASE_URL}${prefix}/bills?${query}`);
  };

  // Sync purchase bills from Zoho
  const syncBills = async () => {
    return axios.get<GeneralApiResponse<{ createdCount: number; updatedCount: number }>>(`${BASE_URL}${prefix}/sync`);
  };

  // Get a single purchase bill by ID
  const getBillById = async (id: string) => {
    return axios.get<GeneralApiResponse<IBillModel>>(`${BASE_URL}${prefix}/bills/${id}`);
  };

  // Generate PDF for a purchase bill
  const generatePdf = async (billId: string) => {
    return axios.get(`${BASE_URL}${prefix}/pdf/${billId}`, {
      responseType: "blob",
    });
  };

   const deleteVendorPurchaseBillById = async (id: any) => {
      return axios.delete<GeneralApiResponse>(
        `${BASE_URL}${prefix}/delete/${id}`
      );
    };

  return {
    getAllBills,
    syncBills,
    getBillById,
    generatePdf,
    deleteVendorPurchaseBillById,
  };
};

// Hook for getting all purchase bills with pagination and search
export const useVendorPurchaseBills = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
  const pagination = usePagination(getPaginationFromParams);
  const api = useVendorPurchaseBillApiHook();

  return useQuery({
    queryKey: ["vendorPurchaseBills", pagination, searchObj],
    queryFn: () => api.getAllBills(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<IBillModel>,
  });
};

// Hook for getting a single purchase bill by ID
export const useVendorPurchaseBillById = (id: string) => {
  const api = useVendorPurchaseBillApiHook();

  return useQuery({
    queryKey: ["vendorPurchaseBill_id", id],
    queryFn: () => api.getBillById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const usedeleteVendorPurchaseBillById = () => {
  const api = useVendorPurchaseBillApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteVendorPurchaseBillById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["VendorPurchaseBills"] });
      // toastSuccess(res);
    },
  });
};

// Hook for syncing purchase bills from Zoho
export const useSyncVendorPurchaseBills = () => {
  const queryClient = useQueryClient();
  const api = useVendorPurchaseBillApiHook();

  return useMutation({
    mutationFn: api.syncBills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorPurchaseBills"] });
    },
  });
};

// Hook for generating PDF for a purchase bill
export const useGenerateVendorPurchaseBillPdf = () => {
  const api = useVendorPurchaseBillApiHook();

  return useMutation({
    mutationFn: ({ billId }: { billId: string }) =>
      api.generatePdf(billId).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `vendor-purchase-bill-${billId}.pdf`);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        return response;
      }),
  });
};



// Generate PDF from JSON data
const generatePdfFromJson = (billData: any) => {
  const doc = new jsPDF();

  // Set the title of the document
  doc.setFontSize(18);
  doc.text("Vendor Purchase Bill", 20, 20);

  // Add the bill data into the document
  doc.setFontSize(12);

  doc.text(`Bill Number: ${billData.bill_number}`, 20, 40);
  doc.text(`Bill Date: ${new Date(billData.bill_date).toLocaleDateString()}`, 20, 50);
  doc.text(`Vendor: ${billData.vendor_name}`, 20, 60);
  doc.text(`Amount: ${billData.currency_code} ${billData.total.toFixed(2)}`, 20, 70);
  doc.text(`Balance: ${billData.currency_code} ${billData.balance.toFixed(2)}`, 20, 80);
  doc.text(`Status: ${billData.status}`, 20, 90);

  // Save the generated PDF
  doc.save(`VendorPurchaseBill_${billData.bill_id}.pdf`);
};



export const downloadVendorPurchaseBillPdf = async (billId: string) => {
  const response = await axios.get(`${BASE_URL}${prefix}/bills/${billId}`);

  try {
    generatePdfFromJson(response.data.data);
  } catch (error) {
    console.error(error);
  }
};
