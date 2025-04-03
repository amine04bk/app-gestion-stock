import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import routes from "../../routes";
import { getUserById } from "../../Redux/usersReduce";
//import { getAllMessages } from "../../Redux/chatReduce";

function Header() {
  const navigate = useHistory();
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const id = localStorage.getItem("id");
  const location = useLocation();

  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    const node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "";
  };

  const fetchUser = useCallback(async () => {
    const response = await dispatch(getUserById(id));
    const data = await response.payload.data;
    setUsername(data.username);
  }, [dispatch, id]);

  /* const fetchMessages = useCallback(async () => {
    const response = await dispatch(getAllMessages(id));
    const data = await response.payload;

    setMessages(data);
  }, [dispatch, id]); */

  function chat() {
    navigate.push("/chat");
  }

  useEffect(() => {
    fetchUser();
    //fetchMessages();
  }, [fetchUser]);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav" className="nav-header">
          <i className="fa-solid fa-comments chat-style" onClick={chat}></i>
          <Nav className="ml-auto nav-header" navbar>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                aria-expanded={false}
                aria-haspopup={true}
                as={Nav.Link}
                data-toggle="dropdown"
                id="navbarDropdownMenuLink"
                variant="default"
                className="m-0"
              >
                <span className="no-icon"><i className="fa-regular fa-bell"></i></span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                {messages.length > 0 ? (
                  messages
                    .filter((message) => message.senderId === parseInt(id) || message.receiverId === parseInt(id)) // Filter messages based on senderId or receiverId
                    .map((message, index) => (
                      <Dropdown.Item
                        key={index}
                        href="#"
                        onClick={(e) => {
                          console.log(message);
                          e.preventDefault();
                          localStorage.setItem("senderId", message.senderId);
                          localStorage.setItem("receiverId", message.receiverId);
                          setTimeout(async () => {
                             window.location.replace("/chat")
                           }, 1500);
                        }}
                      >
                        <i className="fa-solid fa-envelope"></i> {message.senderName}: {message.text}
                      </Dropdown.Item>
                    ))
                ) : (
                  <Dropdown.Item>
                    <i className="fa-solid fa-envelope"></i> No messages
                  </Dropdown.Item>
                )}

              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          <Nav className="ml-auto nav-header" navbar>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                aria-expanded={false}
                aria-haspopup={true}
                as={Nav.Link}
                data-toggle="dropdown"
                id="navbarDropdownMenuLink"
                variant="default"
                className="m-0"
              >
                <span className="no-icon">{username}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  href="#"
                  onClick={() => navigate.push("/profile")}
                >
                  <i className="fa-solid fa-user"></i> Profil
                </Dropdown.Item>
                <div className="divider"></div>
                <Dropdown.Item
                  href="#"
                  onClick={() => {
                    localStorage.clear();
                    window.location.replace("/login");
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
