/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

// const stripe = Stripe(
//   'pk_test_51Lbj0NCSmEAt7UkNQ7bo9f4c7D9oGEURcqcUW3Nk2y73DIa6TRJy30VdFB4vNZ1AsvhqiUvD9uMVJH6UPX908qAB00YH7nIEb5'
// );

export const bookTour = async (tourID) => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`,
    });
    console.log(session);

    // 2) Create checkout form + chanre credit card
    console.log('BEFORE RED');
    location.replace(session.data.session.url);
    console.log('AFTER RED');
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
