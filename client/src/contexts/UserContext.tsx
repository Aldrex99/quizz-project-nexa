import { createContext } from "react";
import { IUser } from "@/types/user";

interface IUserContextValue {
  user: IUser | null;
  userIsLoaded?: boolean;
  isAuthenticated: boolean;
  getMe: () => Promise<void>;
  logout: () => Promise<boolean>;
}

export const UserContext = createContext<IUserContextValue | null>(null);
export type { IUserContextValue };
