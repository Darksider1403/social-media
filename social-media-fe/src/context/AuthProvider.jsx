import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../redux/Auth/auth.action";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken && !token) {
      dispatch(getProfileAction(storedToken));
    }
  }, []);

  return children;
};

export default AuthProvider;
