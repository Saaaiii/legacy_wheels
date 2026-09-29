import { useEffect, useState } from "react"

import Navbar from "../../components/layout/Navbar"
import CarCard from "../../components/car/CarCard"

import { getCars } from "../../services/carService"


function Cars() {

  const [cars, setCars] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")


  const [search, setSearch] = useState("")
  const [brand, setBrand] = useState("")

  const [fuelType, setFuelType] = useState("")

  const [transmission, setTransmission] =
    useState("")

  const [location, setLocation] =
    useState("")

  const [minPrice, setMinPrice] =
    useState("")

  const [maxPrice, setMaxPrice] =
    useState("")

  const [minYear, setMinYear] =
    useState("")

  const [maxYear, setMaxYear] =
    useState("")

  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {

    const loadCars = async () => {

      try {

        const data = await getCars()

        setCars(data)

      } catch (error) {

        setError(error.message)

      } finally {

        setLoading(false)

      }

    }

    loadCars()

  }, [])
    const brands = [
                      ...new Set(
                        cars
                          .map((car) => car.brand)
                          .filter(Boolean)
                      ),
                    ].sort()


  const filteredCars = cars.filter((car) => {
    
    const searchValue =
      search.trim().toLowerCase()

    const locationValue =
      location.trim().toLowerCase()

    const matchesBrand =
      !brand ||
      car.brand === brand  


    const matchesSearch =
      !searchValue ||
      car.brand?.toLowerCase().includes(searchValue) ||
      car.model?.toLowerCase().includes(searchValue) ||
      car.variant?.toLowerCase().includes(searchValue)


    const matchesFuel =
      !fuelType ||
      car.fuel_type === fuelType


    const matchesTransmission =
      !transmission ||
      car.transmission === transmission


    const matchesLocation =
      !locationValue ||
      car.location?.toLowerCase().includes(locationValue)


    const matchesMinPrice =
      !minPrice ||
      Number(car.price) >= Number(minPrice)


    const matchesMaxPrice =
      !maxPrice ||
      Number(car.price) <= Number(maxPrice)


    const matchesMinYear =
      !minYear ||
      Number(car.year) >= Number(minYear)


    const matchesMaxYear =
      !maxYear ||
      Number(car.year) <= Number(maxYear)


    return (
      matchesSearch &&
      matchesBrand &&
      matchesFuel &&
      matchesTransmission &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinYear &&
      matchesMaxYear
    )

  })
  const sortedCars = [...filteredCars].sort(
  (a, b) => {

    if (sortBy === "price-low") {
      return Number(a.price) - Number(b.price)
    }

    if (sortBy === "price-high") {
      return Number(b.price) - Number(a.price)
    }

    if (sortBy === "year-new") {
      return Number(b.year) - Number(a.year)
    }

    if (sortBy === "year-old") {
      return Number(a.year) - Number(b.year)
    }

    // newest
    return (
      new Date(b.created_at) -
      new Date(a.created_at)
    )
  }
)

  const clearFilters = () => {

    setSearch("")
    setBrand("")
    setFuelType("")
    setTransmission("")
    setLocation("")
    setMinPrice("")
    setMaxPrice("")
    setMinYear("")
    setMaxYear("")

  }


  return (

    <div className="cars-page">

      <Navbar />


      <main className="cars-content">


        <section className="cars-header">
          <h1>
            Find a Car
            <br />
            That Fits You.
          </h1>

          <p>
            Browse our collection of quality used cars.
          </p>

        </section>


        {!loading && !error && (

          <section className="cars-marketplace">


            {/* FILTER SIDEBAR */}

            <aside className="cars-sidebar">

              <div className="sidebar-header">

                <p className="sidebar-label">
                  REFINE
                </p>

                <h2>
                  Filters
                </h2>

              </div>


              <div className="sidebar-section">

                <label>
                  SEARCH
                </label>

                <input
                  type="text"
                  placeholder="Brand or model"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

              </div>
              <div className="sidebar-section">

                  <label>
                    BRAND
                  </label>

                  <select
                    value={brand}
                    onChange={(event) =>
                      setBrand(event.target.value)
                    }
                  >

                    <option value="">
                      All Brands
                    </option>

                    {brands.map((brandName) => (

                      <option
                        key={brandName}
                        value={brandName}
                      >
                        {brandName}
                      </option>

                    ))}

                  </select>

                </div>


              <div className="sidebar-section">

                <label>
                  FUEL TYPE
                </label>

                <div className="filter-options">

                  {[
                    "Petrol",
                    "Diesel",
                    "Electric",
                    "Hybrid",
                  ].map((fuel) => (

                    <label
                      className="filter-option"
                      key={fuel}
                    >

                      <input
                        type="radio"
                        name="fuel"
                        checked={
                          fuelType === fuel
                        }
                        onChange={() =>
                          setFuelType(fuel)
                        }
                      />

                      <span>
                        {fuel}
                      </span>

                    </label>

                  ))}

                  <button
                    type="button"
                    className="clear-option"
                    onClick={() =>
                      setFuelType("")
                    }
                  >
                    All fuel types
                  </button>

                </div>

              </div>


              <div className="sidebar-section">

                <label>
                  TRANSMISSION
                </label>

                <div className="filter-options">

                  {[
                    "Manual",
                    "Automatic",
                  ].map((type) => (

                    <label
                      className="filter-option"
                      key={type}
                    >

                      <input
                        type="radio"
                        name="transmission"
                        checked={
                          transmission === type
                        }
                        onChange={() =>
                          setTransmission(type)
                        }
                      />

                      <span>
                        {type}
                      </span>

                    </label>

                  ))}

                  <button
                    type="button"
                    className="clear-option"
                    onClick={() =>
                      setTransmission("")
                    }
                  >
                    All transmissions
                  </button>

                </div>

              </div>


              <div className="sidebar-section">

                <label>
                  PRICE RANGE
                </label>

                <div className="range-inputs">

                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(event) =>
                      setMinPrice(event.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(event) =>
                      setMaxPrice(event.target.value)
                    }
                  />

                </div>

              </div>


              <div className="sidebar-section">

                <label>
                  YEAR
                </label>

                <div className="range-inputs">

                  <input
                    type="number"
                    placeholder="From"
                    value={minYear}
                    onChange={(event) =>
                      setMinYear(event.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="To"
                    value={maxYear}
                    onChange={(event) =>
                      setMaxYear(event.target.value)
                    }
                  />

                </div>

              </div>


              <div className="sidebar-section">

                <label>
                  LOCATION
                </label>

                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />

              </div>


              <button
                type="button"
                className="clear-filters-button"
                onClick={clearFilters}
              >
                CLEAR ALL FILTERS
              </button>

            </aside>


            {/* CAR RESULTS */}

            <section className="cars-results">

              <div className="cars-results-top">

                <div>

                  <p className="results-label">
                    AVAILABLE CARS
                  </p>

                  <h2>
                    {sortedCars.length}{" "}
                    {sortedCars.length === 1
                      ? "car"
                      : "cars"}
                  </h2>

                </div>


                <div className="cars-sort">

                  <label htmlFor="sort-cars">
                    SORT BY
                  </label>

                  <select
                    id="sort-cars"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                  >

                    <option value="newest">
                      Newest
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="year-new">
                      Year: Newest First
                    </option>

                    <option value="year-old">
                      Year: Oldest First
                    </option>

                  </select>

                </div>

              </div>


              {sortedCars.length === 0 ? (

                <div className="cars-empty">

                  <h2>
                    No cars found
                  </h2>

                  <p>
                    Try changing your filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    CLEAR FILTERS
                  </button>

                </div>

              ) : (

                <div className="car-grid">

                  {sortedCars.map((car) => (

                    <CarCard
                      key={car.id}
                      car={car}
                    />

                  ))}

                </div>

              )}

            </section>

          </section>

        )}


        {loading && (

          <p className="cars-message">
            Loading cars...
          </p>

        )}


        {error && (

          <p className="cars-error">
            {error}
          </p>

        )}


      </main>

    </div>

  )

}


export default Cars