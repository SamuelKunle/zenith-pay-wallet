import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ALL_SERVICES, type ServiceItem } from "@/data/services";

interface FavouritesContextType {
  favourites: string[]; // array of service labels
  toggleFavourite: (label: string) => void;
  isFavourite: (label: string) => boolean;
  favouriteServices: ServiceItem[];
}

const STORAGE_KEY = "zenith-pay-favourites";
const DEFAULT_FAVOURITES = ["Electricity", "Airtime", "Data", "Transfer"];

function loadFavourites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_FAVOURITES;
  } catch {
    return DEFAULT_FAVOURITES;
  }
}

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const [favourites, setFavourites] = useState<string[]>(loadFavourites);

  const toggleFavourite = useCallback((label: string) => {
    setFavourites((prev) => {
      const next = prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (label: string) => favourites.includes(label),
    [favourites]
  );

  const favouriteServices = favourites
    .map((label) => ALL_SERVICES.find((s) => s.label === label))
    .filter(Boolean) as ServiceItem[];

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, favouriteServices }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
};
