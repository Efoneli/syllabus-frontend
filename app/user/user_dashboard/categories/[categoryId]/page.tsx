
  'use client';
  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import Link from 'next/link';
  import Image from 'next/image';
  import placeholder from '../../../../assets/placeholder.jpg';
  import { CiCirclePlus } from 'react-icons/ci';
  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { hasPermission } from '../../../../utils';
  import { useParams } from 'next/navigation';

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
    const categoryId = Array.isArray(params.categoryId)
      ? params.categoryId[0]
      : params.categoryId;
    const [category, setCategory] = useState<Category>({
      id: 0,
      name: '',
      courses: [],
    });
    const [newCourse, setNewCourse] = useState<Course>({
      id: 0,
      title: '',
      prerequisites: '',
      imageUrl: '',
      description: '',
      categoryId: parseInt(categoryId),
      courseId: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editCourse, setEditCourse] = useState<Course | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [completedCourses, setCompletedCourses] = useState<number[]>([]);
    const [userEmail, setUserEmail] = useState<string>('');

    useEffect(() => {
      (async () => {
        try {
          const response = await axios.get(
            `http://localhost:3030/categories/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          );
          setCategory(response?.data);

          const res = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          setPermissions(res.data.permissions);
          setUserEmail(res.data.email);
        } catch (error) {
          console.error(error);
        }
      })();
    }, [categoryId]);

    useEffect(() => {
      const fetchCompletedCourses = async () => {
        try {
          const response = await axios.get<number[]>(
            `http://localhost:3030/feedback/completed/${userEmail}`
          );
          console.log('API Response: ', response.data); // Debugging line
          setCompletedCourses(response.data);
        } catch (error) {
          console.error(error, 'Failed to fetch completed courses');
        }
      };

      if (userEmail) {
        fetchCompletedCourses();
      }
    }, [userEmail]);

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      if (isEditing && editCourse) {
        setEditCourse({ ...editCourse, [name]: value });
      } else {
        setNewCourse({ ...newCourse, [name]: value });
      }
    };

    const handleAddCourse = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3030/courses",
          newCourse,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const addedCourse = response.data;
        setCategory((prevCategory: Category) => ({
          ...prevCategory,
          courses: [...prevCategory.courses, addedCourse],
        }));
        setNewCourse({
          id: 0,
          title: "",
          prerequisites: "",
          imageUrl: "",
          description: "",
          categoryId: parseInt(categoryId),
          courseId: 0,
        });
        setShowModal(false);
        toast.success("Course added successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to add course.");
      }
    };

    const handleEditCourse = async () => {
      if (editCourse) {
        try {
          const response = await axios.patch(
            `http://localhost:3030/courses/${editCourse.id}`,
            editCourse,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const updatedCourse = response.data;
          setCategory((prevCategory) => ({
            ...prevCategory,
            courses: prevCategory.courses.map((course) =>
              course.id === updatedCourse.id ? updatedCourse : course
            ),
          }));
          setEditCourse(null);
          setIsEditing(false);
          setShowModal(false);
          toast.success("Course updated successfully!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to update course.");
        }
      }
    };

    const handleDeleteCourse = async (id: number) => {
      try {
        await axios.delete(`http://localhost:3030/courses/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setCategory((prevCategory: Category) => ({
          ...prevCategory,
          courses: prevCategory.courses.filter((course) => course.id !== id),
        }));
        toast.success("Course deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete course.");
      }
    };

    const handleDeleteClick = (courseId: number) => {
      toast.warn(
        <div>
          <p>Do you want to delete this course?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                handleDeleteCourse(courseId);
                toast.dismiss();
              }}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
            >
              No
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        }
      );
    };

    return (
      <div className="bg-white min-h-screen w-full h-full flex flex-col items-center p-4 relative">
        <h2 className="text-2xl font-bold mb-4">Courses for {category?.name}</h2>
        {hasPermission('read:courses') && (
          <button
            className="absolute top-4 right-4 py-1.5 px-3 rounded"
            onClick={() => setShowModal(true)}
          >
            <span className="text-4xl text-gray-900">
              <CiCirclePlus />
            </span>
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 sm:p-6">
            <div className="bg-white p-4 sm:p-6 flex flex-col rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                {isEditing ? 'Edit Course' : 'Add New Course'}
              </h2>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={
                  isEditing && editCourse ? editCourse.title : newCourse.title
                }
                onChange={handleInputChange}
                className="mb-3 p-2 border rounded text-gray-800"
              />
              <input
                type="text"
                name="prerequisites"
                placeholder="Prerequisites"
                value={
                  isEditing && editCourse
                    ? editCourse.prerequisites
                    : newCourse.prerequisites
                }
                onChange={handleInputChange}
                className="mb-3 p-2 border rounded text-gray-800"
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={
                  isEditing && editCourse
                    ? editCourse.imageUrl
                    : newCourse.imageUrl
                }
                onChange={handleInputChange}
                className="mb-3 p-2 border rounded text-gray-800"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={
                  isEditing && editCourse
                    ? editCourse.description
                    : newCourse.description
                }
                onChange={handleInputChange}
                className="mb-4 p-2 border rounded text-gray-800"
              ></textarea>
              <div className="flex justify-between">
                <button
                  onClick={isEditing ? handleEditCourse : handleAddCourse}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {isEditing ? 'Update Course' : 'Add Course'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {category?.courses?.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category?.courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                completedCourses={completedCourses}
                setIsEditing={setIsEditing}
                setEditCourse={setEditCourse}
                setShowModal={setShowModal}
                handleDeleteCourse={handleDeleteCourse}
              />
            ))}
          </ul>
        ) : (
          <p>No courses available for this category.</p>
        )}
      </div>
    );
  }

  const CourseCard = ({
    course,
    completedCourses,
    setIsEditing,
    setEditCourse,
    setShowModal,
    handleDeleteCourse,
  }: {
    course: Course;
    completedCourses: number[];
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setEditCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteCourse: (id: number) => void;
  }) => {
    return (
      <li className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between">
        <Link href={`/user/user_dashboard/categories/${course.categoryId}/courses/${course.id}`} passHref>
          <Image
            width={200}
            height={100}
            src={course.imageUrl || placeholder}
            alt={course.title}
            className="w-full h-[200px] object-cover"
          />
          <div>
            <h3 className="text-gray-800 text-xl font-semibold mt-2 capitalize">
              {course.title}
            </h3>
            <p className="text-gray-700 mt-1">{course.description}</p>
            <p className="text-gray-500 mt-1">
              Prerequisites: {course.prerequisites}
            </p>
          </div>
        </Link>
        <div className='flex justify-between'>
        <div className="mt-4 flex justify-end space-x-2">
          
        {completedCourses.includes(course.id) && !hasPermission("read:courses") && (
            <span className="bg-green-800 text-white p-2 rounded">Done🎉</span>
          )}
      </div>

      <div className="mt-4">
        {hasPermission('read:courses') && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditCourse(course);
              setShowModal(true);
            }}
            className="bg-yellow-500 text-white p-2 mr-2 rounded"
          >
            Edit
          </button>
        )}
        {hasPermission('read:courses') && (
          <button
            onClick={() => handleDeleteCourse(course.id)}
            className="bg-red-500 text-white p-2 rounded"
          >
            Delete
          </button>
        )}
      </div>
    
      </div>
    </li>
  );
};
