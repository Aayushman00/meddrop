import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const defaultCenter = { lat: 12.91285, lng: 74.85603 }; // Mangalore

const AddMedicine = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const isFutureDate = (date) => new Date(date) > new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !quantity || !expiryDate) {
            setError('Name, Quantity, and Expiry Date are required.');
            return;
        }

        if (!pickupLocation) {
            setError('Please select a pickup location on the map.');
            return;
        }

        if (!isFutureDate(expiryDate)) {
            setError('Expiry date must be a future date.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/medicines`,
                {
                    name,
                    quantity,
                    expiryDate,
                    notes,
                    location: pickupLocation
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate('/medicines');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add medicine');
        } finally {
            setLoading(false);
        }
    };

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
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full p-3 mb-4 border border-gray-300 rounded"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={1}
                />

                <input
                    type="date"
                    placeholder="Expiry Date"
                    className="w-full p-3 mb-4 border border-gray-300 rounded"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />

                <textarea
                    placeholder="Notes (optional)"
                    className="w-full p-3 mb-6 border border-gray-300 rounded"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />



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
            </form>
            {isLoaded && (
        <div className="w-full max-w-md bg-white rounded shadow-md p-4">
          <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={() => {
                    if (autocomplete) {
                        const place = autocomplete.getPlace();
                        if (place.geometry?.location) {
                        setPickupLocation({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        });
                        } else {
                            setError('Please select a valid location from the suggestions.');
                        }
                    }
                }}
            >
            <input
                type="text"
                placeholder="Search for pickup location"
                className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            </Autocomplete>

            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '300px' }}
                center={pickupLocation || defaultCenter}
                zoom={15}
                onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setPickupLocation({ lat, lng });
                }}
            >
                {pickupLocation && <Marker position={pickupLocation} />}
            </GoogleMap>

            < p className="text-sm text-gray-600 mt-2">Click the map or search to select pickup location.</p>
            </div>
        )}
        </div>
    );
};

export default AddMedicine;
