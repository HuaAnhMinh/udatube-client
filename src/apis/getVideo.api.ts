import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getVideoApi = async (videoId: string, userId?: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.get(endpoints.getVideo(videoId, userId));
    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default getVideoApi;