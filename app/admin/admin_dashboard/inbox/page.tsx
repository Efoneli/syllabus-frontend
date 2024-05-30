import Image from "next/image";
import Avatar from '../../assests/undrawwaiting.svg'

export default function Inbox () {
    return(   

<div className="max-w-screen bg-white flex flex-col items-center justify-center border border-gray-200 rounded-lg shadow ">
    <a href="#">
        <Image className="rounded-t-lg" src={Avatar} alt="" />
    </a>
    <div className="p-5">
        <a href="#">
            <h5 className="mb-2 text-xl text-gray-600 font-semibold tracking-tight ">You do not have any notification yet.</h5>
        </a>      
    </div>
</div>

    )
}