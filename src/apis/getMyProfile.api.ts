import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getMyProfileApi = async (accessToken: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.get(endpoints.getMyProfile(), {
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

export default getMyProfileApi;