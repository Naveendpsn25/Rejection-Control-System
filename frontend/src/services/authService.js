import { API_BASE_URL } from "../utils/api";
import {
    setAccessToken,
    setRefreshToken,
} from "../utils/token";

// import Cookies from "js-cookie";

export const login = async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    setAccessToken(result.access);
    setRefreshToken(result.refresh);

    console.log("Access Token:", localStorage.getItem("access"));
    console.log("Refresh Token:", localStorage.getItem("refresh"));

    if (!response.ok) {
        throw new Error(result.detail || "Login failed");
    }

    return result;
};




export const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Failed to fetch user");
    }

    return result;
};


import { getAccessToken,getRefreshToken } from "../utils/token";

export const refreshToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: getRefreshToken(),
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Refresh failed");
    }

    return result;
};




export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${setAccessToken()}`,
        },
        body: JSON.stringify({
            refresh: setRefreshToken(),
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Logout failed");
    }

    return result;
};



export async function createRejection(data) {

    const payload = {
        entry_date: data.date,
        department: data.department,
        part_number: data.partNumber,
        operation: data.operation,
        produced_quantity: Number(data.producedQty),
        rejected_quantity: Number(data.rejectedQty),
        defect_type: data.defectType,
        remarks: data.remarks,
    };

    const response = await fetch(
        `${API_BASE_URL}/rejections/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify(payload),
        }
    );

    const result = await response.json();

    if (!response.ok) {

        throw new Error(
            result.part_number?.[0] ||
            result.detail ||
            "Something went wrong."
        );

    }

    return result;
}




const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getDepartments = async () => {
    const response = await fetch(
        `${API_BASE_URL}/rejections/departments/`,
        {
            headers: getHeaders(),
        }
    );

    return await response.json();
};

export const getParts = async () => {
    const response = await fetch(
        `${API_BASE_URL}/rejections/parts/`,
        {
            headers: getHeaders(),
        }
    );

    return await response.json();
};

export const getOperations = async () => {
    const response = await fetch(
        `${API_BASE_URL}/rejections/operations/`,
        {
            headers: getHeaders(),
        }
    );

    return await response.json();
};

export const getDefectTypes = async () => {
    const response = await fetch(
        `${API_BASE_URL}/rejections/defect-types/`,
        {
            headers: getHeaders(),
        }
    );

    return await response.json();
};


export const getRejections = async () => {
    const response = await fetch(
        `${API_BASE_URL}/rejections/`,
        {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        }
    );

    return await response.json();
};


export const getCAPAs = async () => {
    const response = await fetch(
        `${API_BASE_URL}/capa/`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Failed to fetch CAPAs");
    }

    return result;
};


export const getCAPACount = async () => {

    const response = await fetch(
        `${API_BASE_URL}/capa/count/`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Failed to fetch CAPA count");
    }

    return result;

};



export const submitCAPA = async (id, formData) => {

    const response = await fetch(
        `${API_BASE_URL}/capa/${id}/`,
        {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },

            body: formData,
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Failed to submit CAPA");
    }

    return result;
};



export const approveRejectCAPA = async (id, action) => {

    const response = await fetch(
        `${API_BASE_URL}/capa/${id}/approval/`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
                action,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.detail || "Failed to update CAPA."
        );
    }

    return result;
};


