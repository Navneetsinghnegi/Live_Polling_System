import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from '../socket';
import {Timer, Send, CheckCircle2, XCircle} from 'lucide-react';

const StudentView = () => {
    const [activePoll, setActivePoll] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [hasVoted, sethasVoted] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number| null>(null);
    const [pollResults, setPollResults] = useState<any>(null);
    useEffect(()=>{
        const  fetchActivePoll = async ()=>{
            try{
                const res = await axios.get('http://localhost:5000/api/polls/active');
                if(res.data.success && res.data.data){
                    setActivePoll(res.data.data);
                    setTimeLeft(res.data.data.duration);
                }
            }catch(err:any){
                console.log("No active Poll found")
            }
        };
        fetchActivePoll();

        socket.on('pollStarted',(data)=>{
            setActivePoll(data);
            setTimeLeft(data.duration);
            sethasVoted(false);
            setSelectedOption('');
            setPollResults(null);
        })

        return()=>{
            socket.off('pollStarted');
        }
    },[]);

    // 1. Dedicated Countdown Timer
    useEffect(() => {
      if (timeLeft === null || timeLeft <= 0) return;

      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }, [timeLeft]); // Only re-runs when timeLeft changes

    // 2. Dedicated Results Reveal (Triggered only ONCE at 0)
    useEffect(() => {
      const pollId = activePoll?.id || activePoll?._id;
      if (timeLeft === 0 && pollId && !pollResults) {
        const fetchResults = async () => {
          try {
            
            const res = await axios.get(`http://localhost:5000/api/polls/results/${pollId}`);
            if (res.data.success) {
              setPollResults(res.data.data); // Stores accuracy and winner
            }
          } catch (err: any) {
            console.error("Error fetching poll results", err);
          }
        };
        fetchResults();
      }
    }, [timeLeft, activePoll, pollResults]);

    const handleVote = async()=>{
        if(!selectedOption || !activePoll) return;

        try{
            await axios.post('http://localhost:5000/api/polls/submitVote', {
                pollId : activePoll.id || activePoll._id,
                optionId: selectedOption,
                sessionId: "student_"+ Math.random().toString(36).substring(2,9),
            
                

            });
            sethasVoted(true);
            alert("vote cast! wait for the results");
        }catch(err:any){
            alert(err.response?.data?.message || "Failed to vote");
        }
    };

    if(!activePoll){
        return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="animate-pulse bg-indigo-100 p-4 rounded-full mb-4">
          <Timer className="text-indigo-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Waiting for Teacher...</h2>
        <p className="text-gray-500">The poll will appear here automatically when launched.</p>
      </div>
    );
    }

 return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <span className="font-bold">Live Poll Active</span>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
            timeLeft !== null && timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-indigo-500'
            }`}>
            <Timer size={16} />
            <span className="text-sm font-mono font-bold">
                {timeLeft !== null ? `${timeLeft}s` : '0s'}
            </span>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{activePoll.question}</h2>
        
        <div className="space-y-4 mb-8">
          {activePoll?.options?.map((option: any) => (
            <button
              key={option.id}
              disabled={hasVoted}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedOption === option.id 
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-gray-100 hover:border-indigo-200'
              } ${hasVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{option.text}</span>
                {selectedOption === option.id && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {/* Place this inside the render, after the options list */}
        {pollResults && (
          <div className="mt-8 animate-in fade-in zoom-in duration-500">
            <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 ${
              selectedOption === pollResults.correctOptionId 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className={`p-3 rounded-full ${
                selectedOption === pollResults.correctOptionId ? 'bg-emerald-500' : 'bg-red-500'
              } text-white`}>
                {selectedOption === pollResults.correctOptionId ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {selectedOption === pollResults.correctOptionId ? "Correct Answer!" : "Better luck next time!"}
                </h3>
                <p className="text-sm opacity-90">
                  The correct answer was: <span className="font-bold">{
                    pollResults.options.find((o: any) => o.id === pollResults.correctOptionId)?.text
                  }</span>
                </p>
              </div>
            </div>
            
            {/* Optional: Show mini-bars so they see how others voted */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-bold text-gray-400 uppercase mb-3">Class Performance</p>
              <p className="text-sm text-gray-600 italic">Total accuracy for this question: {pollResults.accuracyRate}</p>
            </div>
          </div>
        )}

        {!hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-gray-300 transition"
          >
            <Send size={18} /> Submit Answer
          </button>
        )}

        {hasVoted && (
          <div className="text-center p-4 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-100">
            ✓ Your response has been recorded
          </div>
        )}
      </div>
    </div>
  );
};


export default StudentView