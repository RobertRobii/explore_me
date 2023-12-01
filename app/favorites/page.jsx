import Link from "next/link";

const Favorites = () => {
  return (
    <div>
      <h1 className="small_head_text text-center">
        Favorite
        <span className="orange_gradient"> Cities </span>
        List
      </h1>

      <div className="glassmorphism mt-10">
        <ul className="list-none grid grid-cols-2 sm:grid-cols-3 gap-4">
          <li>
            <Link href="/city" className="black_btn">
              Brasov
            </Link>
          </li>
          <li>
            <Link href="/city" className="black_btn">
              Bucuresti
            </Link>
          </li>
          <li>
            <Link href="/city" className="black_btn">
              Piatra Neamt
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Favorites;
