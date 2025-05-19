import { ISkill, ISkillResponse } from "@/types/provider";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  signupUser: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    postCode: string;
  }) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  signupProvider: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;

    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    postCode: string;
    providerType: string;
    role: "PROVIDER";
    // company fields
    companyName?: string;
    businessTaxNumber?: string;
  }) => {
    const response = await api.post("/providers", data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Provider APIs
export const providerAPI = {
  createProvider: async (providerData: any) => {
    const response = await api.post("/providers", providerData);
    return response.data;
  },

  getProviderProfile: async () => {
    const response = await api.get("/providers/me");
    return response.data;
  },
};

// Task APIs
export const taskAPI = {
  createTask: async (taskData: any) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  getTaskById: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  getTasksByUser: async (userId: string) => {
    const response = await api.get(`/tasks/user/${userId}`);
    return response.data;
  },

  getTasksByProvider: async (providerId: string) => {
    const response = await api.get(`/tasks/provider/${providerId}`);
    return response.data;
  },

  updateTask: async (
    taskId: string,
    taskData: {
      name?: string;
      category?: string;
      description?: string;
      expectedStartDate?: string;
      expectedHours?: string;
      hourlyRate?: string;
      currency?: "USD" | "AUD" | "SGD" | "INR";
    }
  ) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  updateTaskProgress: async (taskId: string, description: string) => {
    const response = await api.post(`/tasks/${taskId}/progress`, {
      description,
    });
    return response.data;
  },

  markTaskAsCompleted: async (taskId: string) => {
    const response = await api.post(`/tasks/${taskId}/complete`);
    return response.data;
  },

  acceptTaskCompletion: async (taskId: string) => {
    const response = await api.post(`/tasks/${taskId}/accept`);
    return response.data;
  },

  rejectTaskCompletion: async (taskId: string) => {
    const response = await api.post(`/tasks/${taskId}/reject`);
    return response.data;
  },
};

// Skill APIs
export const skillAPI = {
  createSkill: async (skillData: ISkill) => {
    const response = await api.post("/skills", skillData);
    return response.data;
  },

  getSkillById: async (skillId: string) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.data;
  },

  getSkillsByProvider: async (providerId: string) => {
    const response = await api.get(`/skills/provider/${providerId}`);
    return response.data;
  },

  updateSkill: async (skillId: string, skillData: any) => {
    const response = await api.put(`/skills/${skillId}`, skillData);
    return response.data;
  },

  deleteSkill: async (skillId: string) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },

  getSkillsByCategory: async (category: string) => {
    const response = await api.get(`/skills/category/${category}`);
    return response.data;
  },

  getSkillsByProviderAndCategory: async (
    providerId: string,
    category: string
  ) => {
    const response = await api.get(
      `/skills/provider/${providerId}/category/${category}`
    );
    return response.data;
  },
};

// Offer APIs
export const offerAPI = {
  createOffer: async (offerData: any) => {
    const response = await api.post("/offers", offerData);
    return response.data;
  },

  getOfferById: async (offerId: string) => {
    const response = await api.get(`/offers/${offerId}`);
    return response.data;
  },

  getOffersByTask: async (taskId: string) => {
    const response = await api.get(`/offers/task/${taskId}`);
    return response.data;
  },

  getOffersByProvider: async (providerId: string) => {
    const response = await api.get(`/offers/provider/${providerId}`);
    return response.data;
  },

  acceptOffer: async (offerId: string) => {
    const response = await api.post(`/offers/${offerId}/accept`);
    return response.data;
  },

  rejectOffer: async (offerId: string) => {
    const response = await api.post(`/offers/${offerId}/reject`);
    return response.data;
  },
};
