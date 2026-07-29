import { useEffect } from "react";

import useAuthStore from "../store/authStore";

import { getCurrentUser } from "../services/authService";

import {
    getAccessToken,
    clearTokens,
} from "../utils/token";

const useAuth = () => {

    const { restoreUser, setLoading } = useAuthStore();

    useEffect(() => {

    const restoreSession = async () => {

        const token = getAccessToken();

        if (!token) {
            setLoading(false);
            return;
        }

        try {

            const user = await getCurrentUser();

            restoreUser(user);

        } catch (error) {

            clearTokens();

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    restoreSession();

}, [restoreUser, setLoading]);

};

export default useAuth;