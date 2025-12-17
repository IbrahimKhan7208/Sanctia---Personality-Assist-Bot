import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuLoader } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [form, setform] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/user/signup",
        form,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      if (res.data.error) {
        setErrorMsg(res.data.error);
      } else {
        navigate("/home", { state: res.data });
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-amber-50 w-full h-screen pt-5">
      {/* Title */}
      <div className="title tracking-tight text-center">
        <p className="text-5xl font-bold text-purple-900 mb-3 flex justify-center gap-2">
          <LuSparkles className="text-amber-500" /> SANCTIA
        </p>
        <p className="text-purple-700/60 text-lg font-semibold">
          Comece o seu refúgio humano
        </p>
      </div>

      {/* Form Container */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-1/4 p-4 bg-white rounded-xl shadow shadow-purple-400 
                    text-purple-500 font-semibold tracking-tight"
      >
        <form onSubmit={submitHandler} autoComplete="off">
          {/* Heading */}
          <div className="flex justify-center p-2 mb-3">
            <h1 className="text-3xl font-semibold text-purple-700 tracking-tighter">
              Criar conta
            </h1>
          </div>

          {/* Name */}
          <label className="text-purple-600">Nome:</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
          />

          {/* Email */}
          <label className="text-purple-600">E-mail:</label>
          <input
            type="email"
            name="email"
            placeholder="nome@exemplo.com"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
          />

          {/* Password */}
          <label className="text-purple-600">Senha:</label>
          <input
            type="password"
            name="password"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
          />

          {/* Actions */}
          <div className="flex justify-between items-center mt-5">
            <Link to="/login" className="text-indigo-400 underline">
              Já tem uma conta?
            </Link>

            {loading ? (
              <p className="flex items-center gap-2 bg-purple-600 shadow shadow-purple-800 hover:bg-purple-700 duration-300 rounded-2xl p-3 cursor-pointer text-sm text-white">
                <LuLoader className="w-4 h-4 animate-spin" />
                <p className="animate-pulse">Criando seu espaço…</p>
              </p>
            ) : (
              <input
                type="submit"
                value="Criar conta"
                className="bg-purple-600 shadow shadow-purple-800 hover:bg-purple-700 duration-300 rounded-2xl py-2 px-10 text-white text-lg cursor-pointer"
              />
            )}
          </div>
          {errorMsg && (
            <p className="text-red-500 text-sm mt-3 text-right">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
