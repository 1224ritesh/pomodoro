import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signinWithGoogle, auth } from "../firebaseAuth";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  const googleLogin = async () => {
    await signinWithGoogle();
    navigate("/dashboard");
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
          <div className="flex flex-col justify-center p-8 md:p-14">
            <span className="mb-3 text-4xl font-bold">POMODORO</span>
            <span className="font-light text-gray-400 mb-8">
              You are here to Focus!
            </span>

            <div className="py-4">
              <span className="mb-2 text-md">Email</span>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="pass"
                id="pass"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              />
            </div>

            <button
              onClick={() => login(email, password)}
              className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              Login
            </button>
            <button
              className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
              onClick={googleLogin}
            >
              <img
                src="https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png"
                alt="img"
                className="w-6 h-6 inline mr-2"
              />
              Sign in with Google
            </button>
            <div className="text-center text-gray-400">
              Dont&apos;have an account?
              <Link to="/register">
                <span className="font-bold text-black">Register </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
