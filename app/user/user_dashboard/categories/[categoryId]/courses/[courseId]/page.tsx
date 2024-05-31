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
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get<Topic[]>("http://localhost:3030/topics");
        console.log(response.data, "from topics");
        const filteredTopics = response.data.filter(topic => topic.courseId === parseInt(courseId));
        setTopics(filteredTopics);
      } catch (error) {
        console.log(error, "error");
        setTopics([]);
      }
    };

    fetchTopics();
  }, [courseId]);

  return (
    <div className="p-6 min-w-sm">
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
              >
              </iframe>
            </div>
          </div>
        ))
      ) : (
        <p>No course detail yet available</p>
      )}
    </div>
  );
}
