'use client';

import {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import {
  FavoriteOptionsProps,
  InitialOptions,
  LoadFavoritePersonalOption,
} from './favorite-table/options';

interface ShoppingCartContextProps {
  getFavoriteOptions:FavoriteOptionsProps | undefined
  setFavoriteOptions:(v:FavoriteOptionsProps)=>void
}

const favoriteContext = createContext({} as ShoppingCartContextProps);

export function useFavorite() {
  return useContext(favoriteContext);
}

export default function FavoriteContext({ children }: { children: React.ReactNode }) {
  const [favoriteOptions, setFavoriteOptions] = useState<FavoriteOptionsProps>();

  useEffect(() => {
    const data = LoadFavoritePersonalOption();
    const FavoriteOptions = data || InitialOptions;
    setFavoriteOptions(FavoriteOptions);
  }, []);

  const value = useMemo(() => ({
    getFavoriteOptions: favoriteOptions,
    setFavoriteOptions,
  }), [favoriteOptions, setFavoriteOptions]);

  return (
    <favoriteContext.Provider value={value}>
      {children}
    </favoriteContext.Provider>
  );
}
