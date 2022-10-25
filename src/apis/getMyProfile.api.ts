import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {User} from "../@types/user";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getMyProfileApi = async (accessToken: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.get(endpoints.getProfile(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return parseSuccessResponse(response, 'user');
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default getMyProfileApi;