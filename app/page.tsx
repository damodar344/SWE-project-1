import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ListingCard from "@/components/ListingCard";
import { connectToDatabase } from "@/lib/db";
import { Listing, User, ContactInfo } from "@/lib/models";
import { Types } from "mongoose";
import Header from "@/components/Header";

interface MongoListing {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  images: string[];
  rent: string;
  accommodationType: string;
  privateBathroom: string;
  distanceFromCampus: string;
  utilityIncluded: boolean;
  amenities: string[];
  status: string;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();
  const listings = await Listing.find({ status: "active" }).lean() as MongoListing[];

  // Get all unique user IDs from listings
  const userIds = [...new Set(listings.map(listing => listing.userId.toString()))];
  
  // Fetch all users and their contact info in one query
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const contactInfos = await ContactInfo.find({ userId: { $in: userIds } }).lean();
  
  console.log({users});
  // Create a map of user data for quick lookup
  const userMap = new Map();
  users.forEach(user => {
    const contactInfo = contactInfos.find(ci => ci.userId.toString() === user._id.toString());
    userMap.set(user._id.toString(), {
      ...user,
      phone: contactInfo?.phone,
      preferredContact: contactInfo?.preferredContact || 'Email'
    });
  });

  const formattedListings = listings.map((listing) => ({
    id: listing._id.toString(),
    images: listing.images || [],
    rent: listing.rent,
    accommodationType: listing.accommodationType,
    privateBathroom: listing.privateBathroom,
    distanceFromCampus: listing.distanceFromCampus,
    utilityIncluded: listing.utilityIncluded,
    amenities: listing.amenities || [],
    user: userMap.get(listing.userId.toString())
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Student Housing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our curated selection of student accommodations near your campus.
            Find the perfect place that matches your needs and preferences.
          </p>
        </div>

        {formattedListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No listings available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formattedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
