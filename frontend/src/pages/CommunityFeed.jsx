import { useState, useEffect } from 'react';
import MoodboardCard from '../components/MoodboardCard';
import api from '../utils/api';

const CommunityFeed = () => {
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMoodboards();
  }, [filter]);

  const fetchMoodboards = async () => {
    setLoading(true);
    try {
      const response = await api.get('/moodboards/public');
      let filtered = response.data.moodboards;

      if (filter !== 'all') {
        filtered = filtered.filter(m => m.mood_category === filter);
      }

      setMoodboards(filtered);
    } catch (err) {
      console.error('Failed to fetch moodboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Happy', 'Calm', 'Energetic', 'Peaceful', 'Mysterious', 'Dreamy'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Community Feed</h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                filter === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>

        {/* Moodboards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : moodboards.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No moodboards found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {moodboards.map((moodboard) => (
              <MoodboardCard key={moodboard.moodboard_id} moodboard={moodboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
