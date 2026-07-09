import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;

    setText(value);

    onSearch(value);
  };

  return (
    <div className="relative">

      <input
        type="text"
        value={text}
        onChange={handleSearch}
        placeholder="Search products..."
        className="w-full h-14 rounded-2xl border border-gray-200 bg-white px-5 pr-14 shadow-sm focus:border-black focus:ring-0"
      />

      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>

    </div>
  );
}
