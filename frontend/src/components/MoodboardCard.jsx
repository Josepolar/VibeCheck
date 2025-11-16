import { Link } from 'react-router-dom';

const MoodboardCard = ({ moodboard }) => {
  return (
    <Link to={`/moodboard/${moodboard.moodboard_id}`}>
      <div className="card hover:shadow-xl transition-shadow cursor-pointer">
        <div className="relative">
          {moodboard.image_url ? (
            <img
              src={moodboard.image_url}
              alt={moodboard.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">🎨</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-medium">
            {moodboard.mood_category || 'General'}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {moodboard.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {moodboard.description || 'No description'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              ❤️ {moodboard.likes_count || 0}
            </span>
            <span className="flex items-center">
              👁️ {moodboard.views_count || 0}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
              {moodboard.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs">{moodboard.username}</span>
          </div>
        </div>

        {moodboard.tags && JSON.parse(moodboard.tags).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {JSON.parse(moodboard.tags).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default MoodboardCard;
