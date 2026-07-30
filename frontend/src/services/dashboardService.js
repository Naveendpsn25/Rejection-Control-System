import { API_BASE_URL } from "../utils/api";

import { getAccessToken } from "../utils/token";

export const getDashboardSummary = async () => {

    const response = await fetch(
        `${API_BASE_URL}/dashboard/summary/`,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.detail || "Failed to load dashboard summary."
        );
    }

    return result;
};