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
  const [showWorkAlert, setShowWorkAlert] = useState(false);
  const [showBreakAlert, setShowBreakAlert] = useState(false);

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

  const handleContinueWork = () => {
    setShowWorkAlert(false);
    setShowBreakAlert(false); 
    setIsBreak(false);
    setMinutes(25); 
    setSeconds(0);
    setIsRunning(true);
  };

  const handleTakeBreak = () => {
    if (isBreak) {
      // Handle continuing the break (Continue Break)
      setShowBreakAlert(false);
      setIsBreak(false);
      setMinutes(25); 
      setSeconds(0);
      setIsRunning(true);
    } else {
      if (!isRunning) {
        // Handle taking a break during work time (Take a Break)
        setShowWorkAlert(false);
        setIsBreak(true);
        setMinutes(5); 
        setSeconds(0);
        setIsRunning(true);
      } else {
        // Handle taking a break when the work time is over
        setShowBreakAlert(false);
        setIsBreak(true);
        setMinutes(5); 
        setIsRunning(false);
      }
    }
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

          if (!isBreak) {
            
            setShowWorkAlert(true);
          } else {
            
            setShowBreakAlert(true);
          }
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
    <div className="bg-green-200 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-green-300 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl">Focus on your goal!</h1>
        <p className="text-xl">{name}</p>
        <p>{email}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-red-600 focus:outline-none"
          onClick={logOut}
        >
          Logout
        </button>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
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
                className="bg-green-500 text-white px-4 py-2 rounded-full mx-auto hover:bg-green-600 focus:outline-none"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full mx-auto hover:bg-yellow-600 focus:outline-none"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-red-500 text-white px-4 py-2 rounded-full mx-auto hover:bg-red-600 focus:outline-none"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {showWorkAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-2xl mb-4">Work time is completed.</p>
            <p>Want to continue working or take a break?</p>
            <div className="mt-4">
              <button
                onClick={handleContinueWork}
                className="bg-green-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-green-600 focus:outline-none"
              >
                Continue Working
              </button>
              <button
                onClick={handleTakeBreak}
                className="bg-blue-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-blue-600 focus:outline-none"
              >
                Take a Break
              </button>
            </div>
          </div>
        </div>
      )}

      {showBreakAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-2xl mb-4">Break time is over.</p>
            <p>Want to continue the break or start working?</p>
            <div className="mt-4">
              <button
                onClick={handleContinueWork}
                className="bg-green-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-green-600 focus:outline-none"
              >
                Start Working
              </button>
              <button
                onClick={handleTakeBreak}
                className="bg-blue-500 text-white px-4 py-2 rounded-full mx-2 hover:bg-blue-600 focus:outline-none"
              >
                Continue Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
