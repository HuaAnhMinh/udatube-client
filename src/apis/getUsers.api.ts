import { getUsers } from "../mocks/users.mock";
import { parseErrorResponse, parseSuccessResponse, SuccessResponse, ErrorResponse } from "../utils/response.util";

const getUsersApi = async (username: string, limit: number, nextKey: string | null): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const { users, ..._nextKey } = await getUsers(username, limit, nextKey);
    return parseSuccessResponse({
      status: 200,
      data: {
        users,
        nextKey: _nextKey.nextKey,
      },
    });
  }
  catch (e) {
    console.log(e);
    return parseErrorResponse({
      response: {
        status: 400,
        data: {
          message: 'Bad Request',
        },
      },
    });
  }
};

export default getUsersApi;