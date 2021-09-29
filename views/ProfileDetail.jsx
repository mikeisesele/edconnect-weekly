import React, { useState, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Col,Image, Container, Form, Row } from "react-bootstrap";
import ShowAlert from "./Alert";

const ProfileDetails = (userParams) => {


  console.log(userParams.message.response.data)
  const error = userParams.error ? userParams.error : null
  const user = userParams.message.response.currentUser;
  const userprograms = userParams.message.response.data.programs;
  const usergraduationYears = userParams.message.response.data.graduationYears;

  // the default sattes will come from the prop
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user?.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matricNumber, setMatricNmber] = useState(user.matricNumber);
  const [program, setProgram] = useState(user.program);
  const [graduationYear, setGraduationYear] = useState(user.graduationYear);
  const [profileImage, setProfileImage] = useState("");

  // take values from the current state and fill fields
  const [userInfo, setUserInfo] = useState({});

  // when the page first loads, set the text views to the user's info
  useEffect(() => {
    setUserInfo({
      firstName,
      lastName,
      email,
      program,
      matricNumber,
      graduationYear,
    })
  }, []);

  // when the user changes the text, update the state
  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "currentPassword":
        setCurrentPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "program":
        setProgram(value);
        break;
      case "matricNumber":
        setMatricNmber(value);
        break;
      case "graduationYear":
        setGraduationYear(value);
        break;
      case "profilePicture":
        setProfileImage(value);
        break;
      default:
    }
  };

  return (
    <>
      <Container data-testid="profile-details">
        <Row id="project_name" className="d-flex align-items-end mt-3">
          <Col className="d-flex align-items-end">
            <h3 data-testid="fullName">
              {`${userInfo.firstName} 
              ${userInfo.lastName}`}
            </h3>
            <h5
              className="ml-2 text-secondary text-md"
              data-testid="email"
            >
              {userInfo.email}
            </h5>
          </Col>
        </Row>
        <Row className="bg-light m-auto pl-3 pr-3">
          <Col
            id="program"
            className="d-flex flex-column mt-2 align-content-center"
          >
            <p className="mb-0">Program</p>
            <p data-testid="program">{userInfo.program}</p>
          </Col>

          <Col className="d-flex flex-column mt-2 align-content-center">
            <p className="mb-0">Matriculation number</p>
            <p data-testid="matriculation-number">{userInfo.matricNumber}</p>
          </Col>

          <Col
            data-testid="graduation-year"
            className="d-flex flex-column mt-2 align-content-center"
          >
            <p className="mb-0">Graduation year</p>
            {userInfo.graduationYear}
          </Col>
        </Row>
        <div className="mt-3">
          <h5>Update Profile</h5>
          <br />
          <Form
            data-testid="profile-form"
            id="signupForm"
            method="post"
            data-testid="user-details"
            className="w-30 mw-70"
            action="/profile"
            encType="multipart/form-data"
          >
            {!(matricNumber && graduationYear && program) && (
              <ShowAlert
                message="Please update your profile!"
                className="text-center"
                variant="primary"
              />
            )}

            <Form.Row>
              <Form.Group data-testid="fullname" as={Col}>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={firstName}
                  placeholder="First Name"
                  onChange={handleInput}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={handleInput}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInput}
                  value={email}
                />
              </Form.Group>

              <Form.Group as={Col} xs={6}>
                <Form.Label>Program:</Form.Label>
                <Form.Control
                  as="select"
                  name="program"
                  placeholder="Program"
                  onChange={handleInput}
                  value={program}
                >
                  <option>Select Program</option>
                  {userprograms.map((program) => (
                    <option key={program}>{program}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Matric Number:</Form.Label>
                <Form.Control
               
                  name="matricNumber"
                  value={matricNumber}
                  placeholder="Matric Number"
                  onChange={handleInput}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Graduation Year:</Form.Label>
                <Form.Control
                  as="select"
                  data-testid="grad"
                  name="graduationYear"
                  placeholder="Graduation Year"
                  onChange={handleInput}
                  value={graduationYear}
                >
                  <option>Select Graduation Year</option>
                  {usergraduationYears.map((year, index) => (
                    <option key={index}>{year}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="profilePicture" className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                name="profilePicture"
                className=" border p-2"
                type="file"
                placeholder="Profile Picture"
                value={profileImage}
                onChange={handleInput}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Form>
        </div>
        <hr />
        <div className="mt-3">
          <h5>Change Password</h5>
          {confirmPassword.length > 0 && !(newPassword === confirmPassword) && (
            <ShowAlert
              message="Confirm new password does not match new password."
              className="text-center"
              variant="danger text-sm"
            />
          )}

          {confirmPassword.length > 0 && confirmPassword.length < 7 && (
            <ShowAlert
              message="Password must be 7 letters or more."
              className="text-center"
              variant="danger text-sm"
            />
          )}
          {error && (
            <ShowAlert
              message={`${error}`}
              className="text-center"
              variant="danger text-sm"
            />
          )}
          <Form
            data-testid="password-form"
            id="signupForm"
            method="post"
            action="/api/v1/password/change"
          >
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Current password</Form.Label>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  onChange={handleInput}
                  value={currentPassword}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>New password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleInput}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Confirm new Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleInput}
                />
              </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

const ProfileDetail = (props) => {
  return (
    <Layout response={props}>
      <ProfileDetails message={props} />
    </Layout>
  );
};

export default ProfileDetail;
