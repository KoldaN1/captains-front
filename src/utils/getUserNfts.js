import axios from "axios";

const getUserNfts = async (wallet) => {
  try {
    const response = await axios.post(import.meta.env.VITE_BOT_API + "/get_user_nfts", {
      wallet: wallet,
    });

    return response.data.nfts;
  } catch (error) {
    console.error("Error fetch NFT:", error);
  }
};

export default getUserNfts;
