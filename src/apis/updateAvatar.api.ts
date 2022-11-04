import api from "../configs/api.config";
import {ErrorResponse, parseErrorResponse, parseSuccessResponse, SuccessResponse} from "../utils/response.util";

const updateAvatarApi = async (url: string, image: File): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response = await api.put(url, image, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
    return parseSuccessResponse(response);
  }
  catch (e) {
    return parseErrorResponse(e);
  }
};

export default updateAvatarApi;