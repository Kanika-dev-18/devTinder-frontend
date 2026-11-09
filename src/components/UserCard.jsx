import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="card feed-card">
      <figure>
        <img className="user-card-photo" src={photoUrl} alt={`${firstName} ${lastName}`} />
      </figure>
      <div className="card-body">
        <div>
          <h2 className="user-card-name">{firstName} {lastName}</h2>
          {age && gender && <p className="user-card-details">{age} · {gender}</p>}
        </div>
        {about && <p className="user-card-about">{about}</p>}
        {_id && (
          <div className="card-actions">
            <button
              className="btn btn-ghost border border-slate-500/30"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserCard;