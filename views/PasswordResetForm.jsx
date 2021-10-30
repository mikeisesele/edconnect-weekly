import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "./styles/style.css";
import ShowAlert from "./Alert";


const passwordResetForm = (props) => {

    const token = props

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
            case "confirmPassword":
            setConfirmPassword(value);
            break;
            default: 
        }
    };

    return (
      <>
        <div className="mx-auto w-50 p-3 mw-70">
          <h1>Reset Password</h1>
          <Form
            id="forgotPasswordForm"
            className="mb-5"
            method="post"
            action="/api/passwordReset"
          >
            {newPassword.length > 0 && newPassword.length < 7 && (
              <ShowAlert
                message="Password must be 7 letters or more."
                className="text-center"
                variant="danger text-sm"
              />
            )}

            {confirmPassword.length > 0 && newPassword != confirmPassword && (
              <ShowAlert
                message="Confirm new password does not match new password."
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
                name="confirmPassword"
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
    );
}

export default passwordResetForm;