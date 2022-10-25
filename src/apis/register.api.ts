import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {parseErrorResponse, parseSuccessResponse} from "../utils/response.util";

const registerApi = async (accessToken: string) => {
  try {
    const response = await api.post(endpoints.register(), {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return parseSuccessResponse(response, 'message');
  }
  catch (e: any) {
    return parseErrorResponse(e);
  }
};

export default registerApi;