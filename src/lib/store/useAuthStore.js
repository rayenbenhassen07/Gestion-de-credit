import create from "zustand";

const useAuthStore = create((set) => ({
  isLoggedIn: true,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));

export default useAuthStore;
