import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/authContext';
import { useForm } from '../hooks/useForm';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleMapPicker from '../components/GoogleMapPicker';

const EditMedicine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { loading, error, data: medicineData, run } = useApi();
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      await run(() =>
        fetch(`${process.env.REACT_APP_API_BASE_URL}/medicines`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error('Failed to load medicine');
          }
          return res.json();
        })
      );

      if (medicineData && medicineData.medicines) {
        const med = medicineData.medicines.find((m) => m._id === id);
        if (med) {
          setMedicine(med);
        }
      }
    };

    if (token) {
      fetchMedicine();
    }
  }, [token, run, medicineData]);

  const [pickupLocation, setPickupLocation] = useState(null);

  const formValidation = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.quantity || values.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    if (!values.expiryDate) errors.expiryDate = 'Expiry date is required';
    else if (!isFutureDate(values.expiryDate)) errors.expiryDate = 'Expiry date must be a future date';
    if (!values.pickupLocation) errors.pickupLocation = 'Please select a pickup location';
    return errors;
  };

  const {
    values: { name, quantity, expiryDate, notes },
    handleChange,
    handleBlur,
    errors,
    validate,
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

  const isFutureDate = (date) => new Date(date) > new Date();

  useEffect(() => {
    if (medicine) {
      resetForm({
        name: medicine.name,
        quantity: medicine.quantity,
        expiryDate: medicine.expiryDate.slice(0, 10),
        notes: medicine.notes || ''
      });
      setPickupLocation(medicine.location);
    }
  }, [medicine, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) return;

    try {
      await run(() =>
        fetch(`${process.env.REACT_APP_API_BASE_URL}/medicines/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            quantity,
            expiryDate,
            notes,
            location: pickupLocation
          })
        }).then((res) => {
          if (!res.ok) {
            throw new Error('Failed to update medicine');
          }
          return res.json();
        })
      );

      navigate('/medicines');
    } catch (err) {
      // Error is handled by useApi hook
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  if (!medicine) {
    return <p className="text-center mt-10">Loading medicine data...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Medicine</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Input
          type="text"
          label="Name"
          placeholder="Enter medicine name"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <Input
          type="number"
          label="Quantity"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          error={errors.quantity}
          required
          min={1}
        />

        <Input
          type="date"
          label="Expiry Date"
          placeholder="Select expiry date"
          value={expiryDate}
          onChange={(e) => handleChange('expiryDate', e.target.value)}
          error={errors.expiryDate}
          required
        />

        <Input
          type="textarea"
          label="Notes (optional)"
          placeholder="Enter any additional notes"
          value={notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>
          <GoogleMapPicker
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            initialLocation={pickupLocation}
            onLocationChange={setPickupLocation}
          />
          {!pickupLocation && (
            <p className="text-red-500 text-sm mt-2">Please select a pickup location</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            type="submit"
            variant="success"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Medicine'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/medicines')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicine;