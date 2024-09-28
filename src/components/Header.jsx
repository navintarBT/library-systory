import "./Header.css";
// import * as React from "react";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./Spinner.css";
import Spinner from "./Spinner";
function Header({ records }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const IP_ADDRESS = process.env.VITE_IP_ADDRESS;
  const query = new URLSearchParams(location.search);
  const LibraryId = query.get("id");
  let libraryData = records.find((item) => item._id == LibraryId);
  let username = libraryData && libraryData.CREATE_BY;
  const loggedInUsername = sessionStorage.getItem("username");
  const loggedInUsernameRole = sessionStorage.getItem("admin");
  // check username according ID and get name
  let CheckUserLogin = username == loggedInUsername;
  // check delete Lirbary
  let CheckUserDelete = loggedInUsernameRole === "admin";

  function onLogout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("admin");
    navigate("/");
    window.location.reload();
  }

  useEffect(() => {
    if (records && records.length === 0) {
      navigate("/AddLibrary");
    } else if (handleDelete && records ) {
      navigate(`/content?id=${records[records.length-1]._id}`);
    }
  }, []);

  // function delete
  const handleDelete = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success swal2-confirm",
        cancelButton: "btn btn-danger swal2-cancel",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Do you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(true);
            // Send delete request to the server
            await axios.delete(`${IP_ADDRESS}/library/delete/library/${id}`);
            
            // Show success alert
            const successResult = await swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "The item has been deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });
  
            // Navigate to the last record or AddLibrary if none are left
            const updatedRecords = records.filter((item) => item._id !== id);
  
            if (updatedRecords.length > 0) {
              // Navigate to the last record if any exist
              navigate(`/content?id=${updatedRecords[updatedRecords.length - 1]._id}`);
            } else {
              // If no records left, navigate to the AddLibrary page
              navigate("/AddLibrary");
            }
            // Reload the page after successful navigation
            if (successResult.isConfirmed) {
              window.location.reload();
            }
          } catch (error) {
            console.error("Error deleting record:", error);
            swalWithBootstrapButtons.fire({
              title: "Error",
              text: "There was an error deleting the record.",
              icon: "error",
            });
          } finally {
            setLoading(false);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "",
            icon: "error",
          });
        }
      });
  };
  

  return (
    <>
      {loading && <Spinner />}
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            {records && records.length > 0 ? (
              <NavLink to={`/content?id=${records[records.length-1]._id}`}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/cae4fb078c75a656bef67378beae8c2fee523fff5a7fff8caed98f6ea5f85c35?apiKey=b53945e59ede4d0cb34670777c19b8a0&"
                  alt="Systory Library Logo"
                />
                <div className="logo-text">Systory Library</div>
              </NavLink>
            ) : (
              <>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/cae4fb078c75a656bef67378beae8c2fee523fff5a7fff8caed98f6ea5f85c35?apiKey=b53945e59ede4d0cb34670777c19b8a0&"
                  alt="Systory Library Logo"
                />
                <div className="logo-text">Systory Library</div>
              </>
            )}
          </div>
          <div className="navbar-actions">
            {location.pathname !== "/AddLibrary" && (
              <>
                {CheckUserDelete && records && records.length > 0 && (
                  <>
                    <button
                      className="edit-library"
                      onClick={() => handleDelete(LibraryId)}
                      // disabled={loading}
                    >
                      Delete Library
                    </button>
                  </>
                )}

                {CheckUserLogin && (
                  <NavLink to={`/EditLibrary?id=${LibraryId}`}>
                    <button className="edit-library">Edit Library</button>
                  </NavLink>
                )}
              </>
            )}

            <NavLink to="/AddLibrary">
              <button className="add-library">Add Library</button>
            </NavLink>
            <button className="logout" onClick={() => onLogout()}>
              Log out
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
