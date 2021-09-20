import React from "react";
import Layout from "./shared/Layout";
import { Alert, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const facebookIcon = <FontAwesomeIcon icon={faFacebook} />;
const googleIcon = <FontAwesomeIcon icon={faGoogle} />;

const BuildForm = ({ err }) => {
  let showAlert = false;
  err.length > 0 ? (showAlert = true) : (showAlert = false);

  return (
    <>
      <div class="mx-auto w-50 p-3 mw-70">
        <h1>Login</h1>
        <Form id="loginForm" className="mb-3" method="post" action="/login">
          <Alert
            className="alert alert-danger"
            variant="danger"
            show={showAlert}
          >
            {err}
          </Alert>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
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
    <Layout user={props.user}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default Login;
