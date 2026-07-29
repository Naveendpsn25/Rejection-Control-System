import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),

    restoreUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    setLoading: (loading) =>
        set({
            isLoading: loading,
        }),
}));

export default useAuthStore;