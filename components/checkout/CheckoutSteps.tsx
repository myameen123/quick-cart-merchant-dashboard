const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className='steps  steps-horizontal'>
      {['Mobile', 'Address', 'Payment'].map((step, index) => (
        <li
          key={step}
          className={`step ${index <= current ? 'step-primary' : ''}`}
        >
          {step}
        </li>
      ))}
    </ul>
  );
};
export default CheckoutSteps;
