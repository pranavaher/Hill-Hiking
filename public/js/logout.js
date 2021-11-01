const hideAlerts = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlerts = (type, msg) => {
  hideAlerts();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlerts, 5000);
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      // url: 'http://127.0.0.1:3000/api/v1/users/logout',
      url: '/api/v1/users/logout',
    });
    if (res.data.status == 'success') {
      location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    showAlerts('error', 'Error logging out! Try again.');
  }
};

document.querySelector('.nav__el--logout').addEventListener('click', logout);
