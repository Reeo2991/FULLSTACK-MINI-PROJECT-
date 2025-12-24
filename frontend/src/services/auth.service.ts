import axios from "axios";
import { API_BASE_URL, API } from "../config/api";

type LoginResponse = {
  token: string;
};

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_BASE_URL}${API.login}`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
