// components/Ratings.js
import { useState, useEffect } from 'react';

const Ratings = ({ courseId, totalStars = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    // Load rating from local storage
    const savedRating = localStorage.getItem(`rating-${courseId}`);
    if (savedRating) {
      setRating(parseInt(savedRating, 10));
    }
  }, [courseId]);

  const handleRating = (value) => {
    setRating(value);
    localStorage.setItem(`rating-${courseId}`, value);
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name={`rating-${courseId}`}
              value={ratingValue}
              onClick={() => handleRating(ratingValue)}
              className="hidden"
            />
            <svg
              className={`w-4 h-4 mt-2 cursor-pointer transition duration-200 ${
                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049.536a1 1 0 011.902 0l1.716 5.294a1 1 0 00.95.691h5.6a1 1 0 01.588 1.81l-4.516 3.286a1 1 0 00-.364 1.118l1.716 5.294a1 1 0 01-1.54 1.118L10 13.772l-4.116 2.993a1 1 0 01-1.54-1.118l1.716-5.294a1 1 0 00-.364-1.118L1.178 8.331a1 1 0 01.588-1.81h5.6a1 1 0 00.95-.691L9.049.536z" />
            </svg>
          </label>
        );
      })}
    </div>
  );
};

export default Ratings;
