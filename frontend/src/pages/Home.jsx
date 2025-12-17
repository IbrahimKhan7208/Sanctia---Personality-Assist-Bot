import React from "react";
import { useState } from "react";
import axios from "axios";
import { LuSparkles, LuCalendar, LuLoader } from "react-icons/lu";
import { FaLocationArrow, FaRegHeart } from "react-icons/fa";
import { TbHeartSpark } from "react-icons/tb";
import { FiSun } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa6";
import { CgCoffee } from "react-icons/cg";
import { VscFeedback } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ENUM_LABELS_PT } from "../enumLabels.pt.js";

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
      if (res.data.error) {
        navigate("/login");
      }
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
    const response = await axios.post(
      "/api/analyze",
      { text },
      { withCredentials: true }
    );
    setLoading(false);

    setResult(response.data);

    const res = await axios.get("/api/entries/latest", {
      withCredentials: true,
    });

    setGuardian(res.data);
  };

  const logOutHandler = async () => {
    if (confirm("Do You Wanna LogOut?") == true) {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
      navigate("/");
    }
  };

  const getEntries = async () => {
    setLoadingEntries(true);
    const res = await axios.get("/api/entries/recent", {
      withCredentials: true,
    });
    setLoadingEntries(false);
    setEntries(res.data);
  };

  const guardianData = async () => {
    try {
      const res = await axios.get("/api/entries/latest", {
        withCredentials: true,
      });

      setGuardian(res.data);
    } catch (err) {
      console.error(err);
    }
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
    <div className=" h-screen w-full p-3">
      <div className="header flex justify-between">
        <div className="title items-center flex gap-2 ">
          <LuSparkles className="text-amber-500 text-4xl" />
          <div>
            <p className="font-semibold tracking-tight text-3xl text-purple-900">
              SANCTIA
            </p>
            <p className="text-sm text-purple-700">O Refúgio Humano</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-xl tracking-tight text-amber-600 flex gap-1 items-baseline">
            Que bom ter você aqui,
            <p className="font-semibold text-2xl text-amber-600">
              {user.user.name}
            </p>
          </div>
          <button
            className="pl-6 pr-6 bg-red-300 shadow shadow-zinc-500 text-gray-700 hover:bg-red-400 duration-200 rounded-xl cursor-pointer font-semibold h-12"
            onClick={logOutHandler}
          >
            Sair
          </button>
        </div>
      </div>

      <div className="chatWindows flex gap-2 m-2 mt-4 h-9/10">
        <div className="left w-2/3">
          <div className="input font-semibold bg-zinc-50 rounded-lg shadow shadow-purple-400 p-3 text-gray-600">
            <textarea
              name="text"
              id="text"
              value={text}
              rows={10}
              maxLength={1000}
              onChange={(e) => {
                setText(e.target.value);
              }}
              onKeyUp={handleKeyPress}
              placeholder="Escreva aqui... Pode ser um diário, um e-mail, um texto pessoal ou qualquer escrita que represente seu jeito natural de se expressar. Entre 300 e 1000 caracteres."
              className="w-full rounded-2xl p-4 outline-none"
            ></textarea>

            <div className="flex justify-between">
              <button
                className="bg-purple-600 hover:bg-purple-700 duration-200 shadow shadow-purple-800 items-center gap-2 rounded-xl pt-3 pb-3 pl-5 pr-6 flex cursor-pointer text-white ml-2"
                onClick={submitHandler}
              >
                <FaLocationArrow /> Ver reflexões
              </button>
              <p className="text-amber-500">
                {text.length} / 1000 characters (min 300)
              </p>
            </div>
          </div>

          <div className="bottom flex mt-2 gap-2">
            <div className="guardian w-1/2 h-63 bg-amber-100 rounded-lg shadow shadow-purple-500 p-2 pl-5 font-semibold">
              <p className="text-2xl text-purple-900 mb-3 flex gap-2 items-center">
                {guardian.type === "morning" ? (
                  <FiSun className="text-amber-600 rounded-full p-2 bg-white text-4xl" />
                ) : (
                  <CgCoffee className="text-amber-600 rounded-full p-2 bg-white text-4xl" />
                )}
                Guardião Sanctia
              </p>
              {guardian ? (
                <div>
                  <p className="text-purple-800 leading-relaxed">
                    {guardian.message}
                  </p>
                  <div className="border-t border-zinc-300 mt-5 mb-5"></div>
                  <div className="flex justify-between text-sm text-purple-800 bg-white p-2 rounded-xl mr-2">
                    <p className="text-purple-600">Estilo de orientação</p>
                    <p className="">
                      {
                        ENUM_LABELS_PT.motivation_style[
                          guardian.motivation_style
                        ]
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-purple-800 animate-pulse italic">
                  Listening quietly...
                </p>
              )}
            </div>

            <div className="recent w-1/2 bg-purple-100 rounded-lg shadow shadow-purple-500 p-2 pl-3 font-semibold h-63 flex flex-col">
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
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
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

        <div className="output bg-white rounded w-1/2 shadow shadow-purple-400 p-4 overflow-y-scroll tracking-tight">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="animate-pulse text-zinc-800 font-semibold">
                Analisando sua escrita…
              </p>
            </div>
          ) : result ? (
            result.error ? (
              <p className="text-red-600 font-medium">{result.error}</p>
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
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
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

      <div className="footer flex flex-col items-center gap-3 m-6">
        <div className="text-center text-sm text-purple-700/70 max-w-md leading-relaxed">
          Sua experiência importa. Se algo não parecer certo — ou se quiser
          compartilhar como se sentiu — estamos ouvindo.
        </div>

        <a
          href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-300 hover:bg-purple-400 text-purple-900 font-semibold transition-all border border-purple-200/50 hover:border-purple-300 cursor-pointer"
        >
          <VscFeedback className="text-xl" />
          Enviar feedback
        </a>

        <p className="text-xs text-purple-700/50 mb-4">
          Não coletamos textos pessoais • Apenas feedback anônimo
        </p>
      </div>
    </div>
  );
};

export default Home;
