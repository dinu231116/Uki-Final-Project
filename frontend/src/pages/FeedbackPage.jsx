import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FeedbackPage = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send feedback to backend API
      await axios.post(`/api/orders/${orderId}/feedback`, {
        rating,
        comment,
      });

      alert("Feedback successfully submitted. Thank you!");
      navigate("/"); // Redirect to home page after submission
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Feedback for Order {orderId}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>

        <br />
        <br />

        <label>
          Comment:
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={5}
            cols={50}
            placeholder="Write your feedback here..."
          />
        </label>

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
