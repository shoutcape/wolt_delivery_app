import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  //for up to 1km the deliveryfee is 2€
  const [deliveryFee, setDeliveryFee] = useState<number>(2);

  useEffect(() => {
    console.log('deliveryfee:', deliveryFee);
  }, [deliveryFee]);

  const calculateFee = (
    cartValue: number,
    distance: number,
    amountOfItems: number,
    time: Date,
  ) => {
    let extraDistanceFee = 0;
    let deliveryFeeCalculation = 2;
    const dateTime = new Date(time);
    const day = dateTime.getDay();
    const hour = dateTime.getHours();

    //process decimals in integers to avoid floating point errors
    const cartValueInCents = cartValue * 100;
    let surcharge = 0;

    //surcharge for orders under 10€
    if (cartValueInCents < 1000) {
      surcharge = (1000 - cartValueInCents) / 100;
    }

    //for each 500m after 1000m add 1€ extraDistanceFee
    if (distance > 1000) {
      extraDistanceFee = Math.ceil((distance - 1000) / 500);
      deliveryFeeCalculation += extraDistanceFee;
      console.log('extradistancefee', extraDistanceFee);
    }

    //surcharge of 0.5€ for each item after 5 items including the fifth. item 13 and after is 1.2€ per item
    if (amountOfItems >= 5) {
      const extraCostAmount = amountOfItems - 4;
      surcharge += 0.5 * extraCostAmount;
    }

    //extra bulk fee for orders of 13 items or more
    if (amountOfItems >= 13) {
      const extraBulkFee = 1.2;
      surcharge += extraBulkFee;
    }

    //add possible surcharge to deliveryFeeCalculation
    deliveryFeeCalculation += surcharge;

    //check if rush hour on a friday
    if (day == 5 && hour >= 15 && hour <= 23) {
      deliveryFeeCalculation = deliveryFeeCalculation * 1.2;
    }

    //set max amount for deliveryFee
    if (deliveryFeeCalculation >= 15) {
      deliveryFeeCalculation = 15;
    }

    //free delivery for orders above 100€
    if (cartValue >= 100) {
      deliveryFeeCalculation = 0;
    }

    deliveryFeeCalculation = parseFloat(deliveryFeeCalculation.toFixed(2));

    //set deliveryFee state
    setDeliveryFee(deliveryFeeCalculation);

  };

  const handlesubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const cartValue = parseFloat(form.cartValue.value);
    const distance = parseFloat(form.distance.value);
    const amountOfItems = parseFloat(form.amountOfItems.value);
    const time = form.time.value;
    calculateFee(cartValue, distance, amountOfItems, time);
  };

  return (
    <>
      <h1>Wolt Delivery Fee Calculator</h1>
      <div className='app-container'>
        <form className='calculator-form' onSubmit={handlesubmit}>
          <div className='form-item'>
            <label>Cart Value</label>
            <input type='number' step='.01' id='cartValue' placeholder='0.0'  />
            <i>€</i>
          </div>
          <div className='form-item'>
            <label>Delivery Distance</label>
            <input type='number' id='distance' placeholder='0' />
            <i>m</i>
          </div>
          <div className='form-item'>
            <label>Amount of items</label>
            <input type='number' id='amountOfItems' placeholder='0'/>
          </div>
          <div className='form-item'>
            <label>Time</label>
            <input type='datetime-local' id='time'/>
          </div>
          <div>
            <button type='submit'>Calculate delivery price</button>
            <p>Delivery price: <span>{deliveryFee}</span>€</p>
          </div>
        </form>
      </div>
    </>
  );
};

export default App;
