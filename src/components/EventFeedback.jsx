import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, ShieldCheck, Check, Sparkles } from "lucide-react";

export function EventFeedback({
  eventId,
  eventTitle,
  reviews = [],
  currentUser,
  role = "student",
  onSubmitReview
}) {
  const isOrganizer = role === "organizer";

  // Filter reviews for this event
  const eventReviews = reviews.filter((r) => String(r.eventId) === String(eventId));

  // Calculate average
  const totalRating = eventReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const avgRating = eventReviews.length > 0 ? (totalRating / eventReviews.length).toFixed(1) : null;

  // Rating distribution counts (1 to 5)
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = eventReviews.filter((r) => r.rating === stars).length;
    const percent = eventReviews.length > 0 ? Math.round((count / eventReviews.length) * 100) : 0;
    return { stars, count, percent };
  });

  // Current user's existing review
  const myReview = currentUser
    ? eventReviews.find((r) => r.studentEmail === currentUser.email)
    : null;

  const [rating, setRating] = useState(myReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(myReview?.comment || "");
  const [selectedTags, setSelectedTags] = useState(myReview?.tags || ["Well Organized"]);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const sentimentTags = [
    "Well Organized",
    "Inspiring Speakers",
    "Hands-on Practical",
    "Great Networking",
    "Good Refreshments",
    "Fun & Energetic"
  ];

  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function handleVoteHelpful(reviewId) {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatusMessage("");

    if (isOrganizer) {
      setStatusMessage("Club organizers cannot submit student reviews.");
      return;
    }

    if (!currentUser) {
      setStatusMessage("Please sign in with your student account to write a review.");
      return;
    }

    if (!rating) {
      setStatusMessage("Please select a star rating.");
      return;
    }

    if (!comment.trim()) {
      setStatusMessage("Please share your thoughts in the feedback box.");
      return;
    }

    const reviewData = {
      eventId,
      studentName: currentUser.fullName || currentUser.email.split("@")[0],
      studentEmail: currentUser.email,
      department: currentUser.department || "Engineering",
      rating,
      comment: comment.trim(),
      tags: selectedTags,
      updatedAt: new Date().toISOString()
    };

    onSubmitReview(reviewData);
    setStatusMessage(myReview ? "Review updated successfully!" : "Thank you! Your feedback has been published.");
  }

  const ratingLabels = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Very Good!",
    5: "Exceptional Experience!"
  };

  return (
    <section className="event-feedback-modern">
      <div className="feedback-header-box">
        <div className="section-title-wrap">
          <MessageSquare className="title-icon" size={20} />
          <h2>Student Ratings & Reviews</h2>
        </div>
        <p className="section-subtitle">
          Real feedback from students who attended or registered for {eventTitle}.
        </p>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="ratings-breakdown-grid">
        <div className="average-score-card">
          <span className="big-score">{avgRating || "5.0"}</span>
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className="star-gold"
                fill={star <= Math.round(Number(avgRating || 5)) ? "#f59e0b" : "#e2e8f0"}
                color={star <= Math.round(Number(avgRating || 5)) ? "#f59e0b" : "#cbd5e1"}
              />
            ))}
          </div>
          <span className="reviews-total-text">
            Based on {eventReviews.length} verified {eventReviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Rating distribution progress bars */}
        <div className="distribution-card">
          {distribution.map(({ stars, count, percent }) => (
            <div key={stars} className="dist-row">
              <span className="dist-stars-label">
                {stars} <Star size={11} fill="#f59e0b" color="#f59e0b" />
              </span>
              <div className="dist-bar-track">
                <div className="dist-bar-fill" style={{ width: `${percent}%` }} />
              </div>
              <span className="dist-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Form (For Students) */}
      {!isOrganizer ? (
        <div className="write-review-card">
          <div className="write-review-header">
            <h3>{myReview ? "Update Your Review" : "Share Your Experience"}</h3>
            <p>Help other students discover what to expect.</p>
          </div>

          {!currentUser ? (
            <div className="login-to-review-box">
              <p>You need to be signed in as a student to submit a rating and review.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {/* Star Rating Picker */}
              <div className="star-picker-group">
                <label>Your Rating</label>
                <div className="star-picker-buttons" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-pick-btn"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={28}
                        fill={star <= (hoverRating || rating) ? "#f59e0b" : "#e2e8f0"}
                        color={star <= (hoverRating || rating) ? "#f59e0b" : "#cbd5e1"}
                      />
                    </button>
                  ))}
                  <span className="rating-text-label">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Tag Chips */}
              <div className="tag-chips-group">
                <label>Quick Impressions (Select tags)</label>
                <div className="tag-chips-wrap">
                  {sentimentTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`chip-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="form-field full">
                <label>Your Feedback / Takeaways</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What was the highlight? What could the organizing team improve next time?"
                  maxLength={1000}
                  required
                />
                <span className="char-count">{comment.length}/1000 characters</span>
              </div>

              {statusMessage && <div className="feedback-status-banner">{statusMessage}</div>}

              <button type="submit" className="btn-submit-review">
                <span>{myReview ? "Save Changes" : "Post Review"}</span>
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="organizer-notice-pill">
          <ShieldCheck size={16} />
          <span>Organizer View: Feedback analytics are monitored for quality assurance and cannot be modified.</span>
        </div>
      )}

      {/* List of Reviews */}
      <div className="reviews-feed">
        <h3 className="feed-title">All Reviews ({eventReviews.length})</h3>

        {eventReviews.length === 0 ? (
          <div className="empty-reviews-box">
            <Sparkles size={32} className="empty-sparkle" />
            <h4>No reviews yet</h4>
            <p>Be the first student to review this campus event!</p>
          </div>
        ) : (
          eventReviews.map((rev, index) => {
            const revId = `${rev.eventId}-${rev.studentEmail}-${index}`;
            const votes = helpfulVotes[revId] || 0;

            return (
              <div key={revId} className="review-item-card">
                <div className="review-item-top">
                  <div className="reviewer-avatar">
                    {(rev.studentName || "S")[0].toUpperCase()}
                  </div>
                  <div className="reviewer-info">
                    <div className="reviewer-name-row">
                      <strong>{rev.studentName || rev.studentEmail.split("@")[0]}</strong>
                      <span className="verified-badge">
                        <ShieldCheck size={11} /> Verified Attendee
                      </span>
                    </div>
                    <span className="reviewer-dept">{rev.department || "Student"}</span>
                  </div>

                  <div className="review-stars-badge">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= rev.rating ? "#f59e0b" : "#e2e8f0"}
                        color={s <= rev.rating ? "#f59e0b" : "#cbd5e1"}
                      />
                    ))}
                  </div>
                </div>

                <p className="review-comment-text">{rev.comment}</p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="review-tags-row">
                    {rev.tags.map((t) => (
                      <span key={t} className="review-tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="review-item-footer">
                  <span className="review-date">
                    {rev.updatedAt
                      ? new Date(rev.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })
                      : "Recently"}
                  </span>

                  <button
                    type="button"
                    className="btn-helpful"
                    onClick={() => handleVoteHelpful(revId)}
                  >
                    <ThumbsUp size={13} />
                    <span>Helpful {votes > 0 ? `(${votes})` : ""}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
