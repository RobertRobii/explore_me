import { Schema, model, models } from "mongoose";

const FavoriteCitySchema = new Schema({
  cityName: {
    type: String,
    required: true,
  },
});

const FavoriteCity = models.City || model("FavoriteCity", FavoriteCitySchema);

export default FavoriteCity;
