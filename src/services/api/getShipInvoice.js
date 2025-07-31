import axiosInstance from "../../utils/axiosInstance.js";

const getShipInvoice = async (shipId) => {
  try {
    const response = await axiosInstance.get(import.meta.env.VITE_BOT_API + "/api/ships/invoice", {
      params: {
        shipId,
      },
    });
    
    return response.data.link;
  } catch (error) {
    console.error("[getShipInvoice]", error);
  }
};

export default getShipInvoice;
