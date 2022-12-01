import api from "../configs/api.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const uploadVideoApi = async (url: string, video: File): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.put(url, video, {
      headers: {
        'Content-Type': 'video/mp4',
      },
      onUploadProgress: (progressEvent) => console.log(progressEvent.loaded),
    });
    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default uploadVideoApi;