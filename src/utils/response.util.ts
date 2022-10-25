import {AxiosError, AxiosResponse} from "axios";

export type ErrorResponse = {
  statusCode: number;
  message: string;
};

export const parseErrorResponse = (e: any): ErrorResponse => {
  const error = e as AxiosError;
  console.log(error.response);
  if (error.response) {
    if (error.response.data) {
      if (error.response.data.hasOwnProperty('message')) {
        return {
          statusCode: error.response.status,
          // @ts-ignore
          message: error.response.data.message,
        };
      }
    }
  }
  return {
    statusCode: 500,
    message: 'Internal Server Error',
  };
};

export type SuccessResponse = {
  statusCode: number;
  data: any;
};

export const parseSuccessResponse = (r: any, key: string): SuccessResponse => {
  const response = r as AxiosResponse;
  return {
    statusCode: response.status,
    data: response.data[key],
  };
};