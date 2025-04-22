import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    images: string[];
    rent: number;
    accommodationType: string;
    privateBathroom: string;
    distanceFromCampus: number;
    utilityIncluded: boolean;
    amenities: string[];
    user: {
      preferredContact: string;
      email?: string;
      phone?: string;
    };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  console.log("Listing user data:", listing.user);
  
  // Get the contact value based on preferred contact method
  const getContactValue = () => {
    if (!listing.user) return null;
    
    // Check for exact matches first
    if (listing.user.preferredContact === "Email" && listing.user.email) {
      return listing.user.email;
    } else if (listing.user.preferredContact === "Phone No." && listing.user.phone) {
      return listing.user.phone;
    }
    
    // Fallback to case-insensitive check
    if (listing.user.preferredContact?.toLowerCase().includes("email") && listing.user.email) {
      return listing.user.email;
    } else if (
      (listing.user.preferredContact?.toLowerCase().includes("phone") || 
       listing.user.preferredContact?.toLowerCase().includes("no.")) && 
      listing.user.phone
    ) {
      return listing.user.phone;
    }
    
    // Final fallback
    return listing.user.email || listing.user.phone || null;
  };

  const contactValue = getContactValue();
  const isEmail = listing.user?.preferredContact?.toLowerCase().includes("email");

  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full">
          {listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={`${listing.accommodationType} preview`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No image available
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">
              ${listing.rent}
              <span className="text-sm font-normal text-gray-600 ml-1">
                {listing.utilityIncluded ? "(utilities included)" : ""}
              </span>
            </h3>
            <span className="text-sm text-gray-600">
              {listing.distanceFromCampus} miles from campus
            </span>
          </div>
          <p className="text-gray-700 mb-2">
            {listing.accommodationType} • {listing.privateBathroom}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-amber-800 px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-gray-600">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>
          
          {/* Contact information at the bottom */}
          {contactValue && (
            <div className="mt-auto pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {isEmail ? (
                  <Mail className="w-4 h-4 text-amber-500" />
                ) : (
                  <Phone className="w-4 h-4 text-amber-500" />
                )}
                <span className="truncate max-w-[200px]">{contactValue}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 