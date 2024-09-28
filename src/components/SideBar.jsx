import "./SideBar.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function SideBar({ records }) {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  let activeLibraryId = query.get("id");

  // check data value
  if (!records && records.length > 0) {
    return null;
  }
  const filteredLibraries = records
  .filter((item) => item.LIB_NAME.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => b._id.toString().localeCompare(a._id.toString())); // Descending order based on _id


  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="library-list">
            <input
              placeholder="Search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filteredLibraries.map((library, index) => (
              <NavLink
                key={index}
                to={`/content?id=${library._id}`}
                className={`library-item ${
                  activeLibraryId == library._id ? "selected" : ""
                }`}
              >
                <div className="library-indicator" />
                <div className="library-label">{library.LIB_NAME}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
