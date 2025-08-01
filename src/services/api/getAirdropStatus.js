import axiosInstance from "../../utils/axiosInstance.js";

const getAirdropStatus = async () => {
  try {
    const response = await axiosInstance.get(import.meta.env.VITE_BOT_API + "/api/airdrop/status" );
    return response.data;
  } catch (error) {
    console.error("[getAirdropStatus]", error);
  }
};

export default getAirdropStatus;
