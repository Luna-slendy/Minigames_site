import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email] && users[email].password === password) {
      setUser({ email });
      localStorage.setItem("currentUser", JSON.stringify({ email }));
      return { success: true };
    }
    return { success: false, error: "Wrong email or password." };
  };

  const signup = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email]) return { success: false, error: "User already exists." };

    users[email] = { password, score: 0 };
    localStorage.setItem("users", JSON.stringify(users));

    setUser({ email });
    localStorage.setItem("currentUser", JSON.stringify({ email }));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const getScore = () => {
    if (!user) return 0;
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users[user.email]?.score || 0;
  };

  const addScore = (amount) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[user.email].score = (users[user.email].score || 0) + amount;
    localStorage.setItem("users", JSON.stringify(users));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        getScore,
        addScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
