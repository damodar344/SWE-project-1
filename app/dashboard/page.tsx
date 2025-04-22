'use client';

import { Suspense } from "react";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Loader2 } from "lucide-react";
import { useListings } from "@/lib/hooks/useListings";

export default function DashboardPage() {
  const { listings, isLoading } = useListings();

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <a
              href="/listing"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              Create New Listing
            </a>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          }>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No listings yet
                </h3>
                <p className="text-gray-600">
                  Create your first listing to start sharing your space
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </Suspense>
        </main>
      </div>
    </AuthWrapper>
  );
}
