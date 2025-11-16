import { useState, useEffect } from 'react';
import MoodboardCard from '../components/MoodboardCard';
import api from '../utils/api';

const Home = () => {
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodboards();
  }, []);

  const fetchMoodboards = async () => {
    try {
      const response = await api.get('/moodboards/public');
      setMoodboards(response.data.moodboards);
    } catch (err) {
      setError('Failed to load moodboards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to VibeCheck</h1>
          <p className="text-xl mb-8">Create, share, and discover inspiring moodboards</p>
          <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Moodboards Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Explore Moodboards</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading moodboards...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : moodboards.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No moodboards yet. Be the first to create one!
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

export default Home;
