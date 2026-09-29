import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../../services/favoriteService"


function CarCard({ car }) {

  const navigate = useNavigate()

  const [isFavorite, setIsFavorite] = useState(false)

  const [favoriteLoading, setFavoriteLoading] =
    useState(false)


  const primaryImage =
  car.images?.find(
    (image) => image.is_primary
  )?.image ||
  car.images?.[0]?.image ||
  null


  /*
   * Check whether this car is already
   * in the user's favorites.
   */
  useEffect(() => {

    const checkFavorite = async () => {

      const token =
        localStorage.getItem("access_token")

      if (!token) {
        return
      }


      try {

        const favorites =
          await getFavorites()


        const alreadyFavorite =
          favorites.some(
            (favorite) =>
              favorite.car.id === car.id
          )


        setIsFavorite(alreadyFavorite)

      } catch (error) {

        console.error(
          "Failed to check favorite:",
          error
        )

      }

    }


    checkFavorite()

  }, [car.id])


  /*
   * Add or remove this car
   * from the user's favorites.
   */
  const handleFavorite = async (
    event
  ) => {

    event.stopPropagation()


    const token =
      localStorage.getItem("access_token")


    if (!token) {

      navigate("/login")

      return

    }


    if (favoriteLoading) {
      return
    }


    try {

      setFavoriteLoading(true)


      if (isFavorite) {

        await removeFavorite(
          car.id
        )

        setIsFavorite(false)

      } else {

        await addFavorite(
          car.id
        )

        setIsFavorite(true)

      }

    } catch (error) {

      console.error(
        "Favorite action failed:",
        error
      )

    } finally {

      setFavoriteLoading(false)

    }

  }


  const handleCardClick = () => {

    navigate(
      `/cars/${car.id}`
    )

  }


  return (

    <div
      className="car-card"
      onClick={handleCardClick}
    >

      <div className="car-image">

        {primaryImage ? (

          <img
            src={primaryImage}
            alt={`${car.brand} ${car.model}`}
          />

        ) : (

          <div className="image-placeholder">
            No Image Available
          </div>

        )}


        <button
          type="button"
          className="favorite-button"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >

          {isFavorite ? "♥" : "♡"}

        </button>

      </div>


      <div className="car-info">

        <p className="car-brand">
          {car.brand}
        </p>


        <h3>
          {car.model}
        </h3>


        {car.variant && (

          <p className="car-variant">
            {car.variant}
          </p>

        )}


        <div className="car-details">

          <span>
            {car.year}
          </span>


          <span>
            {Number(
              car.mileage
            ).toLocaleString()} km
          </span>


          <span>
            {car.fuel_type}
          </span>


          <span>
            {car.transmission}
          </span>

        </div>


        <div className="car-location">

          📍 {car.location}

        </div>


        <div className="car-footer">

          <strong>
            ₹{Number(
              car.price
            ).toLocaleString("en-IN")}
          </strong>


          <button
            type="button"
            className="view-button"
            onClick={(event) => {

              event.stopPropagation()

              navigate(
                `/cars/${car.id}`
              )

            }}
          >
            View Details
          </button>

        </div>

      </div>

    </div>

  )

}


export default CarCard

