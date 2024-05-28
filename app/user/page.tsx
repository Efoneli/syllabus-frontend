
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { getSession } from "@auth0/nextjs-auth0";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);
  useEffect(() => {
    if (user) {
      router.push('/user/user_dashboard');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!isLoading && user) {
      console.log("user changed in some way")
        // Fetch the token from your Auth0 on the client-side or via an API route
        fetch('/api/auth/token')
        .then(response => response.json())
        .then(data => {
          console.log(data, "this good")
            localStorage.setItem('accessToken', data.accessToken);
        });
    }
}, [user, isLoading, router]);


  // useEffect(() => {
  //   const fetchTokenAndRedirect = async () => {
  //     if (user) {
  //       const session = await getSession(); // Get the session to access the token
  //       console.log(session, "session")
  //       if (session?.accessToken) {
  //         localStorage.setItem('accessToken', session.accessToken); // Store the access token in local storage
  //       }
  //       router.replace('/dashboard');
  //     }
  //   };

  //   fetchTokenAndRedirect();
  // }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!isLoading && !user && (
        <>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Welcome to CodeFigma
          </h1>
          <p className="text-lg mb-8">A collaborative coding platform.</p>
          <div className="flex">
            <a
              href="/api/auth/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Sign In
            </a>
          </div>
        </>
      )}
    </div>
  </>
    
     
      
  );
}
