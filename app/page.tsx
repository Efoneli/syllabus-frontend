'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import jwtDecode from 'jwt-decode';

interface MyToken {
  name: string;
  exp: number;
}

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const [permissions, setPermissions] = useState([]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  console.log(user, 'user from console')

  useEffect(() => {
    if (user !== undefined && Object.keys(user).length !== 0) {
      console.log("User authenticated with Auth0");

      fetch('/api/access')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch Auth0 token: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data, "Fetched Auth0 token");
          localStorage.setItem('accessToken', data.accessToken);

          // Decode the JWT token to get the user's permissions
          const decodedToken = jwtDecode<MyToken>(data.accessToken);
          const userPermissions = decodedToken?.permissions || [];
          // setPermissions(userPermissions);
          localStorage.setItem('permissions', JSON.stringify(userPermissions));

          // Create user in backend
          return fetch('http://localhost:3030/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.accessToken}`
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              sub: user.sub,
            })
          });
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 409) {
            throw new Error('User already exists');
          } else {
            throw new Error(`Failed to create user: ${response.statusText}`);
          }
        })
        .then(data => {
          console.log("User created in backend:", data);
        })

        .catch(error => {
          console.error("Error:", error.message);
        });
        router.replace('/user/user_dashboard');
    } 
    // else{
    //   router.replace('/api/auth/login');
    // }
    
  }, [user, router]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:from-inherit lg:dark:bg-zinc-800/30">
          <p>
            Get started by &nbsp;
            <div className="relative inline-block">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" type="button">
                <a href="/api/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                  Sign In
                </a>
              </button>
            </div>
          </p>
        </div>

        <button onClick={toggleModal} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Apply for internship
        </button>

        {isOpen && (
          <div id="crud-modal" aria-hidden={!isOpen} className={`fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${!isOpen ? 'hidden' : 'flex'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Apply for our Internship
                  </h3>
                  <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleModal}>
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                {/* Modal body  */}
                <form className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-black dark:text-white">Name</label>
                      <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Input name here" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Input email here" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                      <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                        <option>Select a category</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Fullstack">Fullstack</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Why Apply for the Internship</label>
                      <textarea id="description" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your reason here"></textarea>                    
                    </div>
                  </div>
                  <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-orange-100 after:via-orange-500 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-orange-700 before:dark:opacity-10 after:dark:from-orange-900 after:dark:via-[#611d02] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className="flex flex-col items-center justify-center">
          <p>Welcome to </p>
          <h1 className="text-4xl">WDAT SYLLABUS</h1>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Docs</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Find in-depth information about tech stacks using their docs.</p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Learn</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Learn about Web development in an interactive courses with videos!</p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Videos</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Explore starter videos for videos.</p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold">Projects</h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">Build and deploy your project to a shareable URL with Vercel.</p>
        </div>
      </div>
    </main>
  );
}






