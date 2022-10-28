import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {parseErrorResponse, parseSuccessResponse} from "../utils/response.util";

const subscribeApi = async (accessToken: string, userId: string) => {
  try {
    const response = await api.post(endpoints.subscribe(userId), {}, {
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

export default subscribeApi;