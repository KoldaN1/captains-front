import axios from "axios";

const checkApi = async (chat_id, api) => {
  try {
    const result = await axios.post(import.meta.env.VITE_BOT_API + api, {
      chat_id: chat_id,
    });

    return result;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

export default checkApi;
