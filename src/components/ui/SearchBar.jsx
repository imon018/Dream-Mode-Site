import {
  useState,
} from "react";

import {
  FiSearch,
  FiX,
} from "react-icons/fi";


export default function SearchBar({
  onSearch,
}) {


  const [text,setText] =
    useState("");



  const handleSearch = (e) => {

    const value =
      e.target.value;

    setText(value);

    onSearch(value);

  };



  const clearSearch = () => {

    setText("");

    onSearch("");

  };



  return (

    <div
      className="
        relative
        w-full
      "
    >


      {/* Search Icon */}

      <FiSearch
        className="
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-amber-500
          text-xl
          md:text-2xl
        "
      />



      <input

        type="text"

        value={text}

        onChange={
          handleSearch
        }

        placeholder="
          Search your dream dress...
        "

        className="
          w-full

          h-14
          md:h-16

          pl-14
          pr-12

          rounded-3xl

          bg-white

          border
          border-amber-500/20

          text-sm
          md:text-base

          text-slate-800

          placeholder:text-gray-400

          outline-none

          transition-all
          duration-300

          focus:border-amber-500

          focus:ring-4
          focus:ring-amber-500/20

          shadow-sm

        "

      />



      {
        text && (

          <button
            onClick={
              clearSearch
            }

            className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2

              text-gray-400

              hover:text-amber-500

              transition
            "
          >

            <FiX
              size={20}
            />

          </button>

        )
      }



    </div>

  );

}
