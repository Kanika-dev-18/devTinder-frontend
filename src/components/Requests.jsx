import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return (
      <section className="page-container">
        <header className="page-heading">
          <p className="page-eyebrow">Good things start with a hello</p>
          <h1 className="page-title">Connection requests</h1>
        </header>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">✉</div>
          <h2 className="empty-state-title">No requests just yet</h2>
          <p className="mt-2">When someone wants to connect, you’ll find them here.</p>
        </div>
      </section>
    );

  return (
    <section className="page-container">
      <header className="page-heading">
        <p className="page-eyebrow">Good things start with a hello</p>
        <h1 className="page-title">Connection requests</h1>
        <p className="page-description">
          People who would like to connect with you.
        </p>
      </header>

      <div className="people-list">
        {requests.map((request) => {
          const sender =
            request.fromUserId && typeof request.fromUserId === "object"
              ? request.fromUserId
              : null;
          const {
            firstName = "New",
            lastName = "connection",
            photoUrl,
            age,
            gender,
            about,
          } = sender || {};
          const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

          return (
            <article key={request._id} className="person-row">
              {photoUrl ? (
                <img
                  alt={`${firstName} ${lastName}`}
                  className="person-photo"
                  src={photoUrl}
                />
              ) : (
                <div className="avatar placeholder">
                  <div className="person-photo grid place-items-center bg-primary/20 text-lg font-bold text-primary-content">
                    <span>{initials}</span>
                  </div>
                </div>
              )}
              <div className="min-w-0 text-left">
                <h2 className="person-name">{firstName} {lastName}</h2>
                {age && gender && <p className="person-meta">{age} · {gender}</p>}
                {about && <p className="person-about">{about}</p>}
              </div>
              <div className="person-actions">
                <button
                  className="btn btn-ghost border border-slate-500/30"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
export default Requests;