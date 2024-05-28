


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Ratings from '../../../components/Ratings';
import placeholder from '../../../assests/placeholder.jpg'

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
}

export default function CategoryDetails() {
  const params = useParams();
  const [category, setCategory] = useState<any>({});
  const [newCourse, setNewCourse] = useState<Course>({ id: 0, title: '', prerequisites: '', imageUrl: '', description: '', categoryId: parseInt(params.categoryId), courseId: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:3030/categories/${params.categoryId}`
      );
      setCategory(response?.data);
    })();
  }, [params.categoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing && editCourse) {
      setEditCourse({ ...editCourse, [name]: value });
    } else {
      setNewCourse({ ...newCourse, [name]: value });
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post("http://localhost:3030/courses", newCourse);
      const addedCourse = response.data;
      setCategory(prevCategory => ({
        ...prevCategory,
        courses: [...prevCategory.courses, addedCourse]
      }));
      setNewCourse({ id: 0, title: '', prerequisites: '', imageUrl: '', description: '', categoryId: parseInt(params.categoryId), courseId: 0 });
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEditCourse = async () => {
    if (editCourse) {
      try {
        const response = await axios.put(`http://localhost:3030/courses/${editCourse.id}`, editCourse);
        const updatedCourse = response.data;
        setCategory(prevCategory => ({
          ...prevCategory,
          courses: prevCategory.courses.map(course => (course.id === updatedCourse.id ? updatedCourse : course))
        }));
        setEditCourse(null);
        setIsEditing(false);
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3030/courses/${id}`);
      setCategory(prevCategory => ({
        ...prevCategory,
        courses: prevCategory.courses.filter(course => course.id !== id)
      }));
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className=" bg-white min-h-screen w-full h-full flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Courses for {category?.name}</h2>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={isEditing && editCourse ? editCourse.title : newCourse.title}
          onChange={handleInputChange}
          className="mb-2 p-2 border text-gray-800"
        />
        <input
          type="text"
          name="prerequisites"
          placeholder="Prerequisites"
          value={isEditing && editCourse ? editCourse.prerequisites : newCourse.prerequisites}
          onChange={handleInputChange}
          className="mb-2 p-2 border text-gray-800"
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={isEditing && editCourse ? editCourse.imageUrl : newCourse.imageUrl}
          onChange={handleInputChange}
          className="mb-2 p-2 border text-gray-800"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={isEditing && editCourse ? editCourse.description : newCourse.description}
          onChange={handleInputChange}
          className="mb-2 p-2 border text-gray-800"
        />
        <button
          onClick={isEditing ? handleEditCourse : handleAddCourse}
          className="bg-blue-500 text-white p-2"
        >
          {isEditing ? 'Update Course' : 'Add Course'}
        </button>
      </div>

      {category?.courses?.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category?.courses.map((course) => (
            <li key={course.courseId} className="bg-white rounded-lg shadow-lg p-4">
              <Link href={`/dashboard/categories/${params.categoryId}/courses/${course.id}`} passHref>
              <Image
                width={200}
                height={150}
                src={course.imageUrl || placeholder}
                alt={course.title}
                className="w-full"
              />
                <div>
                  <h3 className="text-gray-800 text-xl font-semibold mt-2">{course.title}</h3>
                  <p className="text-gray-700 mt-1">{course.description}</p>
                  <p className="text-gray-500 mt-1">Prerequisites: {course.prerequisites}</p>
                </div>
              </Link>
              <Ratings courseId={course.courseId} />
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditCourse(course);
                  }}
                  className="bg-yellow-500 text-white p-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="bg-red-500 text-white p-2"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available for this category.</p>
      )}
    </div>
  );
}
