import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import FavoriteCity from "@models/FavoriteCity";

export async function POST(request, { params }) {
  try {
    await connectToDB();
    const cityName = params.cityName[0];

    const city = await FavoriteCity.findOne({ cityName });

    if (!city) {
      await FavoriteCity.create({
        cityName,
      });

      return NextResponse.json({
        success: true,
        isNew: true,
      });
    } else {
      return NextResponse.json({
        success: true,
        isNew: false,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      isNew: false,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const cityName = params.cityName[0];
    const city = await FavoriteCity.findOneAndDelete({ cityName });

    if (!city) {
      return NextResponse.json({
        success: true,
        isNew: false,
      });
    } else {
      return NextResponse.json({
        success: true,
        isNew: true,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      isNew: false,
    });
  }
}
