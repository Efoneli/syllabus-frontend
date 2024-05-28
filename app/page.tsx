
'use client'

import { useRouter } from "next/navigation"

export default function Home() {
    const router = useRouter()

    return(
        <div className="flex flex-col items-center justify-center">
            <button 
            onClick={() => router.push("/admin")}
            >
                Login as an Admin
            </button>
            <button
             onClick={() => router.push("/user")}
            >
                Login as a user
            </button>
        </div>
    )
}