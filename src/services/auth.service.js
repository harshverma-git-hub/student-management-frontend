import api from "./api";

export const loginUser = async ({ userId, password }) => {
  const res = await api.post("/auth/login", {
    userId,
    password,
  });
  return res.data;
};