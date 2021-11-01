const hideAlertUpdateSettings = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlertUpdateSettings = (type, msg) => {
  hideAlertUpdateSettings();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlertUpdateSettings, 5000);
};

const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlertUpdateSettings(
        'success',
        `${type.toUpperCase()} updated successfully!`
      );
    }
  } catch (err) {
    showAlertUpdateSettings('error', err.response.data.message);
  }
};

// const updateData = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: '/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlertUpdateSettings('success', 'Data updated successfully!');
//     }
//   } catch (err) {
//     showAlertUpdateSettings('error', err.response.data.message);
//   }
// };

document.querySelector('.form-user-data').addEventListener('submit', (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('name', document.getElementById('name').value);
  form.append('email', document.getElementById('email').value);
  form.append('photo', document.getElementById('photo').files[0]);
  console.log(form);

  //   const name = document.getElementById('name').value;
  //   const email = document.getElementById('email').value;
  // updateSettings({ name, email }, 'data');

  updateSettings(form, 'data');
});

document
  .querySelector('.form-user-password')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
