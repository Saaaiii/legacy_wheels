import { useNavigate } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">

      <Navbar />

      <main className="hero">

        <div className="hero-content">

          <p className="hero-label">
            LEGACY WHEELS
          </p>

          <h1>
            Find Your
            <br />
            Next Car
          </h1>

          <p className="hero-description">
            Quality used cars, made simple.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/cars")}
          >
            LET'S GO
          </button>

        </div>

      </main>

    </div>
  )
}

export default Landing