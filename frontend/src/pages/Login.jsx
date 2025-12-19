import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuLoader } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import posthog from "posthog-js";

const Login = () => {
  const [form, setform] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const demoHandler = async () => {
    const demoCredentials = {
      email: "demo@sanctia",
      password: "demo123",
    };

    setform(demoCredentials);

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "/api/user/login",
        demoCredentials,
        {
          withCredentials: true,
        }
      );

      setLoading(false);
      console.log("Hello", res.data)
      if (res.data.error) {
        setErrorMsg(res.data.error);
      } else {
        posthog.capture("demo_login_success");
        navigate("/home", { state: res.data });
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 429) {
        setErrorMsg(err.response.data.message);
        return;
      }

      setErrorMsg("Erro ao acessar a conta de demonstração.");
    }

  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await axios.post("/api/user/login", form, {
        withCredentials: true,
      });
      setLoading(false);
      if (res.data.error) {
        setErrorMsg(res.data.error);
      } else {
        posthog.capture("login_success");
        navigate("/home", { state: res.data });
      }
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 429) {
        setErrorMsg(err.response.data.message);
        return;
      }

      setErrorMsg("Erro ao acessar a conta de demonstração.");
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
      <div className="absolute mt-5 top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-full max-w-md m-2 p-4 bg-white rounded-xl shadow-purple-400 shadow h-fit text-purple-500 font-semibold tracking-tight">
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
            value={form.email}
            type="email"
            name="email"
            placeholder="name@example.com"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
            required
          />

          {/* Password */}
          <p className="text-purple-600">Senha:</p>
          <input
            value={form.password}
            type="password"
            name="password"
            onChange={changeHandler}
            className="mb-4 p-2 h-12 w-full border rounded-xl outline-none"
            required
          />

          {/* Footer */}
          <div className="flex justify-between items-center gap-10 mt-5">
            <Link to="/signup" className="text-indigo-400 underline">
              Ainda não tem uma conta?
            </Link>

            {loading ? (
              <div className="flex items-center gap-2 bg-purple-600 shadow shadow-purple-800 hover:bg-purple-700 duration-300 rounded-2xl p-2 cursor-pointer text-sm text-white">
                <LuLoader className="w-4 h-4 animate-spin" />
                <p className="animate-pulse">Entrando com cuidado...</p>
              </div>
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

        <div className="border-t border-zinc-300 mt-5 mb-5"></div>

        <div className="flex flex-col items-center gap-2 mt-3">
          <button
            onClick={demoHandler}
            className="px-6 py-3 rounded-full  text-purple-700 
               bg-amber-100 border border-purple-200 
               hover:bg-amber-200 hover:border-purple-400 
               transition-all cursor-pointer"
          >
            Entrar como convidado
          </button>

          <p className="text-xs text-purple-600/60 text-center max-w-xs">
            Explore o Sanctia com um exemplo guiado — sem criar conta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
