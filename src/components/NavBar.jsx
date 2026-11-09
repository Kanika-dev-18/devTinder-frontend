import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    }
  };

  return (
    <header className="app-navbar sticky top-0 z-30">
      <div className="navbar app-navbar-inner">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost brand-link">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <span>DevTinder</span>
          </Link>
        </div>
        {user && (
          <div className="flex-none gap-3">
            <div className="nav-user">Welcome, {user.firstName}</div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                aria-label="Open account menu"
                className="btn btn-ghost btn-circle avatar nav-avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Your profile" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content nav-menu z-[1] mt-3 w-56 rounded-2xl p-2 shadow-xl"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Edit profile
                    <span className="badge badge-secondary badge-sm">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
                <li>
                  <Link to="/premium">Premium</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Log out</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default NavBar;