import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import styles from "@/styles/TodoList.module.css";
import moment from "moment";
import { useSession, signOut } from "next-auth/react";


import { db } from "@/firebase";
import { 
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,          
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";


const todoCollection = collection(db, "todos");


const AdminDashboard = () => {
  const [todos, setTodos] = useState([]);

  const { data } = useSession();

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
  const getTodos = async () => {
    if (!data?.user?.name) return;
   
    const q = query(
      todoCollection, 
      orderBy("datetime", "desc")); //todo를 날짜별로 나열
  
    const results = await getDocs(q);
    const newTodos = [];
    //가져온 할 일 목록을 newTodos 배열에 담음
    results.docs.forEach((doc) => {
      //console.log(doc.data());
      //id 값을 Firestore에 저장한 값으로 지정하고, 나머지 데이터를 newTodos 배열에 담습니다.
      newTodos.push({ id:doc.id, ...doc.data() });
    });

    setTodos(newTodos);
  };

    getTodos();
  }, [data]);




  return (
    <div className={styles.container}>
      <h1 className="text-xl mb-5 font-bold underline underline-offset-4" style={{ textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
       textDecoration: "underline dotted", color: "gray" }}>
       All Todo List
      </h1>
      <h2 className = "flex justify-center text-l mb-5" style={{color: "gray"}}>
        The admin can see user's todo-lists but cannot delete them. 
      </h2>
      {data && (
      <div class="grid">
        <button
        className="w-40 p-1 mb-4 bg-purple-300 text-white border border-purple-300 rounded hover:bg-white hover:text-purple-300"
        onClick={handleLogout}
        style={{ boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)' }}
      >
        Logout
      </button>  
      </div>
      )}
      <ul>
        {todos.map((todo) => (
          <TodoItem
          key={todo.id}
          todo={todo}
          //onToggle={() => toggleTodo(todo.id)}
          //onDelete={() => deleteTodo(todo.id)}
          />
          ))}
      </ul>
    </div>

  );
};

export default AdminDashboard;
