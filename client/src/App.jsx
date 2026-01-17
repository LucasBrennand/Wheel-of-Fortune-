import React, { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import Wheel from "./components/Wheel";

function App() {
  const [view, setView] = useState("START");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0);
  const [prize, setPrize] = useState(null);

  const saveToOfflineQueue = (data) => {
    const queue = JSON.parse(localStorage.getItem("pending_leads") || "[]");
    queue.push(data);
    localStorage.setItem("pending_leads", JSON.stringify(queue));
    console.log("Lead saved locally (offline mode)");
  };

  const handleStartSpin = async () => {
    if (!email || !email.includes("@"))
      return alert("Please enter a valid email");

    try {
      const { data } = await axios.post("http://localhost:3000/api/spin", {
        email,
      });
      setTargetAngle(data.targetAngle);
      setPrize(data.prize);
      setIsSpinning(true);
      setView("SPINNING");
    } catch (err) {
      alert(
        err.response?.data?.error || "Connection error. Is the server running?",
      );
    }
  };

  const onSpinFinished = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#000000", "#FF0000", "#FFFFFF"],
    });
    setTimeout(() => setView("CLAIM"), 1500);
  };

  const handleClaimPrize = async (e) => {
    e.preventDefault();
    const leadData = { email, name, prizeLabel: prize };

    try {
      await axios.post("http://localhost:3000/api/claim", leadData);
      setView("SUCCESS");
    } catch (err) {
      saveToOfflineQueue(leadData);
      setView("SUCCESS");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center p-6 font-sans text-black">
      {view === "START" && (
        <div className="flex flex-col items-center max-w-md w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center">
            <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">
              Spin
              <br />
              to Win
            </h1>
            <p className="mt-4 text-gray-500 font-medium tracking-widest uppercase text-sm">
              Trade Show Exclusive
            </p>
          </div>

          <div className="w-full space-y-4">
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              className="w-full text-2xl p-5 border-2 border-black rounded-none outline-none focus:bg-white transition-colors bg-transparent text-center font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleStartSpin}
              className="w-full bg-black text-white py-6 text-2xl font-black hover:bg-gray-900 transition-all active:scale-95"
            >
              SPIN THE WHEEL
            </button>
          </div>
        </div>
      )}

      {view === "SPINNING" && (
        <div className="w-full h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-[85vh] aspect-square relative flex items-center justify-center">
            <Wheel
              mustSpin={isSpinning}
              targetAngle={targetAngle}
              onFinished={onSpinFinished}
            />
          </div>
        </div>
      )}

      {view === "CLAIM" && (
        <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
          <h2 className="text-5xl font-black italic uppercase">
            You Won {prize}!
          </h2>
          <p className="text-xl">
            Enter your name to receive your discount code.
          </p>

          <form
            onSubmit={handleClaimPrize}
            className="w-full max-w-sm space-y-4"
          >
            <input
              autoFocus
              required
              type="text"
              placeholder="YOUR FULL NAME"
              className="w-full text-xl p-4 border-2 border-black rounded-none outline-none text-center font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 text-xl font-black hover:bg-red-700 uppercase"
            >
              Claim My Prize
            </button>
          </form>
        </div>
      )}

      {view === "SUCCESS" && (
        <div className="text-center space-y-8 animate-in fade-in duration-1000">
          <div className="space-y-2">
            <h2 className="text-8xl font-black tracking-tighter uppercase">
              Awesome!
            </h2>
            <p className="text-2xl font-medium text-gray-600">
              The coupon is heading to <b>{email}</b>
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Next Visitor
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
