import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, auth, db } from "../firebaseAuth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const getUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      console.log(error.message);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(25);
    setSeconds(0);
    setIsBreak(false);
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/");
    }
    getUser();

    let timerInterval;

    if (isRunning) {
      timerInterval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          clearInterval(timerInterval);
          setIsRunning(false);

          if (isBreak) {
            setMinutes(25);
          } else {
            setMinutes(5);
          }
          setIsBreak(!isBreak);
        } else if (seconds === 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [user, loading, error, navigate, minutes, seconds, isRunning, isBreak]);

  const logOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-green-500 min-h-screen flex items-center justify-center">
      <div className="bg-green-200 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl">Focus on goal!</h1>
        <p className="text-xl">{name}</p>
        <p>{email}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-red-600 focus:outline-none"
          onClick={logOut}
        >
          Logout
        </button>
      </div>

      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center align-middle p-8 md:p-14 ml-8">
          <div className="text-2xl mb-4">
            {isBreak ? "Break Time" : "Work Time"}
          </div>
          <div className="text-3xl">
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="flex mt-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="bg-green-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-green-600 focus:outline-none"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-yellow-600 focus:outline-none"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-red-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-red-600 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;