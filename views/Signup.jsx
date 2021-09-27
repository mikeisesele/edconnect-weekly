import React, { useState, useEffect } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Layout from "./shared/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
const isValidEmail = require("./validEmail.js");
import "../views/styles/style.css";

const facebookIcon = <FontAwesomeIcon icon={faFacebook} />;
const googleIcon = <FontAwesomeIcon icon={faGoogle} />;

const MainSignup = (props) => {

  const { programs, graduationYears } = props?.response?.data ?  props.response.data : null
  const error = props.error ? props.error : null

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [remember, setRemember] = useState({});

    useEffect(() => {
      setRemember({
        email,
        password,
        firstName,
        lastName,
        matricNumber,
      });
    }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "matricNumber":
        setMatricNumber(value);
        break;
      default:
    }
  };

  return (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h1>Signup</h1>
        <Form id="signupForm" method="post" action="/signup">
          {error.length > 0 && (
            <ShowAlert
              message={`${error.map((text) => {
                return (
                  <>
                    {text}
                    <br />
                  </>
                );
              })}
              `}
              className="text-center alert alert-danger"
              variant="danger text-sm"
            />
          )}

          {email.length > 0 && !isValidEmail(email) && (
            <ShowAlert
              message={`${email} is not a valid email.`}
              className="alert alert-primary text-center"
              variant="danger text-sm"
            />
          )}

          {password.length > 0 && password.length < 7 && (
            <ShowAlert
              message="Password must be 7 characters or more."
              className="text-center"
              variant="danger text-sm"
            />
          )}

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleInput}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInput}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleInput}
                name="email"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleInput}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} xs={6}>
              <Form.Label>Program</Form.Label>
              <Form.Control as="select" name="program">
                <option>Select Option</option>
                {programs.map((program) => (
                  <option key={program}>{program}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Matric Number</Form.Label>
              <Form.Control
                name="matricNumber"
                placeholder="Matric Number"
                value={matricNumber}
                onChange={handleInput}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Graduation Year</Form.Label>
              <Form.Control as="select" name="graduationYear">
                <option>Select Option</option>
                {graduationYears.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
        <div className="d-flex justify-content-center">
          <Button href="/auth/facebook" className="btn btn-primary m-3">
            {facebookIcon} Sign up with Facebook
          </Button>
          <Button href="/auth/google" className=" btn btn-danger m-3">
            {googleIcon} Sign up with Google
          </Button>
        </div>
      </div>
    </>
  );
};

const Signup = (props) => {
  return (
    <Layout response={props}>
      <MainSignup {...props} />
    </Layout>
  );
};

export default Signup;
