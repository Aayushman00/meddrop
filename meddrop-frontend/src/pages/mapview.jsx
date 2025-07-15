import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader} from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';


const containerStyle = {
    width: '100%',
    height: '600px'
};



const MapView = () => {
    const { token } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [hideExpired, setHideExpired] = useState(false);
    const [mapRef, setMapRef] = useState(null);

    const navigate = useNavigate();

    const defaultCenter = { lat: 12.91285, lng: 74.85603 };
    const center = medicines.length > 0
    ? { lat: medicines[0].location.lat, lng: medicines[0].location.lng }
    : defaultCenter;

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const filteredMeds = medicines.filter((med) => {
        const nameMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
        const notExpired = new Date(med.expiryDate) > new Date();
        return nameMatch && (!hideExpired || notExpired);
    });


    useEffect(() => {
        if (mapRef && filteredMeds.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            filteredMeds.forEach((med) => {
                if (med.location) {
                    bounds.extend(new window.google.maps.LatLng(med.location.lat, med.location.lng));
                }
            });
            mapRef.fitBounds(bounds);
        }
    }, [mapRef, filteredMeds]);
    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/medicines`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setMedicines(res.data.medicines))
        .catch(console.error);
    }, [token]);

    if(!isLoaded) return <div>Loading...</div>;

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

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Medicine Pickup Locations</h1>
            <div className='mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between'>
                <input
                    type='text'
                    placeholder='Search by medicine name...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='p-2 border rounded w-full sm:w-1/3'
                />
                <label className='flex items-center'>
                    <input
                        type='checkbox'
                        checked={hideExpired}
                        onChange={() => setHideExpired(!hideExpired)}
                        className='mr-2'
                    />
                    Hide Expired Medicines
                </label>    

                <button
                    className='text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300'
                    onClick={() => {
                        setSearchTerm('');
                        setHideExpired(false);
                    }}
                >
                    Reset Filters
                </button>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                onLoad={map => setMapRef(map)}
                center={center}
                zoom={13}
            >
                {filteredMeds.map((medicine) => (
                    medicine.location && (
                        <Marker
                            key={medicine._id}
                            position={{ lat: medicine.location.lat, lng: medicine.location.lng }}
                            label={{
                                text: medicine.name,
                                color: 'black',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                            icon={getMarkerIcon(medicine.expiryDate)}
                            onClick={() => setSelectedMedicine(medicine)}
                        />
                    )
                ))}

                {selectedMedicine && (
                    <InfoWindow
                        position={{ lat: selectedMedicine.location.lat, lng: selectedMedicine.location.lng }}
                        onCloseClick={() => setSelectedMedicine(null)}
                    >
                        <div className="text-sm">
                            <h3 className="font-bold text-lg mb-1">{selectedMedicine.name}</h3>
                            <p className="mb-1">Quantity: {selectedMedicine.quantity}</p>
                            <p className="mb-1">
                                Expiry: {selectedMedicine.expiryDate.slice(0, 10)}
                            </p>
                            {selectedMedicine.notes && (
                                <p className="text-gray-500">Notes: {selectedMedicine.notes}</p>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => navigate('/medicines')}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Back to Medicine List
                </button>
            </div>
        </div>
    );
}

export default MapView;