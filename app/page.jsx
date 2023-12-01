"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


const Home = () => {
  const router = useRouter();

  const [searchCity, setSearchCity] = useState("");

  const handleSearchChange = (e) => {
    setSearchCity(e.target.value);
  };

  const handleSearchClick =  () => {
     router.push(
      `/${searchCity}`
    );
  };

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Save
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> Urban Escapes</span>
      </h1>
      <p className="desc text-center">
        Unleash the power of a user-friendly web application that lets you
        discover cities, access detailed information, and build a personalized
        collection of favorites. Intelligent recommendations enhance your
        journey.
      </p>

      <form className="relative w-full flex-center search">
        <input
          type="text"
          placeholder="Search for cities..."
          value={searchCity}
          onChange={handleSearchChange}
          className="search_input peer"
          required
        />

        <button
          type="button"
          onClick={handleSearchClick}
          className="black_btn mt-5"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default Home;
