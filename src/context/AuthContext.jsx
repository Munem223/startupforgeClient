import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { authClient } from "../lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const session = authClient.useSession();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session.data?.user) {
      setProfile(null);
      setProfileLoading(false);
      return null;
    }

    setProfileLoading(true);
    try {
      let response;
      try {
        response = await api.get("/users/me");
      } catch (error) {
        if (error.response?.status !== 401) throw error;
        await api.post("/security/token");
        response = await api.get("/users/me");
      }
      setProfile(response.data.data);
      return response.data.data;
    } catch (error) {
      setProfile(null);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  }, [session.data?.user]);

  useEffect(() => {
    if (session.isPending) return;
    fetchProfile().catch(() => undefined);
  }, [session.isPending, fetchProfile]);

  const finalizeAuthentication = useCallback(
    async (role) => {
      if (role) await api.post("/users/complete-registration", { role });
      await api.post("/security/token");
      await session.refetch?.();
      return fetchProfile();
    },
    [fetchProfile, session]
  );

  const signOut = useCallback(async () => {
    try {
      await api.post("/security/logout");
    } finally {
      await authClient.signOut();
      setProfile(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      session: session.data,
      user: profile,
      isAuthenticated: Boolean(session.data?.user && profile),
      isLoading: session.isPending || profileLoading,
      refreshProfile: fetchProfile,
      finalizeAuthentication,
      signOut
    }),
    [session.data, session.isPending, profile, profileLoading, fetchProfile, finalizeAuthentication, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
