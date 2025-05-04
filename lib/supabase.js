import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// Supabase URL and anon key
const supabaseUrl = "https://svkkfcdvutpbhijjlazm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a2tmY2R2dXRwYmhpampsYXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjM3ODcsImV4cCI6MjA2MTM5OTc4N30.8v7qLSaA3vUWAgSPl2JZHEXgmDVQsc6P8MFIEy5d6Mo";

const storage = {
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (error) {
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      return Promise.resolve();
    }
  },
};

// Create the Supabase client with browser-compatible storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: storage,
  },
});
