import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { Listing } from "@/lib/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const userListings = await Listing.find({ 
      userId: session.user.id,
    }).lean();

    const formattedListings = userListings.map((listing) => ({
      id: listing._id.toString(),
      images: listing.images || [],
      rent: listing.rent,
      accommodationType: listing.accommodationType,
      privateBathroom: listing.privateBathroom,
      distanceFromCampus: listing.distanceFromCampus,
      utilityIncluded: listing.utilityIncluded,
      amenities: listing.amenities || [],
    }));

    return NextResponse.json({ listings: formattedListings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 