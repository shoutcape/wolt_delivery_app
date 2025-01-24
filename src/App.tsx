import { useState } from 'react';
import './App.css';
import OrderForm from './components/OrderForm';
import OrderBreakdown from './components/OrderBreakdown';
import { calculateDeliveryDistance, calculateDeliveryFee, calculateSmallOrderSurcharge, calculateTotalPrice, fetchVenueData } from './utils';
import { toast, ToastContainer } from 'react-toastify';
import { FormData, ResultData } from './types';

const App = () => {

  const [formData, setFormData] = useState<FormData>({
    userLocation: null,
    cartValue: 0,
    venueSlug: null,
  });

  const [resultData, setResultData] = useState<ResultData>({
    cartValue: 0,
    deliveryFee: 0,
    smallOrderSurcharge: 0,
    deliveryDistance: null,
    totalPrice: null,
  });


  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const {name, type, value} = event.target
    const parsedValue = type ==='number' ?
    parseFloat(value): value
    setFormData(prevData => ({
      ...prevData,
      [name]: parsedValue
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.venueSlug || formData.venueSlug == '') {
      toast.warn('No venue slug given');
      return;
    }

    if (!formData.cartValue) {
      toast.warn('No cart value given');
      return;
    }

    if (!formData.userLocation) {
      toast.warn('No user location value given');
      return;
    }

    let staticData 
    let dynamicData

    try {
      staticData = await fetchVenueData(formData.venueSlug, 'static');
      dynamicData = await fetchVenueData(formData.venueSlug, 'dynamic');
      console.log(staticData, dynamicData)
    } catch (error) {
      toast.warn('Incorrect venue slug');
      return;
    }

    const cartValueInCents = formData.cartValue * 100
    const deliveryDistance = calculateDeliveryDistance(formData.userLocation, staticData?.venueCoords)
    const smallOrderSurcharge = calculateSmallOrderSurcharge(cartValueInCents, dynamicData?.order_minimum_no_surcharge)
    const deliveryFee = calculateDeliveryFee(dynamicData?.base_price,dynamicData?.distance_ranges,deliveryDistance)
    const totalPrice = calculateTotalPrice(cartValueInCents,smallOrderSurcharge,deliveryFee)

    setResultData({
      cartValue: cartValueInCents,
      deliveryFee: deliveryFee,
      smallOrderSurcharge: smallOrderSurcharge,
      deliveryDistance: deliveryDistance,
      totalPrice: totalPrice,
    })
    toast.success('Price calculated successfully')
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prevData) => ({
          ...prevData,
          userLocation: {
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
          },
        }));
      });
    }
  };


  return (
    <>
      <h1>Wolt Delivery Fee Calculator</h1>
      <div className='app-container'>
        <OrderForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          getLocation={getLocation}
          userLocation={formData.userLocation}
        />
        <h1>Price breakdown</h1>
        <OrderBreakdown
          cartValue={resultData.cartValue}
          deliveryFee={resultData.deliveryFee}
          deliveryDistance={resultData.deliveryDistance}
          smallOrderSurcharge={resultData.smallOrderSurcharge}
          totalPrice={resultData.totalPrice}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default App;
