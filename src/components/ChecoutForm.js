import CreditCardInput from 'react-credit-card-input';
import React, {Component, useEffect, useState} from 'react'
import Input from '@mui/material/Input';
import "./CheckoutForm.css";
import axios from 'axios';
import { Redirect } from 'react-router';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { useCookies } from "react-cookie";

function ChecoutForm() {
  return (
      <CheckoutFormView/>
  )
}
const CheckoutFormView = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [cvc, setCVC] = useState('');
  const [number, setNumber] = useState('');
  const [exp_month, setExpMonth] =useState('');
  const [exp_year, setExpYear] = useState('');
  const [url, setURL] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState(undefined);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postal_code, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [cart, setCart] = useCookies(['cart']);


  const onPressPay = async () => {

    setIsPaymentLoading(true);
    console.log(email)
    console.log(cvc)
    console.log(number)
    console.log(exp_month)
    console.log(exp_year)

    if (name === '' || email === '' || number === '' || exp_month === '' || exp_year === '' || country === '' || state === '' || city === '' || postal_code === '' || address === '') {
      setIsPaymentLoading(false);
    } else {
      var total = 0
      if (cart.cart !== undefined) {
        for (const num of Object.values(cart.cart)) {
          total += parseInt(num.quantity) * parseInt(num.price)
        }
      }
      console.log(total);
      axios({
        method: 'POST',
        url:"https://books2go.herokuapp.com/payment/post",
        data: {
          email: email,
          exp_month: exp_month,
          exp_year: exp_year,
          price: total,
          cvc: cvc,
          number: number,
          address: address,
          state: state,
          country: country,
          postal_code: postal_code,
          city: city,
          name: name,
        },
        // headers: {
        //   "Access-Control-Allow-Origin": "*"
        // }
      }).then((res) => {
        console.log('res', res);
        const { status, url, message } = res.data;
        if (message !== undefined) {
          setIsPaymentLoading(false);
          setMessage(message);
        } else {
          if (status === 'requires_action') {
            console.log('url', url);
            window.location.href = url;
            setURL(url);
            setIsPaymentLoading(false);
          } else {
            axios({
              method: 'POST',
              url: 'https://books2go.herokuapp.com/mail/post',
              data: {
                email: email
              }
            }).then((res) => {
              console.log('res', res);
            }).catch((err) => {
              console.log('err', err);
            })
            setStatus(status);
            setIsPaymentLoading(false);
          }
        }
      }).catch((err) => {
        console.log(err);
        setIsPaymentLoading(false);
      })
    }

  }
    return (
      <Card sx={{ height: '80%', width: '80%', margin: 10,}}>
        <div style={{
        padding: "3rem"
      }}>
        <div style={{
          maxWidth: "500px",
          margin: "0 auto",
        }}>
          <form onSubmit={onPressPay} style={{
            display: "block",
            width: "100%",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 5,
            }}>
              <Typography variant="h6" component="h6" sx={{ display: 'flex', alignSelf: 'flex-start'}}>
                Basic Details:-
              </Typography>
              <div style={{
                display: 'flex',
                flexDirection: 'row',

              }}>
              <Input
              autoComplete={true}
              autoFocus={true}
              placeholder={'Name'}
              value={name}
              required
              sx={{
                marginRight: 10,
              }}
              onChange={(event) => setName(event.target.value)}/>
              <Input
              autoComplete={true}
              autoFocus={true}
              placeholder={'Email-Address'}
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}/>
              </div>
              <Typography variant="h6" component="h6" sx={{ marginTop: 5, display: 'flex', alignSelf: 'flex-start'}}>
                Card Details:-
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column'}}>
              <Input
              autoComplete={true}
              autoFocus={true}
              placeholder={'Card Number'}
              value={number}
              sx={{
                marginBottom: 5,
                width: '100%'
              }}
              required
              onChange={(event) => setNumber(event.target.value)}/>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Input
              autoComplete={true}
              autoFocus={true}
              placeholder={'Exp Month'}
              value={exp_month}
              required
              onChange={(event) => setExpMonth(event.target.value)}/>
              <Input
              autoComplete={true}
              placeholder={'Exp Year'}
              autoFocus={true}
              value={exp_year}
              required
              sx={{
                marginLeft: 5,
              }}
              onChange={(event) => setExpYear(event.target.value)}/>
              <Input
              autoComplete={true}
              placeholder={'CVC/CVV'}
              autoFocus={true}
              value={cvc}
              required
              sx={{
                marginLeft: 5,
              }}
              onChange={(event) => setCVC(event.target.value)}/>
              </div>
              <Typography variant="h6" component="h6" style={{ marginTop: 10,}}>
                Billing Details:-
              </Typography>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                <Input
              autoComplete={true}
              placeholder={'Country'}
              autoFocus={true}
              value={country}
              required
              onChange={(event) => setCountry(event.target.value)}/>
              <Input
              autoComplete={true}
              placeholder={'State'}
              autoFocus={true}
              value={state}
              required
              sx={{
                marginLeft: 5,
              }}
              onChange={(event) => setState(event.target.value)}/>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 15,
                }}>
                <Input
              autoComplete={true}
              placeholder={'City'}
              autoFocus={true}
              value={city}
              required
              onChange={(event) => setCity(event.target.value)}/>
              <Input
              autoComplete={true}
              placeholder={'Postal Code'}
              autoFocus={true}
              value={postal_code}
              required
              sx={{
                marginLeft: 5,
              }}
              onChange={(event) => setPostalCode(event.target.value)}/>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                <Input
              autoComplete={true}
              placeholder={'Address'}
              autoFocus={true}
              value={address}
              sx={{
                marginTop: 5,
                marginBottom: 5,
                width: '100%'
              }}
              required
              onChange={(event) => setAddress(event.target.value)}/>
                </div>
              </div>
              </div>
              {/* <CreditCardInput
  onError={({ inputName, err }) => console.log(`credit card input error: ${err}`)}
  cardCVCInputProps={{
    onBlur: e => console.log('cvc blur', e),
    onChange: (event) => setCVC(event.target.value),
    onError: err => console.log(`cvc error: ${err}`)
  }}
  cardExpiryInputProps={{
    onBlur: e => console.log('expiry blur', e),
    onChange: e => {
      const expiry = e.target.value;
      const exp_month = expiry.split('/')[0];
      setExpMonth(exp_month);
      const exp_year = expiry.split('/')[1];
      setExpYear(exp_year);
    },
    onError: err => console.log(`expiry error: ${err}`)
  }}
  cardNumberInputProps={{
    onBlur: e => console.log('number blur', e),
    onChange: e => setNumber(e.target.value),
    onError: err => console.log(`number error: ${err}`)
  }}
/> */}


              <button
              className="pay-button"
              onClick={onPressPay}
              disabled={isPaymentLoading}>
                {isPaymentLoading ? "Processing..." : "Pay"}
              </button>
            </div>
          </form>
          <div>
            {message === undefined ? (
              <div/>
            ): (
              <text>
                {message}
              </text>
            )}
          </div>
        </div>
        {status !== '' ?(
          <text>
            Payment Status: ${status}
          </text>
        ): (
          <div/>
        )}
      </div>
      </Card>
    )

}

// const InjectedCheckoutForm = () => {
//   const stripe = useStripe();
//   return (
//     <ElementsConsumer>
//       {({elements, stripe})  => (
//         <CheckoutFormView/>
//       )}
//     </ElementsConsumer>
//   )
// }

export default ChecoutForm
