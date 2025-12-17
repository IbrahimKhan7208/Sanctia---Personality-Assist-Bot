import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuLoader } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setform] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const res = await axios.post(
      "https://sanctia-personality-assist-bot.onrender.com/user/login",
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
  };

  return (
    <div className="bg-amber-50 w-full h-screen pt-5">
      {/* Title */}
      <div className="title tracking-tight text-center">
        <p className="text-5xl font-bold text-purple-900 mb-3 flex justify-center gap-2">
          <LuSparkles className="text-amber-500" /> SANCTIA
        </p>
        <p className="text-purple-700/60 text-lg font-semibold">
          Seu refúgio espera por você — volte à clareza e à calma.
        </p>
      </div>

      {/* Card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] p-4 w-1/4 bg-white rounded-xl shadow-purple-400 shadow h-fit text-purple-500 font-semibold tracking-tight">
        <form onSubmit={submitHandler} autoComplete="off">
          {/* Heading */}
          <div className="p-2 mb-4">
            <h1 className="text-purple-700 text-3xl flex justify-center">
              Bem-vindo de volta!
            </h1>
            <p className="flex justify-center text-purple-400 font-medium">
              Seu sanctuary está esperando por você
            </p>
          </div>

          {/* Email */}
          <p className="text-purple-600">E-mail:</p>
          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
          />

          {/* Password */}
          <p className="text-purple-600">Senha:</p>
          <input
            type="password"
            name="password"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
          />

          {/* Footer */}
          <div className="flex justify-between items-center mt-5">
            <Link to="/" className="text-indigo-400 underline">
              Ainda não tem uma conta?
            </Link>

            {loading ? (
              <p className="flex items-center gap-2 bg-purple-600 shadow shadow-purple-800 hover:bg-purple-700 duration-300 rounded-2xl p-2 cursor-pointer text-sm text-white">
                <LuLoader className="w-4 h-4 animate-spin" />
                <p className="animate-pulse">Entrando com cuidado...</p>
              </p>
            ) : (
              <input
                type="submit"
                value="Entrar"
                className="bg-purple-600 shadow shadow-purple-800 hover:bg-purple-700 duration-300 rounded-2xl py-2 px-10 cursor-pointer text-white text-lg"
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

export default Login;
