import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Form } from "react-bootstrap";
import ShowAlert from "./Alert";
import "./styles/style.css"

const BuildForm = (props) => {

  const passwordResetSuccess = props.message ? props.message : null
  const error = props.error ? props.error : null
  const token = props.token ? props.token : null
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState({});

  useEffect(() => {
    setRemember({
      newPassword,
      confirmPassword,
    });
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "password":
        setNewPassword(value);
        break;
      case "confirmpassword":
        setConfirmPassword(value);
        break;
      default:
    }
  };

  return token ? (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        <h1>Reset Password</h1>
        <Form
          id="forgotPasswordForm"
          className="mb-5"
          method="post"
          action="/api/passwordReset"
        >
          {confirmPassword.length > 0 && !(newPassword === confirmPassword) && (
            <ShowAlert
              message="Confirm new password does not match new password."
              className="text-center"
              variant="danger text-sm"
            />
          )}

          {newPassword.length > 0 && newPassword.length < 7 && (
            <ShowAlert
              message="Password must be 7 letters or more."
              className="text-center"
              variant="danger text-sm"
            />
          )}

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter New Password"
              name="password"
              onChange={handleInput}
              value={newPassword}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="confirmpassword"
              onChange={handleInput}
              value={confirmPassword}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              name="id"
              value={token?.payloadId || ""}
              readOnly
              hidden
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              name="token"
              value={token?.paramsToken || ""}
              readOnly
              hidden
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
  ) : (
    <>
      <div className="mx-auto w-50 p-3 mw-70">
        {passwordResetSuccess != "Invalid token" && (
          <>
            <h3 className="text-center mb-5">Password change successful</h3>
            <ShowAlert
              message={`${passwordResetSuccess}`}
              className="text-center mb-5"
              variant="success text-sm"
            />
            <Button
              className="d-flex align-self-center w-20 px-30 "
              variant="primary"
              type="submit"
              href="/login"
            >
              Login
            </Button>
          </>
        )}
        <>
          <h3 className="text-center mb-5">Return to login</h3>
          <ShowAlert
            message={`${passwordResetSuccess}.`}
            className="text-center mb-3"
            variant="danger text-sm"
          />

          <Button
            id="login_btn"
            className="d-flex align-self-center w-20 px-30 "
            variant="primary"
            type="submit"
            href="/login"
          >
            Login
          </Button>
        </>

        {error && (
          <>
            <h1 className="text-center mb-5">Please confirm your email</h1>
            <ShowAlert
              message={`${error}`}
              className="text-center mb-5"
              variant="danger text-sm"
            />
            <Button
              className="d-flex align-self-center w-20 px-30"
              variant="primary"
              type="submit"
              href="/forgotPassword"
            >
              Reset Password
            </Button>
          </>
        )}
      </div>
    </>
  );
};

const ResetPassword = (props) => {
  return (
    <Layout message={props.message}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default ResetPassword;
