import { useState, useEffect } from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import MainContent from "./components/MainContent";
import * as React from "react";
import "./App.css";
import "./components/Spinner.css";
import Login from "./components/Login";
import AddLibrary from "./components/AddLibrary";
import EditLibrary from "./components/EditLibrary";
import Spinner from "./components/Spinner";

function App() {
  const [loggedIn, setLoggedIn] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const IP_ADDRESS = process.env.VITE_IP_ADDRESS;

  useEffect(() => {
    async function fetchRecords() {
      try {
        setLoading(true);
        const response = await axios.get(`${IP_ADDRESS}/library/`);
        console.log(response)
        setRecords(response.data);
        
      } catch (error) {
        console.error("Failed to fetch records", error);
      } finally {
        setLoading(false);
        setShowComponents(true);
      }
    }

    // Adding setTimeout to delay the fetchRecords execution
    const timeoutId = setTimeout(() => {
      fetchRecords();
    }, 1000); // 2000 ms (2 seconds) delay

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <BrowserRouter>
        {loading && <Spinner />}
        {/* {showComponents ( */}
        {showComponents && (
          <>
            <Routes>
              <Route path="/" element={<Login records={records} />} />
            </Routes>
            {sessionStorage.getItem("username") && (
              <div className="container">
                <Header records={records} />
                <div className="content">
                  <SideBar records={records} />
                  <Routes>
                    <Route
                      path="/content"
                      element={<MainContent records={records} />}
                    />
                    <Route
                      path="/EditLibrary"
                      element={<EditLibrary records={records} />}
                    />
                    <Route path="/AddLibrary" element={<AddLibrary />} />
                  </Routes>
                </div>
              </div>
            )}
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
