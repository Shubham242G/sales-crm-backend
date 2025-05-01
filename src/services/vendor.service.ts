import useAxiosAuth from "../libs/hooks/axios";
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, {
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./urls.service";
import axios from "../libs/hooks/axios";
import jsPDF from "jspdf";

const prefix = "/vendor";
export interface IVendor {
  vendor: {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    contactName: string;
    contactOwner: string;
    panNumber: string;
    gst: string;
    vendorType: string[];
    landLine: string;
    phoneNumber: string;
    displayName: string;
  };

  location: {
    state: string;
    city: string;
    area: string;
    address: string;
  };

  category: {
    categoryType: string;
  };

  rooms: {
    roomCategory: string;
    numberOfRooms: number;
    roomSize: string;
    roomImageUpload: string[];
    prices: {
      roomType: string;
      roomPrice: string;
    }[];
  }[];


  isBanquetDetailsVisible: boolean;
  isRestaurantDetailsVisible: boolean;


  banquets: {
    numberOfBanquests: string;
    banquetCategory: string;
    banquetSize: string;
    banquetImageUpload: string[];
    banquetName: string;
    banquetSetup: string;
    banquetVegPrice: string;
    banquetNonVegPrice: string;
    banquetFloor: string;
    prefuntionAreaSize: string;
  }[];

  restaurant: {
    restaurantMenuType: string[];
    restaurantImageUpload: string[];
    restaurantCovers: string;
    restaurantFloor: string;
    restaurantSwimmingPool: string;
  };

  bankDetails: {
    bankName: string;
    bankAccountNumber: string;
    ifsc: string;
    pointOfContact: string;
    email: string;
    phoneNumber: string;
    billingAddress: string;
  };

  eventServices: {
    services: string;
    rate: string;
  }[];

  eventLocation: {
    state: string;
    city: string;
    area: string;
    serviceAreas: string[];
  };

  transportLocation: {
    state: string;
    city: string;
    travelLocal: boolean;
    travelOutStation: boolean;
    serviceAreas: string[];
    carDetails: {
      carType: string;
      numberOfCars: number;
      fourHr40Km: string;
      eightHr80Km: string;
      fullDay100Km: string;
      airportTransfer: string;
    }[];
  };

  otherDetails: {
    sourceOfSupply: string;
    gstTreatment: string;
    gstin: string;
    pan: string;
    msmeRegistered: boolean;
    currency: string;
    openingBalanceState: string;
    openingBalance: string;
    creditLimit: string;
    paymentTerms: string;
    tds: string;
    priceList: string;
    enablePortal: boolean;
    portalLanguage: string;
    documents?: [];
    websiteUrl: string;
    department: string;
    designation: string;
    skype: string;
    facebook: string;
    twitter: string;
  };

  billingAddress: {
    addressId: string;
    //   attention : string;
    billingCountry: string;
    billingAddressStreet1: string;
    billingAddressStreet2: string;
    billingCity: string;
    billingState: string;
    billingPincode: string;
    billingPhone: string;
    billingFaxNumber: string;
  };

  shipppingAddress: {
    //   attention : string;
    shippingCountry: string;
    shippingAddressStreet1: string;
    shippingAddressStreet2: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
    shippingPhone: string;
    shippingFaxNumber: string;
  };
  // contactPersons
  contactPersons: {
    salutation: string;
    contactPersonId: string;
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactPersonEmail: string;
    contactPersonWorkPhone: string;
    contactPersonMobilePhone: string;
    contactPersonMobile: string;
  }[];

  documents?: string;
}



export const useVendorApiHook = () => {
  // const axiosAuth = useAxiosAuth({});
  const addVendor = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/`, obj);
  };
  const updateVendorById = async ({ id, obj }: { id: string; obj: any }) => {
    return axios.patch<GeneralApiResponse>(
      `${BASE_URL}${prefix}/updateById/${id}`,
      obj
    );
  };
  const deleteVendorById = async (id: any) => {
    return axios.delete<GeneralApiResponse>(
      `${BASE_URL}${prefix}/deleteById/${id}`
    );
  };
  const getVendorById = async (id: any) => {
    return axios.get<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/getById/${id}`
    );
  };

  const getAllVendor = async (pagination: PaginationState, searchObj: any) => {
    const query = new URLSearchParams({
      pageIndex: String(pagination.pageIndex),
      pageSize: String(pagination.pageSize),
      ...searchObj,
    }).toString();
    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}?${query}`);
  };

  const convertVendorToSalesContact = async (id: string) => {
    return axios.post<GeneralApiResponse<any>>(
      `${BASE_URL}${prefix}/convert-to-sales-contact/${id}`
    );
  };

  const generatePdf = async (vendorId: string) => {
      return axios.get(`${BASE_URL}${prefix}/pdf/${vendorId}`, {
        responseType: "blob",
      });
    };



  const getAllVendorName = async () => {


    return axios.get<GeneralApiResponsePagination<any>>(`${BASE_URL}${prefix}/getAllVendorName`);
  };




  const bulkUpload = async (obj: any) => {
    return axios.post<GeneralApiResponse<any>>(`${BASE_URL}${prefix}/bulkUpload`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
  }


  return {
    addVendor,
    deleteVendorById,
    updateVendorById,
    getVendorById,
    getAllVendor,
    convertVendorToSalesContact,
    getAllVendorName,
    bulkUpload,
    generatePdf,
  };
};

export const useAddVendor = () => {
  const queryClient = useQueryClient();
  const api = useVendorApiHook();
  return useMutation({
    mutationFn: api.addVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useVendorById = (id: string) => {
  const api = useVendorApiHook();

  return useQuery({
    queryKey: ["Vendor_id", id],
    queryFn: () => api.getVendorById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useVendor = (
  searchObj: Record<string, any> = {},
  getPaginationFromParams = true
) => {
  const pagination = usePagination(getPaginationFromParams);

  const api = useVendorApiHook();

  return useQuery({
    queryKey: ["Vendor", pagination, searchObj],
    queryFn: () =>
      api.getAllVendor(pagination, searchObj).then((res) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};

export const usedeleteVendorById = () => {
  const api = useVendorApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteVendorById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Vendor"] });
      // toastSuccess(res);
    },
  });
};

export const useUpdateVendorById = () => {
  const api = useVendorApiHook();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateVendorById,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useBulkUpload = () => {
  const api = useVendorApiHook()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.bulkUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorBulkUpload"] });
    }
  })
}




export const useConvertVendorToSalesContact = () => {
  const api = useVendorApiHook();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.convertVendorToSalesContact,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["Sales Contact"] });
      queryClient.invalidateQueries({ queryKey: ["Vendor"] });
    },
  });
};


export const useVendorName = (

) => {



  const api = useVendorApiHook();
  return useQuery({
    queryKey: ["VendorName"],
    queryFn: () =>
      api.getAllVendorName().then((res: any) => res?.data),
    initialData: {
      data: [],
      total: 0,
      message: "",
    } as unknown as GeneralApiResponsePagination<any>,
  });
};


// Generate PDF from JSON data
const generatePdfFromJson = (vendorData: any) => {
  const doc = new jsPDF();

  // Set the title of the document
  doc.setFontSize(18);
  doc.text("Vendor", 20, 20);

  // Add the bill data into the document
  doc.setFontSize(12);

  doc.text(`Vendor Name: ${vendorData.firstName}`, 20, 40);
  doc.text(`Email: ${new Date(vendorData.bill_date).toLocaleDateString()}`, 20, 50);
  doc.text(`Comapany Name: ${vendorData.vendor_name}`, 20, 60);
  doc.text(`Phone Number: ${vendorData.currency_code} ${vendorData.total.toFixed(2)}`, 20, 70);
  doc.text(`GST IN: ${vendorData.currency_code} ${vendorData.balance.toFixed(2)}`, 20, 80);
  doc.text(`Location: ${vendorData.status}`, 20, 90);

  // Save the generated PDF
  doc.save(`VendorPurchaseBill_${vendorData.bill_id}.pdf`);
};



export const downloadVendorPurchaseBillPdf = async (billId: string) => {
  const response = await axios.get(`${BASE_URL}${prefix}/bills/${billId}`);

  try {
    generatePdfFromJson(response.data.data);
  } catch (error) {
    console.error(error);
  }
};
