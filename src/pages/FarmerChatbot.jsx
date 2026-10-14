import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { sendChatMessage } from '../services/api';
import { 
  MessageSquareText, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Sparkles, 
  Lightbulb, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const FarmerChatbot = () => {
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: language === 'te' 
        ? "నమస్కారం! నేను మీ అగ్రిస్మార్ట్ వ్యవసాయ AI సహాయకుడిని. పంట తెగుళ్లు, నీటి యాజమాన్యం లేదా ఎరువుల వాడకం గురించి నన్ను అడగవచ్చు."
        : language === 'hi'
        ? "नमस्ते! मैं आपका एग्रीस्मार्ट कृषि सहायक हूँ। आप फसल रोगों, खादों और मौसम से जुड़े सवाल पूछ सकते हैं।"
        : "Hello! I am your AgriSmart Agricultural AI Assistant. Ask me anything about crop diseases, balanced fertilizers, smart irrigation, or soil preparation.",
      caution: null,
      source: "AgriSmart Knowledge Engine"
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = {
    en: [
      "How to treat early blight on tomato leaves organically?",
      "When is the best time of day to irrigate my field?",
      "How should I split urea fertilizer for maize?",
      "What is the ideal soil pH for vegetable crops?"
    ],
    te: [
      "టొమాటో ఆకుమచ్చ తెగులుకు సేంద్రీయ నివారణ ఏమిటి?",
      "పొలానికి నీరు పెట్టడానికి సరైన సమయం ఏది?",
      "యూరియా ఎరువును ఎన్ని దఫాలుగా వేయాలి?",
      "చౌడు నేలను ఎలా బాగుచేసుకోవాలి?"
    ],
    hi: [
      "टमाटर में झुलसा रोग की जैविक रोकथाम कैसे करें?",
      "सिंचाई करने का सबसे सही समय कौन सा है?",
      "मक्के में यूरिया की मात्रा कैसे दें?",
      "मिट्टी का पीएच सुधारने के उपाय क्या हैं?"
    ]
  };

  const currentQuestions = quickQuestions[language] || quickQuestions.en;

  const handleSend = async (messageToSend) => {
    const text = messageToSend || input;
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    if (!messageToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(text, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.response,
          caution: res.caution_notice,
          source: res.source
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Sorry, I encountered a temporary connection issue. Please verify backend server status.",
          caution: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <MessageSquareText className="w-3.5 h-3.5 text-teal-600" /> Trilingual Agronomic Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('chatbot.title')}
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          {t('chatbot.subtitle')}
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  msg.sender === 'user' ? 'bg-agri-600' : 'bg-teal-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-agri-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none space-y-3'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.caution && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{msg.caution}</span>
                  </div>
                )}

                {msg.source && (
                  <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">
                    Source: {msg.source}
                  </span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                Synthesizing agronomic response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Suggestions:
          </span>
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 shadow-xs whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 text-sm bg-slate-50 rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`p-3 rounded-xl text-white font-bold transition-all shadow-sm ${
                loading || !input.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-agri-600 hover:bg-agri-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            {t('chatbot.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};
