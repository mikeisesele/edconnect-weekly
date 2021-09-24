import React from "react";
import { Button, Form, FormControl, Nav, Navbar, Image } from "react-bootstrap";

const Header = (props) => {
 
 
  const currentUser = props?.response?.currentUser
    ? props.response.currentUser
    : null;
           
   

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand>
          {" "}
          <Nav.Link href="/" style={{ color: "white" }}>
            Project Explorer
          </Nav.Link>{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search Projects"
              className="mr-sm-2"
            />
            <Button variant="outline-light">Search</Button>
          </Form>
          <Nav className="mr-auto">
            <Nav.Link href="/projects/all">
              All Projects
            </Nav.Link>
          </Nav>
          <Nav id="every" className="d-flex align-items-center">
            {currentUser.firstName != null ? (
              <>
                <Nav.Link id="logout" href="/logout">
                  Logout
                </Nav.Link>
                <Nav.Link
                  id="username"
                  href="/profile"
                >{`Hi ${currentUser.firstName}`}</Nav.Link>
                <Nav.Link href="/profile">
                  <Image
                    src={`${currentUser.profilePicture}`}
                    roundedCircle
                    style={{ height: 3 + "rem", width: 3 + "rem" }}
                    className="ml-2"
                  ></Image>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <br />
    </>
  );
};

export default Header;
