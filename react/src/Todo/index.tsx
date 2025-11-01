import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import styles from "./Todos.module.css";

type Todo = {
  id: string;
  content: string;
  isCompleted: boolean;
};

const TodoContext = createContext<
  | {
      todos: Todo[];
      onDelete: (id: string) => void;
      markCompleted: (id: string, state: boolean) => void;
      addTodo: (todo: Todo) => void;
      completedTodoCount: number;
      total: number;
    }
  | undefined
>(undefined);

function useTodoContext() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodoContext must be used within provider");
  }
  return context;
}

function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const completedTodoCount = useMemo(
    () => todos.filter((todo) => todo.isCompleted).length,
    [todos],
  );

  const onDelete = (id: string) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });
  };

  const markCompleted = (id: string, state: boolean) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id !== id) {
          return todo;
        }
        return {
          ...todo,
          isCompleted: state,
        };
      });
    });
  };

  const addTodo = (todo: Todo) => {
    setTodos((prev) => {
      const copy = [...prev];
      copy.push(todo);
      return copy;
    });
  };
  const value = {
    total: todos.length,
    completedTodoCount,
    addTodo,
    markCompleted,
    onDelete,
    todos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

function Header() {
  const { addTodo, completedTodoCount, total } = useTodoContext();
  const [todo, setTodo] = useState("");

  const onSubmitTodo = (e: FormEvent) => {
    e.preventDefault();
    addTodo({
      id: Date.now().toString(),
      content: todo,
      isCompleted: false,
    });
    startTransition(() => {
      setTodo("");
    });
  };
  return (
    <div className={styles["todo-header"]}>
      <h2>
        Todos{" "}
        <span className={styles["completed-count"]}>
          ({`${completedTodoCount}`} of {`${total}`} completed)
        </span>
      </h2>
      <form onSubmit={onSubmitTodo}>
        <input
          type="text"
          value={todo}
          placeholder="e.g. Plan new design for the dashboard"
          onChange={(e) => setTodo(e.target.value.trim())}
        />
        <button className={styles["btn-submit"]} type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
function TodoList() {
  const { todos, markCompleted, onDelete, total } = useTodoContext();
  if (total === 0) {
    return <div className={styles["zerostate"]}>Add new Todos</div>;
  }
  return (
    <ul className={styles["todo-list"]}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          markCompleted={markCompleted}
        />
      ))}
    </ul>
  );
}

function TodoItem({
  todo,
  onDelete,
  markCompleted,
}: {
  todo: Todo;
  onDelete: (id: string) => void;
  markCompleted: (id: string, state: boolean) => void;
}) {
  return (
    <li
      className={`${styles["todo-list__item"]} ${todo.isCompleted && styles["is-completed"]}`}
    >
      <div
        className={`${styles["content"]} ${todo.isCompleted && styles["is-completed"]}`}
      >
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={(e) => markCompleted(todo.id, e.target.checked)}
        />
        {todo.content}
      </div>
      <button
        className={styles["btn-remove"]}
        onClick={() => onDelete(todo.id)}
      >
        x
      </button>
    </li>
  );
}

export default function Todo() {
  return (
    <TodoProvider>
      <div className={styles["todo-container"]}>
        <Header />
        <TodoList />
      </div>
    </TodoProvider>
  );
}
