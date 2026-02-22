import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { BarChart3, Users, CheckCircle2 } from 'lucide-react';

interface LiveResultsProps {
  pollData: any;
  onPollEnd: () => void;
}

const LiveResults = ({ pollData, onPollEnd }: LiveResultsProps) => {
  const [results, setResults] = useState(pollData.options);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Listen for the live 'voteUpdate' event from backend
    socket.on('voteUpdate', (data) => {
      if (data.pollId === pollData.id || data.pollId === pollData._id) {
        setResults(data.options);
        const total = data.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
        setTotalVotes(total);
      }
    });

    return () => {
      socket.off('voteUpdate');
    };
  }, [pollData]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">Live Results</span>
            <h2 className="text-3xl font-bold mt-2">{pollData.question}</h2>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-2">
            <Users size={18} className="text-indigo-400" />
            <span className="font-mono font-bold text-xl">{totalVotes}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {results.map((option: any) => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-700">
                <span>{option.text}</span>
                <span>{option.votes} votes ({percentage.toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 border-t flex justify-center">
        <button 
          onClick={onPollEnd}
          className="text-slate-500 hover:text-indigo-600 font-semibold text-sm transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default LiveResults;