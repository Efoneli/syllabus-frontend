// import { getSession } from "@auth0/nextjs-auth0";
// import Image from "next/image";
// import { setTimeout } from "timers/promises";

// export default async function UserProfile() {

//   const session = await getSession();
//   await setTimeout(5000);

//   return (
//     <div className="top-60 flex items-end justify-end">
//       {!!session?.user && (
//         <div className="flex items-center justify-center mr-4">
//           <Image src={session.user.picture} height={50} width={50} alt={session.user.name} className='rounded-full' />

//           <div className="px-4 py-3 flex flex-col" role="none">
//             <p className="text-sm text-gray-900 " role="none">
//             {session.user.name}
//             </p>
//             <p
//               className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
//               role="none"
//             >
//               {session.user.email}
//             </p>
//           </div>
//           <a
//             href="/api/auth/logout"
//             className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100"
//           >
//             Logout
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useUser } from '@auth0/nextjs-auth0/client';
// import Image from 'next/image';

// export default function ProfileClient() {
//   const { user, error, isLoading } = useUser();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>{error.message}</div>;

//   return (
//       user && (
//           <div>
//             <Image src={user.picture} height={50} width={50} alt={user.name} />
//             <h2 className='text-white'>{user.name}</h2>
//             <p className='text-white'>{user.email}</p>
//           </div>
//       )
//   );
// }


'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
      user && (
          <div className='bg-[#00235B] flex items-center justify-end p-3 border-b'>
            <Image height={50} width={50}  src={user.picture || '/default-avatar.webp'} alt={user.name || 'User'} className='rounded-full'/>
            <h2 className='text-gray-200'>{user.name}</h2>
            <p className='text-gray-200'>{user.email}</p>
            <a
            href="/api/auth/logout"
             className="block w-20 text-left px-4 py-2 rounded-lg text-white bg-[#E21818] "
           >
             Logout
         </a>
          </div>
      )
  );
}