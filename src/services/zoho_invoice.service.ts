import { jsPDF } from "jspdf";

import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";

const prefix = "/zohoInvoice";

export interface IZohoInvoice {
  _id: string;
  invoice_id: string;
  invoice_number: string;
  date: string;
  status: string;
  customer_name: string;
  total: number;
  balance: number;
  currency_code: string;
  pdf_url: string;
  created_time: string;
  updated_time: string;
}

export const useZohoInvoiceApiHook = () => {
  // Get all invoices with filtering and pagination
  const getAllInvoices = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axios.get<GeneralApiResponsePagination<IZohoInvoice>>(`${BASE_URL}${prefix}/invoices?${query}`);
  };

  // Sync invoices from Zoho
  const syncInvoices = async () => {
    return axios.post<GeneralApiResponse<{ createdCount: number, updatedCount: number }>>(`${BASE_URL}${prefix}/sync`);
  };

  // Get a single invoice by ID
  const getInvoiceById = async (id: string) => {
    return axios.get<GeneralApiResponse<IZohoInvoice>>(`${BASE_URL}${prefix}/invoicesById/${id}`);
  };

  // Generate PDF for an invoice
  const generatePdf = async (invoiceId: string) => {
    return axios.get(`${BASE_URL}${prefix}/pdf/${invoiceId}`, {
      responseType: 'blob'
    });
  };

  return {
    getAllInvoices,
    syncInvoices,
    getInvoiceById,
    generatePdf
  };
};

// Hook for getting all invoices with pagination and search
export const useZohoInvoices = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
  const pagination = usePagination(getPaginationFromParams);
  const api = useZohoInvoiceApiHook();

  return useQuery({
    queryKey: ["zohoInvoices", pagination, searchObj],
    queryFn: () => api.getAllInvoices(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<IZohoInvoice>,
  });
};

// Hook for getting a single invoice by ID
export const useZohoInvoiceById = (id: string) => {
  const api = useZohoInvoiceApiHook();

  return useQuery({
    queryKey: ["zohoInvoice_id", id],
    queryFn: () => api.getInvoiceById(id).then((res) => res.data),
    enabled: !!id,
  });
};

// Hook for syncing invoices from Zoho
export const useSyncZohoInvoices = () => {
  const queryClient = useQueryClient();
  const api = useZohoInvoiceApiHook();

  return useMutation({
    mutationFn: api.syncInvoices,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["zohoInvoices"] });
    },
  });
};

// Hook for generating PDF for an invoice
export const useGenerateInvoicePdf = () => {
  const api = useZohoInvoiceApiHook();

  return useMutation({
    mutationFn: ({ invoiceId }: { invoiceId: string }) =>
      api.generatePdf(invoiceId).then(response => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        return response;
      })
  });
};




const generatePdfFromJson = (invoiceData: any) => {
  const doc = new jsPDF();

  // Set the title of the document
  doc.setFontSize(18);
  doc.text("Invoice", 20, 20);

  // Add the invoice data into the document
  doc.setFontSize(12);

  // Adding Invoice Number
  doc.text(`Invoice Number: ${invoiceData.invoice_number}`, 20, 40);
  doc.text(`Invoice Date: ${new Date(invoiceData.date).toLocaleDateString()}`, 20, 50);
  doc.text(`Customer: ${invoiceData.customer_name}`, 20, 60);
  doc.text(`Amount: ${invoiceData.currency_code} ${invoiceData.total.toFixed(2)}`, 20, 70);
  doc.text(`Balance: ${invoiceData.currency_code} ${invoiceData.balance.toFixed(2)}`, 20, 80);
  doc.text(`Status: ${invoiceData.status}`, 20, 90);

  // Optionally, you can add more data, loop through items, etc.

  // Save the generated PDF
  doc.save(`Invoice_${invoiceData.invoice_id}.pdf`);
};




export const downloadZohoInvoicePdf = async (invoiceId: string) => {
 
    const response = await axios.get(
      `${BASE_URL}${prefix}/invoicesById/${invoiceId}` // Don't use responseType: 'blob' here
    );



     try{
      generatePdfFromJson(response.data.data); } 
      catch (error) {
         console.error(error);
      }
    
};

