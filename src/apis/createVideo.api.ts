import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const createVideoApi = async (accessToken: string, title: string, description: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.post(endpoints.createVideo(), {
      title,
      description,
    }, {
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

export default createVideoApi;