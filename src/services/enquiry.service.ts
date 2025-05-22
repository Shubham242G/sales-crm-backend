
import { usePagination } from "../libs/hooks/usePagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import BASE_URL, { GeneralApiResponse, GeneralApiResponsePagination } from "./urls.service";
import axios from "../libs/hooks/axios";
import { CHARGE_TYPE } from "@/common/constant.common";
import axiosAuth from "./axios.service";
import { TypeObject } from "@mui/material/styles/createPalette";
// import useAxiosAuth from "@/libs/hooks/useAxiosAuth";




const prefix = "/enquiry";
export interface IEnqiry {
    // Basic Details
    // nameObj: string;
    salutation: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    displayName: string;
    email: string;
    companyName: string
    levelOfEnquiry: string;
    enquiryType: string;
    leadId: string;
    hotelPreferences: string;
    hotelName: string;
    othersPreference: string;
    approxPassengers: string;
    checkIn: string;
    checkOut: string;
    banquetDate: string;
    banquetTime: string;
    city: string;
    area: string;
    noOfRooms: string;
    leadOwner: string;
    assignTo: string;
    categoryOfHotel: string[];
    priority: string;
    occupancy: string[];
    status: string;
    banquet: {
        date: string;
        time: string;
        session: string[];
        seatingStyle: string;
        avSetup: string;
        menuType: string;
        minPax: string;
        seatingRequired: string;
    }[];
    room: {
        date: string;
        noOfRooms: string;
        roomCategory: string;
        occupancy: string;
        mealPlan: [];
    }[];
    eventSetup: {
        functionType: string;
        setupRequired: string;
        eventDates: {
            startDate: string;
            endDate: string;
        }[];

        eventStartDate: string;
        eventEndDate: string;
    };
    airTickets: {
        tripType: string;
        numberOfPassengers: string;
        fromCity: string;
        toCity: string;
        departureDate: string;
        returnDate: string;
        multiFromCity: string;
        multiToCity: string;
        multiDepartureDate: string;
    };
    cab: {
        date: string;
        fromCity: string;
        toCity: string;
        vehicleType: string;
        tripType: string;
        noOfVehicles: string;
        typeOfVehicle: string;
        mealPlan: [];
    }[];
    billingInstructions: string;


}

export interface Inew extends IEnqiry {
    id: string,
}



export const useEnquiryApiHook = () => {
    // const axiosAuth = useAxiosAuth({});
    const addEnquiry = async (obj: any) => {

        return axios.post<GeneralApiResponse<IEnqiry>>(`${BASE_URL}${prefix}`, obj);
    };
    const updateEnquiryById = async ({ id, obj }: { id: string; obj: any }) => {
        return axios.patch<GeneralApiResponse>(`${BASE_URL}${prefix}/updateById/${id}`, obj);
    };
    const deleteEnquiryById = async (id: any) => {
        return axios.delete<GeneralApiResponse>(`${BASE_URL}${prefix}/deleteById/${id}`);
    };
    const getEnquiryById = async (id: any) => {
        return axios.get<GeneralApiResponse<IEnqiry>>(`${BASE_URL}${prefix}/getById/${id}`);
    };





    const getAllEnquiry = async (pagination: PaginationState, searchObj: any) => {
        const query = new URLSearchParams({
            pageIndex: String(pagination.pageIndex),
            pageSize: String(pagination.pageSize),
            ...searchObj,
        }).toString();
        return axios.get<GeneralApiResponsePagination<IEnqiry>>(`${BASE_URL}${prefix}?${query}`);
    };

    const convertToRfp = async (id: any) => {
        return axios.post<GeneralApiResponse<Inew>>(`${BASE_URL}${prefix}/convert/${id}`);
    }

    return {
        getAllEnquiry,
        updateEnquiryById,
        deleteEnquiryById,
        getEnquiryById,
        addEnquiry,
        convertToRfp
    };
};

export const useAddEnquiry = () => {
    const queryClient = useQueryClient();
    const api = useEnquiryApiHook();
    return useMutation({
        mutationFn: api.addEnquiry,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["EnquiryAdd"] });
        },
    });
};

export const useEnquiryById = (id: string) => {
    const api = useEnquiryApiHook();

    return useQuery({
        queryKey: ["enquiry_id", id],
        queryFn: () => api.getEnquiryById(id).then((res) => res.data),
        enabled: !!id,
    });
};

export const useEnquiry = (searchObj: Record<string, any> = {}, getPaginationFromParams = true) => {
    const pagination = usePagination(getPaginationFromParams);

    const api = useEnquiryApiHook();


    return useQuery({
        queryKey: ["EnquiryAll", pagination, searchObj],
        queryFn: () => api.getAllEnquiry(pagination, searchObj).then((res) => res?.data),
        initialData: {
            data: [],
            total: 0,
            message: "",
        } as unknown as GeneralApiResponsePagination<IEnqiry>,
    });
};

export const usedeleteEnquiryById = () => {
    const api = useEnquiryApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.deleteEnquiryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["EnquiryDeleter"] });
            // toastSuccess(res);
        },
    });
};

export const useUpdateEnquiryById = () => {
    const api = useEnquiryApiHook();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.updateEnquiryById,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["enquiryById"] });
        },
    });
};

export const useConvertEnquiryToRfp = () => {
    const api = useEnquiryApiHook();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.convertToRfp,
        onSuccess: (res) => {

            queryClient.invalidateQueries({ queryKey: ["EnquiryConvert"] });
        },
    });
};

export const getExel = async () => {
    return axios.get(`${BASE_URL}${prefix}/getExel`);
};


export const addEnquiryExel = async (obj: any,) => {

    return axios.post<GeneralApiResponse>(`${BASE_URL}${prefix}/bulkUploadEnquiries`, obj, { headers: { 'Content-Type': 'multipart/form-data' } });
};