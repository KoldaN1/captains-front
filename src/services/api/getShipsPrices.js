import axiosInstance from "../../utils/axiosInstance.js";

const getShipsPrices = async () => {
  try {
    const response = await axiosInstance.get(import.meta.env.VITE_BOT_API + "/api/ships/prices" );
    return response.data;
  } catch (error) {
    console.error("[getShipsPrices]", error);
  }
};

export default getShipsPrices;
