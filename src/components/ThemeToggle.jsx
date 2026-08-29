import {
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";


export default function ThemeToggle({ className = "" }) {

  const { isDark, toggleTheme } = useTheme();


  return (

    <button

      onClick={toggleTheme}

      aria-label={
        isDark
        ?
        "Switch to light mode"
        :
        "Switch to dark mode"
      }

      title={
        isDark
        ?
        "Light Mode"
        :
        "Dark Mode"
      }

      className={`
        relative
        transition-transform
        hover:scale-110
        ${className}
      `}

    >

      {
        isDark
        ?
        <FiSun
          size={22}
          className="text-amber-400"
        />
        :
        <FiMoon
          size={22}
          className="text-[#071F57]"
        />
      }

    </button>

  );

}
