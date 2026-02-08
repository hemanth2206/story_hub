import React, { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
import axios from 'axios';

function Signin() {
  const [error, setError] = useState("");

  async function checkIfBlocked(email) {
    try {
      const res = await axios.get(`http://localhost:3000/user-api/get-user/${email}`);
      if (!res.data.isActive) {
        setError("Your account is blocked. Please contact admin.");
      }
    } catch (err) {
      setError("Error checking account status.");
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center h-100'>
      {error ? <p className="text-danger">{error}</p> : <SignIn afterSignIn={(user) => checkIfBlocked(user.primaryEmailAddress)} />}
    </div>
  );
}

export default Signin;
