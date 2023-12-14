import Link from "next/link";
import FavoriteCity from "@models/FavoriteCity";
import { connectToDB } from "@utils/database";

const Favorites = async () => {
  await connectToDB();
  const favCity = await FavoriteCity.find();

  return (
    <div>
      <h1 className="small_head_text text-center">
        Favorite
        <span className="orange_gradient"> Cities </span>
        List
      </h1>

      <div className="glassmorphism mt-10">
        <ul className="list-none grid grid-cols-2 sm:grid-cols-3 gap-4">
          {favCity &&
            favCity.map((city) => (
              <li key={city}>
                <Link href={`/${city.cityName}`} className="black_btn">
                  {city.cityName}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Favorites;
