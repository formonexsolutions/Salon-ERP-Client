import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Helper/helper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubscriptionInfo = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [salonId, setSalonId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch salon ID from local storage initially
    const storedSalonId = localStorage.getItem('salon_id');
    if (storedSalonId) {
      setSalonId(storedSalonId);
    }
  }, []);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!salonId || !token) {
        setSubscriptionDetails({});
        return;
      }
      
      setIsLoading(true);

      try {
        const response = await axios.get(`${BASE_URL}/api/payment/subscriptions`, {
          params: { salon_id: salonId },
          headers: {
            'x-token': token,
          },
        });

        console.log('API response:', response.data);

        if (response.data.length > 0) {
          // Assuming the API returns an array of subscriptions, we take the first one
          setSubscriptionDetails(response.data[0]);
        } else {
          setSubscriptionDetails({});
          toast.error('No subscription details found for this salon', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        toast.error('An error occurred while fetching subscription details', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setSubscriptionDetails({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [salonId, token]); // Add salonId and token as dependencies

  const formattedDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB') : 'N/A';
  };

  return (
    <div className="cards-container23">
      <h5 className="heading234">Subscription Information</h5>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='gfr45'>
          <div className='mothflex8'>
            <p className='p67'>Salon ID</p>: <span>{salonId || 'N/A'}</span>
          </div>
          <div className='mothflex8'>
            <p className='p67'>Start Date </p>: <span>{formattedDate(subscriptionDetails.subscription_startDate)}</span>
          </div>
          <div className='mothflex8'>
            <p className='p67'>Expiry Date</p>: <span>{formattedDate(subscriptionDetails.subscription_expiryDate)}</span>
          </div>
          <div className='mothflex8'>
            <p className='p67'>Price</p>: <span>{subscriptionDetails.amount ? `${subscriptionDetails.amount} INR` : 'N/A'}</span>
          </div>
          <div className='mothflex8'>
            <p className='p67'>Status</p>:<span> {subscriptionDetails.status || 'N/A'}</span>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SubscriptionInfo;
