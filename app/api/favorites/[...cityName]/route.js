import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import FavoriteCity from "@models/FavoriteCity";

export async function POST(request, { params }) {
  // console.log(params);

  try {
    await connectToDB();
    const cityName = params.cityName[0];

    const city = await FavoriteCity.findOne({ cityName });

    if (!city) {
      await FavoriteCity.create({
        cityName,
      });
    }
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({
    success: true,
  });
}
