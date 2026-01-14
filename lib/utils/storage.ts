const isServer = typeof window === "undefined";

export const cookieStorage = {
  deleteCookie: (name: string): void => {
    if (isServer) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export const tokenStorage = {
  // We can't check httpOnly cookies from JavaScript
  // Backend will handle cookie validation

  clearTokens: () => {
    cookieStorage.deleteCookie("accessToken");
    cookieStorage.deleteCookie("refreshToken");
  },
};
