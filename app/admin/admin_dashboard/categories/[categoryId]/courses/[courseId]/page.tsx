"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Topic {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  docsUrl: string;
  courseId: number;
  videoUrl: string;
}

export default function CourseDetail() {
  const params = useParams();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState<Topic>({ id: 0, title: '', content: '', imageUrl: '', docsUrl: '', courseId: parseInt(params.courseId), videoUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get<Topic[]>("http://localhost:3030/topics");
        const filteredTopics = response.data.filter(topic => topic.courseId === parseInt(params.courseId));
        setTopics(filteredTopics);
      } catch (error) {
        console.log(error, "error");
        setTopics([]);
      }
    };

    fetchTopics();
  }, [params.courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing && editTopic) {
      setEditTopic({ ...editTopic, [name]: value });
    } else {
      setNewTopic({ ...newTopic, [name]: value });
    }
  };

  const handleAddTopic = async () => {
    try {
      const response = await axios.post("http://localhost:3030/topics", newTopic);
      setTopics([...topics, response.data]);
      setNewTopic({ id: 0, title: '', content: '', imageUrl: '', docsUrl: '', courseId: parseInt(params.courseId), videoUrl: '' });
      setShowModal(false); // Close the modal after adding the topic
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEditTopic = async () => {
    if (editTopic) {
      try {
        await axios.put(`http://localhost:3030/topics/${editTopic.id}`, editTopic);
        setTopics(topics.map(topic => (topic.id === editTopic.id ? editTopic : topic)));
        setEditTopic(null);
        setIsEditing(false);
        setShowModal(false); // Close the modal after editing the topic
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const handleDeleteTopic = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3030/topics/${id}`);
      setTopics(topics.filter(topic => topic.id !== id));
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <div className="p-6 min-w-sm relative">
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white py-1.5 px-3 rounded"
        onClick={() => setShowModal(true)}
      >
        <span className="text-xl">+</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 flex flex-col rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{isEditing ? 'Edit Topic' : 'Add New Topic'}</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={isEditing && editTopic ? editTopic.title : newTopic.title}
              onChange={handleInputChange}
              className="mb-2 p-2 border text-gray-800"
            />
            <input
              type="text"
              name="content"
              placeholder="Content"
              value={isEditing && editTopic ? editTopic.content : newTopic.content}
              onChange={handleInputChange}
              className="mb-2 p-2 border text-gray-800"
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={isEditing && editTopic ? editTopic.imageUrl : newTopic.imageUrl}
              onChange={handleInputChange}
              className="mb-2 p-2 border text-gray-800"
            />
            <input
              type="text"
              name="docsUrl"
              placeholder="Docs URL"
              value={isEditing && editTopic ? editTopic.docsUrl : newTopic.docsUrl}
              onChange={handleInputChange}
              className="mb-2 p-2 border text-gray-800"
            />
            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={isEditing && editTopic ? editTopic.videoUrl : newTopic.videoUrl}
              onChange={handleInputChange}
              className="mb-2 p-2 border text-gray-800"
            />
            <button
              onClick={isEditing ? handleEditTopic : handleAddTopic}
              className="bg-blue-500 text-white p-2 mr-2"
            >
              {isEditing ? 'Update Topic' : 'Add Topic'}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white p-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {topics.length > 0 ? (
        topics.map((topic) => (
          <div key={topic.id} className="mb-6 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-semibold mb-2">{topic.title}</h2>
            <Image
              width={200}
              height={150}
              src={topic.imageUrl}
              alt={topic.title}
              className=""
            />
            <p className="">{topic.content}</p>
            <div className="mt-4">
              <a
                href={topic.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold hover:underline"
              >
                {topic.docsUrl}
              </a>
              <br />
              <iframe
                src={`https://www.youtube.com/embed/${new URL(topic.videoUrl).searchParams.get("v")}`}
                width={500}
                height={300}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="mt-2"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditTopic(topic);
                  setShowModal(true); // Show the modal when editing
                }}
                className="bg-yellow-500 text-white p-2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No topics available</p>
      )}
    </div>
  );
}
