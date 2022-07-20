import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";

import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const isServer = typeof window === "undefined" ? false : true;
const userSubject = new BehaviorSubject(
  isServer && JSON.parse(localStorage.getItem("user"))
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  logout,
  getAll,
  update,
  register,
  getByUsername,
  delete: _delete,
};

function login(username, password) {
  return fetchWrapper
    .post(`${baseUrl}/authenticate`, { username, password })
    .then((user) => {
      // publish user to subscribers and store in local storage to stay logged in between page refreshes
      userSubject.next(user);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem("user");
  userSubject.next(null);
  Router.push("/login");
}

function register(user) {
  return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll() {
  return fetchWrapper.get(baseUrl);
}

function getByUsername(username) {
  return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(username, params) {
  return fetchWrapper.put(`${baseUrl}/${username}`, params).then((x) => {
    // update stored user if the logged in user updated their own record
    if (username === userSubject.value.username) {
      // update local storage
      const user = { ...userSubject.value, ...params };
      localStorage.setItem("user", JSON.stringify(user));

      // publish updated user to subscribers
      userSubject.next(user);
    }

    return x;
  });
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(username) {
  return fetchWrapper.delete(`${baseUrl}/${username}`);
}
