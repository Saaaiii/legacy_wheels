const API_URL =
  "http://127.0.0.1:8000/api/auth"


export async function registerUser(
  userData
) {

  const response = await fetch(
    `${API_URL}/register/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        userData
      ),
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


export async function loginUser(
  credentials
) {

  const response = await fetch(
    `${API_URL}/login/`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        credentials
      ),
    }
  )


  const data =
    await response.json()


  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Login failed"
    )

  }


  return data
}


export function isLoggedIn() {

  const token =
    localStorage.getItem(
      "access_token"
    )

  return Boolean(token)
}


export function logoutUser() {

  localStorage.removeItem(
    "access_token"
  )

  localStorage.removeItem(
    "refresh_token"
  )
}


export async function getCurrentUser() {

  const token =
    localStorage.getItem(
      "access_token"
    )


  if (!token) {

    throw new Error(
      "You must be logged in."
    )

  }


  const response = await fetch(
    `${API_URL}/me/`,
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
      "Failed to load profile."
    )

  }


  return data
}