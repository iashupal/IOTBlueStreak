import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { AuthenticationDetails } from "amazon-cognito-identity-js";

const UseForm = (callback, validate) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
    const authDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password,
    });
    // if (checked && email !== "") {
    //   localStorage.email = email;
    //   localStorage.password = password;
    //   localStorage.checkbox = checked;
    // }
    Auth.signIn(authDetails)
      .then((data) => {
        // localStorage.setItem("token", data.session.idToken.jwtToken);
        window.location.href = "/";
        console.log("Logged in", data);
      })
      .catch((err) => {
        console.error("Failed to login", err);
      });
  };

  const handleChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  };
};

export default UseForm;
