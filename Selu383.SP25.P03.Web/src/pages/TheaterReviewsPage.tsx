import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { ReviewDto } from "../Data/ReviewInterface";

const TheaterReviewsPage = () => {
  const { id: theaterId } = useParams();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fake review data
  const initialData: Record<string, ReviewDto[]> = {
    "1": [
      {
        id: 1,
        review: "Amazing Dolby Atmos experience. The seats were so comfy!",
        rating: 5,
        user: { id: 1, userName: "alice" },
        theater: { id: 1, name: "New Orleans", address: "123 Canal St" }
      },
      {
        id: 2,
        review: "Snacks were overpriced but overall great vibe.",
        rating: 4,
        user: { id: 2, userName: "bob" },
        theater: { id: 1, name: "New Orleans", address: "123 Canal St" }
      },
      {
        id: 3,
        review: "Sound was insane 🔊",
        rating: 5,
        user: { id: 3, userName: "jay" },
        theater: { id: 1, name: "New Orleans", address: "123 Canal St" }
      }
    ],
    "2": [
      {
        id: 4,
        review: "Good local theater. Clean seats, friendly staff.",
        rating: 4,
        user: { id: 4, userName: "sarah" },
        theater: { id: 2, name: "Hammond", address: "456 University Ave" }
      },
      {
        id: 5,
        review: "Could use some better lighting, but sound was crisp.",
        rating: 3,
        user: { id: 5, userName: "mike" },
        theater: { id: 2, name: "Hammond", address: "456 University Ave" }
      },
      {
        id: 6,
        review: "Great spot for Friday night shows.",
        rating: 5,
        user: { id: 6, userName: "lucy" },
        theater: { id: 2, name: "Hammond", address: "456 University Ave" }
      }
    ],
    "3": [
      {
        id: 7,
        review: "Classic theater vibes. Popcorn was perfect 🍿",
        rating: 5,
        user: { id: 7, userName: "tony" },
        theater: { id: 3, name: "Baton Rouge", address: "789 Government St" }
      },
      {
        id: 8,
        review: "Seats were a bit stiff. Bring a cushion 😅",
        rating: 3,
        user: { id: 8, userName: "ella" },
        theater: { id: 3, name: "Baton Rouge", address: "789 Government St" }
      },
      {
        id: 9,
        review: "Would definitely come back. Clean and quick service!",
        rating: 4,
        user: { id: 9, userName: "kevin" },
        theater: { id: 3, name: "Baton Rouge", address: "789 Government St" }
      }
    ]
  };

  // Shuffle helper
  const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!theaterId) return;

    const data = initialData[theaterId];
    if (data) {
      setReviews(shuffle(data));
    } else {
      setReviews([]);
    }
    setLoading(false);
  }, [theaterId]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleReviewSubmit = () => {
    if (!newReview || newRating === 0) return;

    const newEntry: ReviewDto = {
      id: Date.now(),
      review: newReview,
      rating: newRating,
      user: { id: 999, userName: "guest_user" },
      theater: { id: Number(theaterId), name: "Guest Theater", address: "N/A" }
    };

    setReviews([newEntry, ...reviews]);
    setNewReview("");
    setNewRating(0);
    setHoveredRating(0);
  };

  if (loading) return <div className="text-center text-white p-10">Loading reviews...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">📝 Theater Reviews</h1>

      <div className="text-center text-yellow-400 text-xl mb-8">
        ⭐ Average Rating: {averageRating} / 5
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mb-10 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 resize-none mb-4"
        />

        <div className="flex gap-2 mb-4 text-yellow-400 text-xl">
          {[...Array(5)].map((_, i) => {
            const star = i + 1;
            return (
              <FaStar
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setNewRating(star)}
                className={`cursor-pointer transition ${
                  star <= (hoveredRating || newRating) ? "text-yellow-400" : "text-gray-600"
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleReviewSubmit}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md text-white transition"
        >
          Submit
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews yet for this theater.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaUserCircle className="text-3xl text-gray-400" />
                <h3 className="text-lg font-semibold">
                  {review.user?.userName || "Anonymous"}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-300">{review.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheaterReviewsPage;
