import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {parseErrorResponse, parseSuccessResponse} from "../utils/response.util";

const updateUsernameApi = async (accessToken: string, username: string) => {
  try {
    const response = await api.patch(endpoints.updateUsername(), {
      username,
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

export default updateUsernameApi;