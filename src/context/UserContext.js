import React, { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserContextProvider(props) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState({});
	const [userLoading, setUserLoading] = useState(false);
	const [authErrors, setAuthErrors] = useState({});

	const URI = "https://planitout-server.onrender.com";

	const register = (newUser) => {
		setUserLoading(true);

		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			axios
				.post(URI + "/api/users/register", newUser, config)
				.then((res) => {
					window.localStorage.setItem("budget-token", res.data.user.token);
					setIsAuthenticated(true);
					setUser(res.data.user);
					setUserLoading(false);
					resolve();
				})
				.catch((err) => {
					setUserLoading(false);
					reject({ register: err.response.data.msg });
				});
		});
	};

	const login = (user) => {
		setUserLoading(true);

		return new Promise((resolve, reject) => {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			axios
				.post(URI + "/api/users/login", user, config)
				.then((res) => {
					window.localStorage.setItem("budget-token", res.data.user.token);
					setIsAuthenticated(true);
					setUser(res.data.user);
					setUserLoading(false);
					resolve();
				})
				.catch((err) => {
					setUserLoading(false);
					reject({ login: err.response.data.msg });
				});
		});
	};

	const loadUser = () => {
		return new Promise((resolve) => {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const token = window.localStorage.getItem("budget-token");

			if (token) {
				config.headers["x-auth-token"] = token;
			}

			axios
				.get(URI + "/api/users", config)
				.then((res) => {
					setIsAuthenticated(true);
					setUser(res.data);
					resolve();
				})
				.catch((err) => {
					setAuthErrors({ loadUser: err.response.data.msg });
					resolve();
				});
		});
	};

	return (
		<UserContext.Provider
			value={{
				isAuthenticated,
				user,
				userLoading,
				authErrors,
				register,
				login,
				loadUser,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
}
