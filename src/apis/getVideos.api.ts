import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getVideosApi = async (title: string, limit: number, nextKey: string | null): Promise<SuccessResponse | ErrorResponse> => {
  try {
    let endpoint = endpoints.getVideos();
    if (title) {
      endpoint += `title=${title}`;
    }
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

export default getVideosApi;