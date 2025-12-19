import React from "react";
import { useState } from "react";
import axios from "axios";
import { LuSparkles, LuCalendar, LuLoader, LuLogOut } from "react-icons/lu";
import { FaLocationArrow, FaRegHeart } from "react-icons/fa";
import { TbHeartSpark } from "react-icons/tb";
import { FiSun } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa6";
import { CgCoffee } from "react-icons/cg";
import { VscFeedback } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ENUM_LABELS_PT } from "../enumLabels.pt.js";
import posthog from "posthog-js";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [entries, setEntries] = useState(null);
  const [guardian, setGuardian] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await axios.get("/api/user/home", {
        withCredentials: true,
      });
      console.log(res.data.error);
      if (res.data.error) {
        navigate("/");
      }
      posthog.capture("session_flow_completed");
    };

    checkAuth();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/analyze",
        { text },
        { withCredentials: true }
      );
      posthog.capture("analysis_submitted");
      setLoading(false);

      setResult(response.data);

      const res = await axios.get("/api/entries/latest", {
        withCredentials: true,
      });

      posthog.capture("guardian_triggered");
      setGuardian(res.data);
      posthog.capture("analysis_completed");
    } catch (err) {
      setLoading(false);

      if (err.response && err.response.status === 429) {
        setResult({ error: err.response.data.message });
      }
    }
  };

  const logOutHandler = async () => {
    if (confirm("Gostaria de sair?") == true) {
      await axios.post(
        "/api/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
      posthog.capture("logout_completed");
    }
  };

  const getEntries = async () => {
    setLoadingEntries(true);
    try {
      const res = await axios.get("/api/entries/recent", {
        withCredentials: true,
      });
      setLoadingEntries(false);
      setEntries(res.data);
      posthog.capture("got_recent_entries");
    } catch {
      setLoadingEntries(false);
      setEntries(
        "Estamos com dificuldade para acessar seus registros no momento."
      );
    }
  };

  const guardianData = async () => {
    const res = await axios.get("/api/entries/latest", {
      withCredentials: true,
    });

    setGuardian(res.data);
  };

  useEffect(() => {
    guardianData();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

  return (
    <div className="h-screen w-full p-3">
      {/* HEADER */}
      <div className="header flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="title items-center flex gap-2">
          <LuSparkles className="text-amber-500 text-4xl" />
          <div>
            <p className="font-semibold tracking-tight text-3xl text-purple-900">
              SANCTIA
            </p>
            <p className="text-sm text-purple-700">O Refúgio Humano</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
          <div className="text-xl tracking-tight text-amber-600 flex gap-1 items-baseline">
            Que bom ter você aqui,
            <p className="font-semibold text-2xl text-amber-600">
              {user?.user?.name || ""}
            </p>
          </div>
          <button
            className="flex items-center gap-1 justify-center pl-6 pr-6 bg-red-300 shadow shadow-zinc-500 text-zinc-600 hover:bg-red-400 hover:text-zinc-800 duration-200 rounded-xl cursor-pointer font-semibold h-12"
            onClick={logOutHandler}
          >
            <LuLogOut className="text-xl" />
            Sair
          </button>
        </div>
      </div>

      <div className="chatWindows grid grid-cols-1 md:grid-cols-5 gap-4 m-2 mt-4">
        {/* LEFT */}
        <div className="left md:col-span-3 flex flex-col">
          <div className="input font-semibold bg-zinc-50 rounded-lg shadow shadow-purple-400 p-3 text-gray-600">
            <textarea
              name="text"
              id="text"
              spellCheck={false}
              value={text}
              rows={10}
              maxLength={1000}
              onChange={(e) => setText(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Escreva aqui... Pode ser um diário, um e-mail, um texto pessoal ou qualquer escrita que represente seu jeito natural de se expressar. Entre 300 e 1000 caracteres."
              className="w-full rounded-2xl p-4 outline-none md:rows-10"
            ></textarea>

            <div className="flex justify-between items-center flex-wrap gap-2">
              <button
                className="bg-purple-600 hover:bg-purple-700 duration-200 shadow shadow-purple-800 items-center gap-2 rounded-xl pt-3 pb-3 pl-5 pr-6 flex cursor-pointer text-white ml-2"
                onClick={submitHandler}
              >
                <FaLocationArrow /> Ver reflexões
              </button>
              <p className="text-orange-300">
                {text.length} / 1000 characters (min 300)
              </p>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="bottom flex flex-col md:flex-row mt-2 gap-3">
            <div className="guardian w-full md:w-1/2 h-63 bg-amber-100 rounded-lg shadow shadow-purple-500 p-2 pl-5 font-semibold">
              <p className="text-2xl text-purple-900 mb-3 flex gap-2 items-center">
                {guardian.type === "morning" ? (
                  <FiSun className="text-amber-600 rounded-full p-2 bg-white text-4xl" />
                ) : (
                  <CgCoffee className="text-amber-600 rounded-full p-2 bg-white text-4xl" />
                )}
                Guardião Sanctia
              </p>

              {guardian ? (
                <>
                  <p className="text-purple-800 leading-relaxed">
                    {guardian.message}
                  </p>
                  <div className="border-t border-zinc-300 mt-5 mb-5"></div>
                  <div className="flex justify-between text-sm text-purple-800 bg-white p-2 rounded-xl mr-2">
                    <p className="text-purple-600">Estilo de orientação</p>
                    <p>
                      {
                        ENUM_LABELS_PT.motivation_style[
                          guardian.motivation_style
                        ]
                      }
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="flex space-x-1.5">
                    <div
                      className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <p className="text-purple-800 font-medium italic text-center mt-4">O Guardian está ouvindo sua escrita...</p>
                  <p className="text-purple-500 text-sm font-medium italic text-center">Sua orientação chegará no momento certo.</p>
                </div>
              )}
            </div>

            <div className="recent w-full md:w-1/2 bg-purple-100 rounded-lg shadow shadow-purple-500 p-2 pl-3 font-semibold h-min-63 overflow-y-auto flex flex-col">
              {entries && entries.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl text-purple-900 mb-1">
                      Reflexões Recentes
                    </p>
                    <button
                      onClick={getEntries}
                      disabled={loadingEntries}
                      className="flex items-center p-2 gap-1 rounded-full bg-purple-300 hover:bg-purple-400 text-purple-900 text-xs font-medium transition-all border border-purple-200/50 hover:border-purple-300 disabled:opacity-50 cursor-pointer"
                    >
                      {loadingEntries ? (
                        <>
                          <LuLoader className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <LuSparkles className="w-4 h-4" />
                          <span>Carregar reflexões recentes</span>
                        </>
                      )}
                    </button>
                  </div>
                  {entries.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex flex-col space-y- py-2 border-b border-zinc-300 last:border-0 pl-1"
                    >
                      <div className="flex items-center space-x-2">
                        <LuCalendar className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs text-purple-700/70 font-medium">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      <span className="text-sm text-purple-800 pl-5">
                        {ENUM_LABELS_PT.emotional_state[entry.emotional_state]},{" "}
                        {entry.emotional_tone}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-2xl text-purple-900 mb-1">
                    Reflexões Recentes
                  </p>
                  <div className="flex flex-col items-center justify-center flex-1 space-y-2">
                    <div className="w-12 h-12 bg-purple-200 border border-purple-300 rounded-full flex items-center justify-center">
                      <LuCalendar className="w-6 h-6 text-purple-400" />
                    </div>

                    <div className="text-center space-y-0.5">
                      <p className="text-sm text-purple-700/70 mb-2">
                        Nenhuma reflexão ainda
                      </p>
                    </div>

                    <button
                      onClick={getEntries}
                      disabled={loadingEntries}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-300 hover:bg-purple-400 text-purple-900 font-medium transition-all border border-purple-200/50 hover:border-purple-300 disabled:opacity-50 cursor-pointer"
                    >
                      {loadingEntries ? (
                        <>
                          <LuLoader className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <LuSparkles className="w-4 h-4" />
                          <span>Carregar reflexões anteriores</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="output md:col-span-2 bg-white rounded shadow shadow-purple-400 p-4 overflow-y-scroll tracking-tight max-h-[609px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                <TbHeartSpark className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-purple-900 font-semibold text-lg">
                  Analisando sua escrita...
                </p>
                <p className="text-purple-600/60 text-sm">
                  SANCTIA está ouvindo
                </p>
              </div>
            </div>
          ) : result ? (
            result.error ? (
              <div className="flex flex-col items-center justify-center h-full space-y-5">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-200">
                  <svg
                    className="w-10 h-10 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-red-400 font-semibold text-lg">
                    Algo deu errado
                  </p>
                  <p className="text-red-400 text-sm leading-relaxed">
                    {result.error}
                  </p>
                  <p className="text-amber-500 font-semibold mt-3">
                    Por favor, tente novamente
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-purple-900 mb-1 flex items-center gap-2">
                    Sua Reflexão
                    <TbHeartSpark className="text-amber-500" />
                  </h2>
                  <p className="text-sm text-purple-700/60">
                    Um reflexo de quem você é
                  </p>
                </div>

                <div className="border-t border-zinc-300"></div>

                {/* Emotional Profile */}
                <section className="space-y-4">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Perfil Emocional
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50 text-center">
                      <FaRegHeart className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-[10px] text-purple-700/60 mb-1 font-semibold uppercase tracking-wide">
                        Estado
                      </p>
                      <p className="text-sm text-purple-900 font-semibold">
                        {ENUM_LABELS_PT.emotional_state[result.emotional_state]}
                      </p>
                    </div>

                    <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50 text-center">
                      <LuSparkles className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-[10px] text-purple-700/60 mb-1 font-semibold uppercase tracking-wide">
                        Tom
                      </p>
                      <p className="text-sm text-purple-900 font-semibold">
                        {result.emotional_tone}
                      </p>
                    </div>

                    <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50 text-center">
                      <FaRegStar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                      <p className="text-[10px] text-purple-700/60 mb-1 font-semibold uppercase tracking-wide">
                        Sensibilidade
                      </p>
                      <p className="text-sm text-purple-900 font-semibold">
                        {
                          ENUM_LABELS_PT.sensitivity_level[
                            result.sensitivity_level
                          ]
                        }
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Behavioural Style */}
                <section className="space-y-3">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Estilo Comportamental
                  </h3>

                  <div className="space-y-3.5">
                    <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100/50">
                      <p className="text-xs text-purple-700/50 mb-2">Tipo</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {result.mbti_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-purple-700/50 mb-1.5">
                        Estilo de Comunicação
                      </p>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        {result.communication_style}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Motivation Pattern */}
                <section className="space-y-3">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Padrão de Motivação
                  </h3>
                  <p className="text-sm text-purple-900 leading-relaxed">
                    {ENUM_LABELS_PT.motivation_style[result.motivation_style]}
                  </p>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Strengths */}
                <section className="space-y-3 rounded-lg bg-purple-50 p-2">
                  <div className="flex items-center space-x-2 ">
                    <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                      Pontos Fortes
                    </h3>
                  </div>
                  <div className="space-y-2.5 ">
                    {result.strengths.map((strength, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></div>
                        <p className="text-sm text-purple-800 leading-relaxed">
                          {strength}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Growth Points */}
                <section className="space-y-3.5 rounded-lg bg-amber-50 p-2">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Pontos de Crescimento
                  </h3>
                  <div className="space-y-2.5">
                    {result.growth_points.map((point, i) => (
                      <div key={i} className="flex items-start space-x-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2"></div>
                        <p className="text-sm text-purple-800 leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Lifestyle Pointers */}
                <section className="space-y-3">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Indicações de Estilo de Vida
                  </h3>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    {result.lifestyle_hint}
                  </p>
                </section>

                <div className="border-t border-zinc-300"></div>

                {/* Fashion & Jewelry */}
                <section className="space-y-4 rounded-lg bg-red-50 p-2">
                  <h3 className="uppercase tracking-wider text-purple-900/80 font-semibold">
                    Alinhamento de Estilo e Joias
                  </h3>

                  <div>
                    <p className="text-xs text-purple-700/50 mb-1.5">Estilo</p>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      {result.fashion_hint}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-purple-700/50 mb-1.5">Joias</p>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      {result.jewelry_hint}
                    </p>
                  </div>
                </section>
              </div>
            )
          ) : (
            <div className="filler flex items-center justify-center h-full ">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center mx-auto">
                  <LuSparkles className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-purple-700 font-semibold text-xl">
                  Seus insights aparecerão aqui
                </p>
                <p className="text-purple-700/60 max-w-xs">
                  Compartilhe seus pensamentos no espaço de escrita e descubra
                  os padrões que tornam você único
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-300 mt-5"></div>

      {/* FOOTER */}
      <div className="footer flex flex-col items-center gap-3 m-6">
        <div className="text-center text-sm text-purple-700/70 max-w-md leading-relaxed">
          Sua experiência importa. Se algo não parecer certo — ou se quiser
          compartilhar como se sentiu — estamos ouvindo.
        </div>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSe6LudDXcqLgUvZyiwdzvTbyKJkygH8ljclUR4PNIVuHPheFw/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-400 hover:bg-purple-500 text-purple-900 font-semibold transition-all border border-purple-500 hover:border-purple-600 cursor-pointer"
        >
          <VscFeedback className="text-2xl" />
          Enviar feedback
        </a>

        <p className="text-xs text-purple-700/60 mb-4">
          Não coletamos textos pessoais • Apenas feedback anônimo
        </p>
      </div>
    </div>
  );
};

export default Home;
