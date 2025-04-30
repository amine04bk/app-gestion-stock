import React, { Component } from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";

function Sidebar({ color, image, routes }) {
  const id_role = localStorage.getItem("roles");
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
      />
      <div className="sidebar-wrapper">
        <div className="logo">
          {/* <a
            href="https://www.creative-tim.com?ref=lbd-sidebar"
            className="simple-text logo-mini mx-1"
          > */}
          
           <div className="logo-img">
            <img src={require("../../assets/img/lgo.jpg")} alt="Logo" width="250" height="250" />
     
          </div> 
           
          {/* </a> */}
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              if (prop.id_role.includes(id_role))
                return (
                  <li
                    className={prop.className}
                    key={key}
                  >
                    <NavLink
                      to={prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
