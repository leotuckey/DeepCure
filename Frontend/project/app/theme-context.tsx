"use client";
import React, {createContext, useContext, useState, ReactNode} from "react";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}

export function ThemeProvider({children}: { children: ReactNode }) {
    const [theme, setTheme] = useState("lung");
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}