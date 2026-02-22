import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, Target, Users, ArrowLeft } from 'lucide-react';

const PollSummary = ({ pollId, onBack }: { pollId: string; onBack: () => void }) => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchFinalResults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/polls/results/${pollId}`);
        if (res.data.success) setSummary(res.data.data);
      } catch (err) {
        console.error("Error fetching summary", err);
      }
    };
    fetchFinalResults();
  }, [pollId]);

  if (!summary) return <div className="text-center p-10">Calculating final scores...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-8 text-white text-center">
        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Poll Concluded!</h2>
        <p className="text-indigo-100">{summary.question}</p>
      </div>

      <div className="p-8 grid grid-cols-3 gap-4 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-50 text-center">
          <Users className="mx-auto text-indigo-600 mb-2" size={20} />
          <p className="text-xs text-gray-500 font-bold uppercase">Total Votes</p>
          <p className="text-2xl font-black text-gray-900">{summary.totalVotes}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-50 text-center">
          <Target className="mx-auto text-emerald-500 mb-2" size={20} />
          <p className="text-xs text-gray-500 font-bold uppercase">Accuracy</p>
          <p className="text-2xl font-black text-gray-900">{summary.accuracyRate}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-50 text-center col-span-1">
          <Trophy className="mx-auto text-amber-500 mb-2" size={20} />
          <p className="text-xs text-gray-500 font-bold uppercase">Winner</p>
          <p className="text-sm font-bold text-gray-900 truncate">{summary.winner}</p>
        </div>
      </div>

      <div className="p-8 pt-2">
         <h3 className="font-bold text-gray-800 mb-4">Final Breakdown</h3>
         <div className="space-y-3">
            {summary.options.map((opt: any) => (
              <div key={opt.id} className={`p-3 rounded-xl flex justify-between items-center ${opt.id === summary.correctOptionId ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50'}`}>
                <span className="text-sm font-medium text-gray-700">{opt.text}</span>
                <span className="text-xs font-bold text-gray-500">{opt.votes} votes</span>
              </div>
            ))}
         </div>
         <button 
           onClick={onBack}
           className="w-full mt-8 flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-indigo-600 transition"
         >
           <ArrowLeft size={18} /> Create New Poll
         </button>
      </div>
    </div>
  );
};

export default PollSummary;