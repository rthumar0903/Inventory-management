import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; 

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const schema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().matches(passwordRules, { message: "Please create a stronger password" }).required("Required"),
  });

  const handleChange = (event) => {
    console.log(event)
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const initalValues = {
    username: '',
    password: '',
  }
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      toast.success("Successfully Registered !!!! Try to Login now");
    } catch (error) {
      console.error('Registration error:', error.message);
      setErrors({ username: 'Registration failed. Please try again.' });
    }
    
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 style={{ textAlign: 'center' }}>Register Page</h1>
        <Formik
          initialValues={initalValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, handleSubmit, isSubmitting,handleChange }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="username"
                name="username"
                value={values?.username}
                onChange={(e)=>{handleChange(e)}}
                placeholder="Enter your username"
                className='input'
              />
              <br />
              <br />
              <span className="error-message">{errors.username}</span>
              <input
                type="password"
                name="password"
                value={values?.password}
                onChange={(e)=>{handleChange(e)}}
                placeholder="Enter your password"
                className='input'
              />
              <br />
              <br />
              <span className="error-message">{errors.password}</span>
              <button type="submit" className='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
              <br/>
              <br/>
              <Link style={{marginLeft:"200px"}} to={'/'}>Login</Link>
            </form>
          )}
        </Formik>
        <ToastContainer />
      </div>
    </div>
  );
}
