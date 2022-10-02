import { useEffect, useState } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

const ToDo = ({ content, isCompleted, onChange, onDelete }) => {
  const cards = ["card", "card2", "card3", "card4", "card5"];
  return (
    <div className={styles[cards[Math.floor(Math.random() * cards.length)]]}>
      <div
        className={styles.text}
        style={{ textDecoration: isCompleted ? "line-through" : "" }}
      >
        {content}
      </div>
      <div className={styles.reverseWrapper}>
        <input
          type="checkbox"
          className={styles.check}
          checked={isCompleted}
          onChange={onChange}
        />
        <button className={styles.delBtn} onClick={onDelete}>
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [newContent, setNewContent] = useState("");

  const [toDos, setToDos] = useState([]);
  const myInterval = setInterval(reFresh, 2000);

  const getToDos = async () => {
    clearInterval(myInterval);
    const resp = await fetch("api/todos");
    const toDos = await resp.json();

    setToDos(toDos);
  };

  const createToDo = async () => {
    if (!newContent) return;
    await fetch("api/todos", {
      method: "post",
      body: JSON.stringify({ content: newContent }),
    });
    await getToDos();
  };

  const updateToDo = async (todo) => {
    let newBody = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    await fetch(`api/todos/${todo.key}`, {
      method: "put",
      body: JSON.stringify(newBody),
    });

    await getToDos();
  };

  const deleteToDo = async (tid) => {
    await fetch(`api/todos/${tid}`, { method: "delete" });
    setTimeout(getToDos, 200);
  };

  useEffect(() => {
    getToDos();
  }, []);

  const completed = toDos.filter((todo) => todo.isCompleted);
  const notCompleted = toDos.filter((todo) => !todo.isCompleted);
  function reFresh() {
    getToDos();
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>deta + next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h2>
          C'est un demo de <a href="https://www.deta.sh">Deta base</a> +{" "}
          <a href="https://nextjs.org">Next.js</a>
        </h2>
        <p className={styles.mytextcolor}>
          Afin d'éviter les abus, les donnés seront automatiquement suprimés
          dans qlq mn
        </p>
      </header>
      <main className={styles.main}>
        <div className={styles.incomplete}>
          <div className={styles.firstRow}>
            <div className={styles.title}>Tâches à faire</div>
            <div className={styles.reverseWrapper}>
              <input
                className={styles.inpt}
                onChange={(e) => setNewContent(e.target.value)}
              ></input>
              <button className={styles.addBtn} onClick={createToDo}>
                &#10011;
              </button>
            </div>
          </div>
          <div className={styles.scrolly}>
            {notCompleted.map((todo, index) => (
              <ToDo
                key={todo.key}
                content={`${index + 1}. ${todo.content}`}
                isCompleted={todo.isCompleted}
                onChange={() => updateToDo(todo)}
                onDelete={() => deleteToDo(todo.key)}
              />
            ))}
          </div>
        </div>

        <div className={styles.complete}>
          <div className={styles.firstRow}>
            <div className={styles.title}>Terminée</div>
          </div>
          <div className={styles.scrolly}>
            {completed.map((todo, index) => (
              <ToDo
                key={todo.key}
                content={`${index + 1}. ${todo.content}`}
                isCompleted={todo.isCompleted}
                onChange={() => updateToDo(todo)}
                onDelete={() => deleteToDo(todo.key)}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://deta.sh?ref=create-next-deta-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          powered by
          <img src="/deta.svg" alt="Deta Logo" className={styles.logo} />
          &nbsp;deta & next.js
        </a>
      </footer>
    </div>
  );
}
