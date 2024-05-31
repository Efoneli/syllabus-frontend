"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import placeholder from "../../../../assets/placeholder.jpg";

interface Course {
  id: number;
  title: string;
  prerequisites: string;
  imageUrl: string;
  description: string;
  categoryId: number;
  courseId: number;
}

interface Category {
  id: number;
  name: string;
  courses: Course[];
}

export default function CategoryDetails() {
  const params = useParams();
  const categoryId = Array.isArray(params.categoryId) ? params.categoryId[0] : params.categoryId;
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`http://localhost:3030/categories/${categoryId}`);
        setCategory(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [categoryId]);

  return (
    <div className="min-h-screen w-full h-full flex flex-col items-center p-4">
      {category ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Courses for {category.name}</h2>
          {category.courses.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.courses.map((course: Course) => (
                <li key={course.courseId} className="bg-white rounded-lg shadow-lg p-4">
                  <Image
                    width={200}
                    height={150}
                    src={course.imageUrl || placeholder}
                    alt={course.title}
                    className=""
                  />
                  <Link href={`/user/user_dashboard/categories/${categoryId}/courses/${course.id}`} passHref>
                    <div>
                      <h3 className="text-xl font-semibold mt-2">{course.title}</h3>
                      <p className="text-gray-700 mt-1">{course.description}</p>
                      <p className="text-gray-500 mt-1">Prerequisites: {course.prerequisites}</p>
                    </div>
                  </Link>
                  {/* <Ratings courseId={course.courseId} /> */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses available for this category.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
