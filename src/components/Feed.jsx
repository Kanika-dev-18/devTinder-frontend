import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const pageCount = feed ? Math.ceil(feed.length / pageSize) : 0;

  useEffect(() => {
    if (pageCount > 0 && currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

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

  const startIndex = (currentPage - 1) * pageSize;
  const visibleUsers = feed.slice(startIndex, startIndex + pageSize);

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
        Showing {startIndex + 1}–{startIndex + visibleUsers.length} of {feed.length} people
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
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </button>
          <span className="feed-page-number" aria-current="page">
            Page {currentPage} of {pageCount}
          </span>
          <button
            className="btn btn-primary"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
};
export default Feed;