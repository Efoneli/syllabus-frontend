// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { useParams } from "next/navigation";

// interface Topic {
//   id: number;
//   title: string;
//   content: string;
//   imageUrl: string;
//   docsUrl: string;
//   courseId: number;
//   videoUrl: string;
// }

// export default function CourseDetail() {
//   const params = useParams();
//   const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
//   const [topics, setTopics] = useState<Topic[]>([]);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const response = await axios.get<Topic[]>("http://localhost:3030/topics");
//         console.log(response.data, "from topics");
//         const filteredTopics = response.data.filter(topic => topic.courseId === parseInt(courseId));
//         setTopics(filteredTopics);
//       } catch (error) {
//         console.log(error, "error");
//         setTopics([]);
//       }
//     };

//     fetchTopics();
//   }, [courseId]);

//   return (
//     <div className="p-6 min-w-sm bg-gray-900">
//       {topics.length > 0 ? (
//         topics.map((topic) => (
//           <div key={topic.id} className="mb-6 flex flex-col items-center justify-center">
//             <h2 className="text-3xl font-semibold mb-2">{topic.title}</h2>
//             <Image
//               width={200}
//               height={150}
//               src={topic.imageUrl}
//               alt={topic.title}
//               className=""
//             />
//             <p className="">{topic.content}</p>
//             <div className="mt-4">
//               <a
//                 href={topic.docsUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 font-semibold hover:underline"
//               >
//                 {topic.docsUrl}
//               </a>
//               <br />
//               <iframe
//                 src={`https://www.youtube.com/embed/${new URL(topic.videoUrl).searchParams.get("v")}`}
//                 width={500}
//                 height={300}
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 className="mt-2"
//                 allowFullScreen
//               >
//               </iframe>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No course detail yet available</p>
//       )}
//     </div>
//   );
// }




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

export default function CourseDetail() {
  const params = useParams();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;
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

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get<Topic[]>(
          "http://localhost:3030/topics",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
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
      const response = await axios.post(
        "http://localhost:3030/topics",
        newTopic,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
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
        const response = await axios.patch(
          `http://localhost:3030/topics/${editTopic.id}`,
          editTopic,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const updatedTopic = response.data;
        setTopics(topics.map(topic => {
          if(topic.id === updatedTopic.id) {
            return updatedTopic;
          }
          return topic;
        }));
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
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div className="p-6 min-w-sm relative bg-gray-900">
      {hasPermission("read:topics") && (
        <button
          className="absolute top-4 right-4 py-1.5 px-3 rounded"
          onClick={() => setShowModal(true)}
        >
          <span className="text-4xl">
            <CiCirclePlus />
          </span>
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 sm:p-6">
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
              className="mb-3 p-2 border rounded text-gray-800"
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={isEditing && editTopic ? editTopic.imageUrl : newTopic.imageUrl}
              onChange={handleInputChange}
              className="mb-3 p-2 border rounded text-gray-800"
            />
            <input
              type="text"
              name="docsUrl"
              placeholder="Docs URL"
              value={isEditing && editTopic ? editTopic.docsUrl : newTopic.docsUrl}
              onChange={handleInputChange}
              className="mb-3 p-2 border rounded text-gray-800"
            />
            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={isEditing && editTopic ? editTopic.videoUrl || '' : newTopic.videoUrl || ''}
              onChange={handleInputChange}
              className="mb-4 p-2 border rounded text-gray-800"
            />
            <textarea
              type="text"
              name="content"
              placeholder="Content"
              value={isEditing && editTopic ? editTopic.content : newTopic.content}
              onChange={handleInputChange}
              className="mb-3 p-2 border rounded text-gray-800"
            ></textarea>
            <div className="flex justify-between">
              <button
                onClick={isEditing ? handleEditTopic : handleAddTopic}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {isEditing ? "Update Topic" : "Add Topic"}
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

      {topics.length > 0 ? (
      topics.map((topic) => (
        <div
          key={topic.id}
          className="min-w-smz mb-6 flex flex-col items-start justify-start mx-auto"
        >
          <h2 className="text-3xl font-semibold mb-2 text-center">{topic.title}</h2>
          <div className="flex flex-col md:flex-row-reverse justify-center">
          <Image
  width={300}
  height={400}
  src={topic.imageUrl}
  alt={topic.title}
  className="object-cover w-full  rounded-sm mb-5 border md:ml-6"
/>

            <p className="text-justify mr-6">{topic.content}</p>
          </div>
          <div className="mt-4">
            <p className="my-3 mb-4">View {topic.title} Documentation here:👇</p>
            <a
              href={topic.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 text-blue-500 font-semibold hover:underline"
            >
              {topic.docsUrl}
            </a>
            <br />
            {topic.videoUrl && (
              <div className="relative min-w-screen" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeVideoID(topic.videoUrl)}`}
                  className="absolute top-0 left-0 min-w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          <div className="mt-4">
            {hasPermission("read:topics") && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditTopic(topic);
                  setShowModal(true);
                }}
                className="bg-yellow-500 text-white p-2 mr-2"
              >
                Edit
              </button>
            )}
            {hasPermission("read:topics") && (
              <button
                onClick={() => handleDeleteTopic(topic.id)}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))
      
      ) : (
        <p>No topics available</p>
      )}
    </div>
  );
}
