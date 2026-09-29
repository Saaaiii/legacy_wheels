import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../../components/layout/Navbar"
import CarCard from "../../components/car/CarCard"

import { getFavorites } from "../../services/favoriteService"


function Favorites() {

  const navigate = useNavigate()

  const [favorites, setFavorites] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  useEffect(() => {

    const loadFavorites = async () => {

      const token =
        localStorage.getItem("access_token")

      if (!token) {

        navigate("/login")

        return

      }


      try {

        const data =
          await getFavorites()

        setFavorites(data)

      } catch (error) {

        console.error(error)

        setError(
          error.message ||
          "Failed to load favorites."
        )

      } finally {

        setLoading(false)

      }

    }


    loadFavorites()

  }, [navigate])


  return (

    <div className="favorites-page">

      <Navbar />


      <main className="favorites-content">

        <section className="favorites-header">

          <p className="favorites-label">
            LEGACY WHEELS
          </p>


          <h1>
            Your
            <br />
            Favorites.
          </h1>


          <p>
            Cars you've saved for later.
          </p>

        </section>


        <section className="favorites-list">


          {loading && (

            <p className="favorites-message">
              Loading favorites...
            </p>

          )}


          {error && (

            <p className="favorites-error">
              {error}
            </p>

          )}


          {!loading && !error && (

            <>

              <div className="favorites-count">

                {favorites.length} saved car
                {favorites.length !== 1 && "s"}

              </div>


              {favorites.length === 0 ? (

                <div className="favorites-empty">

                  <div className="favorites-empty-icon">
                    ♡
                  </div>


                  <h2>
                    No favorites yet
                  </h2>


                  <p>
                    Save cars you like and
                    find them here later.
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      navigate("/cars")
                    }
                  >
                    BROWSE CARS
                  </button>

                </div>

              ) : (

                <div className="car-grid">

                  {favorites.map(
                    (favorite) => (

                      <CarCard
                        key={favorite.id}
                        car={favorite.car}
                      />

                    )
                  )}

                </div>

              )}

            </>

          )}

        </section>

      </main>

    </div>

  )

}


export default Favorites

