import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "dreamMode_theme";


function getInitialTheme(){

  try{

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if(saved === "dark" || saved === "light"){
      return saved;
    }

    // সেভ করা কিছু না থাকলে ইউজারের ডিভাইস/ব্রাউজারের সিস্টেম
    // প্রেফারেন্স অনুযায়ী শুরু করা হচ্ছে।
    if(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ){
      return "dark";
    }

  }catch(err){
    // localStorage/matchMedia না থাকলেও অ্যাপ যেন ভেঙে না পড়ে
  }

  return "light";

}


export function ThemeProvider({ children }){


  const [theme, setTheme] =
    useState(getInitialTheme);


  useEffect(()=>{

    const root = document.documentElement;

    if(theme === "dark"){
      root.classList.add("dark");
    }else{
      root.classList.remove("dark");
    }

    try{
      localStorage.setItem(STORAGE_KEY, theme);
    }catch(err){
      // ignore
    }

  },[theme]);


  const toggleTheme = ()=>{

    setTheme(
      (prev)=>
        prev === "dark" ? "light" : "dark"
    );

  };


  return (

    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
      }}
    >

      {children}

    </ThemeContext.Provider>

  );

}


export function useTheme(){
  return useContext(ThemeContext);
}
