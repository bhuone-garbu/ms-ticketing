import { useState } from 'react';
import useRequest from '../../hooks/use-request';

const newTicket = () => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: (ticket) => console.log(ticket)
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price, 10);
    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  return <div>
    <h1>Create a ticket</h1>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input className="form-control"
          onBlur={onBlur}
          value={price}
          onChange={e => setPrice(e.target.value)} />
      </div>
      {errors}
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>;
};

export default newTicket;
