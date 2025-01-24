import React from 'react'

interface OrderBreakdownProps {
  cartValue: number;
  deliveryFee: number;
  deliveryDistance: number | null;
  smallOrderSurcharge: number;
  totalPrice: number | null;
}

const OrderBreakdown: React.FC<OrderBreakdownProps> = ({
    cartValue,
    deliveryFee,
    deliveryDistance,
    smallOrderSurcharge,
    totalPrice,
  }) => {
  return (
    <div className='detail-container'>
      <div className='detail-item'>
        <p>Cart Value</p>
        <div className='value-item'>
          <p data-raw-value={cartValue ? cartValue : 0} data-test-id='cart-value'>
            {cartValue ? cartValue / 100 : 0}
          </p>
          <i>€</i>
        </div>
      </div>
      <div className='detail-item'>
        <p>Delivery fee</p>
        <div className='value-item'>
          <p data-raw-value={deliveryFee ? deliveryFee : 0} data-test-id='delivery-fee'>
            {deliveryFee ? deliveryFee / 100 : 0}
          </p>
          <i>€</i>
        </div>
      </div>
      <div className='detail-item'>
        <p>Delivery distance</p>
        <div className='value-item'>
          <p data-raw-value={deliveryDistance ? deliveryDistance : 0} data-test-id='delivery-distance'>
            {deliveryDistance ? deliveryDistance.toFixed() : 0}
          </p>
          <i>m</i>
        </div>
      </div>
      <div className='detail-item'>
        <p>Small order surcharge</p>
        <div className='value-item'>
          <p data-raw-value={smallOrderSurcharge ? smallOrderSurcharge : 0} data-test-id='small-order-surcharge'>
            {smallOrderSurcharge ? smallOrderSurcharge / 100 : 0}
          </p>
          <i>€</i>
        </div>
      </div>
      <div className='detail-item'>
        <p>Total price</p>
        <div className='value-item'>
          <p data-raw-value={totalPrice ? totalPrice : 0} data-test-id='total-price'>
            {totalPrice ? totalPrice /100 : 0}
          </p>
          <i>€</i>
        </div>
      </div>
    </div>
  )
}

export default OrderBreakdown;
