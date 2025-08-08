import TodoApp from "../components/TodoApp";

export default function Page() {
  return (
    <main className="container">
      <h1>Todo List</h1>
      <TodoApp />
      <footer className="footer">
        <span>Built with Next.js</span>
      </footer>
    </main>
  );
}
