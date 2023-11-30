import { BASE_URL } from "../constants/config";
import axios from "axios";

/* Getting the token from the session storage. */
const token = sessionStorage.getItem("token");

// All api calls to get data.
// getApi.js

//const endPoint = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;

/**
 * Get the Details from Database.
 * @function getDataFromApi
 * @param {apiName} string api to get data from
 * @param {token}  string
 */

export const getDataFromApi = (apiName, token) => {
  /* Checking if the token is not present then it will get the token from the session storage. */
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  /* A fetch call to get the data from the server. */
  return fetch(BASE_URL + "/" + apiName, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then((myJson) => {
      return myJson;
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Post the Data to Database.
 * @function postDataToApi
 * @param {apiName} string api to get data from
 * @param {data} Object the collection of data passing to database
 * @param {method = "POST"}
 * @param {token}  string
 */
export const postDataToApi = (apiName, data, method = "POST", token) => {
  /* Checking if the token is not present then it will get the token from the session storage. */
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  /* A fetch call to get the data from the server. */
  return fetch(BASE_URL + "/" + apiName, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    method: method,
    body: data,
  })
    .then(function (response) {
      return response.json();
    })
    .then((myJson) => {
      return myJson;
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * Post the Details to Database.
 * Saving file in server
 * Uses axios package
 * @function axiosPostDataToApi
 * @param {apiName} string api to get data from
 * @param {body} Object the collection of data passing to database
 * @param {token}  string
 */

export const axiosPostDataToApi = (apiName, body, token) => {
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token,
  };
  console.log("57", token);
  return axios
    .post(BASE_URL + "/" + apiName, body, {
      headers: headers,
    })
    .then(function (response) {
      return response;
    })
    .then((myJson) => {
      return myJson;
    })
    .catch((error) => {
      throw error;
    });
};
