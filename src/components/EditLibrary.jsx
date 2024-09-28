// import * as React from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";
import fs from 'fs';
import "../common/51-modern-default.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./AddLibrary.css";
import FileInput from "./FileInput";
import ImageInput from "./ImageInput";

function EditLibrary({ records }) {
  const navigate = useNavigate();
  const IP_ADDRESS = process.env.VITE_IP_ADDRESS;

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("username");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const LibraryId = query.get("id");
  let libraryData = records.find((item) => item._id == LibraryId);
  // form
  const [id, setId] = useState("");
  const [libraryName, setLibraryName] = useState("");
  const [userName, setUserName] = useState("");
  const [files, setFiles] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [installationDes, setInstallationDes] = useState("");
  const [HowToUseDes, setHowToUseDes] = useState("");
  const [exampleDes, setExampleDes] = useState("");
  const [overviewDes, setOverviewDes] = useState("");
  const [suggestionDes, setSuggestionDes] = useState("");
  // form
  const [idCounterInstallations, setIdCounterInstallation] = useState(1);
  const [idCounterHowToUse, setIdCounterHowToUse] = useState(1);
  const [idCounterExamPle, setIdCounterExamPle] = useState(1);

  // Define the initial rows in state
  const [rowsInstallations, setRowsInstallations] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);
  const [rowsHowToUse, setRowsHowToUse] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);
  const [rowsExample, setRowsExamPle] = useState([
    { id: 1, title: "", description: "", example: "" },
  ]);

  useEffect(() => {
    const getRawFile = async (files, formDataKey) => {
      const formData = new FormData();
        // Loop through each file in fileArray
        for (let fileInfo of files) {
          // Fetch each file
          let filename = formDataKey == 'files' ? fileInfo.filename : fileInfo;
          let response = await axios.get(`${IP_ADDRESS}/library/files/${filename}`, {
            responseType: 'arraybuffer' // Ensure the response is in binary format
          });
          // Create a Blob from the response data
          const fileType = (filename).split('.').pop();
          const blob = new Blob([response.data], { type: `application/${fileType}` });
          // Append the Blob to FormData
          formData.append(formDataKey, blob, filename);
        }
        // Extract file details from FormData
        let fileDetails = [];
        for (let [key, value] of formData.entries()) {
          if (value instanceof Blob) {
            fileDetails.push({
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: value.lastModified,
              lastModifiedDate: new Date(value.lastModifiedDate)
            });
          }
        }
        return formData;
    }

    const fetchData = async () => {
      try {
        let fileArray = JSON.parse(libraryData.ATTRACHMENT);
        // Set files with the details
        setFiles(await getRawFile(fileArray, 'files'));
        // Set files with the details
        setImage(await getRawFile([libraryData.IMAGE], 'image'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (libraryData) {
      setId(libraryData._id);
      setLibraryName(libraryData.LIB_NAME || "");
      setDescription(libraryData.DESCRIPTION || "");
      setReference(libraryData.REFERENCE || "");
      setInstallationDes(libraryData.DESCRIPTIONS_INS || "");
      setHowToUseDes(libraryData.DESCRIPTIONS_HTU || "");
      setExampleDes(libraryData.DESCRIPTIONS_EXP || "");
      setOverviewDes(libraryData.DESCRIPTIONS_OVER || "");
      setSuggestionDes(libraryData.DESCRIPTIONS_SGT || "");

      setRowsInstallations(JSON.parse(libraryData.INSTALLATION));
      setIdCounterInstallation(libraryData.INSTALLATION.length + 1);
      setRowsHowToUse(JSON.parse(libraryData.HOWTOUSE));
      setIdCounterHowToUse(libraryData.HOWTOUSE.length + 1);
      setRowsExamPle(JSON.parse(libraryData.EXAMPLE));
      setIdCounterExamPle(libraryData.EXAMPLE.length + 1);
      fetchData();
    }
    console.log(libraryData.INSTALLATION);
    
  }, [libraryData]);

  // created functions keep input value
  const handleInputChangeTitle = (id, field, value, type) => {
    switch (type) {
      case "installations":
        setRowsInstallations((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      case "howToUse":
        setRowsHowToUse((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      case "example":
        setRowsExamPle((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
          )
        );
        break;
      default:
        break;
    }
  };

  //Create functions add new row
  const addRow = (type, index) => {
    switch (type) {
      case "installations":
        setIdCounterInstallation((prevCounter) => prevCounter + 1);
        setRowsInstallations((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterInstallations + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      case "howToUse":
        setIdCounterHowToUse((prevCounter) => prevCounter + 1);
        setRowsHowToUse((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterHowToUse + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      case "example":
        setIdCounterExamPle((prevCounter) => prevCounter + 1);
        setRowsExamPle((prevRows) => [
          ...prevRows.slice(0, index + 1),
          {
            id: idCounterExamPle + 1,
            title: "",
            description: "",
            example: "",
          },
          ...prevRows.slice(index + 1),
        ]);
        break;
      default:
        break;
    }
  };

  //Create functions remove row
  const removeRow = (id, type) => {
    switch (type) {
      case "installations":
        setRowsInstallations((prevRows) =>
          prevRows.filter((row) => row.id !== id)
        );
        break;
      case "howToUse":
        setRowsHowToUse((prevRows) => prevRows.filter((row) => row.id !== id));
        break;
      case "example":
        setRowsExamPle((prevRows) => prevRows.filter((row) => row.id !== id));
        break;
      default:
        break;
    }
  };

  // set username from sessionStorage to state
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
    }
  }, []);

  function onChangeFile(files) {
    setFiles(files);
  }

  function onRemoveFile(files) {
    setFiles(files);
  }

  function onChangeImage(image) {
    setImage(image);
  }
  function onRemoveImage(image) {
    setImage(image);
  }

  // create function when the click button save
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    if (files) {
      for (let [key, value] of files.entries()) {
        formData.append('files', value);
      }
    }

    if (image) {
      for (let [key, value] of image.entries()) {
        formData.append('image', value);
      }
    }

    const record = {
      id,
      libraryName,
      description,
      reference,
      overviewDes,
      installationDes,
      HowToUseDes,
      exampleDes,
      suggestionDes,
      rowsInstallations,
      rowsHowToUse,
      rowsExample,
      userName,
    };

    formData.append("record", JSON.stringify(record));
    console.log(...formData);
    
    try {
      await axios
        .put(`${IP_ADDRESS}/library/Update/Data/${libraryData._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      window.location.reload();
      window.location.href = `/content?id=${id}`;
    } catch (err) {
      console.error("Error uploading file client 4454545:", err);
    }
  }

  return (
    <>
      <main className="content-container">
        <div className="add-content">
          <section className="section">
            <div className="group">
              <label>Library Image</label>
              <ImageInput
                onChangeImage={onChangeImage}
                onRemoveImage={onRemoveImage}
                initialImage={image}
              />
            </div>
            <div className="group-row">
              <div className="group">
                <label>Library Name</label>
                <div className="kintoneplugin-input-outer">
                  <input
                    style={{ width: "102%" }}
                    className="kintoneplugin-input-text"
                    type="text"
                    value={libraryName}
                    onChange={(e) => {
                      setLibraryName(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="group-row">
              <div className="group">
                <label>Description</label>
                <div className="kintoneplugin-input-outer">
                  <textarea
                    style={{ width: "102%", height: "10rem" }}
                    className="kintoneplugin-input-text"
                    type="text"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label>Reference</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="group">
              <label>Attachment</label>
              <FileInput
                onChangeFile={onChangeFile}
                onRemoveFile={onRemoveFile}
                initialFiles={files}
              />
            </div>
            {/* ============================ */}
          </section>

          {/* overview section */}
          <section className="section" id="overview">
            <div className="section-header">Overview</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={overviewDes}
                  onChange={(e) => {
                    setOverviewDes(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>
          {/* installation section */}
          <section className="section" id="installation">
            <div className="section-header">Installation</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={installationDes}
                  onChange={(e) => {
                    setInstallationDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table Installations</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsInstallations.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "installations"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("installations", index)}
                          ></button>
                          {/* )} */}
                          {rowsInstallations.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "installations")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* how to use section */}
          <section className="section" id="installation">
            <div className="section-header">How to use</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={HowToUseDes}
                  onChange={(e) => {
                    setHowToUseDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table How to use</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsHowToUse.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "howToUse"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("howToUse", index)}
                          ></button>
                          {/* )} */}
                          {rowsHowToUse.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "howToUse")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Example section */}
          <section className="section" id="example">
            <div className="section-header">Example</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={exampleDes}
                  onChange={(e) => {
                    setExampleDes(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* table */}
            <div className="group">
              <label>Table Example</label>
              <div className="kintoneplugin-input-outer">
                <table
                  id="field_settings_table"
                  className="kintoneplugin-table"
                  style={{ width: "106%" }}
                >
                  <thead>
                    <tr className="header-Table">
                      <th className="kintoneplugin-table-th left">
                        <span className="title">Title</span>
                      </th>
                      <th className="kintoneplugin-table-th">
                        <span className="title">Description</span>
                      </th>
                      <th className="kintoneplugin-table-th rigth">
                        <span className="title">Example (Code)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody id="kintoneplugin-setting-tbody">
                    {rowsExample.map((row, index) => (
                      <tr className="item" key={row.id}>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <input
                                    className="kintoneplugin-input-text"
                                    type="text"
                                    value={row.title || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "title",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.description || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "description",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="kintoneplugin-table-td-control">
                            <div className="kintoneplugin-table-td-control-value">
                              <div className="kintoneplugin-input-outer input_select">
                                <div className="kintoneplugin-input-outer">
                                  <textarea
                                    type="text"
                                    className="kintoneplugin-input-text"
                                    value={row.example || ""}
                                    onChange={(e) =>
                                      handleInputChangeTitle(
                                        row.id,
                                        "example",
                                        e.target.value,
                                        "example"
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="kintoneplugin-table-td-operation cf-operation-column">
                          {/* {index === rows.length - 1 && ( */}
                          <button
                            type="button"
                            className="kintoneplugin-button-add-row-image addButton"
                            title="Add row"
                            onClick={() => addRow("example", index)}
                          ></button>
                          {/* )} */}
                          {rowsExample.length > 1 && (
                            <button
                              type="button"
                              className="kintoneplugin-button-remove-row-image removeButton"
                              title="Delete this row"
                              onClick={() => removeRow(row.id, "example")}
                            ></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Suggestion section */}
          <section className="section" id="suggestion">
            <div className="section-header">Suggestion</div>
            {/* description */}
            <div className="group">
              <label>Description</label>
              <div className="kintoneplugin-input-outer">
                <textarea
                  style={{ width: "100%", height: "10rem" }}
                  className="kintoneplugin-input-text"
                  type="text"
                  value={suggestionDes}
                  onChange={(e) => {
                    setSuggestionDes(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>

          <section className="section">
            <button
              className="submit"
              type="button"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Submit
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

export default EditLibrary;
