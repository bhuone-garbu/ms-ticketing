import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email, password
      });
    } catch (err) {
      setErrors(err.response.data.errors)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-control" />
      </div>
      {errors.length && (
        <div className="alert alert-danger">
          <h4>Opps....</h4>
          <ul className="my-0">
            {errors.map(err => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>)}
      <button className="btn btn-primary">Sign Up</button>
    </form>);
};

export default Signup;
