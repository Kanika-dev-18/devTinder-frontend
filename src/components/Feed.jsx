import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const requestFeed = () =>
  axios.get(BASE_URL + "/feed", {
    withCredentials: true,
  });

const reportFeedError = (error, setFeedError) => {
  console.error("Unable to load feed:", error);
  setFeedError(
    error.response?.status === 401
      ? "Please log in to discover people."
      : error.response?.status === 503
        ? "The backend service is temporarily unavailable. Please try again later."
        : "We couldn’t load people right now. Check your connection and try again."
  );
};

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [feedError, setFeedError] = useState("");
  const pageSize = 9;

  useEffect(() => {
    if (feed) return;

    requestFeed()
      .then((res) => {
        if (!Array.isArray(res?.data?.data)) {
          throw new Error("The feed response did not contain a user list.");
        }
        dispatch(addFeed(res.data.data));
      })
      .catch((err) => reportFeedError(err, setFeedError));
  }, [dispatch, feed]);

  const retryFeed = () => {
    setFeedError("");
    requestFeed()
      .then((res) => {
        if (!Array.isArray(res?.data?.data)) {
          throw new Error("The feed response did not contain a user list.");
        }
        dispatch(addFeed(res.data.data));
      })
      .catch((err) => reportFeedError(err, setFeedError));
  };

  const pageCount = feed ? Math.ceil(feed.length / pageSize) : 0;
  const activePage = Math.min(currentPage, Math.max(pageCount, 1));

  if (!feed && feedError)
    return (
      <section className="page-container">
        <div className="empty-state" role="alert">
          <h1 className="empty-state-title">Feed unavailable</h1>
          <p className="mt-2">{feedError}</p>
          <button className="btn btn-primary mt-5" onClick={retryFeed}>
            Try again
          </button>
        </div>
      </section>
    );

  if (!feed)
    return (
      <section className="page-container">
        <div className="empty-state" role="status">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4">Finding your next connection…</p>
        </div>
      </section>
    );

  if (feed.length <= 0)
    return (
      <section className="page-container">
        <div className="page-heading">
          <p className="page-eyebrow">Your community</p>
          <h1 className="page-title">Discover people</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">✦</div>
          <h2 className="empty-state-title">You’re all caught up</h2>
          <p className="mt-2">There are no new people to discover right now. Check back soon.</p>
        </div>
      </section>
    );

  const visibleStartIndex = (activePage - 1) * pageSize;
  const visibleUsers = feed.slice(visibleStartIndex, visibleStartIndex + pageSize);

  return (
    <section className="page-container feed-page">
      <div className="page-heading">
        <p className="page-eyebrow">A good connection starts here</p>
        <h1 className="page-title">Meet someone new</h1>
        <p className="page-description">
          Discover people in your community and see where a conversation takes you.
        </p>
      </div>
      <p className="feed-count">
        Showing {visibleStartIndex + 1}–{visibleStartIndex + visibleUsers.length} of {feed.length} people
      </p>
      <div className="feed-grid">
        {visibleUsers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="feed-pagination" aria-label="Feed pages">
          <button
            className="btn btn-ghost"
            disabled={activePage === 1}
            onClick={() => setCurrentPage(activePage - 1)}
          >
            Previous
          </button>
          <span className="feed-page-number" aria-current="page">
            Page {activePage} of {pageCount}
          </span>
          <button
            className="btn btn-primary"
            disabled={activePage === pageCount}
            onClick={() => setCurrentPage(activePage + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
};
export default Feed;