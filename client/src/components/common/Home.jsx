import { useContext, useEffect, useState } from 'react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';
import { useUser, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk(); // Clerk sign-out function
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkIfBlocked() {
      if (isSignedIn && user) {
        try {
          const email = user.emailAddresses[0]?.emailAddress;
          console.log("Checking if user is blocked:", email);

          const res = await axios.post("http://localhost:3000/check-blocked", { email });

          if (res.data.isBlocked) {
            console.log("User is blocked.");
            setIsBlocked(true);
            setTimeout(() => {
              signOut();
              navigate("/signin");
            }, 5000); 
          }
        } catch (err) {
          console.error("Error checking user status:", err);
        }
      }
    }

    checkIfBlocked();
  }, [isSignedIn, user, navigate, signOut]);

  async function onSelectRole(e) {
    if (isBlocked) {
      setError("Your account is blocked. You cannot proceed.");
      return;
    }

    setError('');
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;

    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', currentUser);
      } else if (selectedRole === 'user') {
        res = await axios.post('http://localhost:3000/user-api/user', currentUser);
      }

      if (res?.data.message === selectedRole) {
        setCurrentUser({ ...currentUser, ...res.data.payload });
        localStorage.setItem("currentuser", JSON.stringify(res.data.payload));
      } else {
        setError(res?.data.message || "Error occurred");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isBlocked && currentUser?.role && error.length === 0) {
      navigate(`/${currentUser.role}-profile/${currentUser.email}`);
    }
  }, [currentUser, isBlocked]);

  return (
    <div className="home-container" style={{
      backgroundImage: "url('https://source.unsplash.com/1600x900/?writing,blog')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: "20px",
    }}>
    
      {!isSignedIn ? (
        <div className="text-center text-light p-5 bg-info bg-opacity-75 rounded">
          <h1 className="display-4 text-black">Welcome to the Story HUB Platform</h1>
          <p className="lead fs-3 text-black">Discover Tales, Share Thoughts, Inspire Writers!</p>
          <p className="fs-4 text-black">Please sign in to get started.</p>
        </div>
      ) : (
        <div className="card shadow p-4 bg-white rounded" style={{ maxWidth: "600px", textAlign: "center" }}>
          <div className="d-flex flex-column align-items-center">
            <img src={user.imageUrl} width="120px" className="rounded-circle border shadow" alt="User" />
            <h2 className="mt-3">{user.firstName}</h2>
            <p className="text-muted">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
    
          {isBlocked ? (
            <div className="alert alert-danger fs-5 mt-3">
              <strong>Your account is blocked.</strong> Please contact the admin.
            </div>
          ) : (
            <>
              <p className="lead mt-3">Select your role</p>
              {error && <p className="text-danger fs-5">{error}</p>}
              <div className="d-flex justify-content-center gap-3">
                <div className="form-check">
                  <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
                  <label htmlFor="author" className="form-check-label fs-5">Writer</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
                  <label htmlFor="user" className="form-check-label fs-5">Reader</label>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    
    </div>
    
  );
}

export default Home;