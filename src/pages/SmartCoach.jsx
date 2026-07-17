import { useMemo, useState } from "react";
import { useFitness } from "../context/FitnessContext";

export default function SmartCoach({ navigate }) {
  const { profile, history, nutrition, plans } = useFitness();
  const [messages, setMessages] = useState([{ id: 1, from: "coach", text: `Hey ${profile.name}. I reviewed your current training, recovery and nutrition data. What do you need help with today?` }]);
  const [input, setInput] = useState("");

  const totals = nutrition.meals.reduce((sum, meal) => ({ protein: sum.protein + meal.protein, calories: sum.calories + meal.calories }), { protein: 0, calories: 0 });
  const insights = useMemo(() => [
    { icon: "🥚", title: "Protein gap", message: `${Math.max(0, nutrition.proteinTarget - totals.protein)}g protein remaining today.`, action: "Open nutrition", page: "nutrition" },
    { icon: "⚡", title: "Training focus", message: `Your next planned session is ${plans[0]?.name || "a workout"}.`, action: "View planner", page: "planner" },
    { icon: "💧", title: "Hydration", message: `${Math.max(0, nutrition.waterTarget - nutrition.water)} glasses left to hit your water goal.`, action: "Track water", page: "nutrition" },
  ], [nutrition, totals, plans]);

  const answer = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes("protein") || lower.includes("food")) return `You have logged ${totals.protein}g protein. Aim for another ${Math.max(0, nutrition.proteinTarget - totals.protein)}g using eggs, fish, chicken, paneer, Greek yogurt or soya chunks.`;
    if (lower.includes("rest") || lower.includes("recovery")) return history.length >= 3 ? "Your recent training load is moderate. Keep one complete recovery day after your hardest lower-body session and aim for 7–9 hours of sleep." : "Build consistency first, but avoid training the same sore muscle group hard on consecutive days.";
    if (lower.includes("workout") || lower.includes("today")) return `Start with ${plans[0]?.name || "your first planned session"}. Keep 1–3 reps in reserve on most working sets and focus on clean form.`;
    if (lower.includes("weight") || lower.includes("progress")) return `Your current weight is ${profile.weight} kg and your target is ${profile.targetWeight} kg. Track the weekly average instead of reacting to a single day.`;
    return "For this frontend prototype, I use rule-based suggestions from your logged workouts, nutrition and goals. Ask about today’s workout, protein, recovery or weight progress.";
  };

  const send = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage = { id: Date.now(), from: "user", text: trimmed };
    const coachMessage = { id: Date.now() + 1, from: "coach", text: answer(trimmed) };
    setMessages((items) => [...items, userMessage, coachMessage]);
    setInput("");
  };

  return (
    <div className="page coach-page">
      <section className="page-heading"><div><span className="eyebrow">Rule-based prototype</span><h1>Smart Coach</h1><p>Context-aware training, recovery and nutrition suggestions based on your local data.</p></div><div className="coach-status"><i /> Coach online</div></section>
      <section className="coach-layout">
        <aside className="coach-insights"><span className="eyebrow">Today’s insights</span>{insights.map((item) => <article key={item.title}><span>{item.icon}</span><div><strong>{item.title}</strong><p>{item.message}</p><button className="text-btn" onClick={() => navigate(item.page)}>{item.action} →</button></div></article>)}</aside>
        <article className="coach-chat panel"><header><div className="coach-avatar">✧</div><div><strong>FitVerse Coach</strong><span><i /> Rule-based assistant</span></div></header><div className="chat-messages">{messages.map((message) => <div className={`chat-message ${message.from}`} key={message.id}>{message.from === "coach" && <span>✧</span>}<p>{message.text}</p></div>)}</div><div className="prompt-chips">{["What should I train today?", "How can I hit protein?", "Do I need a rest day?", "Review my weight progress"].map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about workout, recovery or nutrition…" /><button>Send →</button></form></article>
      </section>
      <p className="medical-note">FitVerse provides educational fitness guidance only. It is not medical diagnosis or a replacement for a qualified healthcare or nutrition professional.</p>
    </div>
  );
}
