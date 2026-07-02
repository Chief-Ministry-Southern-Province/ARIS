/* eslint-disable react-refresh/only-export-components */
import {createContext,useState,type ReactNode,useContext,} from "react";

interface AuthContextType {
  token: string | null;
  role: string[];
  user: (token: string, role: string[]) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<string[]>(
    JSON.parse(localStorage.getItem("role") || "[]")
  );

  const user = (token: string, role: string[]) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", JSON.stringify(role));

    setToken(token);
    setRole(role);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole([]);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role: role.map((r) => r[0].toLowerCase() + r.slice(1)),
        user,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};