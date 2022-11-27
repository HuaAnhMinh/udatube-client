import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const createCommentApi = async (accessToken: string, videoId: string, content: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.post(endpoints.createComment(), {
      videoId,
      content,
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

export default createCommentApi;