import { useState } from 'react';
import Home from './components/Home';
import CreatePoll from './components/CreatePoll';
// import StudentView from './components/StudentView'; // We'll build this next

function App() {
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);

  if (!role) {
    return <Home onSelectRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-4 bg-white border-b flex justify-between items-center">
        <span className="font-bold text-xl text-indigo-600">Pulse Check</span>
        <button 
          onClick={() => setRole(null)}
          className="text-sm text-slate-500 hover:text-slate-800 font-medium"
        >
          Switch Role
        </button>
      </nav>

      <div className="container mx-auto py-12 px-4">
        {role === 'teacher' ? (
          <CreatePoll />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">Student View Coming Soon!</h2>
            <p className="text-slate-500">Wait for the teacher to launch a poll.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;