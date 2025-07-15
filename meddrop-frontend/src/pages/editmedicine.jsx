import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const defaultCenter = { lat: 12.91285, lng: 74.85603 };
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [notes, setNotes] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        const fetchMedicine = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/medicines`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const medicine = response.data.medicines.find((m) => m._id === id);

            if (!medicine) {
                setError('Medicine not found');
                return;
            }

            setName(medicine.name);
            setQuantity(medicine.quantity);
            setExpiryDate(medicine.expiryDate.slice(0, 10));
            setNotes(medicine.notes || '');

            setPickupLocation(medicine.location);
        } catch (err) {
            setError('Failed to load medicine');
        } finally {
            setLoading(false);
        }
        };

        fetchMedicine();
    }, [id, token]);

    const isFutureDate = (date) => new Date(date) > new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !quantity || !expiryDate) {
            setError('All fields are required.');
            return;
        }

        if (!isFutureDate(expiryDate)) {
            setError('Expiry date must be a future date.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/medicines/${id}`,
                { name, quantity, expiryDate, notes, location: pickupLocation },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            navigate('/medicines');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update medicine');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;


    const isFormValid =
        name.trim() &&
        quantity &&
        expiryDate &&
        pickupLocation &&
        isFutureDate(expiryDate);

    
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Medicine</h2>

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
                    disabled={!isFormValid || submitting}
                    className={`w-full p-3 text-white rounded ${
                        !isFormValid || submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {submitting ? 'Updating...' : 'Update Medicine'}
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

export default EditMedicine;
