import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { setTimeout } from "timers/promises";

export default async function UserProfile() {
  const session = await getSession();
  await setTimeout(5000);
  return (
    <div className="top-60 flex items-end justify-end">
      {!!session?.user && (
        <div className="flex items-center justify-center mr-4">
          <Image src={session.user.picture} height={50} width={50} alt={session.user.name} className='rounded-full' />

          <div className="px-4 py-3 flex flex-col" role="none">
            <p className="text-sm text-gray-900 " role="none">
            {session.user.name}
            </p>
            <p
              className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
              role="none"
            >
              {session.user.email}
            </p>
          </div>
          <a
            href="/api/auth/logout"
            className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-100"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
