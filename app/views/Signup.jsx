import React from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import Layout from "./shared/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const facebookIcon = <FontAwesomeIcon icon={faFacebook} />;
const googleIcon = <FontAwesomeIcon icon={faGoogle} />;

const MainSignup = (props) => {
  const { program, graduationYear, err } = props;
  let showAlert = false;
  err.length > 0 ? (showAlert = true) : (showAlert = false);

  return (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h1>Signup</h1>
        <Form id="signupForm" method="post" action="/signup">
          {
            <Alert
              className="alert alert-danger"
              variant="danger"
              show={showAlert}
            >
              {err.map((text) => {
                return (
                  <>
                    {text}
                    <br />
                  </>
                );
              })}
            </Alert>
          }
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>First Name:</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control type="text" name="lastName" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} xs={6}>
              <Form.Label>Program:</Form.Label>
              <Form.Control as="select" name="program">
                <option>Select Option</option>
                {program.map((prog) => (
                  <option key={prog}>{prog}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Matric Number:</Form.Label>
              <Form.Control name="matricNumber" />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Graduation Year:</Form.Label>
              <Form.Control as="select" name="graduationYear">
                <option>Select Option</option>
                {graduationYear.map((year) => (
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
            <Button href="/auth/facebook" class="btn btn-primary m-3">
              {facebookIcon} Sign up with Facebook
            </Button>
            <Button href="/auth/google" class=" btn btn-danger m-3">
              {googleIcon} Sign up with Google
            </Button>
          </div>
      </div>
    </>
  );
};

const Signup = (props) => {
  return (
    <Layout us={props.us}>
      <MainSignup {...props} />
    </Layout>
  );
};

export default Signup;
