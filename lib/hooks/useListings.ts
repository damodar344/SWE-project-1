import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Listing {
  id: string;
  images: string[];
  rent: number;
  accommodationType: string;
  privateBathroom: boolean;
  distanceFromCampus: number;
  utilityIncluded: boolean;
  amenities: string[];
}

export function useListings() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch('/api/listings');
        const data = await response.json();
        
        if (response.ok) {
          setListings(data.listings);
        } else {
          console.error('Failed to fetch listings:', data.error);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, [session?.user?.id]);

  return { listings, isLoading };
} 