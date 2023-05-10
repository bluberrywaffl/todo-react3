import React from "react";
import TodoList from "../components/TodoList";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/signin");
    },
  });
  return (
    <div>
      <TodoList />
    </div>
  );
}
