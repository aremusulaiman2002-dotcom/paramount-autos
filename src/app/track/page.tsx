'use client';

import { useState } from 'react';

export default function TrackBooking() {
  const [refNumber, setRefNumber] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/bookings?ref=${refNumber}`);
      const data = await response.json();

      if (response.ok) {
        setBooking(data.booking);
      } else {
        setError(data.error || 'Booking not found');
      }
    } catch (err) {
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Track Your Booking</h1>
        
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label htmlFor="refNumber" className="block text-sm font-medium text-gray-700">
              Booking Reference Number
            </label>
            <input
              type="text"
              id="refNumber"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
              placeholder="PMT-20251201-ABC1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Booking'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {booking && (
          <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            <div className="space-y-2">
              <p><strong>Reference:</strong> {booking.refNumber}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status}
                </span>
              </p>
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Total Amount:</strong> ₦{booking.totalAmount?.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}