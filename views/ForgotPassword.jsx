import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Form } from "react-bootstrap";
import ShowAlert from "./Alert";
const isValidEmail = require("./validEmail.js");

import "./styles/style.css";

const BuildForm = (props) => {

  const status = props?.message?.status ? props.message.status : "blue"
  const message = props?.message?.message ? props.message.message : null
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
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

        {status == "green" && (
          <>
            <ShowAlert
              message={`${message}`}
              className="alert alert-primary text-center"
              variant="success text-sm"
            />
          </>
        )}

        {email.length < 1 && status == "red" && (
          <ShowAlert
            message={`${message}`}
            className="alert alert-primary text-center"
            variant="danger text-sm"
          />
        )}

        {email.length < 1 && status == "blue" && (
          <ShowAlert
            message="Enter your email address to begin the password reset process"
            className="alert alert-primary text-center"
            variant="primary text-sm"
          />
        )}

        {/* {email.length > 0 && !isValidEmail(email) && (
          <ShowAlert
            message={`${email} is not a valid email.`}
            className="alert alert-primary text-center"
            variant="danger text-sm"
          />
        )} */}

        <Form
        className="mb-5"
          id="forgotPasswordForm"
          method="post"
          action="/api/passwordReset/sendEmailToken"
        >
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
              <a href="/login" className="text-decoration-none">
                Login
              </a>
            </p>
          </div>
        </Form>
      </div>
    </>
  );
};

const EmailForm = (email) => { }

const ForgotPassword = (props) => {
  return (
    <Layout response={props}>
      <BuildForm message={props.response.data} />
    </Layout>
  );
};

export default ForgotPassword;
