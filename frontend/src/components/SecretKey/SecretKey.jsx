import React, { useEffect, useState } from 'react';
import css from "./SecretKey.module.css";
import { handleError, handleSuccess } from '../../Utils';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const SecretKey = () => {
  const [secretKey, setSecretKey] = useState("");
  const [hasFetched, setHasFetched] = useState(false); // Flag to track if fetch was made
  const navigate = useNavigate();

  useEffect(() => {
    KeySetFunction();
  }, []); // Run on mount

  /************** Encrypt Decrypt  *************/

  const EncryptedKeySet = (key) => {
    // Encrypt
    const encryptedKey = CryptoJS.AES.encrypt(key, 'secret').toString();
    sessionStorage.setItem('myKey', encryptedKey);
  };

  const DecryptedKeySet = (key) => {
    // Decrypt
    const decryptedKey = CryptoJS.AES.decrypt(key, 'secret').toString(CryptoJS.enc.Utf8);
    return decryptedKey;
  };


  const key = sessionStorage.getItem("myKey");

  const decryptedKey = key? DecryptedKeySet(key):"";

  const KeySetFunction = () => {
    if (!key) {
      return handleError("Secret Key is required to encrypt your data");
    }

    setSecretKey(decryptedKey); // Set secretKey state
  };

  useEffect(() => {
    // Only trigger postRequestKey when secretKey is set and hasFetched is false
    if (secretKey && !hasFetched) {
      
        postRequestKey(secretKey);

    }
  }, [secretKey, hasFetched]); // Trigger when secretKey changes

  const postRequestKey = async (secretKey) => {
    try {
      const url = "http://localhost:3000/expenses/setsecret";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ secretKey:decryptedKey }),
        headers: {
          "Authorization": localStorage.getItem('token'),
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setHasFetched(true); // Set flag after successful fetch
        setTimeout(() => {
          navigate('/expenses');
        }, 1000);
      } else if (error) {
        const detail = error.details[0].message;
        handleError(detail);
      } else if (!success) {
        handleError(message);
      }

    } catch (error) {
      handleError(error);
    }
  };

  const handleSecret = async (e) => {
    e.preventDefault();

    if (!secretKey) {
      return handleError("Secret Key is required to encrypt your data");
    }

    if (hasFetched) {
      return handleError("Key Already entered");
    }

    postRequestKey(secretKey);
  };


  return (
    <>
      {!hasFetched && (
        <div className={css.secretKey}>
          <form onSubmit={handleSecret}>
            <label htmlFor="secretKey">Secret Key</label>
            <input
              className="signup-login-input"
              onChange={(e) => {
                EncryptedKeySet(e.target.value);
                setSecretKey(e.target.value); // Update state immediately
              }}
              type="text"
              name="secretKey"
              autoFocus
              placeholder="Enter your Secret Key"
              value={secretKey}
            />

            <button disabled={hasFetched} className={css.secretBtn}>Submit</button>
          </form>
        </div>
      )}
    </>
  );
};

export default SecretKey;
