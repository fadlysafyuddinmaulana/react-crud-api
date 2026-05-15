import api from "./api";

export interface ProductAnalysisData {
  total_products: number;
  total_stock: number;
  average_price: number;
  max_price: number;
  min_price: number;
}

export interface ProductAnalysisResponse {
  status: "ok" | "error";
  data?: ProductAnalysisData;
  message?: string;
}

export const analyzeProducts = async (): Promise<ProductAnalysisResponse> => {
  try {
    const resp = await api.get<ProductAnalysisResponse>("/products/analyze");
    return resp.data;
  } catch (error: any) {
    console.error("Analysis service error:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
    });

    if (error?.response?.status === 401) {
      throw new Error("Unauthorized");
    }

    if (error?.response?.status === 500) {
      throw new Error(
        error?.response?.data?.message ||
          "Backend error - Python service may not be running"
      );
    }

    if (error?.code === "ERR_NETWORK") {
      throw new Error("Network error - Check if backend is running");
    }

    throw error;
  }
};

export default { analyzeProducts };
