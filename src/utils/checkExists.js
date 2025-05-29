import axios from "axios";

const checkSubscription = async (chat_id, channel_id) => {
  try {
    const result = await axios.post(import.meta.env.VITE_BOT_API + "/checkSubscription", {
      chat_id: chat_id,
      channel_id: channel_id,
    });

    return result;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

export default checkSubscription;
