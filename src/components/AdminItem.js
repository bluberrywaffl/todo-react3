/*
  각각의 할 일 항목을 렌더링하는 컴포넌트입니다.
  각 할 일의 완료 상태에 따라 체크박스와 텍스트 스타일을 동기화하며,
  삭제 버튼을 통해 해당 할 일을 삭제할 수 있습니다.
  이 컴포넌트는 `admin.js`에서 사용되어 할 일 목록을 구성합니다.
*/
import React from "react";
import styles from "@/styles/TodoList.module.css";
import moment from "moment";



const AdminItem = ({ todo, onToggle, onDelete, userName }) => {
    
  const formattedDate = moment(todo.datetime).format("MMM DD, YYYY, hh:mm:ss");
  // 각 할  일 항목을 렌더링합니다.
  return (
    <li className={styles.todoItem}>
    
      <input type="checkbox" checked={todo.completed} onChange={onToggle} class="custom-checkbox" />


      {/* 할 일의 텍스트를 렌더링하고, 완료 상태에 따라 텍스트에 취소선을 적용합니다. */}
      <span
        className={styles.todoText}
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </span>
      <span className={`${styles.date} ${styles.dateMarginRight}`}>{formattedDate}</span>
      <span className={styles.todoAuthor}
      style={{ textDecoration: todo.completed ? "line-through" : "none"}}
      >
        TodoBy:{ userName }
      </span>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
};


export default AdminItem;
