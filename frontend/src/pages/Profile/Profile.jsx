import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../../components/layout/Navbar"
import CarCard from "../../components/car/CarCard"

import { getMyCars,deleteCar } from "../../services/carService"
import { getCurrentUser,logoutUser } from "../../services/authService"


function Profile() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [myCars, setMyCars] = useState([])
  

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")



useEffect(() => {

  const loadProfile = async () => {

    const token =
      localStorage.getItem("access_token")


    if (!token) {

      navigate("/login")

      return

    }


    try {

      const [
        userData,
        carsData,
      ] = await Promise.all([
        getCurrentUser(),
        getMyCars(),
      ])


      setUser(userData)

      setMyCars(carsData)

    } catch (error) {

      console.error(error)

      setError(
        error.message ||
        "Failed to load profile."
      )

    } finally {

      setLoading(false)

    }

  }


  loadProfile()

}, [navigate])




  const handleLogout = () => {

    logoutUser()

    navigate("/")

  }


const handleDeleteCar = async (carId) => {

  const confirmed =
    window.confirm(
      "Are you sure you want to delete this listing?"
    )


  if (!confirmed) {
    return
  }


  try {

    await deleteCar(carId)


    setMyCars((previousCars) =>
      previousCars.filter(
        (car) => car.id !== carId
      )
    )

  } catch (error) {

    console.error(error)

    setError(
      error.message ||
      "Failed to delete listing."
    )

  }

}




  return (

    <div className="profile-page">

      <Navbar />


      <main className="profile-content">


        <section className="profile-header">

          <p className="profile-label">
            LEGACY WHEELS
          </p>


          <h1>
            Your
            <br />
            Profile.
          </h1>


          <p>
            Manage your account and your car listings.
          </p>

        </section>


        <section className="profile-card">


          <div className="profile-top">

            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>


            <div className="profile-user">

             <h2>
                {user?.username || "User"}
              </h2>

              <p>
                {user?.email || "No email added"}
              </p>

            </div>

          </div>


          <div className="profile-divider"></div>


          <div className="profile-info">


            <div className="profile-info-item">

              <span>
                FULL NAME
              </span>

              <strong>
                {user?.first_name ||
                  user?.username ||
                  "Not added"}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                EMAIL
              </span>

              <strong>
                {user?.email || "No email added"}
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                PHONE
              </span>

              <strong>
                Not added
              </strong>

            </div>


            <div className="profile-info-item">

              <span>
                LOCATION
              </span>

              <strong>
                Bangalore
              </strong>

            </div>

          </div>


          <div className="profile-actions">


            <button
              type="button"
              className="edit-profile-button"
            >
              Edit Profile
            </button>


            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>


        </section>


        <section className="my-listings">


          <div className="listings-header">


            <div>

              <p className="listings-label">
                YOUR ACTIVITY
              </p>


              <h2>
                My Listings
              </h2>

            </div>


            <span>
              {myCars.length} car
              {myCars.length !== 1 && "s"}
            </span>


          </div>


          {loading && (

            <div className="listings-empty">

              <h3>
                Loading your listings...
              </h3>

            </div>

          )}


          {error && (

            <div className="listings-empty">

              <h3>
                Unable to load listings
              </h3>

              <p>
                {error}
              </p>

            </div>

          )}


          {!loading &&
            !error &&
            myCars.length === 0 && (

              <div className="listings-empty">

                <div className="listings-icon">
                  🚗
                </div>


                <h3>
                  No listings yet
                </h3>


                <p>
                  Cars you list on Legacy Wheels
                  will appear here.
                </p>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/sell")
                  }
                >
                  LIST YOUR CAR
                </button>

              </div>

            )}


          {!loading &&
            !error &&
            myCars.length > 0 && (

              
<div className="car-grid">

  {myCars.map((car) => (

    <div
      key={car.id}
      className="my-listing-item"
    >

      <CarCard
        car={car}
      />


      <div className="listing-management">

        <button
          type="button"
          className="edit-listing-button"
          onClick={() =>
            navigate(`/cars/${car.id}/edit`)
          }
        >
          Edit Listing
        </button>


        <button
          type="button"
          className="delete-listing-button"
          onClick={() =>
            handleDeleteCar(car.id)
          }
        >
          Delete Listing
        </button>

      </div>

    </div>

  ))}

</div>



            )}


        </section>


      </main>

    </div>

  )

}


export default Profile

