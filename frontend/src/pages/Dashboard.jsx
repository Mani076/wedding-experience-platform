import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, MapPin, CheckCircle, Clock, MessageCircle, Users, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import AIRecommend from '../components/AIRecommend';
import { useTranslation } from 'react-i18next';
import CreateWeddingModal from '../components/CreateWeddingModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [activeHostName, setActiveHostName] = useState('');
  const [hostTab, setHostTab] = useState('listings'); // 'listings' or 'bookings'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchMyData = async () => {
    try {
      if (user.role === 'tourist') {
        const { data } = await axios.get('/bookings/mybookings');
        setBookings(data);
      } else if (user.role === 'host') {
        const listingsRes = await axios.get('/weddings/myweddings');
        const bookingsRes = await axios.get('/bookings/hostbookings');
        setMyListings(listingsRes.data);
        setHostBookings(bookingsRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyData();
    }
  }, [user]);

  const handlePayment = async (bookingId) => {
    try {
      await axios.put(`/bookings/${bookingId}/pay`);
      fetchMyData();
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment simulation failed.');
    }
  };

  const openChat = (booking, isHost = false) => {
    setActiveChatRoom(booking._id);
    setActiveHostName(isHost ? booking.userId.name : 'Your Host');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">{t('loginRequired', 'Please log in')}</h2>
        <Link to="/login" className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="md:flex md:items-center md:justify-between mb-8 border-b pb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {t('welcome', 'Welcome')}, {user.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {user.role === 'tourist' ? t('touristAccount', 'Tourist Account') : user.role === 'host' ? t('hostAccount', 'Host Account') : 'Admin Account'}
          </p>
        </div>
      </div>

      {user.role === 'tourist' && <AIRecommend />}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : user.role === 'tourist' ? (
        <div>
          <h3 className="text-xl font-semibold mb-6">{t('yourBookings', 'Your Bookings')}</h3>
          {bookings.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{t('noBookings', 'You haven\'t booked any weddings yet.')}</p>
              <Link to="/weddings" className="text-rose-600 font-medium hover:text-rose-700">
                {t('browseWeddings', 'Browse Weddings')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-gray-900 truncate pr-4">
                        {booking.weddingId?.title || 'Wedding Details Unavailable'}
                      </h4>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    {booking.weddingId && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{new Date(booking.weddingId.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">Guests: {booking.guests} | Total: ${booking.totalAmount}</div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                    <div className="text-sm">
                      {booking.paymentStatus === 'pending' ? (
                        <span className="text-yellow-600 flex items-center"><Clock className="w-4 h-4 mr-1"/> Pending</span>
                      ) : (
                        <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Paid</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openChat(booking)} className="bg-white border border-gray-300 px-3 py-2 rounded flex items-center text-sm font-medium">
                        <MessageCircle className="w-4 h-4 mr-1" /> Chat
                      </button>
                      {booking.paymentStatus === 'pending' && (
                        <button onClick={() => handlePayment(booking._id)} className="bg-rose-600 text-white px-4 py-2 rounded text-sm font-medium">Pay Now</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : user.role === 'host' ? (
        <div>
          <div className="flex border-b mb-6">
            <button 
              className={`py-2 px-4 font-medium border-b-2 ${hostTab === 'listings' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setHostTab('listings')}
            >
              My Listings
            </button>
            <button 
              className={`py-2 px-4 font-medium border-b-2 ${hostTab === 'bookings' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setHostTab('bookings')}
            >
              Guest Bookings
            </button>
          </div>

          {hostTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Wedding Events</h3>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center text-rose-600 font-medium hover:text-rose-700">
                  <PlusCircle className="w-5 h-5 mr-1" /> Create Listing
                </button>
              </div>
              {myListings.length === 0 ? (
                <p className="text-gray-500">You haven't created any wedding listings yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map(wedding => (
                    <div key={wedding._id} className="border rounded-xl overflow-hidden shadow-sm bg-white">
                      <img src={wedding.images[0] || 'https://via.placeholder.com/400x200'} alt={wedding.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 truncate">{wedding.title}</h4>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(wedding.date).toLocaleDateString()}</span>
                          <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {wedding.bookedGuests || 0}/{wedding.maxGuests} Booked</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {hostTab === 'bookings' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Bookings from Tourists</h3>
              {hostBookings.length === 0 ? (
                <p className="text-gray-500">No guests have booked your weddings yet.</p>
              ) : (
                <div className="space-y-4">
                  {hostBookings.map(booking => (
                    <div key={booking._id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.userId?.name} <span className="text-gray-500 font-normal text-sm">({booking.userId?.email})</span></p>
                        <p className="text-sm text-gray-600 mt-1">Booked: <span className="font-medium">{booking.weddingId?.title}</span></p>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                          <span>Guests: {booking.guests}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending Payment'}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => openChat(booking, true)} className="mt-3 sm:mt-0 bg-rose-50 text-rose-700 px-4 py-2 rounded-md hover:bg-rose-100 font-medium flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" /> Message Guest
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}

      {activeChatRoom && (
        <ChatBox room={activeChatRoom} hostName={activeHostName} onClose={() => setActiveChatRoom(null)} />
      )}

      {/* Host Create Wedding Modal */}
      <CreateWeddingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onWeddingCreated={fetchMyData} 
      />
    </div>
  );
};

export default Dashboard;
