import { useEffect, useState, useCallback } from "react";

export type Profile = {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
};

const STORAGE_KEY = "secureyou_profile";

export function getStoredProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Profile;
  } catch (e) {
    // ignore
  }
  return {
    name: "Ayesha Siddika",
    email: "ayesha@secureyou.com",
    password: "",
    phone: "+880 1712 345678",
    address: "Road: 1, Building: 2, Mirpur 2...",
  };
}

export default function useProfile() {
  const [profile, setProfileState] = useState<Profile>(() => getStoredProfile());

  // Persist to localStorage and update state
  const setProfile = useCallback((p: Profile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
      // ignore
    }
    setProfileState(p);
  }, []);

  // Listen for storage events so multiple tabs stay in sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          if (e.newValue) setProfileState(JSON.parse(e.newValue));
          else setProfileState(getStoredProfile());
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { profile, setProfile } as const;
}
