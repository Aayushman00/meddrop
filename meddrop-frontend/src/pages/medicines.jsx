import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import medicineApi from '../services/api';
import Button from '../components/Button';

const Medicines = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!token) return;

      setLoading(true);
      setError('');
      try {
        const response = await medicineApi.getAll();
        setMedicines(response.data.medicines || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineApi.delete(id);
        // Filter out the deleted medicine
        setMedicines(prev => prev.filter(med => med._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete medicine');
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!medicines || medicines.length === 0) {
    return <p className="text-center mt-10">No medicines found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Medicines</h1>
      <Button
        variant="primary"
        onClick={() => navigate('/add-medicine')}
        className="mb-6"
      >
        + Add Medicine
      </Button>
      <div className="grid grid-cols-1 gap-4">
        {medicines.map((med) => (
          <div key={med._id} className="bg-white shadow-md p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">{med.name}</h2>
            <p><strong>Quantity:</strong> {med.quantity}</p>
            <p><strong>Expiry:</strong> {new Date(med.expiryDate).toLocaleDateString()}</p>
            <p><strong>Notes:</strong> {med.notes || 'None'}</p>
            <div className="mt-4 flex gap-2">
              <Button
                variant="warning"
                onClick={() => navigate(`/edit-medicine/${med._id}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(med._id)}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/map')}
              >
                View All on Map
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medicines;