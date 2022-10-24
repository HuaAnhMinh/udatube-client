import api from "../configs/api.config";
import endpoints from "../configs/endpoints.config";
import {User} from "../@types/user";

const getMyProfileApi = async (accessToken: string): Promise<User | null> => {
  try {
    const response = await api.get(endpoints.getProfile(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.user;
  }
  catch (e) {
    return null;
  }
};

export default getMyProfileApi;