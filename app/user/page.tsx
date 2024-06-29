// "use client";
// import { useRouter } from "next/navigation";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { useEffect } from "react";
// import axios from 'axios';

// export default function Home() {
//   const { user, isLoading } = useUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (user) {
//       router.replace('/user/user_dashboard');
//     }
//   }, [isLoading, user, router]);

//   useEffect(() => {
//     if (!isLoading && user) {
//       console.log("User authenticated with Auth0");

//       // Fetch the token from Auth0
//       axios.get('/api/auth/token')
//         .then(response => {
//           const data = response.data;
//           console.log(data, "Fetched Auth0 token");
//           const accessToken = data.accessToken;
//           localStorage.setItem('accessToken', accessToken);

//           // Decode the token to get user details (if necessary)
//           const decodedToken = jwt.decode(accessToken);

//           // Create user in backend
//           axios.post('http://localhost:3030/users', {
//             name: user.name,
//             email: user.email,
//             sub: user.sub,
//           }, {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${accessToken}`
//             }
//           })
//           .then(response => {
//             console.log('Response status:', response.status); // Log the response status
//             console.log("User created in backend:", response.data);
//           })
//           .catch(error => {
//             if (error.response) {
//               // Request made and server responded
//               console.error('Error creating user in backend:', error.response.data);
//               if (error.response.status === 409) {
//                 console.error('User already exists');
//               } else {
//                 console.error(`Failed to create user: ${error.response.data}`);
//               }
//             } else if (error.request) {
//               // The request was made but no response was received
//               console.error('Error creating user in backend: No response received');
//             } else {
//               // Something happened in setting up the request that triggered an Error
//               console.error('Error creating user in backend:', error.message);
//             }
//           });
//         })
//         .catch(error => {
//           console.error("Error fetching Auth0 token:", error);
//         });
//     }
//   }, [user, isLoading, router]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       {!isLoading && !user && (
//         <>
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
//             Welcome to WDAT Syllabus
//           </h1>
//           <p className="text-lg mb-8">
//             Empower your learning journey with our comprehensive web development syllabus app.
//           </p>
//           <div className="flex">
//             <a
//               href="/api/auth/login"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
//             >
//               Sign In as a user
//             </a>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



export default function Home() {
  return(
    <h1>hello</h1>
  )
}