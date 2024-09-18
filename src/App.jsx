import Footer from "./components/Footer.jsx";
import Navbar from '../src/components/Navbar.jsx';
import Home from "./Pages/Home.jsx";
import Detail from "./Pages/Detail.jsx";
import { Route, Routes } from "react-router-dom";
import { routes } from "./utils/route.js";
import { GlobalContextProvider } from "./context/globalContext.jsx";
import { UserContextProvider } from "./context/userContext.jsx";
import PerfilPage from "./Pages/PerfilPage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";
import BookingPage from "./Pages/BookingPage.jsx";
import ReservasPorCanchaPage from "./Pages/ReservasPorCanchaPage.jsx";


function App() {
  return (
    <>
      <UserContextProvider>
        <GlobalContextProvider>
          <div className="app-container">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.detail} element={<Detail />} />
                <Route path={routes.reserva} element={<BookingPage/>}/>
                <Route path={routes.perfilPage} element={<PerfilPage/>}/>
                <Route path={routes.canchasReservas} element={<ReservasPorCanchaPage />} />
                <Route path="*" element={<ErrorPage/>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </GlobalContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;

