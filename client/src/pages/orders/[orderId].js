import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

const ShowOrder = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };

  }, [order]);


  if (timeLeft < 0) {
    return <div>Order expired!</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft}
      <StripeCheckout
        token={({ id }) => doRequest({ stripeToken: id })}

        // FIXME: Although this is a public shareable key,
        // can use Next.js or k8s for handling this as env variable
        stripeKey="pk_test_51HnSCUDarl2amIOhdts8eoAktq1KRPhJUUDSrO8SZDQx86EppBvYdZAPJktCBDkt9P6QB31gnTWEeVPRAjG6oBFZ0045GObdy2"
        amount={order.ticket.price * 100}
        email={currentUser.email}
        currency="GBP"
      />
      {errors}
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default ShowOrder;
