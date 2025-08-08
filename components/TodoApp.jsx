"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "next_todo_items_v1";

export default function TodoApp() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const remainingCount = useMemo(() => items.filter(i => !i.completed).length, [items]);

  const filtered = useMemo(() => {
    if (filter === "active") return items.filter(i => !i.completed);
    if (filter === "completed") return items.filter(i => i.completed);
    return items;
  }, [items, filter]);

  function addItem(e) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    const newItem = { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() };
    setItems(prev => [newItem, ...prev]);
    setInput("");
  }

  function toggleItem(id) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, completed: !i.completed } : i)));
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clearCompleted() {
    setItems(prev => prev.filter(i => !i.completed));
  }

  function renameItem(id, title) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, title } : i)));
  }

  return (
    <section className="card" aria-label="Todo application">
      <form className="form" onSubmit={addItem}>
        <label htmlFor="newTodo" className="sr-only">Add a new task</label>
        <input
          id="newTodo"
          className="input"
          placeholder="Add a task and press Enter"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
        />
        <button className="button" type="submit" aria-label="Add task">Add</button>
      </form>

      <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
        <span className="pill">{remainingCount} remaining</span>
        <div className="filterBar" role="toolbar" aria-label="Filters">
          <button className="filterBtn" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
          <button className="filterBtn" aria-pressed={filter === "active"} onClick={() => setFilter("active")}>Active</button>
          <button className="filterBtn" aria-pressed={filter === "completed"} onClick={() => setFilter("completed")}>Completed</button>
        </div>
      </div>

      <ul className="list" aria-live="polite">
        {filtered.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={() => toggleItem(item.id)}
            onRemove={() => removeItem(item.id)}
            onRename={(t) => renameItem(item.id, t)}
          />
        ))}
      </ul>

      <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
        <button className="button" onClick={clearCompleted}>Clear completed</button>
        <small style={{ color: "#9aa7d9" }}>Local-only, saved in your browser</small>
      </div>
    </section>
  );
}

function TodoItem({ item, onToggle, onRemove, onRename }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.title);

  useEffect(() => setText(item.title), [item.title]);

  function submitEdit() {
    const t = text.trim();
    if (t && t !== item.title) onRename(t);
    setEditing(false);
  }

  return (
    <li className="item">
      <input
        className="checkbox"
        id={`cb-${item.id}`}
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
        aria-label={item.completed ? "Mark as active" : "Mark as completed"}
      />

      {editing ? (
        <form onSubmit={(e) => { e.preventDefault(); submitEdit(); }} style={{ flex: 1 }}>
          <label htmlFor={`edit-${item.id}`} className="sr-only">Edit task</label>
          <input
            id={`edit-${item.id}`}
            className="input"
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={submitEdit}
            autoFocus
          />
        </form>
      ) : (
        <label htmlFor={`cb-${item.id}`} className={`title ${item.completed ? "completed" : ""}`} style={{ cursor: "pointer" }}>
          {item.title}
        </label>
      )}

      <button className="iconBtn" onClick={() => setEditing(v => !v)} aria-label={editing ? "Save" : "Edit"}>
        {editing ? "✔" : "✎"}
      </button>
      <button className="iconBtn" onClick={onRemove} aria-label="Delete">🗑</button>
    </li>
  );
}
