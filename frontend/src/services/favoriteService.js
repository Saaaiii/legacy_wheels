const API_URL =
  "http://127.0.0.1:8000/api/auth/favorites"


export async function getFavorites() {

  const token =
    localStorage.getItem("access_token")

  const response = await fetch(
    `${API_URL}/`,
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
      "Failed to load favorites"
    )
  }

  return data
}


export async function addFavorite(
  carId
) {

  const token =
    localStorage.getItem("access_token")

  const response = await fetch(
    `${API_URL}/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        car: carId,
      }),
    }
  )

  const data =
    await response.json()

  if (!response.ok) {
    throw new Error(
      data.error ||
      "Failed to add favorite"
    )
  }

  return data
}


export async function removeFavorite(
  carId
) {

  const token =
    localStorage.getItem("access_token")

  const response = await fetch(
    `${API_URL}/${carId}/`,
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
      "Failed to remove favorite"
    )
  }
}

