/* eslint-disable react-refresh/only-export-components */
import {createContext,useEffect,useState,type ReactNode,useContext,} from "react";
import { getProfile, type LoginResponse } from "@/services/auth.service";
import type { ProfileResponse } from "@/types/User.type";

type AuthSession = {
  role: string[];
  id: number | null;
  name: string | null;
  institutionId: number | null;
  institutionType: string | null;
};

const emptySession: AuthSession = {
  role: [],
  id: null,
  name: null,
  institutionId: null,
  institutionType: null,
};

const profileToSession = ({ user, role }: ProfileResponse): AuthSession => ({
  role,
  id: user.id,
  name: user.name,
  institutionId: user.institution_id,
  institutionType: user.institution?.type ?? null,
});

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string[];
  id: number | null;
  name: string | null;
  institutionId: number | null;
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
  const [session, setSession] = useState<AuthSession>(emptySession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getProfile()
      .then((profile) => {
        if (active) setSession(profileToSession(profile));
      })
      .catch(() => {
        if (active) setSession(emptySession);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loginUser = (response: LoginResponse) => {
    setSession({
      role: response.role,
        id: response.id,
        name: response.name ?? null,
        institutionId: response.institutionId ?? null,
        institutionType: response.institutionType ?? null,
    });
  };

  const logoutUser = () => {
    setSession(emptySession);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session.id !== null,
        isLoading,
        role: session.role.map((r) => r[0].toLowerCase() + r.slice(1)),
        id: session.id,
        name: session.name,
        institutionId: session.institutionId,
        institutionType: session.institutionType,
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
