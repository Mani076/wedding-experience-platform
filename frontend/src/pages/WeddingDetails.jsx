import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users, Info, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const { data } = await axios.get(`/weddings/${id}`);
        setWedding(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wedding details', error);
        setError('Failed to load wedding details');
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingLoading(true);
    setError('');
    
    try {
      await axios.post('/bookings', {
        weddingId: id,
        guests: parseInt(guests),
      });
      setSuccess('Booking successful! Please check your dashboard for payment details.');
      setBookingLoading(false);
      
      // Update seats locally
      setWedding(prev => ({
        ...prev,
        bookedGuests: prev.bookedGuests + parseInt(guests)
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!wedding) {
    return <div className="text-center py-20 text-xl text-gray-600">Wedding not found.</div>;
  }

  const seatsAvailable = wedding.maxGuests - wedding.bookedGuests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden h-96 relative mb-8">
        <img
          src={wedding.images && wedding.images.length > 0 ? wedding.images[0] : 'https://images.unsplash.com/photo-1583939000240-690a1e05d0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
          alt={wedding.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">{wedding.title}</h1>
          <div className="flex items-center text-white text-lg">
            <MapPin className="w-5 h-5 mr-2" />
            {wedding.location.address}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Wedding</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {wedding.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rituals & Events</h2>
            {wedding.rituals && wedding.rituals.length > 0 ? (
              <div className="space-y-4">
                {wedding.rituals.map((ritual, index) => (
                  <div key={index} className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center mb-2">
                      <span className="bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">{index + 1}</span>
                      {ritual.name}
                    </h3>
                    <p className="text-sm text-rose-600 font-medium mb-2">{ritual.time}</p>
                    <p className="text-gray-600">{ritual.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Events schedule will be shared soon.</p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 h-80">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.location.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                title="Wedding Location"
              ></iframe>
            </div>
            <p className="mt-2 text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" /> {wedding.location.address}</p>
          </section>
        </div>

        {/* Sidebar / Booking Box */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-3xl font-extrabold text-gray-900">${wedding.price}</span>
                <span className="text-gray-500 ml-1">/ person</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-rose-500" />
                <span>{new Date(wedding.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-rose-500" />
                <span>{seatsAvailable} seats available</span>
              </div>
              {wedding.hostId && (
                <div className="flex items-center text-gray-700">
                  <Info className="w-5 h-5 mr-3 text-rose-500" />
                  <span>Hosted by {wedding.hostId.name}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md shadow-sm border"
                disabled={seatsAvailable === 0}
              >
                {[...Array(Math.min(10, seatsAvailable)).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={seatsAvailable === 0 || bookingLoading || success}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white 
                ${seatsAvailable === 0 || success ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500'}
              `}
            >
              {bookingLoading ? 'Processing...' : success ? 'Booked!' : seatsAvailable === 0 ? 'Sold Out' : 'Reserve Spot'}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingDetails;
