import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getCommentsApi = async (videoId: string, limit: number, nextKey: string | null): Promise<SuccessResponse | ErrorResponse> => {
  try {
    let endpoint = endpoints.getComments(videoId);
    endpoint += `&limit=${limit}`;
    if (nextKey) {
      endpoint += `&nextKey=${nextKey}`;
    }
    const response = await api.get(endpoint);
    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default getCommentsApi;