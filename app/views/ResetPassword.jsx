import React from "react";
import Layout from "./shared/Layout";
import { Alert, Button, Form } from "react-bootstrap";

const BuildForm = ({ err }) => {
  let showAlert = false;
  err.length > 0 ? (showAlert = true) : (showAlert = false);

  return (
    <>
      <div class="mx-auto w-50 p-3 mw-70">
        <h1>Reset Password</h1>
        <Form
          id="forgotPasswordForm"
          className="mb-5"
          method="post"
          action="/resetPassword"
        >
          <Alert
            className="alert alert-danger"
            variant="danger"
            show={showAlert}
          >
            {err}
          </Alert>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Confirm Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Confirm Email"
              name="email"
            />
          </Form.Group>
            <Button
              className="d-flex align-self-center"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>          
        </Form>
      </div>
    </>
  );

  
};



const Login = (props) => {
  return (
    <Layout us={props.us}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default Login;
