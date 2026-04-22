import { useState } from "react";

const responses = {
  "hi": "Hello! Welcome to UniNexus. How can I help you today?",
  "hello": "Hi there! Need help with marketplace or registration?",
  "register": "To register, go to the Register tab and fill your details with a valid @my.sliit.lk email.",
  "login": "Login using your username and password. All fields are required.",
  "add product": "To sell a product, go to Sell Product tab and fill the form. Price must be a number.",
  "buy product": "To buy a product, go to Marketplace and click Buy on available products.",
  "default": "Sorry, I didn't understand that. Try keywords like 'register', 'login', 'buy product', 'add product'."
};

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am your UniNexus assistant. Type 'help' for guidance." }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const key = input.toLowerCase();
    const botMsg = { from: "bot", text: responses[key] || responses["default"] };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: 25, right: 30, zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "flex-end", fontFamily: "'Inter', sans-serif" }}>
      {open && (
        <div style={{
          width: 350,
          height: 500,
          backgroundColor: "rgba(25, 25, 25, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
          marginBottom: "20px",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ padding: "20px", background: "linear-gradient(135deg, var(--accent-primary), #3b82f6)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "35px", height: "35px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.2rem" }}>
                🤖
              </div>
              <div>
                <strong style={{ fontSize: "1.1rem", display: "block" }}>UniNexus Assistant</strong>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: "white", fontSize: "1.8rem", cursor: "pointer", display: "flex", transition: "0.2s" }} onMouseOver={e=>e.target.style.color="rgba(255,255,255,0.6)"} onMouseOut={e=>e.target.style.color="white"}>×</button>
          </div>

          {/* Chat Body */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px", background: "rgba(0,0,0,0.2)" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "bot" ? "flex-start" : "flex-end" }}>
                <div style={{
                  maxWidth: "85%",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  borderBottomLeftRadius: m.from === "bot" ? "4px" : "18px",
                  borderBottomRightRadius: m.from === "user" ? "4px" : "18px",
                  backgroundColor: m.from === "bot" ? "var(--bg-tertiary)" : "linear-gradient(135deg, var(--accent-primary), #3b82f6)",
                  background: m.from === "user" ? "linear-gradient(135deg, var(--accent-primary), #3b82f6)" : "var(--bg-tertiary)",
                  color: "white",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  border: m.from === "bot" ? "1px solid rgba(255,255,255,0.05)" : "none"
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: "15px", background: "var(--bg-secondary)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Write a message..."
              style={{ flex: 1, padding: "12px 18px", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-primary)", outline: "none", fontSize: "0.95rem" }}
            />
            <button 
              onClick={handleSend} 
              style={{ width: "45px", height: "45px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-primary), #3b82f6)", color: "white", border: "none", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", transition: "0.3s transform, 0.3s box-shadow", boxShadow: "0 2px 10px rgba(59, 130, 246, 0.4)", fontSize: "1.1rem" }}
              onMouseOver={e=>{e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow="0 4px 15px rgba(59, 130, 246, 0.6)"}}
              onMouseOut={e=>{e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 10px rgba(59, 130, 246, 0.4)"}}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "linear-gradient(135deg, var(--accent-primary), #3b82f6)",
            color: "white",
            borderRadius: "50%",
            width: 65,
            height: 65,
            fontSize: "1.8rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 5px 20px rgba(59, 130, 246, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "0.3s transform",
            zIndex: 2000
          }}
          onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"}
          onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}
        >
          💬
        </button>
      )}
    </div>
  );
}