const hideStripeAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showStripeAlert = (type, msg) => {
  hideStripeAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideStripeAlert, 5000);
};

const stripe = Stripe(
  'pk_test_51JqFAcSB3Fi8zgLOOiK9TruMzvu5um6MdUI9oP16PucM2mcbUhTjhjV58BqE3BDRsApkZjZBW3aOVhFUQhF6NiLh004mpuTeCP'
);

const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showStripeAlert('error', err);
  }
};

document.getElementById('book-tour').addEventListener('click', (e) => {
  e.target.textContent = 'Processing...';
  const { tourId } = e.target.dataset;
  bookTour(tourId);
});
