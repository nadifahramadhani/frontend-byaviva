import api from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const authService = {
  login: async (payload: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/login", payload);

    return response.data;
  },

  register: async (payload: RegisterRequest) => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      payload
    );

    return response.data;
  },
};
