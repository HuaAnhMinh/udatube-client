import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {parseErrorResponse, parseSuccessResponse} from "../utils/response.util";

const dislikeVideoApi = async (accessToken: string, videoId: string) => {
  try {
    const response = await api.post(endpoints.dislikeVideo(videoId), {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e)
  }
};

export default dislikeVideoApi;