import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Users } from 'lucide-react';

const Weddings = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const { data } = await axios.get(`/weddings${locationFilter ? `?location=${locationFilter}` : ''}`);
        setWeddings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weddings', error);
        setLoading(false);
      }
    };

    fetchWeddings();
  }, [locationFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Explore Authentic Weddings</h1>
        
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <input
            type="text"
            placeholder="Search by location (e.g. Goa, Jaipur)"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      ) : weddings.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl text-gray-500">No weddings found for your search.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weddings.map((wedding) => (
            <Link key={wedding._id} to={`/weddings/${wedding._id}`} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={wedding.images && wedding.images.length > 0 ? wedding.images[0] : 'https://images.unsplash.com/photo-1583939000240-690a1e05d0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    alt={wedding.title}
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-rose-600 shadow">
                    ${wedding.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{wedding.title}</h3>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-rose-500" />
                    <span className="truncate">{wedding.location.address}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-1 text-rose-500" />
                    <span>{new Date(wedding.date).toLocaleDateString()}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {wedding.maxGuests - wedding.bookedGuests} seats left
                    </div>
                    <span className="text-rose-600 font-medium hover:text-rose-700">View Details &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weddings;
