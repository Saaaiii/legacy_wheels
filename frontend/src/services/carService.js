const API_URL = "http://127.0.0.1:8000/api/auth/cars"


export async function getCars() {

  const response = await fetch(
    `${API_URL}/`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      "Failed to load cars"
    )
  }

  return data
}


export async function getCar(id) {

  const response = await fetch(
    `${API_URL}/${id}/`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      "Failed to load car"
    )
  }

  return data
}


export async function getMyCars() {

  const token =
    localStorage.getItem("access_token")


  if (!token) {

    throw new Error(
      "You must be logged in."
    )

  }


  const response = await fetch(
    "http://127.0.0.1:8000/api/auth/my-cars/",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Failed to load your listings."
    )

  }


  return data
}


export async function deleteCar(id) {

  const token =
    localStorage.getItem("access_token")


  if (!token) {
    throw new Error(
      "You must be logged in."
    )
  }


  const response = await fetch(
    `http://127.0.0.1:8000/api/auth/cars/${id}/`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  )


  if (!response.ok) {

    const data =
      await response.json()

    throw new Error(
      data.detail ||
      "Failed to delete car."
    )
  }

}

export async function updateCar(id, carData) {

  const token =
    localStorage.getItem("access_token")


  if (!token) {

    throw new Error(
      "You must be logged in."
    )

  }


  const response = await fetch(
    `http://127.0.0.1:8000/api/auth/cars/${id}/`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(carData),
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.detail ||
      JSON.stringify(data)
    )

  }


  return data
}


export async function deleteCarImage(
  imageId
) {

  const token =
    localStorage.getItem("access_token")


  const response = await fetch(
    `http://127.0.0.1:8000/api/auth/cars/images/${imageId}/`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  )


  if (!response.ok) {

    const data =
      await response.json()

    throw new Error(
      data.error ||
      "Failed to delete image."
    )

  }

}


export async function setPrimaryCarImage(
  imageId
) {

  const token =
    localStorage.getItem("access_token")


  const response = await fetch(
    `http://127.0.0.1:8000/api/auth/cars/images/${imageId}/primary/`,
    {
      method: "PATCH",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Failed to set primary image."
    )

  }


  return data

}


export async function uploadCarImage(
  carId,
  image,
  isPrimary = false
) {

  const token =
    localStorage.getItem("access_token")


  const imageData =
    new FormData()


  imageData.append(
    "car",
    carId
  )


  imageData.append(
    "image",
    image
  )


  imageData.append(
    "is_primary",
    isPrimary
      ? "true"
      : "false"
  )


  const response = await fetch(
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


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.error ||
      "Failed to upload image."
    )

  }


  return data

}







