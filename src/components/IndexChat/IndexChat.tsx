import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./IndexChat.css";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

const API_URL = "http://localhost:3000/api/chat";

const IndexChat = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) {
      thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const text = inputText.trim();
    if (!text || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = (await response.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.reply ?? "" },
      ]);
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-shell">
      <div className="chat">
        <header className="chat-header">
          <div className="chat-avatar bot-avatar">
            <span>V</span>
          </div>
          <div className="chat-heading">
            <h1>VenecoBot</h1>
            <p>Tu pana virtual, hecho en Venezuela</p>
          </div>
          <span className="chat-status">
            <span className="status-dot" />
            En línea
          </span>
        </header>

        <div className="thread-section" ref={threadRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-badge">V</div>
              <h2>¿Qué pasó, pana?</h2>
              <p>Escríbeme lo que necesites y te echo una mano.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.role === "model" && (
                <div className="message-avatar bot-avatar">
                  <span>V</span>
                </div>
              )}
              <span className="message-bubble">{message.text}</span>
            </div>
          ))}

          {isLoading && (
            <div className="message model">
              <div className="message-avatar bot-avatar">
                <span>V</span>
              </div>
              <span className="message-bubble typing" aria-label="Escribiendo">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            </div>
          )}
        </div>

        {error && <p className="chat-error">{error}</p>}

        <form className="InputSection" onSubmit={sendMessage}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe tu mensaje…"
            disabled={isLoading}
            aria-label="Mensaje"
          />
          <button
            type="submit"
            disabled={isLoading || inputText.trim().length === 0}
            aria-label="Enviar"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M3.4 20.4 20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.4 1.06L3.5 11H12a1 1 0 0 1 0 2H3.5L2 19.34a1 1 0 0 0 1.4 1.06Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default IndexChat;
