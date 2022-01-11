import React, { useEffect, useState } from 'react'
import axios from 'axios';
import https from 'https';
import { Card, Typography } from '@mui/material';
const ProcessingPayment = () => {
  const [Status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('url', window.location.href);
    const url = window.location.href;
    const url1 = url.split('https://books2go.herokuapp.com/Payment?payment_intent=')[1];
    console.log(url1);
    const url2 = url1.split('&payment_intent_client_secret')[0];
    console.log(url2);
    payment_status(url2);
  })

  const payment_status = async (id) => {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    axios({
      method: 'POST',
      url: 'https://books2go.herokuapp.com/payment-intent/get',
      data: {
        payment_intent_id: id
      },
      httpsAgent: agent
    }).then((res) => {
      const { status, email } = res.data;
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
      
      console.log(status);
      setLoading(false);
      setStatus(status);
    })
  }
  if (loading === true) {
    return(
      <Card sx={{ width: '60%', margin: 20, height: '30%'}}>
        <div style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" component="h6" sx={{ margin: 10,}}>
          Your Payment Processing....
        </Typography>
      </div>
      </Card>
    )
  } else {
    return (
      <Card sx={{ width: '60%', margin: 10, height: '30%'}}>
        <div style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <Typography variant="h6" component="h6" sx={{ margin: 10,}}>
             Payment Status: {Status}
          </Typography>

      </div>
      </Card>
    )
  }
}

export default ProcessingPayment