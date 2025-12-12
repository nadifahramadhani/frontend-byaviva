export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
