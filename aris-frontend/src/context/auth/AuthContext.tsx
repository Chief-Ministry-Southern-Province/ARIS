/* eslint-disable react-refresh/only-export-components */
import {createContext,useState,type ReactNode,useContext,} from "react";
import { setAuthToken } from "@/services/api";
import type { LoginResponse } from "@/services/auth.service";

interface AuthContextType {
  token: string | null;
  role: string[];
  id: number | null;
  name: string | null;
  institutionType: string | null;
  loginUser: (response: LoginResponse) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [institutionType, setInstitutionType] = useState<string | null>(null);

  const loginUser = (response: LoginResponse) => {
    setAuthToken(response.token);
    setToken(response.token);
    setRole(response.role ?? []);
    setId(response.id ?? null);
    setName(response.name ?? null);
    setInstitutionType(response.institutionType ?? null);
  };

  const logoutUser = () => {
    setAuthToken(null);
    setToken(null);
    setRole([]);
    setId(null);
    setName(null);
    setInstitutionType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role: role.map((r) => r[0].toLowerCase() + r.slice(1)),
        id,
        name,
        institutionType,
        loginUser,
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
