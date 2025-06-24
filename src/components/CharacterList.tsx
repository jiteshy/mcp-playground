import { useState, useEffect, useRef } from 'react';
import { Character, ApiResponse } from '../types/character';
import { useDebounce } from '../hooks/useDebounce';

interface CharacterListProps {}

export default function CharacterList({}: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCharacters = async (search?: string) => {
    try {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      if (search) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      
      setError(null);

      const url = search 
        ? `https://rickandmortyapi.com/api/character?name=${encodeURIComponent(search)}`
        : 'https://rickandmortyapi.com/api/character';

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setCharacters(data.results);
      
      if (search) {
        setHasSearched(true);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      if (errorMessage.toLowerCase().includes('timeout')) {
        setError('Network timeout. Please check your connection and try again.');
      } else {
        setError('Failed to load characters. Please try again.');
      }
      
      setCharacters([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const handleRetry = () => {
    if (searchTerm && hasSearched) {
      fetchCharacters(searchTerm);
    } else {
      fetchCharacters();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm.trim()) {
        fetchCharacters(searchTerm.trim());
      }
    }
  };

  const getStatusColor = (status: Character['status']) => {
    switch (status) {
      case 'Alive':
        return 'text-green-600';
      case 'Dead':
        return 'text-red-600';
      case 'unknown':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    img.src = '/placeholder-character.png'; // Fallback image
  };

  // Initial load
  useEffect(() => {
    fetchCharacters();
    
    // Cleanup function to cancel any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      return; // Don't search while user is still typing
    }

    if (debouncedSearchTerm.trim() === '') {
      if (hasSearched) {
        // User cleared search, return to all characters
        setHasSearched(false);
        fetchCharacters();
      }
      return;
    }

    // Perform search
    fetchCharacters(debouncedSearchTerm.trim());
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rick and Morty Characters
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore the universe of Rick and Morty
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {isSearching && (
              <div 
                data-testid="search-loading"
                className="absolute right-3 top-3"
              >
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div 
              data-testid="loading-indicator"
              className="text-center"
            >
              <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading characters...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && characters.length === 0 && hasSearched && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No characters found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
        )}

        {/* Character Grid */}
        {!isLoading && !error && characters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                data-testid={`character-card-${character.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={character.image}
                    alt={character.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {character.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Status:</span>
                      <span className={`font-medium ${getStatusColor(character.status)}`}>
                        {character.status}
                      </span>
                    </div>
                    
                    {character.species && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Species:</span>
                        <span className="text-gray-700">{character.species}</span>
                      </div>
                    )}
                    
                    {character.location?.name && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2 mt-0.5">Location:</span>
                        <span className="text-gray-700 break-words">{character.location.name}</span>
                      </div>
                    )}
                    
                    {character.origin?.name && character.origin.name !== 'unknown' && (
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2 mt-0.5">Origin:</span>
                        <span className="text-gray-700 break-words">{character.origin.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 