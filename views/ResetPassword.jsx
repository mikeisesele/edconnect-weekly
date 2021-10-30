import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button } from "react-bootstrap";
import ShowAlert from "./Alert";
import PasswordResetForm from "./PasswordResetForm";
import "./styles/style.css";

const BuildForm = (props) => {
  
  const resetTokenValue = props.response.data.resetToken? props.response.data.resetToken : "";
  const message = props.response.data.message
    ? props.response.data.message
    : null;
  const status = props.response.data.status = true ? true : false;                    
  const isToken = props.response.data.token = true ? true : false;
  const token = props.response.data.message
    ? props.response.data.message
    : null;

    return (
      <>
        {isToken == true && status == true && (
          <PasswordResetForm token={token} />
        )}
        <div className="mx-auto w-50 p-3">
          {(status == true && isToken == null) ||
            false ||
            (undefined && (
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
            ))}

          {!status && message == "Invalid token" && (
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
                href="/forgotPassword"
              >
                Go to Forgot Password
              </Button>
            </>
          )}
        </div>
        );
      </>
    );
};

const ResetPassword = (props) => {
  
  return (
    <Layout response={props}>
      <BuildForm {...props} />
    </Layout>
  );
};

export default ResetPassword;
