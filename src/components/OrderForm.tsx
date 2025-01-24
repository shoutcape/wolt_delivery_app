
interface OrderFormProps {
  handleSubmit: (event: React.FormEvent) => void;
  handleChange: (event: React.ChangeEvent<HTMLFormElement>) => void;
  getLocation: () => void;
  userLocation: { Latitude: number; Longitude: number } | null;
}

const OrderForm: React.FC<OrderFormProps> = ({ handleSubmit, handleChange, getLocation, userLocation }) => {
  return (
    <>
      <form className='calculator-form' onChange={handleChange} onSubmit={handleSubmit}>
        <div className='form-item'>
          <label>Venue slug</label>
          <input type='text' id='venueSlug' name='venueSlug' data-test-id='venue-slug-input' placeholder='venue' />
        </div>
        <div className='form-item'>
          <label>Cart Value</label>
          <input type='number' step='.01' id='cartValue' name='cartValue' data-test-id='cart-value-input' placeholder='0.0' />
          <i>€</i>
        </div>
        <div className='form-item'>
          <label>User latitude</label>
          <p data-test-id="userLatitude">{userLocation?.Latitude}</p>
          <i>lat</i>
        </div>
        <div className='form-item'>
          <label>User longitude</label>
          <p data-test-id="userLongitude">{userLocation?.Longitude}</p>
          <i>long</i>
        </div>
        <div>
          <button data-test-id="getLocation" type='button' onClick={() => getLocation()}>
            Get location
          </button>
        </div>
        <div>
          <button type='submit'>Calculate delivery price</button>
        </div>
      </form>
    </>

  )
}

export default OrderForm
