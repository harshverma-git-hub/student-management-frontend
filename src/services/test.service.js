import api from "./api";

export const uploadTest = async (formData) => {
  const res = await api.post("/tests", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getStudentTests = async () => {
  const res = await api.get("/tests/student");
  return res.data;
};