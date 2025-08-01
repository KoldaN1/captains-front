import axiosInstance from "../../utils/axiosInstance.js";

const getShipPayload = async (shipId) => {
  try {
    const response = await axiosInstance.get(import.meta.env.VITE_BOT_API + "/api/ships/payload", {
      params: {
        shipId,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("[getShipPayload]", error);
  }
};

export default getShipPayload;
