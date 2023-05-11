import React, { useState, useEffect } from "react";
import styles from "@/styles/TodoList.module.css";
import moment from "moment";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import AdminItem from "@/components/AdminItem";

import { db } from "@/firebase";
import { 
  collection,
  query,
  doc,
  getDocs,
  updateDoc,          
  deleteDoc,
  orderBy,
  where,
  getDoc,
  getFirestore,
  setDoc,
  getAuth,
} from "firebase/firestore";


 const todoCollection = collection(db, "todos");




const AdminDashboard = () => {
  const [todos, setTodos] = useState([]);

  const { data } = useSession();
  const router = useRouter();
   



  const getTodos = async () => {
    if (!data?.user?.name) return;
    
    const adminNames = ["정원", "김진중"];
    const isAdmin = data && adminNames.includes(data.user.name);
    //운영자(학생 본인과 교수님)이 아니면 홈으로 돌아갈 수밖에 없습니다.
    if (!isAdmin) {
      alert("You cannot access this page.");
      router.push("/");
      return;
    }
    
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
    useEffect(() => {

    getTodos();
  }, [data]);

  const toggleTodo = (id, userId) => {
//아이디를 확인해 admin page에서 다른 유저의 투두를 체크하지 못하게 합니다.
    if (userId !== data?.user.id) {
      alert("You cannot check other peoples' todos.");
      return;
     }
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.

    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        //Firestore에서 해당 id 가진 할 일 찾아 완료한 상태 업데이트
       const todoDoc = doc(todoCollection, id);
       updateDoc(todoDoc, { completed: !todo.completed });
      // ...todo => id: 1, text: "할일1", completed: false
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
  });

  setTodos(newTodos);
};



  const deleteTodo = (id, userId) => {
//아이디를 확인해 admin page에서 다른 유저의 투두를 삭제하지 못하게 합니다.
     if (userId !== data?.user.id) {
      alert("You cannot delete other peoples' todos.");
      return;
     }
    //Firestore에서 해당 id를 가진 할 일을 삭제한다.
    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);
   
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    setTodos(
      todos.filter((todo) => { 
      return todo.id !== id;
      })
    );
  };


  return (
    
    <div className={styles.container}>
      <h1 className="text-xl mb-5 font-bold underline underline-offset-4" style={{ textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
       textDecoration: "underline dotted", color: "gray" }}>
       All Todo List
      </h1>
      <h2 className = "mb-5 flex justify-center" style={{color: "gray"}}>
        The admin can see other users' todo-lists but cannot delete or check them. 
      </h2>
      {data && (
      <div class="grid">
        <button
          className="w-60 justify-self-center p-1 mb-4 bg-pink-300 text-white border border-pink-300 rounded hover:bg-white hover:text-pink-300"
          onClick={() => router.push("/")}
          style={{ boxShadow: '0 4px 5px rgba(0, 0, 0, 0.3)' }}
        >
          Go to my todo list
        </button> 
    
      </div>
      )}
      <ul>
        {todos.map((todo) => 
        (
          <AdminItem
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo.id, todo.userId)}
          onDelete={() => deleteTodo(todo.id, todo.userId)}
          userName={todo.userName}
          />
          ))}
      </ul>
    </div>

  );
};


export default AdminDashboard;
