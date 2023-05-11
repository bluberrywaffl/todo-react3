import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";


export default function Signin() {
   const router = useRouter();
   const { data: session } = useSession();
//관리자는 앱 운영자와 교수님 두 분입니다.
  const adminNames = ["정원", "김진중"];


  const isAdmin = session && adminNames.includes(session.user.name);


   return (
    <div className = "flex justify-center h-screen">
        {session ? (
            <div className = "grid m-auto text-center">
                <div className = "m-4">Signed in as {session.user.name}</div>
                <button
                className = {`w-40
                    justify-self-center
                    p-1 mb-4
                    bg-pink-500 text-pink-300
                    border border-pink-500 rounded
                    hover: bg-white hover:text-pink-500`}
                onClick={() => router.push("/")}
                >
                    Go to Home
                </button>
                <button
                className={`w-40
                justify-self-center
                p-1 mb-4
                text-pink-500
                border border-pink-500 rounded
                hover: bg-white hover:text-pink-500`}
                onClick = {() => signOut()}
                >
                    Sign out
                </button>
                {isAdmin && (
            <button
            //admin page 로 갈 수 있는 버튼입니다.
              className={`w-40
                justify-self-center
                p-1 mb-4
                bg-green-500 text-blue
                border border-green-500 rounded
                hover: bg-white hover:text-green-500`}
              onClick= {() => router.push("/admin")}
            >
              Go to Dashboard
            </button>
          )}
    </div>
   ) : (
    <div className = "grid m-auto text-center">
        <div className = "m-4">Not Signed In</div>
        <button
        className={`w-40
            justify-self-center
            p-1 mb-4
            bg-pink-300 text-white
            border border-pink-500 rounded
            hover: bg-white hover:text-gray-300`}
            onClick={() => signIn()}
            >
                Sign in
            </button>
    </div>
   )}
   </div>
   );
}