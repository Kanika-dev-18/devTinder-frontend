import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender?.toLowerCase() || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err) {
      const responseError = err.response?.data;
      setError(
        axios.isAxiosError(err) && !err.response
          ? "Cannot reach the API at http://localhost:3000. Start the backend and check that its database connection succeeds."
          : typeof responseError === "string"
            ? responseError
            : responseError?.message ||
              `Unable to save profile${err.response?.status ? ` (HTTP ${err.response.status})` : ""}. Please try again.`
      );
    }
  };

  return (
    <>
      <section className="page-container">
        <header className="page-heading">
          <p className="page-eyebrow">Make it yours</p>
          <h1 className="page-title">Your profile</h1>
          <p className="page-description">Let people know a little about you.</p>
        </header>
        <div className="profile-layout">
          <div className="card form-card">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit your details</h2>
              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-first-name">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    id="profile-first-name"
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-last-name">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    id="profile-last-name"
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-photo-url">
                    <span className="label-text">Photo URL</span>
                  </label>
                  <input
                    id="profile-photo-url"
                    type="url"
                    value={photoUrl}
                    className="input input-bordered w-full"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-age">
                    <span className="label-text">Age</span>
                  </label>
                  <input
                    id="profile-age"
                    type="number"
                    value={age}
                    className="input input-bordered w-full"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-gender">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    id="profile-gender"
                    value={gender}
                    className="select select-bordered w-full"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label" htmlFor="profile-about">
                    <span className="label-text">About</span>
                  </label>
                  <textarea
                    id="profile-about"
                    value={about}
                    className="textarea textarea-bordered w-full"
                    onChange={(e) => setAbout(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              {error && <div role="alert" className="alert alert-error break-all">{error}</div>}
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
          <UserCard
            user={{ _id: user._id, firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </section>
      {showToast && (
        <div className="toast toast-center profile-toast" role="status" aria-live="polite">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;