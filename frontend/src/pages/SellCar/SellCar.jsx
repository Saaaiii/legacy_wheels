import { useState } from "react"
import { useNavigate } from "react-router-dom"

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from "react-image-crop"

import "react-image-crop/dist/ReactCrop.css"


function centerAspectCrop(
  mediaWidth,
  mediaHeight,
  aspect
) {

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )

}


function getCroppedImage(
  image,
  crop
) {

  const canvas = document.createElement("canvas")

  const scaleX =
    image.naturalWidth / image.width

  const scaleY =
    image.naturalHeight / image.height

  canvas.width =
    crop.width * scaleX

  canvas.height =
    crop.height * scaleY

  const context =
    canvas.getContext("2d")

  context.drawImage(
    image,

    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,

    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve) => {

    canvas.toBlob(
      (blob) => {

        resolve(blob)

      },
      "image/jpeg",
      0.92
    )

  })

}


function SellCar() {

  const navigate = useNavigate()


  const [formData, setFormData] = useState({

    brand: "",
    model: "",
    variant: "",
    year: "",
    price: "",
    mileage: "",
    fuel_type: "Petrol",
    transmission: "Manual",
    location: "",
    description: "",

  })


  const [images, setImages] =
    useState([])


  const [cropQueue, setCropQueue] =
    useState([])

  const [currentCropIndex, setCurrentCropIndex] =
    useState(0)

  const [cropImage, setCropImage] =
    useState(null)

  const [crop, setCrop] =
    useState()

  const [completedCrop, setCompletedCrop] =
    useState(null)

  const [showCropper, setShowCropper] =
    useState(false)


  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [loading, setLoading] =
    useState(false)


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })

  }


  const handleImageChange = (event) => {

    const selectedFiles =
      Array.from(event.target.files || [])

    if (!selectedFiles.length) {
      return
    }

    setError("")

    setCropQueue(selectedFiles)

    setCurrentCropIndex(0)

    const reader =
      new FileReader()

    reader.onload = () => {

      setCropImage(reader.result)

      setShowCropper(true)

    }

    reader.readAsDataURL(
      selectedFiles[0]
    )

    event.target.value = ""

  }


  const handleCropImageLoad = (event) => {

    const {
      width,
      height,
    } = event.currentTarget

    const initialCrop =
      centerAspectCrop(
        width,
        height,
        4 / 3
      )

    setCrop(initialCrop)

  }


  const handleCropNext = async () => {

    if (
      !completedCrop ||
      !cropImage
    ) {
      setError(
        "Please select a crop area."
      )

      return
    }


    const image =
      document.querySelector(
        "#legacy-wheels-crop-image"
      )


    if (!image) {
      return
    }


    const croppedBlob =
      await getCroppedImage(
        image,
        completedCrop
      )


    if (!croppedBlob) {

      setError(
        "Unable to crop this image."
      )

      return

    }


    const originalFile =
      cropQueue[currentCropIndex]


    const croppedFile =
      new File(
        [
          croppedBlob
        ],
        originalFile.name
          .replace(/\.[^/.]+$/, "")
          + "-cropped.jpg",
        {
          type: "image/jpeg"
        }
      )


    setImages((previousImages) => [

      ...previousImages,

      croppedFile,

    ])


    const nextIndex =
      currentCropIndex + 1


    if (
      nextIndex <
      cropQueue.length
    ) {

      setCurrentCropIndex(
        nextIndex
      )

      setCompletedCrop(null)

      setCrop(undefined)


      const reader =
        new FileReader()

      reader.onload = () => {

        setCropImage(
          reader.result
        )

      }

      reader.readAsDataURL(
        cropQueue[nextIndex]
      )

    } else {

      setShowCropper(false)

      setCropQueue([])

      setCurrentCropIndex(0)

      setCropImage(null)

      setCrop(undefined)

      setCompletedCrop(null)

    }

  }


  const removeImage = (index) => {

    setImages(
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    )

  }


  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)


    try {

      const token =
        localStorage.getItem(
          "access_token"
        )


      if (!token) {

        navigate("/login")

        return

      }


      const carResponse =
        await fetch(
          "http://127.0.0.1:8000/api/auth/cars/",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({

              ...formData,

              year:
                Number(formData.year),

              price:
                Number(formData.price),

              mileage:
                Number(formData.mileage),

            }),

          }
        )


      const carData =
        await carResponse.json()


      if (!carResponse.ok) {

        throw new Error(
          JSON.stringify(carData)
        )

      }


      for (
        let index = 0;
        index < images.length;
        index++
      ) {

        const imageData =
          new FormData()


        imageData.append(
          "car",
          carData.id
        )


        imageData.append(
          "image",
          images[index]
        )


        imageData.append(
          "is_primary",
          index === 0
            ? "true"
            : "false"
        )


        const imageResponse =
          await fetch(
            "http://127.0.0.1:8000/api/auth/cars/images/",
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: imageData,

            }
          )


        const imageResult =
          await imageResponse.json()


        if (!imageResponse.ok) {

          throw new Error(
            JSON.stringify(
              imageResult
            )
          )

        }

      }


      setSuccess(
        "Your car has been listed successfully."
      )


      setTimeout(() => {

        navigate(
          `/cars/${carData.id}`
        )

      }, 1000)


    } catch (error) {

      console.error(error)

      setError(
        error.message ||
        "Something went wrong."
      )

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="sell-car-page">


      {/* Existing Navbar can remain here */}


      <main className="sell-car-content">

        <h1>
          Sell Your Car
        </h1>


        <form
          onSubmit={handleSubmit}
        >


          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="variant"
            placeholder="Variant"
            value={formData.variant}
            onChange={handleChange}
          />


          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
          />


          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
          >

            <option value="Petrol">
              Petrol
            </option>

            <option value="Diesel">
              Diesel
            </option>

            <option value="Electric">
              Electric
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

          </select>


          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
          >

            <option value="Manual">
              Manual
            </option>

            <option value="Automatic">
              Automatic
            </option>

          </select>


          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />


          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />


          <div className="image-upload-section">

            <label>
              Car Images
            </label>


            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />


            {images.length > 0 && (

              <div className="image-preview-list">

                {images.map(
                  (image, index) => (

                    <div
                      key={index}
                      className="image-preview"
                    >

                      <img
                        src={
                          URL.createObjectURL(
                            image
                          )
                        }
                        alt={`Car ${index + 1}`}
                      />


                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {error && (

            <p className="sell-error">
              {error}
            </p>

          )}


          {success && (

            <p className="sell-success">
              {success}
            </p>

          )}


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "LISTING CAR..."
              : "LIST MY CAR"}

          </button>


        </form>

      </main>


      {/* Cropper */}

      {showCropper && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              width: "min(900px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >

            <h2>
              Crop Your Car Image
            </h2>


            <p>
              Image {currentCropIndex + 1}
              {" "}
              of
              {" "}
              {cropQueue.length}
            </p>


            {cropImage && (

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >

                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) =>
                    setCrop(percentCrop)
                  }
                  onComplete={(pixelCrop) =>
                    setCompletedCrop(
                      pixelCrop
                    )
                  }
                  aspect={4 / 3}
                >

                  <img
                    id="legacy-wheels-crop-image"
                    src={cropImage}
                    alt="Crop preview"
                    onLoad={
                      handleCropImageLoad
                    }
                    style={{
                      maxWidth: "100%",
                      maxHeight: "60vh",
                      display: "block",
                    }}
                  />

                </ReactCrop>

              </div>

            )}


            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >

              <button
                type="button"
                onClick={() => {

                  setShowCropper(false)
                  setCropQueue([])
                  setCropImage(null)
                  setCrop(undefined)
                  setCompletedCrop(null)

                }}
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleCropNext
                }
              >

                {currentCropIndex + 1 <
                cropQueue.length
                  ? "CROP & NEXT"
                  : "CROP & DONE"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}


export default SellCar

