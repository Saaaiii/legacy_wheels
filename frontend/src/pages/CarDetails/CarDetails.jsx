import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import Navbar from "../../components/layout/Navbar"
import { getCar } from "../../services/carService"

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../../services/favoriteService"


function CarDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const [isFavorite, setIsFavorite] =
  useState(false)

  const [favoriteLoading, setFavoriteLoading] =
  useState(false)
  

  useEffect(() => {

    async function loadCar() {

      try {

        setLoading(true)
        setError("")

       const data = await getCar(id)

        setCar(data)

        const initialImage =
          data.images?.find(
            (image) => image.is_primary
          )?.image ||
          data.images?.[0]?.image ||
          null

        setSelectedImage(initialImage)
                const token =
          localStorage.getItem("access_token")

if (token) {

  try {

    const favorites =
      await getFavorites()

    const alreadyFavorite =
      favorites.some(
        (favorite) =>
          favorite.car.id === data.id
      )

    setIsFavorite(
      alreadyFavorite
    )

  } catch (error) {

    console.error(
      "Failed to check favorite:",
      error
    )

  }
}

      } catch (error) {

        console.error(error)

        setError("Failed to load car details.")

      } finally {

        setLoading(false)

      }

    }

    loadCar()

  }, [id])
  const handleFavorite = async () => {

  const token =
    localStorage.getItem(
      "access_token"
    )

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
  



  if (loading) {

    return (
      <div className="car-details-page">

        <Navbar />

        <main className="car-details-content">

          <p>Loading car details...</p>

        </main>

      </div>
    )

  }


  if (error || !car) {

    return (
      <div className="car-details-page">

        <Navbar />

        <main className="car-details-content">

          <h1>Car Not Found</h1>

          <p>
            {error || "The requested car could not be found."}
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/cars")}
          >
            ← Back to Cars
          </button>

        </main>

      </div>
    )

  }
  
return (

    <div className="car-details-page">

      <Navbar />


      <main className="car-details-content">


        <button
          className="back-button"
          onClick={() => navigate("/cars")}
        >
          ← Back to Cars
        </button>


        <section className="details-layout">


          {/* Car Image */}

          {/* Car Image Gallery */}

<div className="details-gallery">

  <div className="details-main-image">

    {selectedImage ? (

      <img
        src={selectedImage}
        alt={`${car.brand} ${car.model}`}
      />

    ) : (

      <div className="image-placeholder">
        No Image Available
      </div>

    )}

  </div>


  {car.images?.length > 0 && (

    <div className="details-thumbnails">

      {car.images.map((image) => (

        <button
          key={image.id}
          type="button"
          className={`details-thumbnail ${
            selectedImage === image.image
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedImage(image.image)
          }
        >

          <img
            src={image.image}
            alt={`${car.brand} ${car.model} thumbnail`}
          />

          {image.is_primary && (
            <span className="thumbnail-primary">
              PRIMARY
            </span>
          )}

        </button>

      ))}

    </div>

  )}

</div>


          {/* Car Information */}

          <div className="details-info">


            <p className="details-label">
              {car.brand}
            </p>


            <h1>
              {car.model}
            </h1>


            {car.variant && (

              <p className="details-variant">
                {car.variant}
              </p>

            )}


            <p className="details-location">
              📍 {car.location}
            </p>


            <div className="details-specs">


              <div>

                <span>YEAR</span>

                <strong>
                  {car.year}
                </strong>

              </div>


              <div>

                <span>MILEAGE</span>

                <strong>
                  {Number(car.mileage).toLocaleString()} km
                </strong>

              </div>


              <div>

                <span>FUEL</span>

                <strong>
                  {car.fuel_type}
                </strong>

              </div>


              <div>

                <span>TRANSMISSION</span>

                <strong>
                  {car.transmission}
                </strong>

              </div>


            </div>


            <div className="details-price">

              ₹{Number(car.price).toLocaleString("en-IN")}

            </div>


            <p className="details-description">

              {car.description ||
                "No description provided by the seller."}

            </p>


            <div className="details-actions">


              <button className="contact-button">

                Contact Seller

              </button>


              <button
                  className="favorite-details-button"
                  type="button"
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


          </div>


        </section>


      </main>


    </div>

  )

}
export default CarDetails

