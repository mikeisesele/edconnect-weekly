import React, { useState, useEffect} from "react";
import Layout from "./shared/Layout";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import isValidEmail  from "../utils/validEmail";
import ShowAlert from "./Alert"
import "../views/styles/style.css";

const facebookIcon = <FontAwesomeIcon  className="facebook-icon" icon={faFacebook} />;
const googleIcon = <FontAwesomeIcon icon={faGoogle} />;

const BuildForm = ({ error }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState({});

    const handleInput = (e) => {
      const { name, value } = e.target;
      switch (name) {
        case "email":
          setEmail(value);
          break;
        case "password":
          setPassword(value);
          break;

        default:
      }
    };

    useEffect(() => {
      setRemember({
        email,
        password,
      });
    }, []);

  return (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h1>Login</h1>
        {email.length > 0 && !isValidEmail(email) && (
          <ShowAlert
            message={`${email} is not a valid email.`}
            className="alert alert-primary"
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

        {error.length > 0 && (
          <ShowAlert
            message={`${error}`}
            className="text-center"
            variant="danger text-sm"
          />
        )}

        <Form id="loginForm" className="mb-3" method="post" action="/login">
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

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleInput}
            />
          </Form.Group>

          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              Login
            </Button>
            <p className="ml-3 mb-0 pb-0">
              <a href="/forgotPassword" className="text-decoration-none">
                Forgot Password?
              </a>
            </p>
          </div>
        </Form>
        <div className="d-flex justify-content-center">
          <Button href="/auth/facebook" className="btn btn-primary m-3">
            {facebookIcon} Login with Facebook
          </Button>
          <Button href="/auth/google" className=" btn btn-danger m-3">
            {googleIcon} Login with Google
          </Button>
        </div>
      </div>
    </>
  );
};

const Login = (props) => {
  return (
    <Layout response={props}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default Login;
