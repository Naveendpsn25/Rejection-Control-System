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

    // Used when the app starts again.
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