import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getUserApi = async (accessToken: string, userId: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.get(endpoints.getUser(userId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default getUserApi;