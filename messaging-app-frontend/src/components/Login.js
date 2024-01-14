import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import './Login.css';
import { auth, googleProvider, twitterProvider, facebookProvider,anonymousProvider } from '../firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import firebase from 'firebase/app';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
    const [{}, dispatch] = useStateValue();
    const [messages, setMessages] = useState([]); //
    const [user, setUser] = useState(null); //

  

    useEffect(() => {
       
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            dispatch({
                type: actionTypes.SET_USER,
                user: JSON.parse(storedUser),
            });
        }
    }, [dispatch]);

    const signInWithProvider = (provider) => {
        auth.signInWithPopup(provider)
            .then(result => {
                
                localStorage.setItem('user', JSON.stringify(result.user));

                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
            })
            .catch(error => alert(error.message));
    };
  const gitprovider =new firebase.auth.GithubAuthProvider();
    return (
        <div className="login">
            <div className="login__container">
                <img src="logo512.png" alt="whatsapp" />
                <div className="login__text">
                    <h1>Sign in to Messaging App</h1>
                </div> 
              
                <Button onClick={() => signInWithProvider(googleProvider)}>Google</Button>
                <br/>
                <Button onClick={() => signInWithProvider(facebookProvider)}>Facebook</Button>
                <br/>
                <Button onClick={() => signInWithProvider(gitprovider)}>Github</Button>
            </div>
           
        </div>
    );
};

export default Login;
