import React, { useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const CreatePoll = () => {
    const [question, setQuestion] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(0);
    const [duration, setDuration] = useState<number>(60);

    const handleAddOptions = () => setOptions([...options,'']);

    const handleOptionChange = (index:number, value:string) =>{
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    } 

    const handleRemoveOption = (index:number) =>{
        if(options.length>2){
            setOptions(options.filter((_,i) => i !==index));
        }
    }

    const handleSubmit : React.SubmitEventHandler = async (e) => {
        e.preventDefault();
        if(correctOptionIndex === null) return alert("Select a correct answer");
        try{
            const payload = {question,options,correctOption: options[correctOptionIndex],duration};

            const response = await axios.post('http://localhost:5000/api/polls/create', payload)
            alert('Poll Started Successfully');
            console.log('Poll Data', response.data.data);

        }catch(error:any){
            alert(error.response?.data?.message || 'Failed to start the poll');
        }


    };
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="p-8">
        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Intervue Poll
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Let’s Get Started</h1>
        <p className="text-gray-500 mb-8">you’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>

        {/* Question Area */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-gray-800">Enter your question</label>
            <div className="relative">
              <select 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="appearance-none bg-gray-100 border-none rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value={60}>60 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-32 p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none text-gray-700"
              placeholder="Type your question here..."
              maxLength={100}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <span className="absolute bottom-4 right-4 text-xs text-gray-400">
              {question.length}/100
            </span>
          </div>
        </div>

        {/* Options Area */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <label className="font-bold text-gray-800 block mb-4">Edit Options</label>
            <div className="space-y-3">
              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                    {idx + 1}
                  </span>
                  <input
                    className="flex-1 bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={option}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[idx] = e.target.value;
                      setOptions(newOpts);
                    }}
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={() => setOptions([...options, ''])}
              className="mt-4 text-indigo-600 text-sm font-bold border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
            >
              + Add More option
            </button>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-4">Is it Correct?</label>
            <div className="space-y-7 pt-2">
              {options.map((_, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correct"
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      checked={correctOptionIndex === idx}
                      onChange={() => setCorrectOptionIndex(idx)}
                    />
                    <span className="text-sm font-medium text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      className="w-4 h-4 text-gray-300 border-gray-300"
                      checked={correctOptionIndex !== idx}
                      readOnly
                    />
                    <span className="text-sm font-medium text-gray-400">No</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-gray-50 p-6 flex justify-end">
        <button
          onClick={()=>handleSubmit}
          className="bg-indigo-600 text-white px-10 py-3 rounded-full font-bold hover:bg-indigo-700 transform active:scale-95 transition shadow-lg"
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};


export default CreatePoll