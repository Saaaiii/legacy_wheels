import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  isLoggedIn,
  logoutUser
} from "../../services/authService"


function Navbar() {

  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(
    isLoggedIn()
  )


  const handleLogout = () => {

    logoutUser()

    setLoggedIn(false)

    navigate("/")

  }


  return (

    <header className="navbar">

      <div
        className="logo"
        onClick={() => navigate("/")}
      >
        LEGACY <span>WHEELS</span>
      </div>


      <nav className="navbar-links">

        <button
          onClick={() => navigate("/cars")}
        >
          Browse Cars
        </button>


        <button
          onClick={() => {

            if (loggedIn) {
              navigate("/sell")
            } else {
              navigate("/login")
            }

          }}
        >
          Sell Your Car
        </button>


        <button
          onClick={() => {

            if (loggedIn) {
              navigate("/favorites")
            } else {
              navigate("/login")
            }

          }}
        >
          Favorites
        </button>


        <button
          onClick={() => {

            if (loggedIn) {
              navigate("/profile")
            } else {
              navigate("/login")
            }

          }}
        >
          Profile
        </button>


        {loggedIn ? (

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        ) : (

          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        )}

      </nav>

    </header>

  )
}

export default Navbar