import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing/Landing"
import Cars from "./pages/Cars/Cars"
import CarDetails from "./pages/CarDetails/CarDetails"
import Favorites from "./pages/Favorites/Favorites"
import SellCar from "./pages/SellCar/SellCar"
import Profile from "./pages/Profile/Profile"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"
import EditCar from "./pages/EditCar/EditCar"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/profile" element={<Profile />} />
         <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
         <Route
            path="/cars/:id/edit"
            element={<EditCar />}
          />

      </Routes>
      
     

    </BrowserRouter>
  )
}

export default App