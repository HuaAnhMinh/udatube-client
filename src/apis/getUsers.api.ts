// import { getUsers } from "../mocks/users.mock";
import { parseErrorResponse, parseSuccessResponse, SuccessResponse, ErrorResponse } from "../utils/response.util";
import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";

const getUsersApi = async (username: string, limit: number, nextKey: string | null): Promise<SuccessResponse | ErrorResponse> => {
  try {
    // const { users, ..._nextKey } = await getUsers(username, limit, nextKey);
    let endpoint = endpoints.getUsers();
    if (username) {
      endpoint += `username=${username}`;
    }
    endpoint += `&limit=${limit}`;
    if (nextKey) {
      endpoint += `&nextKey=${nextKey}`;
    }

    const response = await api.get(endpoint);
    return parseSuccessResponse(response);
  }
  catch (e) {
    console.log(e);
    return parseErrorResponse(e);
  }
};

export default getUsersApi;