import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from "react-image-crop"

import "react-image-crop/dist/ReactCrop.css"

import Navbar from "../../components/layout/Navbar"

import {
  getCar,
  updateCar,
  deleteCarImage,
  setPrimaryCarImage,
  uploadCarImage,
} from "../../services/carService"


function EditCar() {

  const { id } = useParams()

  const navigate = useNavigate()


  // -----------------------------
  // CAR FORM
  // -----------------------------

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


  const [car, setCar] =
    useState(null)

  const [images, setImages] =
    useState([])


  // -----------------------------
  // PAGE STATE
  // -----------------------------

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")


  // -----------------------------
  // IMAGE / CROP STATE
  // -----------------------------

  const [newImageQueue, setNewImageQueue] =
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

  const [uploadingImage, setUploadingImage] =
    useState(false)
    const cropImageRef = useRef(null)

    const fileInputRef = useRef(null)
  // -----------------------------
  // LOAD CAR
  // -----------------------------

  useEffect(() => {
    

    const loadCar = async () => {

      const token =
        localStorage.getItem(
          "access_token"
        )

      if (!token) {

        navigate("/login")

        return

      }


      try {

        setLoading(true)
        setError("")


        const data =
          await getCar(id)


        console.log(
          "Edit car response:",
          data
        )


        setCar(data)

        setImages(
          data.images || []
        )
        console.log("Setting images:", data.images)

        setFormData({
          brand:
            data.brand || "",

          model:
            data.model || "",

          variant:
            data.variant || "",

          year:
            data.year || "",

          price:
            data.price || "",

          mileage:
            data.mileage || "",

          fuel_type:
            data.fuel_type ||
            "Petrol",

          transmission:
            data.transmission ||
            "Manual",

          location:
            data.location || "",

          description:
            data.description || "",
        })
        console.log("Setting form data for:", data.brand, data.model)


      } catch (error) {

        console.error(
          "Failed to load car:",
          error
        )


        setError(
          error.message ||
          "Failed to load car."
        )

      } finally {

        setLoading(false)

      }

    }


    loadCar()

  }, [id, navigate])


  // -----------------------------
  // FORM CHANGE
  // -----------------------------

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target


    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    )

  }


  // -----------------------------
  // UPDATE CAR
  // -----------------------------

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault()

    setError("")
    setSuccess("")
    setSaving(true)


    try {

      const updatedCar =
        await updateCar(
          id,
          {
            ...formData,

            year:
              Number(
                formData.year
              ),

            price:
              Number(
                formData.price
              ),

            mileage:
              Number(
                formData.mileage
              ),
          }
        )


      setSuccess(
        "Your listing has been updated."
      )


      setTimeout(() => {

        navigate(
          `/cars/${updatedCar.id}`
        )

      }, 800)


    } catch (error) {

      console.error(error)

      setError(
        error.message ||
        "Failed to update listing."
      )

    } finally {

      setSaving(false)

    }

  }


  // -----------------------------
  // CROP HELPER
  // -----------------------------

  const centerAspectCrop = (
    mediaWidth,
    mediaHeight,
    aspect
  ) => {

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


  // -----------------------------
  // SELECT NEW IMAGES
  // -----------------------------

  const handleNewImageChange = (
    event
  ) => {

    const files =
      Array.from(
        event.target.files || []
      )


    if (!files.length) {
      return
    }


    console.log(
      "Selected images:",
      files
    )


    setError("")

    setNewImageQueue(files)

    setCurrentCropIndex(0)

    setCompletedCrop(null)

    setCrop(undefined)


    const objectUrl =
      URL.createObjectURL(
        files[0]
      )

    setCropImage(objectUrl)

    setShowCropper(true)


    if (fileInputRef.current) {

      fileInputRef.current.value =
        ""

    }

  }


  // -----------------------------
  // IMAGE LOADED
  // -----------------------------

  const handleCropImageLoad = (
    event
  ) => {

    const image =
      event.currentTarget


    const width =
      image.naturalWidth

    const height =
      image.naturalHeight


    if (!width || !height) {
      return
    }


    const initialCrop =
      centerAspectCrop(
        width,
        height,
        4 / 3
      )


    setCrop(
      initialCrop
    )

  }


  // -----------------------------
  // GET CROPPED IMAGE
  // -----------------------------

  const getCroppedImage = async () => {

  if (
    !cropImageRef.current ||
    !completedCrop ||
    !completedCrop.width ||
    !completedCrop.height
  ) {
    return null
  }

  const image = cropImageRef.current

  const scaleX =
    image.naturalWidth / image.width

  const scaleY =
    image.naturalHeight / image.height

  const cropWidth =
    Math.round(
      completedCrop.width * scaleX
    )

  const cropHeight =
    Math.round(
      completedCrop.height * scaleY
    )

  const canvas =
    document.createElement("canvas")

  canvas.width = cropWidth
  canvas.height = cropHeight

  const context =
    canvas.getContext("2d")

  if (!context) {
    return null
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"

  context.drawImage(
    image,

    completedCrop.x * scaleX,
    completedCrop.y * scaleY,

    completedCrop.width * scaleX,
    completedCrop.height * scaleY,

    0,
    0,

    cropWidth,
    cropHeight
  )

  return new Promise((resolve) => {

    canvas.toBlob(
      (blob) => {

        if (!blob) {
          resolve(null)
          return
        }

        const file = new File(
          [blob],
          `car-image-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        )

        resolve(file)

      },
      "image/jpeg",
      0.95
    )

  })
}
  // -----------------------------
  // CROP + UPLOAD
  // -----------------------------

  const handleCropNext =
    async () => {

      if (
        !completedCrop ||
        !completedCrop.width ||
        !completedCrop.height
      ) {

        setError(
          "Please select a crop area first."
        )

        return

      }


      try {

        setError("")

        setUploadingImage(true)


        const croppedFile =
          await getCroppedImage()


        if (!croppedFile) {

          setError(
            "Unable to crop the image."
          )

          return

        }


       const uploadedImage = await uploadCarImage(
          id,
          croppedFile,
          images.length === 0
        )

        console.log("Uploaded image response:",uploadedImage)
        console.log("Current images after upload:", [
        ...images,
        uploadedImage,
      ])
const updatedCar = await getCar(id)

setCar(updatedCar)
setImages(updatedCar.images || [])
const nextIndex =
          currentCropIndex + 1


        if (
          nextIndex <
          newImageQueue.length
        ) {

          setCurrentCropIndex(
            nextIndex
          )


          const nextUrl =
            URL.createObjectURL(
              newImageQueue[
                nextIndex
              ]
            )


          setCropImage(
            nextUrl
          )


          setCrop(undefined)

          setCompletedCrop(
            null
          )


        } else {

          setNewImageQueue([])

          setCurrentCropIndex(0)

          setCropImage(null)

          setCrop(undefined)

          setCompletedCrop(null)

          setShowCropper(false)

        }


      } catch (error) {

        console.error(
          "Image upload failed:",
          error
        )


        setError(
          error.message ||
          "Failed to upload image."
        )

      } finally {

        setUploadingImage(false)

      }

    }


  // -----------------------------
  // CANCEL CROPPER
  // -----------------------------

  const handleCancelCrop =
    () => {

      if (cropImage) {

        URL.revokeObjectURL(
          cropImage
        )

      }


      setNewImageQueue([])

      setCurrentCropIndex(0)

      setCropImage(null)

      setCrop(undefined)

      setCompletedCrop(null)

      setShowCropper(false)

    }


  // -----------------------------
  // DELETE IMAGE
  // -----------------------------

  const handleDeleteImage =
    async (image) => {

      if (images.length <= 1) {

        setError(
          "A listing must keep at least one image."
        )

        return

      }


      if (image.is_primary) {

        setError(
          "Set another image as primary before deleting this one."
        )

        return

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this image?"
        )


      if (!confirmed) {
        return
      }


      try {

        setError("")


        await deleteCarImage(
          image.id
        )


        setImages(
          (previousImages) =>
            previousImages.filter(
              (item) =>
                item.id !== image.id
            )
        )


      } catch (error) {

        console.error(error)


        setError(
          error.message ||
          "Failed to delete image."
        )

      }

    }


  // -----------------------------
  // SET PRIMARY IMAGE
  // -----------------------------

  const handleSetPrimary =
    async (image) => {

      if (image.is_primary) {
        return
      }


      try {

        setError("")


        await setPrimaryCarImage(
          image.id
        )


        setImages(
          (previousImages) =>
            previousImages.map(
              (item) => ({
                ...item,

                is_primary:
                  item.id ===
                  image.id,
              })
            )
        )


      } catch (error) {

        console.error(error)


        setError(
          error.message ||
          "Failed to set primary image."
        )

      }

    }


  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {

    return (

      <div className="edit-car-page">

        <Navbar />

        <main className="edit-car-content">

          <p>
            Loading listing...
          </p>

        </main>

      </div>

    )

  }


  // -----------------------------
  // LOAD ERROR
  // -----------------------------

  if (
    error &&
    !formData.brand
  ) {

    return (

      <div className="edit-car-page">

        <Navbar />

        <main className="edit-car-content">

          <h1>
            Unable to Load Listing
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >
            ← Back to Profile
          </button>

        </main>

      </div>

    )

  }


  return (

    <div className="edit-car-page">

      <Navbar />


      <main className="edit-car-content">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              "/profile"
            )
          }
        >
          ← Back to Profile
        </button>


        <section className="edit-car-header">

          <p className="edit-car-label">
            LEGACY WHEELS
          </p>

          <h1>
            Edit Your
            <br />
            Listing.
          </h1>

          <p>
            Update the details of your car.
          </p>

        </section>


        {/* =========================
            IMAGE MANAGEMENT
        ========================== */}

        <section className="edit-images-section">

          <div className="edit-images-header">

            <div>

              <p className="edit-images-label">
                CAR PHOTOS
              </p>

              <h2>
                Manage Your Images
              </h2>

              <p>
                Choose your main photo or add new images.
              </p>

            </div>


            <button
              type="button"
              className="add-image-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              + ADD IMAGES
            </button>

          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={
              handleNewImageChange
            }
          />


          {images.length > 0 ? (

            <div className="edit-images-grid">

              {images.map((image) => (

                  <div
                    className="edit-image-card"
                    key={image.id}
                  >
                    <div className="edit-image-wrapper">

                      <img
  src={image.image}
  alt={`${car?.brand || ""} ${car?.model || ""}`}
  onLoad={(event) => {
    const img = event.currentTarget

    console.log("IMAGE LOADED:", image.id, image.image)

    console.log("NATURAL SIZE:", {
      width: img.naturalWidth,
      height: img.naturalHeight,
    })

    console.log("DISPLAY SIZE:", {
      width: img.clientWidth,
      height: img.clientHeight,
    })
  }}
  onError={() => {
    console.error(
      "IMAGE FAILED:",
      image.id,
      image.image
    )
  }}
/>
                      {image.is_primary && (

                        <span className="primary-badge">
                          PRIMARY
                        </span>

                      )}

                    </div>


                    <div className="edit-image-actions">

                      {!image.is_primary && (

                        <button
                          type="button"
                          onClick={() =>
                            handleSetPrimary(
                              image
                            )
                          }
                        >
                          SET PRIMARY
                        </button>

                      )}


                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteImage(
                            image
                          )
                        }
                      >
                        DELETE
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="no-images">

              <p>
                No images added yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                ADD YOUR FIRST IMAGE
              </button>

            </div>

          )}

        </section>


        {/* =========================
            CROPPER
        ========================== */}

        {showCropper &&
          cropImage && (

            <section className="cropper-section">

              <div className="cropper-header">

                <p className="edit-images-label">
                  IMAGE{" "}
                  {currentCropIndex + 1}{" "}
                  OF{" "}
                  {newImageQueue.length}
                </p>


                <h2>
                  Crop Your Image
                </h2>
                <p>
                  Adjust the image before adding it to your listing.
                </p>

              </div>


              <div className="cropper-container">
             
                <ReactCrop
                  crop={crop}
                 onChange={(pixelCrop) => {
                  setCrop(pixelCrop)
                }}
                  onComplete={(pixelCrop) => {
                    setCompletedCrop(pixelCrop)

                  }}
                  aspect={4 / 3}
                >

                  <img
                    ref={cropImageRef}
                    src={cropImage}
                    alt="Crop preview"
                    onLoad={handleCropImageLoad}
                  />

                </ReactCrop>

              </div>


              <div className="cropper-actions">

                <button
                  type="button"
                  onClick={
                    handleCancelCrop
                  }
                  disabled={
                    uploadingImage
                  }
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={
                    handleCropNext
                  }
                  disabled={
                    uploadingImage ||
                    !completedCrop
                  }
                >
                  {uploadingImage
                    ? "UPLOADING..."
                    : currentCropIndex + 1 <
                      newImageQueue.length
                    ? "CROP & CONTINUE"
                    : "CROP & ADD"}
                </button>

              </div>

            </section>

          )}


        {/* =========================
            CAR FORM
        ========================== */}
        <form
          className="edit-car-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-row">

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={
                formData.brand
              }
              onChange={
                handleChange
              }
              required
            />


            <input
              type="text"
              name="model"
              placeholder="Model"
              value={
                formData.model
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <input
            type="text"
            name="variant"
            placeholder="Variant"
            value={
              formData.variant
            }
            onChange={
              handleChange
            }
          />


          <div className="form-row">

            <input
              type="number"
              name="year"
              placeholder="Year"
              value={
                formData.year
              }
              onChange={
                handleChange
              }
              required
            />


            <input
              type="number"
              name="price"
              placeholder="Price"
              value={
                formData.price
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={
              formData.mileage
            }
            onChange={
              handleChange
            }
            required
          />


          <div className="form-row">

            <select
              name="fuel_type"
              value={
                formData.fuel_type
              }
              onChange={
                handleChange
              }
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
              value={
                formData.transmission
              }
              onChange={
                handleChange
              }
            >

              <option value="Manual">
                Manual
              </option>

              <option value="Automatic">
                Automatic
              </option>

            </select>

          </div>


          <input
            type="text"
            name="location"
            placeholder="Location"
            value={
              formData.location
            }
            onChange={
              handleChange
            }
            required
          />


          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows="6"
          />


          {error && (

            <p className="edit-car-error">
              {error}
            </p>

          )}


          {success && (

            <p className="edit-car-success">
              {success}
            </p>

          )}


          <div className="edit-car-actions">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/cars/${id}`
                )
              }
            >
              CANCEL
            </button>


            <button
              type="submit"
              disabled={
                saving
              }
            >
              {saving
                ? "SAVING..."
                : "UPDATE LISTING"}
            </button>

          </div>

        </form>

      </main>

    </div>

  )

}


export default EditCar