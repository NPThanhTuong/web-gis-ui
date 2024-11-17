import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/configs/axiosConfig";
import { boolean } from "zod";
import { useToast } from "@/hooks/use-toast";

const initialContext = {
  user: {
    useId: null,
    name: null,
    role: null,
    avatar: null,
  },
  token: null,
  error: null,
  login: (email, password) => null,
  logout: () => null,
  isLoggedIn: () => boolean,
};

const AuthContext = createContext(initialContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if token exists and validate it
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    }

    setIsReady(true);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });
      if (res) {
        const result = res?.data;
        const { user } = result;

        localStorage.setItem("token", result.token);
        const userInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        setToken(result.token);
        setUser(userInfo);
        toast({
          title: "Đăng nhập thành công!",
          description: "Bạn đã đăng nhập vào tài khoản thành công.",
        });
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{ login, user, logout, isLoggedIn, error, token }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
