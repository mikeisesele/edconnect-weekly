import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Form } from "react-bootstrap";
import ShowAlert from "./Alert";
import isValidEmail from "./validEMail";
import "./styles/style.css";

const BuildForm = (props) => {
  console.log(props);
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      default:
    }
  };

  useEffect(() => {
    setRemember({
      email,
    });
  }, []);

  return (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h3 className="text-center">Forgot Password?</h3>
        <Form
          id="forgotPasswordForm"
          className="mb-5"
          method="post"
          action="/emailforresetpassword"
        >
          {email.length < 1 &&
            (props.message ? (
              <ShowAlert
                message={`${props.message}`}
                className="alert alert-primary text-center"
                variant="danger text-sm"
              />
            ) : (
              <ShowAlert
                message="Enter your email address to begin the password reset process"
                className="alert alert-primary text-center"
                variant="primary text-sm"
              />
            ))}

          {email.length > 0 && !isValidEmail(email) && (
            <ShowAlert
              message={`${email} is not a valid email.`}
              className="alert alert-primary text-center"
              variant="danger text-sm"
            />
          )}

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleInput}
              name="email"
            />
          </Form.Group>
          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <p className="ml-3 mb-0 pb-0">
              <a href="/login" classname="text-decoration-none">
                Login
              </a>
            </p>
          </div>
        </Form>
      </div>
    </>
  );
};

const ForgotPassword = (props) => {
  return (
    <Layout user={props.user}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default ForgotPassword;
