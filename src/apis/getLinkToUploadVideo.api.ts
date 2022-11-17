import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const getLinkToUploadThumbnailVideo = async (accessToken: string, videoId: string): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.patch(endpoints.uploadVideo(videoId), {}, {
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

export default getLinkToUploadThumbnailVideo;