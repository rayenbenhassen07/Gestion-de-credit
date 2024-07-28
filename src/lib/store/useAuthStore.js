import create from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));

export default useAuthStore;
