import { useEffect, useState } from "react";
import "./Header.css";
import HeaderNavButton from "./NavButton";
import HeaderButton from "./HeaderButton";
import "material-icons/iconfont/material-icons.css";
import Logo from "../../images/logo.png";
import ProfileVector from "../../images/default_profile_vector.webp";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthToken, useCurrentUserType } from "../../auth";

function Header() {
  var authToken = useAuthToken();
  var userType = useCurrentUserType();
  const [activePage, setActivePage] = useState(null);
  var location = useLocation();
  var navigate = useNavigate();

  useEffect(() => {
    setActivePage(getPageId(location.pathname));
  }, [location.pathname]);

  function navItemClick(id) {
    navigate(id);
  }

  function onSignUpButtonClick() {
    navigate("/signup");
  }

  function onLoginButtonClick() {
    navigate("/login");
  }

  function onNotificationButtonClick() {
    navigate("/notification");
  }

  function onCartButtonClick() {
    navigate("/cart");
  }

  function onSignOutClick() {
    navigate("/signout");
  }

  function onProfileButtonClick() {
    navigate("/profile");
  }

  return (
    <div className="header">
      <div className="header-top">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="header-right">
          {authToken == null ? (
            <>
              <div className="div-btn" id="login" onClick={onLoginButtonClick}>
                <button className="signin-button">Sign In</button>
              </div>
              <div className="div-btn" id="signup" onClick={onSignUpButtonClick}>
                <button className="signup-button">Sign Up</button>
              </div>
            </>
          ) : (
            <>
              <div className="div-btn" id="signout" onClick={onSignOutClick}>
                <button className="signout-button">Sign Out</button>
              </div>
              <HeaderButton id="notification" activeId={activePage} onClick={onNotificationButtonClick}>
                <span className="material-icons-outlined">notifications</span>
              </HeaderButton>
              <HeaderButton id="cart" activeId={activePage} onClick={onCartButtonClick}>
                <span className="material-icons-outlined">shopping_bag</span>
              </HeaderButton>

              <div className="profile" onClick={onProfileButtonClick}>
                <div className="profile-picture">
                  <img src={ProfileVector} alt="Profile" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="header-nav">
        <HeaderNavButton id="" activeId={activePage} name="Home" onClick={navItemClick} />
        <HeaderNavButton id="create-app" activeId={activePage} name="Create Appointment" onClick={navItemClick} />
        <HeaderNavButton id="my-app" activeId={activePage} name="My Appointments" onClick={navItemClick} />
        <HeaderNavButton id="service" activeId={activePage} name="Our Service" onClick={navItemClick} />
        <HeaderNavButton id="offer" activeId={activePage} name="Offers" onClick={navItemClick} />
        <HeaderNavButton id="store" activeId={activePage} name="Our Store" onClick={navItemClick} />
        <HeaderNavButton id="contact" activeId={activePage} name="Contact Us" onClick={navItemClick} />

        <HeaderNavButton id="recommendation" activeId={activePage} name="Hair Recommendation" onClick={navItemClick} />

        {userType === "employee" && (
          <HeaderNavButton id="leave" activeId={activePage} name="Leave" onClick={navItemClick} />
        )}
      </div>
    </div>
  );
}

function getPageId(path) {
  path = path.substring(1);
  const firstIndex = path.indexOf("/");
  return firstIndex === -1 ? path : path.substring(0, firstIndex);
}

export default Header;
