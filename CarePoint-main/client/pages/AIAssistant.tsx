import { Header } from "@/components/Header";
import { ArrowRight, Brain, MessageSquare, Send, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const aiResponses: Record<string, string[]> = {
  fever: [
    "A fever is your body's natural response to infection. Here are some recommendations:\n\n• Rest and drink plenty of fluids\n• Stay hydrated with water, herbal tea, or warm lemon water\n• Use fever-reducing medications if temperature exceeds 103°F\n• Avoid heavy meals, stick to light foods\n• Keep your environment cool and wear light clothing\n• If fever persists beyond 3 days or reaches 104°F+, consult a doctor",
  ],
  cold: [
    "Common cold symptoms usually improve with self-care:\n\n• Get plenty of rest\n• Drink warm fluids - water, warm lemon water with honey\n• Use saline nasal drops to clear congestion\n• Eat immune-boosting foods: citrus fruits, berries, leafy greens\n• Gargle with warm salt water for sore throat\n• Use a humidifier to ease congestion\n• Most colds resolve in 7-10 days",
  ],
  headache: [
    "Here are ways to manage headaches:\n\n• Rest in a quiet, dark room\n• Apply warm or cold compress to the affected area\n• Stay hydrated - dehydration is a common trigger\n• Try over-the-counter pain relievers if needed\n• Practice relaxation techniques - deep breathing, meditation\n• Avoid caffeine, alcohol, and stress\n• If headaches are frequent, consult a healthcare provider",
  ],
  cough: [
    "Cough management depends on the type:\n\n• Stay hydrated with warm fluids\n• Use honey - a natural cough suppressant (for adults and children over 1)\n• Avoid irritants like smoke and pollution\n• Use steam inhalation from a hot shower\n• Try lozenges or cough drops\n• Get adequate rest\n• If cough persists beyond 2-3 weeks, see a doctor",
  ],
  tired: [
    "Feeling tired? Here are ways to boost your energy:\n\n• Get 7-9 hours of quality sleep\n• Maintain regular sleep schedule (sleep and wake at the same time)\n• Exercise regularly - even a 30-minute walk helps\n• Eat balanced meals with protein, healthy carbs, and fats\n• Stay hydrated throughout the day\n• Limit screen time before bed\n• Manage stress through meditation or yoga\n• If fatigue persists, consult a healthcare provider",
  ],
  viral: [
    "Viral infections require supportive care as antibiotics don't work on viruses:\n\n• Get complete rest\n• Drink plenty of fluids - water, electrolyte solutions\n• Eat nutritious foods - warm broths, soups, fruits\n• Use honey for sore throat relief\n• Gargle with salt water\n• Take over-the-counter medications for fever/pain if needed\n• Wash hands frequently to prevent spread\n• Most viral infections resolve in 7-14 days",
  ],
  stomach: [
    "For digestive issues, try these remedies:\n\n• Eat light foods - rice, toast, bananas, plain chicken\n• Stay hydrated with water, clear broths, or electrolyte drinks\n• Avoid dairy, fatty foods, and spicy food temporarily\n• Try ginger tea or herbal tea for relief\n• Rest your digestive system\n• Eat slowly and chew thoroughly\n�� Avoid alcohol, caffeine, and carbonated drinks\n• If symptoms persist beyond 48 hours, consult a doctor",
  ],
  allergy: [
    "Managing allergies effectively:\n\n• Identify and avoid triggers (pollen, dust, pet dander)\n• Keep windows closed during high pollen season\n• Wash hands and face frequently\n• Use air purifiers in your home\n• Take antihistamines as needed\n• Stay hydrated\n• Keep nasal passages clear with saline spray\n• If allergies are severe, consult an allergist",
  ],
  sleep: [
    "Improve sleep quality with these tips:\n\n• Maintain a consistent sleep schedule\n• Create a dark, cool, quiet sleeping environment\n• Avoid screens 1 hour before bed\n• Limit caffeine, alcohol, and heavy meals in evening\n• Exercise regularly but not close to bedtime\n• Practice relaxation techniques - meditation, deep breathing\n• Try keeping a sleep diary to identify patterns\n• If insomnia persists, consult a sleep specialist",
  ],
  default: [
    "I'm your AI Health Assistant. I can help with information about common health conditions and wellness tips.\n\nYou can ask me about:\n• Fever, cold, cough, headache\n• Digestive issues, stomach problems\n• Allergies, fatigue, sleep problems\n• General health advice and wellness tips\n\nPlease note: I provide general information only. For serious conditions or persistent symptoms, please consult a qualified healthcare professional.",
  ],
};

function getAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  for (const [keyword, responses] of Object.entries(aiResponses)) {
    if (keyword !== "default" && message.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return aiResponses.default[0];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI Health Assistant. 👋 I can help you with information about common health conditions, symptoms, and wellness tips. What health concern can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  const quickQuestions = [
    "I have a fever",
    "How to manage stress?",
    "Cold and cough remedies",
    "Sleep better at night",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border border-border"
                }`}
              >
                {message.type === "ai" && (
                  <p className="flex items-center gap-2 mb-2 font-semibold text-sm">
                    <Brain className="w-4 h-4" />
                    AI Assistant
                  </p>
                )}
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-3 border border-border">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions (show only if first message) */}
        {messages.length === 1 && !loading && (
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-border bg-muted/30">
            <p className="text-sm font-medium text-foreground mb-3">
              Try asking about:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left p-3 bg-white border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-medium text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="px-4 sm:px-6 lg:px-8 py-4 border-t border-border bg-white"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your health..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 bg-blue-50 border-t border-blue-200 text-xs text-blue-900">
          ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information
          only. For serious medical conditions, emergencies, or persistent symptoms, please
          consult a qualified healthcare professional or call emergency services.
        </div>
      </div>
    </div>
  );
}
