import React from "react";
import Layout from "./shared/Layout";
import { Alert, Button, Form } from "react-bootstrap";

const BuildForm = ({ err }) => {
  let showAlert = false;
  err.length > 0 ? (showAlert = true) : (showAlert = false);

  return (
    <>
      <div class="mx-auto w-50 p-3 mw-70">
        <h3>Forgot Password?</h3>
        <Form
          id="forgotPasswordForm"
          className="mb-5"
          method="post"
          action="/sendEmail"
        >
          <Alert
            className="alert alert-danger"
            variant="danger"
            show={showAlert}
          >
            {err}
          </Alert>
          <Alert className="alert alert-primary" variant="primary text-sm">
            Enter your email address to begin the password reset process.
          </Alert>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
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

const Login = (props) => {
  return (
    <Layout user={props.user}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default Login;
