import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import medicineApi from '../services/api';
import Button from '../components/Button';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const MapView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hideExpired, setHideExpired] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!token) return;

      setLoading(true);
      setError('');
      try {
        const response = await medicineApi.getAll();
        // The API returns { medicines: [...] }
        setMedicines(response.data.medicines || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [token]);

  const filteredMeds = medicines.filter((med) => {
    const nameMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notExpired = new Date(med.expiryDate) > new Date();
    return nameMatch && (!hideExpired || notExpired);
  });

  const getMarkerIcon = (expiryDate) => {
    const daysLeft = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

    if (daysLeft <= 3) {
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    } else if (daysLeft <= 7) {
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    } else {
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Medicine Pickup Locations</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by medicine name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/3"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={hideExpired}
            onChange={() => setHideExpired(!hideExpired)}
            className="mr-2"
          />
          Hide Expired Medicines
        </label>

        <button
          onClick={() => {
            setSearchTerm('');
            setHideExpired(false);
          }}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>
      <div id="map" style={containerStyle}>
        {filteredMeds.map((medicine) => (
          medicine.location && (
            <div
              key={medicine._id}
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <img
                src={getMarkerIcon(medicine.expiryDate)}
                alt=""
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  zIndex: 10
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 20
                }}
              >
                {medicine.name}
              </div>
            </div>
          )
        ))}

        {selectedMedicine && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 30,
              maxWidth: '250px'
            }}
          >
            <h3 className="font-bold text-lg mb-1">{selectedMedicine.name}</h3>
            <p className="mb-1">Quantity: {selectedMedicine.quantity}</p>
            <p className="mb-1">
              Expiry: {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
            </p>
            {selectedMedicine.notes && (
              <p className="text-gray-500">Notes: {selectedMedicine.notes}</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          variant="secondary"
          onClick={() => navigate('/medicines')}
        >
          Back to Medicine List
        </Button>
      </div>
    </div>
  );
};

export default MapView;