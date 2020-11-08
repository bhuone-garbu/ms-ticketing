import nats from 'node-nats-streaming';

console.clear();

// using stan name like in docs, it's basically a client
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const message = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  });

  stan.publish('ticket:created', message, () => {
    console.log('Event published');
  })
});
