import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { Formik } from 'formik';
import * as Yup from 'yup';
import './Login.css'; // Import CSS file for styling

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const initalValues = {
    username: '',
    password: '',
  }
  const navigate = useNavigate();
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const schema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().matches(passwordRules, { message: "Please create a stronger password" }).required("Required"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      const user = {userID:data?.user?.userID,userName:data?.user?.userName}
      localStorage.setItem('user',JSON.stringify(data?.user))
    //   const userData = JSON.parse(localStorage.getItem('user'))
      navigate('/dashboard')

      // Handle successful login, such as redirecting to another page
    } catch (error) {
      console.error('Login error:', error.message);
      setErrors({ email: 'Login failed. Please check your credentials.' });
    }

    setSubmitting(false);
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h1  style={{ textAlign: 'center'  }}>Login Page</h1>
        <Formik
          initialValues={initalValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleSubmit,handleChange }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="username"
                name="username"
                value={values?.username}
                onChange={(e) => {handleChange(e)}}
                placeholder="Enter your email"
                className='input'
              />
              <br/>
              <br/>
              <span className="error-message">{errors.email}</span>
              <input
                type="password"
                name="password"
                value={values?.password}
                onChange={(e) => handleChange(e)}
                placeholder="Enter your password"
              />
              <br/>
              <br/>
              <span className="error-message">{errors.password}</span>
              
              <button type="submit" className='submit'>Submit</button>
              <br/>
              <br/>
              <Link style={{marginLeft:"200px"}} to={'/register'}>Register</Link>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
