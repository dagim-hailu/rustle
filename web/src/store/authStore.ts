import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError } from "../lib/api";
import type { Bootstrap, Locale, User } from "../types";

type AuthStatus = "idle" | "loading" | "ready" | "error";

interface AuthState {
  token: string | null;
  user: User | null;
  bootstrap: Bootstrap | null;
  status: AuthStatus;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    displayName: string;
    locale: Locale;
  }) => Promise<void>;
  restore: () => Promise<void>;
  refresh: () => Promise<void>;
  applyProfile: (user: User, token: string) => void;
  setBootstrap: (bootstrap: Bootstrap) => void;
  clearError: () => void;
  logout: () => void;
}

async function loadSession(
  token: string,
  set: (partial: Partial<AuthState>) => void,
  get: () => AuthState
): Promise<void> {
  set({ status: "loading", error: null, token });
  try {
    const bootstrap = await api.bootstrap(token);
    set({
      token,
      user: bootstrap.user,
      bootstrap,
      status: "ready",
      error: null
    });
  } catch (error) {
    const code = error instanceof ApiError ? error.code : "NETWORK";
    if (error instanceof ApiError && error.status === 401) {
      get().logout();
    } else {
      set({ status: "error", error: code });
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      bootstrap: null,
      status: "idle",
      error: null,

      login: async (email, password) => {
        set({ status: "loading", error: null });
        try {
          const result = await api.login(email, password);
          await loadSession(result.token, set, get);
        } catch (error) {
          set({
            status: "error",
            error: error instanceof ApiError ? error.code : "NETWORK"
          });
          throw error;
        }
      },

      register: async (input) => {
        set({ status: "loading", error: null });
        try {
          const result = await api.register(input);
          await loadSession(result.token, set, get);
        } catch (error) {
          set({
            status: "error",
            error: error instanceof ApiError ? error.code : "NETWORK"
          });
          throw error;
        }
      },

      restore: async () => {
        const token = get().token;
        if (!token || get().status === "loading") return;
        await loadSession(token, set, get);
      },

      refresh: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const bootstrap = await api.bootstrap(token);
          set({ user: bootstrap.user, bootstrap, status: "ready", error: null });
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            get().logout();
          } else {
            set({ error: "NETWORK" });
          }
        }
      },

      applyProfile: (user, token) =>
        set((state) => ({
          token,
          user,
          bootstrap: state.bootstrap
            ? {
                ...state.bootstrap,
                user,
                guilds: state.bootstrap.guilds.map((guild) => ({
                  ...guild,
                  members: guild.members.map((member) =>
                    member.userId === user.id
                      ? {
                          ...member,
                          displayName: user.displayName,
                          avatarColor: user.avatarColor,
                          avatarUrl: user.avatarUrl,
                          bannerUrl: user.bannerUrl,
                          bannerColor: user.bannerColor,
                          bio: user.bio,
                          pronouns: user.pronouns
                        }
                      : member
                  )
                }))
              }
            : null
        })),

      setBootstrap: (bootstrap) => set({ bootstrap, user: bootstrap.user }),

      clearError: () => set({ error: null }),

      logout: () =>
        set({
          token: null,
          user: null,
          bootstrap: null,
          status: "idle",
          error: null
        })
    }),
    {
      name: "rustle-auth",
      partialize: (state) => ({ token: state.token })
    }
  )
);
