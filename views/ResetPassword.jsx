import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button } from "react-bootstrap";
import ShowAlert from "./Alert";
import PasswordResetForm from "./PasswordResetForm";
import "./styles/style.css";

const BuildForm = (props) => {
  
  const message = props.message.info ? props.message.info : null;
  const status = props.message.status;
  const isToken = props.message.token ? props.message.token : null;
  const token = props.message ? props.message : null;

  return isToken ? (
    <PasswordResetForm token={token} />
  ) : (
    <div className="mx-auto w-50 p-3 mw-70">
      {status && (
        <>
          <h3 className="text-center mb-5">Password change successful</h3>
          <ShowAlert
            message={`${message}`}
            className="text-center mb-5"
            variant="success text-sm"
          />
          <Button
            className="d-flex align-self-center w-20 px-30 "
            variant="primary"
            type="submit"
            href="/login"
            id="login_btn"
          >
            Login
          </Button>
        </>
      )}

      {!status && message == "Invalid token" ? (
        <>
          <h3 className="text-center mb-5">Change Password</h3>
          <ShowAlert
            message={`${message}.`}
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
      ) : (
        <>
          <h3 className="text-center mb-5">Return to login</h3>
          <ShowAlert
            message={`${message}.`}
            className="text-center mb-3"
            variant="danger text-sm"
          />
          <PasswordResetForm token={token} />
        </>
      )}
    </div>
  );
};

const ResetPassword = (props) => {
  cosole.log(props);
  return (
    <Layout message={props.message}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default ResetPassword;
