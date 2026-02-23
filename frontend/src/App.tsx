import { useState } from 'react';
import Home from './components/Home';
import CreatePoll from './components/CreatePoll';
import StudentView from './components/StudentView';

function App() {
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);

  if (!role) {
    return <Home onSelectRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-4 bg-white border-b flex justify-between items-center">
        <span className="font-bold text-xl text-indigo-600">Live Polling System</span>
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
        ) :<StudentView/>}
      </div>
    </div>
  );
}

export default App;