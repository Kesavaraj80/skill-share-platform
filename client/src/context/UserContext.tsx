"use client";

import { createContext, useContext } from "react";

export type AuthUserT = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  role: string;
};

export interface UserContextStateT {
  user: AuthUserT;
  setUser: (user: AuthUserT) => void;
}

const UserContext = createContext<UserContextStateT>({
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    fullName: "",
    role: "",
  },
  setUser: () => {},
});

function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
}

export { useAuth, UserContext };
