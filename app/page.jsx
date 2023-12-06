"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchCity = formData.get("city");
    router.push(`/${searchCity}`);
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

      <form
        className="relative w-full flex-center search"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="text"
          placeholder="Search for cities..."
          className="search_input peer"
          name="city"
          required
          autoComplete="off"
        />

        <button className="black_btn mt-5">Search</button>
      </form>
    </section>
  );
};

export default Home;
