
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { hasPermission } from "../../../../../../utils";
import { CiCirclePlus } from "react-icons/ci";

interface Topic {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  docsUrl: string;
  courseId: number;
  videoUrl?: string;
}

interface Feedback {
  email: string;
  courseId: number;
  feedback: string;
}

export default function CourseDetail() {
  const params = useParams();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState<Topic>({
    id: 0,
    title: "",
    content: "",
    imageUrl: "",
    docsUrl: "",
    courseId: parseInt(courseId, 10),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [email, setemail] = useState<string>("");
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setemail(response.data.email);
      } catch (error) {
        console.log(error, "error");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get<Topic[]>("http://localhost:3030/topics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const filteredTopics = response.data.filter(
          (topic) => topic.courseId === parseInt(courseId, 10)
        );
        setTopics(filteredTopics);
      } catch (error) {
        console.log(error, "error");
        setTopics([]);
      }
    };

    fetchTopics();
  }, [courseId]);

  useEffect(() => {
    const savedCompletedTopics = localStorage.getItem(`completedTopics_${courseId}`);
    if (savedCompletedTopics) {
      setCompletedTopics(JSON.parse(savedCompletedTopics));
    }
  }, [courseId]);

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
      const response = await axios.post("http://localhost:3030/topics", newTopic, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTopics([...topics, response.data]);
      setNewTopic({
        id: 0,
        title: "",
        content: "",
        imageUrl: "",
        docsUrl: "",
        courseId: parseInt(courseId, 10),
      });
      setShowModal(false); // Close the modal after adding the topic
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleEditTopic = async () => {
    if (editTopic) {
      try {
        const response = await axios.patch(`http://localhost:3030/topics/${editTopic.id}`, editTopic, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const updatedTopic = response.data;
        setTopics(
          topics.map((topic) => {
            if (topic.id === updatedTopic.id) {
              return updatedTopic;
            }
            return topic;
          })
        );
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
      setTopics(topics.filter((topic) => topic.id !== id));
    } catch (error) {
      console.log(error, "error");
    }
  };

  const extractYouTubeVideoID = (url?: string) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (completedTopics.length !== topics.length) {
      alert("Please complete all topics before submitting feedback.");
      return;
    }
    
    const feedbackData: Feedback = {
      email: email,
      courseId: parseInt(courseId, 10),
      feedback: feedback,
    };
    try {
      await axios.post("http://localhost:3030/feedback", feedbackData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCourseCompleted(true);
      setFeedback("");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleCompleteTopic = (topicId: number) => {
    const updatedCompletedTopics = [...completedTopics, topicId];
    setCompletedTopics(updatedCompletedTopics);
    localStorage.setItem(`completedTopics_${courseId}`, JSON.stringify(updatedCompletedTopics));
  };

  return (
    <div className="p-6 min-w-lg min-h-screen relative ">
      <div className='w-[50%] shadow-lg shadow-black rounded-lg p-3'>
        {hasPermission("read:topics") && (
          <button className="absolute top-4 right-4 py-1.5 px-3 rounded" onClick={() => setShowModal(true)}>
            <span className="text-4xl">
              <CiCirclePlus />
            </span>
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 sm:p-6">
            <div className="bg-white p-4 sm:p-6 flex flex-col rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                {isEditing ? "Edit Topic" : "Add New Topic"}
              </h2>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={isEditing && editTopic ? editTopic.title : newTopic.title}
                onChange={handleInputChange}
                className="mb-4 px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="content"
                placeholder="Content"
                value={isEditing && editTopic ? editTopic.content : newTopic.content}
                onChange={handleInputChange}
                className="mb-4 px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={isEditing && editTopic ? editTopic.imageUrl : newTopic.imageUrl}
                onChange={handleInputChange}
                className="mb-4 px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="docsUrl"
                placeholder="Document URL"
                value={isEditing && editTopic ? editTopic.docsUrl : newTopic.docsUrl}
                onChange={handleInputChange}
                className="mb-4 px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL"
                value={isEditing && editTopic ? editTopic.videoUrl : newTopic.videoUrl}
                onChange={handleInputChange}
                className="mb-4 px-4 py-2 border rounded"
              />
              <div className="flex justify-center">
                {isEditing ? (
                  <button
                    onClick={handleEditTopic}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleAddTopic}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Add Topic
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setEditTopic(null);
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded ml-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 w-[50%]">
        {topics.map((topic) => (
          <div key={topic.id} className="border p-4 rounded-lg shadow-lg shadow-black">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <div>
                {!hasPermission("read:topics") && (
                <button onClick={() => handleCompleteTopic(topic.id)} className="text-green-500">
                  {completedTopics.includes(topic.id) ? "Completed" : "Mark as Completed"}
                </button>
                )}
                {/* <button onClick={() => handleCompleteTopic(topic.id)} className="text-green-500">
                  {completedTopics.includes(topic.id) ? "Completed" : "Mark as Completed"}
                </button> */}
                {hasPermission("read:topics") && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditTopic(topic);
                      setShowModal(true);
                    }}
                    className="ml-2 text-blue-500"
                  >
                    Edit
                  </button>
                )}
                {hasPermission("read:topics") && (
                  <button onClick={() => handleDeleteTopic(topic.id)} className="ml-2 text-red-500">
                    Delete
                  </button>
                )}
              </div>
            </div>
            {topic.imageUrl && (
              <div className="relative mb-4" style={{ paddingBottom: "56.25%" }}>
                <Image src={topic.imageUrl} alt={topic.title} layout="fill" objectFit="contain" />
              </div>
            )}
            {topic.videoUrl && (
              <div className="relative mb-4" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  title={topic.title}
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoID(topic.videoUrl)}`}
                  frameBorder="0"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
            )}
            <p>{topic.content}</p>
            {topic.docsUrl && (
              <a href={topic.docsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 inline-block">
                View Document
              </a>
            )}
          </div>
        ))}
      </div>


      {!hasPermission("read:topics") && !courseCompleted && (
        <div className='w-[100%]  bg-gray-800'>
      <div className="w-[50%] flex flex-col shadow-lg shadow-black my-6 mb-12 p-3 absolute left-0">
        <h3 className="text-lg font-semibold mb-2">Provide Your Feedback</h3>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          className="border rounded p-2 mb-2 text-black"
          rows={4}
        />
        <button
          onClick={handleSubmitFeedback}
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={completedTopics.length !== topics.length}
        >
          Submit Feedback
        </button>
        
        {courseCompleted && (
          <div className="mt-4 p-2 bg-green-500 text-white rounded">
            <p>Thank you for completing the course and providing your feedback!</p>
          </div>
        )}
      </div>
      </div>

      )}
    </div>
  );
}
