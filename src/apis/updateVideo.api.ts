import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {parseErrorResponse, parseSuccessResponse} from "../utils/response.util";

const updateVideoApi = async (accessToken: string, videoId: string, title: string, description: string) => {
  try {
    const response = await api.patch(endpoints.updateVideo(videoId), {
      title,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return parseSuccessResponse(response);
  }
  catch (e: any) {
    return parseErrorResponse(e);
  }
};

export default updateVideoApi;