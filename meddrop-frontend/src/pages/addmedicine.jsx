import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import medicineApi from '../services/api';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useForm } from '../hooks/useForm';
import Button from '../components/Button';
import Input from '../components/Input';

const AddMedicine = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [pickupLocation, setPickupLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded } = useGoogleMaps({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const defaultCenter = { lat: 12.91285, lng: 74.85603 };

  const isFutureDate = (date) => new Date(date) > new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form using useForm validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      // Set the first error to display in the UI
      const firstError = Object.values(validationErrors)[0];
      setError(firstError);
      return;
    }

    if (!pickupLocation) {
      setError('Please select a pickup location on the map.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await medicineApi.create({
        name,
        quantity,
        expiryDate,
        notes,
        location: pickupLocation
      });

      navigate('/medicines');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const formValidation = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.quantity || values.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    if (!values.expiryDate) errors.expiryDate = 'Expiry date is required';
    else if (!isFutureDate(values.expiryDate)) errors.expiryDate = 'Expiry date must be a future date';
    return errors;
  };

  const {
    values: { name, quantity, expiryDate, notes },
    handleChange,
    resetForm
  } = useForm(
    {
      name: '',
      quantity: '',
      expiryDate: '',
      notes: ''
    },
    formValidation
  );

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Medicine</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={name}
          onChange={(e) => handleChange(e, 'name')}
        />

        <input
          type="number"
          placeholder="Quantity"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={quantity}
          onChange={(e) => handleChange(e, 'quantity')}
          min={1}
        />

        <input
          type="date"
          placeholder="Expiry Date"
          className="w-full p-3 mb-4 border border-gray-300 rounded"
          value={expiryDate}
          onChange={(e) => handleChange(e, 'expiryDate')}
        />

        <textarea
          placeholder="Notes (optional)"
          className="w-full p-3 mb-6 border border-gray-300 rounded"
          value={notes}
          onChange={(e) => handleChange(e, 'notes')}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <div>
            <input
              type="text"
              placeholder="Search for pickup location"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <div
              id="map"
              style={{ width: '100%', height: '300px' }}
            ></div>
            <p className="text-sm text-gray-600 mt-2">
              Click the map or search to select pickup location.
            </p>
          </div>
          {!pickupLocation && (
            <p className="text-red-500 text-sm mt-2">Please select a pickup location</p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Adding...' : 'Add Medicine'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/medicines')}
            className="mt-4 w-full p-3 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AddMedicine;