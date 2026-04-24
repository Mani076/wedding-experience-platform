import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

const AIRecommend = () => {
  const [preferences, setPreferences] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    if (!preferences.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await axios.post('/ai/recommend', { preferences });
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error('Error fetching AI recommendation', error);
      setRecommendation("Sorry, the AI is taking a nap. Please try again later!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-2xl shadow-sm border border-rose-100 mb-8 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-rose-600 w-6 h-6" />
        <h3 className="text-lg font-bold text-gray-900">AI Cultural Matchmaker</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Tell us what kind of experience you're looking for (e.g., "I want a beach wedding with seafood", or "I want a royal palace wedding with dancing") and our AI will recommend the perfect event!
      </p>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && getRecommendation()}
          placeholder="e.g. Royal palace with spicy food..."
          className="flex-1 p-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button
          onClick={getRecommendation}
          disabled={loading || !preferences.trim()}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask AI'}
        </button>
      </div>

      {recommendation && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-rose-100 shadow-sm animate-fade-in-up">
          <p className="text-gray-800 leading-relaxed"><strong className="text-rose-600">AI Recommendation:</strong> {recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommend;
