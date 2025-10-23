import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Auth APIs
export const authAPI = {
  login: (data) => axios.post("/auth/login", data),
  register: (data) => axios.post("/auth/register", data),
};

// User APIs
export const userAPI = {
  getMe: () => axios.get("/users/me", { headers: getAuthHeaders() }),
  getAllStudents: () =>
    axios.get("/users/students", { headers: getAuthHeaders() }),
};

// Assignment APIs
export const assignmentAPI = {
  create: (data) =>
    axios.post("/assignments", data, { headers: getAuthHeaders() }),
  getAll: () => axios.get("/assignments", { headers: getAuthHeaders() }),
  getByProfessor: () =>
    axios.get("/assignments/professor", { headers: getAuthHeaders() }),
  getById: (id) =>
    axios.get(`/assignments/${id}`, { headers: getAuthHeaders() }),
  update: (id, data) =>
    axios.put(`/assignments/${id}`, data, { headers: getAuthHeaders() }),
  getAnalytics: () =>
    axios.get("/assignments/analytics", { headers: getAuthHeaders() }),
};

// Group APIs
export const groupAPI = {
  create: (data) => axios.post("/groups", data, { headers: getAuthHeaders() }),
  getMyGroups: () =>
    axios.get("/groups/my-groups", { headers: getAuthHeaders() }),
  getById: (id) => axios.get(`/groups/${id}`, { headers: getAuthHeaders() }),
  addMember: (groupId, userId) =>
    axios.post(
      `/groups/${groupId}/members/${userId}`,
      {},
      { headers: getAuthHeaders() }
    ),
};

// Submission APIs
export const submissionAPI = {
  submit: (data) =>
    axios.post("/submissions", data, { headers: getAuthHeaders() }),
  confirm: (data) =>
    axios.patch("/submissions/confirm", data, { headers: getAuthHeaders() }),
  getByAssignment: (assignmentId) =>
    axios.get(`/submissions/${assignmentId}`, { headers: getAuthHeaders() }),
};
