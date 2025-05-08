
////// live url
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_VERSION}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const NEXT_APP_BASE_URL = `${process.env.NEXT_PUBLIC_APP_API_URL}`
// export const NEXT_APP_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`


export const generateFilePath = (fileName: any) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;
};


export default BASE_URL

//BACKEND IP
/////// local url
// export const url = "http://localhost:3004";



export type GeneralApiResponse<T = unknown> = {
  token(token: any): any;
  _id: any;
  message: string;
  data: T;
};

export type GeneralApiResponsePagination<T = unknown> = {
  message: string;
  data: T[];
  total: number;
};

export type ReactSelectFormat = {
  label: string,
  value: string,
}