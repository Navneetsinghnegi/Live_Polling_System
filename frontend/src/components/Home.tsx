import React from 'react'
import { UserCircle, GraduationCap, ChevronRight } from 'lucide-react';

interface HomeProps{
    onSelectRole : (role:'teacher' | 'student') => void;
}

const Home = ({onSelectRole}: HomeProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Pulse Check</h1>
        <p className="text-slate-500 mb-12 text-lg">Select your role to continue to the live polling platform.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Teacher Card */}
          <button 
            onClick={() => onSelectRole('teacher')}
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-600 text-left"
          >
            <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Continue as Teacher</h2>
            <p className="text-slate-500 mb-6 text-sm">Create live polls, manage questions, and monitor real-time student analytics.</p>
            <div className="flex items-center text-indigo-600 font-bold gap-2">
              Enter Dashboard <ChevronRight size={18} />
            </div>
          </button>

          {/* Student Card */}
          <button 
            onClick={() => onSelectRole('student')}
            className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-500 text-left"
          >
            <div className="bg-emerald-100 text-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Continue as Student</h2>
            <p className="text-slate-500 mb-6 text-sm">Join active sessions, cast your votes, and see live results once the poll ends.</p>
            <div className="flex items-center text-emerald-500 font-bold gap-2">
              Join Poll <ChevronRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home