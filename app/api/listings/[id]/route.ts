import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Listing, User, Profile, Preferences } from "@/lib/models";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    // Get listing with user data
    const listing = await Listing.findById(params.id)
      .populate({
        path: "userId",
        model: User,
        select: "firstName lastName",
      })
      .lean();

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Get profile data
    const profile = await Profile.findOne({ userId: listing.userId._id }).lean();

    // Get preferences data
    const preferences = await Preferences.findOne({ userId: listing.userId._id }).lean();

    // Format the response
    const formattedListing = {
      id: listing._id,
      images: listing.images || [],
      accommodationType: listing.accommodationType,
      privateBathroom: listing.privateBathroom,
      rent: listing.rent,
      utilityIncluded: listing.utilityIncluded,
      amenities: listing.amenities || [],
      distanceFromCampus: listing.distanceFromCampus,
      user: {
        firstName: listing.userId.firstName,
        lastName: listing.userId.lastName,
        gender: profile?.gender,
        academicLevel: profile?.academicLevel,
        studySchedule: profile?.studySchedule,
        socializingPreference: profile?.socializingPreference,
        tidiness: profile?.tidiness,
        drinkingPreference: profile?.drinkingPreference,
        smokingPreference: profile?.smokingPreference,
        hobbies: profile?.hobbies || [],
      },
      preferences: {
        roommate: preferences?.preferences || [],
        guestPreference: preferences?.guestPreference,
        additionalPreference: preferences?.additionalPreference,
      },
      publishedAt: listing.publishedAt,
    };

    return NextResponse.json({ listing: formattedListing });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
} 