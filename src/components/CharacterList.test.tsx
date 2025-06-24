import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterList from './CharacterList';
import { Character, ApiResponse } from '../types/character';

// Mock data
const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'unknown', url: '' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    url: 'https://rickandmortyapi.com/api/character/2',
    created: '2017-11-04T18:50:21.651Z',
  },
];

const mockApiResponse: ApiResponse = {
  info: {
    count: 2,
    pages: 1,
    next: null,
    prev: null,
  },
  results: mockCharacters,
};

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => mockApiResponse,
  } as Response);
});

describe('CharacterList Component', () => {
  // TC-001: Initial Page Load
  describe('Initial Page Load', () => {
    test('should show loading state initially and make API call to /api/character', async () => {
      render(<CharacterList />);
      
      // Verify loading state shows initially
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      
      // Verify API call is made
      expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character', expect.objectContaining({
        signal: expect.any(AbortSignal)
      }));
      
      // Wait for characters to load
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
      
      // Verify loading state is removed
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  // TC-002: API Response Handling
  describe('API Response Handling', () => {
    test('should render character cards with correct data', async () => {
      render(<CharacterList />);
      
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
      
             // Verify each character card shows required data
       const rickCard = screen.getByTestId('character-card-1');
       expect(rickCard).toBeInTheDocument();
       expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
       expect(within(rickCard).getByText('Alive')).toBeInTheDocument();
               expect(within(rickCard).getByText('Human')).toBeInTheDocument();
        expect(within(rickCard).getByText('Citadel of Ricks')).toBeInTheDocument();
        expect(within(rickCard).getByText('Earth (C-137)')).toBeInTheDocument();
      
      // Verify character image
      const rickImage = screen.getByAltText('Rick Sanchez');
      expect(rickImage).toHaveAttribute('src', 'https://rickandmortyapi.com/api/character/avatar/1.jpeg');
    });

         test('should display status with correct color coding', async () => {
       render(<CharacterList />);
       
       await waitFor(() => {
         expect(screen.getAllByText('Alive')[0]).toBeInTheDocument();
       });
       
       // Verify status color coding
       const aliveStatuses = screen.getAllByText('Alive');
       expect(aliveStatuses[0]).toHaveClass('text-green-600');
     });
  });

  // TC-003: API Error Handling
  describe('API Error Handling', () => {
    test('should display error message when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));
      
      render(<CharacterList />);
      
             await waitFor(() => {
         expect(screen.getByText('Failed to load characters. Please try again.')).toBeInTheDocument();
       });
       
       // Verify retry mechanism is available
       expect(screen.getByText('Retry')).toBeInTheDocument();
      
      // Verify no character cards are shown
      expect(screen.queryByTestId('character-card-1')).not.toBeInTheDocument();
    });
  });

  // TC-004: Network Timeout
  describe('Network Timeout Handling', () => {
    test('should handle network timeout with appropriate error message', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));
      
      render(<CharacterList />);
      
             await waitFor(() => {
         expect(screen.getByText('Network timeout. Please check your connection and try again.')).toBeInTheDocument();
       });
       
       // Verify retry option is available
       expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  // TC-005: Search Input Rendering
  describe('Search Input Rendering', () => {
    test('should render search input with correct placeholder', () => {
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });
  });

  // TC-006: Basic Search - Valid Character
  describe('Basic Search Functionality', () => {
    test('should filter characters by search term with debounce', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      // Type search term
      await user.type(searchInput, 'rick');
      
      // Verify debounce - API call should not be immediate
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only initial call
      
             // Wait for debounce delay (300ms)
       await waitFor(() => {
         expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?name=rick', expect.objectContaining({
           signal: expect.any(AbortSignal)
         }));
       }, { timeout: 500 });
    });
  });

     // TC-007: Basic Search - No Results
   describe('Search No Results', () => {
     test('should display no results message when search returns empty', async () => {
       const user = userEvent.setup();
       
       render(<CharacterList />);
       
       // Wait for initial load to complete
       await waitFor(() => {
         expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
       });
       
       // Now mock empty response for search
       mockFetch.mockResolvedValueOnce({
         ok: true,
         json: async () => ({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] }),
       } as Response);
       
       const searchInput = screen.getByPlaceholderText('Search characters...');
       await user.type(searchInput, 'invalidcharacter123');
       
       await waitFor(() => {
         expect(screen.getByText('No characters found')).toBeInTheDocument();
       });
       
       // Verify no character cards are visible
       expect(screen.queryByTestId('character-card-1')).not.toBeInTheDocument();
       
       // Verify search input remains populated
       expect(searchInput).toHaveValue('invalidcharacter123');
     });
   });

  // TC-008: Search Debouncing
  describe('Search Debouncing', () => {
    test('should debounce search input and cancel previous requests', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      // Rapidly type different characters
      await user.type(searchInput, 'r');
      await user.type(searchInput, 'i');
      await user.type(searchInput, 'c');
      await user.type(searchInput, 'k');
      
             // Wait for debounce
       await waitFor(() => {
         expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?name=rick', expect.objectContaining({
           signal: expect.any(AbortSignal)
         }));
       }, { timeout: 500 });
       
       // Should only have initial call + final debounced call
       expect(mockFetch).toHaveBeenCalledTimes(2);
     });
   });
 
   // TC-009: Clear Search
   describe('Clear Search', () => {
     test('should reset to initial state when search is cleared', async () => {
       const user = userEvent.setup();
       render(<CharacterList />);
       
       const searchInput = screen.getByPlaceholderText('Search characters...');
       
       // Type search term
       await user.type(searchInput, 'rick');
       
       // Clear search
       await user.clear(searchInput);
       
       // Verify API call to get all characters
       await waitFor(() => {
         expect(mockFetch).toHaveBeenLastCalledWith('https://rickandmortyapi.com/api/character', expect.objectContaining({
           signal: expect.any(AbortSignal)
         }));
       });
    });
  });

  // TC-010: Typing in Search Input
  describe('Search Input Interaction', () => {
    test('should update input value with each keystroke', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      await user.type(searchInput, 'test');
      
      expect(searchInput).toHaveValue('test');
    });
  });

  // TC-011: Search Input Focus States
  describe('Search Input Focus', () => {
    test('should handle focus states correctly', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      // Focus input
      await user.click(searchInput);
      expect(searchInput).toHaveFocus();
      
      // Tab navigation should work
      await user.tab();
      expect(searchInput).not.toHaveFocus();
    });
  });

  // TC-013: Initial Load State
  describe('Loading States', () => {
    test('should show loading indicator during initial load', () => {
      render(<CharacterList />);
      
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
      expect(screen.queryByTestId('character-card-1')).not.toBeInTheDocument();
    });
  });

  // TC-014: Search Loading State
  describe('Search Loading State', () => {
    test('should show loading indicator during search', async () => {
      const user = userEvent.setup();
      
      // Delay the fetch response
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => mockApiResponse,
        } as Response), 100))
      );
      
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      await user.type(searchInput, 'rick');
      
      // Should show loading during search
      await waitFor(() => {
        expect(screen.getByTestId('search-loading')).toBeInTheDocument();
      });
    });
  });

  // TC-016: Empty Search Input
  describe('Edge Cases', () => {
    test('should not make API call for empty search', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      // Focus and press Enter with empty input
      await user.click(searchInput);
      await user.keyboard('{Enter}');
      
      // Should only have initial API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  // TC-017: Special Characters in Search
  describe('Special Characters', () => {
    test('should handle special characters in search', async () => {
      const user = userEvent.setup();
      render(<CharacterList />);
      
      const searchInput = screen.getByPlaceholderText('Search characters...');
      
      await user.type(searchInput, '!@#$%');
      
             await waitFor(() => {
         expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?name=!%40%23%24%25', expect.objectContaining({
           signal: expect.any(AbortSignal)
         }));
       });
    });
  });

  // TC-020: Character Card Rendering
  describe('Character Display', () => {
    test('should render character cards with proper layout and status color coding', async () => {
      render(<CharacterList />);
      
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
      
      const rickCard = screen.getByTestId('character-card-1');
      
             // Verify all required elements are present
       expect(rickCard.querySelector('img')).toBeInTheDocument();
       expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
       
       // Get the specific Alive status for Rick within his card
       const rickAliveStatus = within(rickCard).getByText('Alive');
       expect(rickAliveStatus).toHaveClass('text-green-600');
       
       expect(within(rickCard).getByText('Human')).toBeInTheDocument();
       expect(within(rickCard).getByText('Citadel of Ricks')).toBeInTheDocument();
       expect(within(rickCard).getByText('Earth (C-137)')).toBeInTheDocument();
    });
  });

  // TC-021: Missing Character Data
  describe('Missing Data Handling', () => {
    test('should handle missing character data gracefully', async () => {
      const incompleteCharacter = {
        ...mockCharacters[0],
        species: '',
        location: { name: '', url: '' },
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: mockApiResponse.info,
          results: [incompleteCharacter],
        }),
      } as Response);
      
      render(<CharacterList />);
      
      await waitFor(() => {
        expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      });
      
      // Should render without errors
      expect(screen.getByTestId('character-card-1')).toBeInTheDocument();
    });
  });

  // TC-022: Character Image Loading
  describe('Image Loading', () => {
    test('should handle image loading errors with fallback', async () => {
      render(<CharacterList />);
      
      await waitFor(() => {
        expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
      });
      
      const image = screen.getByAltText('Rick Sanchez');
      
      // Simulate image error
      fireEvent.error(image);
      
      // Should handle error gracefully
      expect(image).toBeInTheDocument();
    });
  });
}); 