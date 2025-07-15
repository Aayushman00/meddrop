import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Medicines = () => {
    const { token } = useAuth();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        const fetchMedicines = async () => {
        try {
            const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/medicines`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
            setMedicines(response.data.medicines);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch medicines');
        } finally {
            setLoading(false);
        }
        };

        fetchMedicines();
    }, [token]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this medicine?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/medicines/${id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setMedicines((prevMeds) => prevMeds.filter((med) => med._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete medicine');
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
    if (medicines.length === 0) return <p className="text-center mt-10">No medicines found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Medicines</h1>
        <button
            onClick={() => navigate('/add-medicine')}
            className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
            + Add Medicine
        </button>
        <div className="grid grid-cols-1 gap-4">
            {medicines.map((med) => (
            <div key={med._id} className="bg-white shadow-md p-4 rounded-lg border">
                <h2 className="text-xl font-semibold mb-2">{med.name}</h2>
                <p><strong>Quantity:</strong> {med.quantity}</p>


                <p><strong>Expiry:</strong> {new Date(med.expiryDate).toLocaleDateString()}</p>


                <p><strong>Notes:</strong> {med.notes || 'None'}</p>


                <div className="mt-4 flex gap-2">


                    <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                        onClick={() => navigate(`/edit-medicine/${med._id}`)}
                    >
                    Edit
                    </button>


                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleDelete(med._id)}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => navigate('/map')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        View All on Map
                    </button>

                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Medicines;
