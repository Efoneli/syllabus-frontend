
import { Carousel } from "flowbite-react";
import arif from "../../assets/arif.jpg";
import brook from "../../assets/brook.jpg";
import christopher from "../../assets/christopher.jpg";
import joshua from "../../assets/joshua.jpg";
import window from "../../assets/arif.jpg";
import Image from "next/image";

export default async function DashbaordPage() {
  return (
    <div className='min-h-screen'>
    
      <div className="p-12">
        <div>
          <h1 className="text-3xl font-semibold  mb-4 text-gray-200">
            Welcome to WDAT Syllabus{" "}
          </h1>
          <p className="text-md mb-4 text-gray-200">
            Empower your learning journey with our comprehensive web development
            syllabus app. Whether you&apos;re a student, educator, or lifelong
            learner, WDAT is here to streamline your study experience and help
            you achieve your web dev goals.
          </p>
        </div>

        <div className="h-60 sm:h-64 xl:h-80 2xl:h-96">
          <Carousel>
            <Image height={300} width={300} src={arif} alt="..." />
            <Image height={300} width={300} src={joshua} alt="..." />
            <Image height={300} width={300} src={brook} alt="..." />
            <Image height={300} width={300} src={christopher} alt="..." />
            <Image height={300} width={300} src={joshua} alt="..." />
            <Image height={300} width={300} src={window} alt="..." />
          </Carousel>
        </div>
      </div>
    </div>
  );
}



