import React from 'react';
import axios from 'axios';
import { setFlash } from '../actions/flash';
import { setHeaders } from '../actions/headers';
import {BASE_URL} from '../utils/urls';

const login = user => {
  return { type: 'LOGIN', user };
};

const logout = () => {
  return { type: 'LOGOUT' };
};

export const registerUser = (email, password, passwordConfirmation, history) => {
  return dispatch => {
    axios.post(`${BASE_URL}/api/auth`, { email, password, password_confirmation: passwordConfirmation })
      .then(res => {
        const { data: { data: user }, headers } = res;
        dispatch(setHeaders(headers));
        dispatch(login(user));
        history.push('/');
      })
      .catch(res => {
        const messages =
          res.response.data.errors.full_messages.map(message =>
            <div>{message}</div>);
        const { headers } = res;
        dispatch(setHeaders(headers));
        dispatch(setFlash(messages, 'red'));
      });
  };
};

export const handleLogout = history => {
  return dispatch => {
    axios.delete(`${BASE_URL}/api/auth/sign_out`)
      .then(res => {
        const { headers } = res;
        dispatch(setHeaders(headers));
        dispatch(logout());
        dispatch(setFlash('Logged out successfully!', 'green'));
        history.push(`${BASE_URL}/login`);
      })
      .catch(res => {
        const messages =
          res.response.data.errors.map(message =>
            <div>{message}</div>);
        const { headers } = res;
        dispatch(setHeaders(headers));
        dispatch(setFlash(messages, 'red'));
      });
  };
};

export const handleLogin = (email, password, history) => {
  return dispatch => {
    axios.post(`${BASE_URL}/api/auth/sign_in`, { email, password })
      .then(res => {
        const { data: { data: user }, headers } = res;
        dispatch(setHeaders(headers));
        dispatch(login(user));
        history.push('/');
      })
      .catch(res => {
        let errors = res.response.data.errors ? res.response.data.errors : { full_messages: ['Something went wrong'] }
        if (Array.isArray(errors))
          errors = { full_messages: errors }
        const messages =
          errors.map(message =>
            <div>{message}</div>);
        const { headers } = res;
        dispatch(setHeaders(headers));
        dispatch(setFlash(messages, 'red'));
      });
  };
};

export const validateToken = (callBack = () => {}) => {
  return dispatch => {
    dispatch({ type: 'VALIDATE_TOKEN' });
    const headers = axios.defaults.headers.common;
    axios.get(`${BASE_URL}/api/auth/validate_token`, headers)
      .then(res => {
        const user = res.data.data;
        dispatch(setHeaders(res.headers));
        dispatch(login(user));
      })
      .catch(() => callBack());
  };
};
