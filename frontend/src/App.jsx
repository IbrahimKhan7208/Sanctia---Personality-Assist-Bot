import React from "react";
import { useState } from "react";
import axios from "axios"
import Markdown from "react-markdown";

const App = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const submitHandler = async ()=>{
    const res = await axios.post('http://localhost:3000/analyze', {text}) 
    setResult(res.data)
  }

  return (
    <div className="bg-zinc-300 h-screen w-full p-4">
      <p className="title text-3xl font-semibold tracking-tight flex justify-center">
        Personality & Lifestyle Assistant
      </p>

      <div className="chatWindows flex gap-2 m-5">
        <div className="input w-1/2">
          <textarea
            name="text"
            id="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            placeholder="Paste your writing here... This could be a journal entry, email, blog post, or any text that represents your natural writing style."
            className="w-full h-full bg-zinc-200 rounded-2xl border-2 p-4"
          ></textarea>
          <button className="bg-indigo-400 rounded-2xl p-2 flex font-semibold border-2" onClick={submitHandler}>
            Analyze
          </button>
        </div>

        <div className="output bg-zinc-100 h-96 w-1/2 rounded-2xl border-2 p-4 overflow-y-scroll"><Markdown>{result}</Markdown></div>
      </div>
    </div>
  );
};

export default App;
