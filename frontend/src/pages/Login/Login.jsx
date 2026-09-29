import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { loginUser } from "../../services/authService"


function Login() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")
    setLoading(true)

    try {

      const data = await loginUser({
        username,
        password,
      })


      localStorage.setItem(
        "access_token",
        data.access
      )

      localStorage.setItem(
        "refresh_token",
        data.refresh
      )


      navigate("/cars")

    } catch (error) {

      setError(error.message)

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="login-page">

      <div className="login-box">

        <p className="login-label">
          LEGACY WHEELS
        </p>

        <h1>
          Welcome
          <br />
          Back.
        </h1>

        <p className="login-description">
          Login to continue to Legacy Wheels.
        </p>


        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button type="submit">
            {loading
              ? "Logging in..."
              : "LOGIN"
            }
          </button>

        </form>


        <p className="login-signup">

          Don't have an account?

          <button
            type="button"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>

        </p>

      </div>

    </div>

  )
}

export default Login