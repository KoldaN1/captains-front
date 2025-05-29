import axios from "axios";

const getJWT = async (initData) => {
  try {
    const {
      data: { token, refresh_token },
    } = await axios.post(import.meta.env.VITE_BOT_API + "/auth-from-chat", {
      initData: initData,
    });

    if (token && refresh_token) {
      return { token, refresh_token };
    } else {
      return null;
    }
  } catch (ex) {
    return null;
  }
};

export default getJWT;
