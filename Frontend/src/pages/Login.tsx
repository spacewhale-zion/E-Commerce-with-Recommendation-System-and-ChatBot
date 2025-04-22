import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [isSignup, setIsSignup] = useState(false);
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();

  const firebaseLoginHandler = async (user: any) => {
    const res = await login({
      name: user.displayName || "User",
      email: user.email,
      photo: user.photoURL || "https://via.placeholder.com/150",
      gender,
      role: "user",
      dob: date,
      _id: user.uid,
    });

    if ("data" in res && res.data) {
      toast.success(res.data.message);
      const data = await getUser(user.uid);
      dispatch(userExist(data?.user!));
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponse).message;
      toast.error(message);
      dispatch(userNotExist());
    }
  };

  const googleLoginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await firebaseLoginHandler(user);
    } catch (error) {
      toast.error("Google Sign-In Failed");
    }
  };

  const emailAuthHandler = async () => {
    if (!email || !password) return toast.error("Enter email & password");

    try {
      let userCredential;
      if (isSignup) {
        if (!gender || !date) return toast.error("Please fill all fields");
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      await firebaseLoginHandler(userCredential.user);
    } catch (error: any) {
      toast.error("Wrong Email or Password");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">{isSignup ? "Sign Up" : "Login"}</h1>

        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {isSignup && (
          <>
            <div>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label>Date of birth</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </>
        )}

        <button className="login-email-btn" onClick={emailAuthHandler}>
          {isSignup ? "Sign Up with Email" : "Login with Email"}
        </button>

        <p className="toggle-auth">
  {isSignup ? "Already have an account?" : "Don't have an account?"}
  <button onClick={() => setIsSignup((prev) => !prev)}>
    {isSignup ? "Login" : "Sign Up"}
  </button>
</p>

        <div>
          <p>or</p>
          {!isSignup && (
          <>
            <div>
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label>Date of birth</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </>
        )}
          <button onClick={googleLoginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
