import { useState } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';

const CreateWeddingModal = ({ isOpen, onClose, onWeddingCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    maxGuests: '',
    location: { address: '' },
    images: [''],
    rituals: [{ name: '', time: '', description: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setFormData({ ...formData, location: { address: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleRitualChange = (index, field, value) => {
    const newRituals = [...formData.rituals];
    newRituals[index][field] = value;
    setFormData({ ...formData, rituals: newRituals });
  };

  const addRitualField = () => {
    setFormData({
      ...formData,
      rituals: [...formData.rituals, { name: '', time: '', description: '' }]
    });
  };
  
  const removeRitualField = (index) => {
    const newRituals = formData.rituals.filter((_, i) => i !== index);
    setFormData({ ...formData, rituals: newRituals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean up empty fields
      const cleanedData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        rituals: formData.rituals.filter(r => r.name.trim() !== '')
      };

      await axios.post('/weddings', cleanedData);
      setLoading(false);
      onWeddingCreated(); // Callback to refresh dashboard data
      onClose(); // Close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wedding');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-2xl flex flex-col max-h-[90vh]">
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">Create Wedding Listing</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Wedding Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" placeholder="e.g. Royal Rajasthani Wedding" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Per Person ($)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                  <input type="number" name="maxGuests" required value={formData.maxGuests} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Location (Full Address)</label>
                  <input type="text" name="address" required value={formData.location.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" placeholder="e.g. Rambagh Palace, Jaipur, Rajasthan" />
                  <p className="text-xs text-gray-500 mt-1">This will be used to generate the Google Map.</p>
                </div>
              </div>

              {/* Images */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Photo URLs</label>
                  <button type="button" onClick={addImageField} className="text-sm text-rose-600 flex items-center hover:text-rose-700"><Plus className="w-4 h-4 mr-1"/> Add Photo</button>
                </div>
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input type="url" value={img} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="https://image-url.com/photo.jpg" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm" />
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImageField(index)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>

              {/* Rituals & Events */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Rituals & Schedule</label>
                  <button type="button" onClick={addRitualField} className="text-sm text-rose-600 flex items-center hover:text-rose-700"><Plus className="w-4 h-4 mr-1"/> Add Event</button>
                </div>
                {formData.rituals.map((ritual, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md mb-3 border relative">
                    {formData.rituals.length > 1 && (
                      <button type="button" onClick={() => removeRitualField(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input type="text" placeholder="Event Name (e.g. Haldi)" value={ritual.name} onChange={(e) => handleRitualChange(index, 'name', e.target.value)} className="block w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm" />
                      </div>
                      <div>
                        <input type="text" placeholder="Time (e.g. Day 1 - 10:00 AM)" value={ritual.time} onChange={(e) => handleRitualChange(index, 'time', e.target.value)} className="block w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm" />
                      </div>
                      <div className="md:col-span-2">
                        <input type="text" placeholder="Description" value={ritual.description} onChange={(e) => handleRitualChange(index, 'description', e.target.value)} className="block w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end gap-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none sm:w-auto sm:text-sm">
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWeddingModal;
