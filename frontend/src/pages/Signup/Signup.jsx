import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { registerUser } from "../../services/authService"


function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })

  }


  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")
    setLoading(true)

    try {

      await registerUser(formData)

      navigate("/login")

    } catch (error) {

      setError(error.message)

    } finally {

      setLoading(false)

    }

  }


  return (
    <form onSubmit={handleSubmit}>

      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <input
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirm_password}
        onChange={handleChange}
      />

      {error && (
        <p>{error}</p>
      )}

      <button type="submit">
        {loading ? "Creating Account..." : "Create Account"}
      </button>

    </form>
  )
}

export default Signup