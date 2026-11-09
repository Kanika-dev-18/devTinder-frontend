import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return (
      <section className="page-container">
        <header className="page-heading">
          <p className="page-eyebrow">Your people</p>
          <h1 className="page-title">Connections</h1>
        </header>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">♡</div>
          <h2 className="empty-state-title">Your connections will show up here</h2>
          <p className="mt-2">Start exploring to meet people and build your circle.</p>
        </div>
      </section>
    );

  return (
    <section className="page-container">
      <header className="page-heading">
        <p className="page-eyebrow">Your people</p>
        <h1 className="page-title">Connections</h1>
        <p className="page-description">Keep the conversation going with your community.</p>
      </header>

      <div className="people-list">
      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <div
            key={_id}
            className="person-row"
          >
            <div>
              <img
                alt="photo"
                className="person-photo"
                src={photoUrl}
              />
            </div>
            <div className="min-w-0 text-left">
              <h2 className="person-name">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p className="person-meta">{age} · {gender}</p>}
              {about && <p className="person-about">{about}</p>}
            </div>
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Message</button>
            </Link>
          </div>
        );
      })}
      </div>
    </section>
  );
};
export default Connections;