
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "admin" | "employee" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName: string | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // 初始化時從 localStorage 讀取用戶信息
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserRole = localStorage.getItem("userRole") as UserRole;
    const storedUserName = localStorage.getItem("userName");

    setIsLoggedIn(storedIsLoggedIn);
    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, []);

  const login = (role: UserRole, name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role || "");
    localStorage.setItem("userName", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  // 簡單的密碼修改功能（實際應用中應該與後端API交互）
  const changePassword = (oldPassword: string, newPassword: string) => {
    // 這裡僅做模擬，實際應用中應與後端交互
    // 目前只是檢查舊密碼是否為user123，作為示例
    if (userRole === "employee" && oldPassword === "user123") {
      console.log("密碼已變更為:", newPassword);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRole,
        userName,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
