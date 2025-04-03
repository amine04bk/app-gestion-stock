import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";

import routes from "../routes";
import { verifyToken } from "../Utils/utils";
import { useCallback } from "react";

function Admin() {
  const id_role = localStorage.getItem("roles");

  const [users, setUsers] = React.useState(null);
  const dispatch = useDispatch();
  const [color, setColor] = React.useState("black");
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    console.log(id_role);
    
    return routes.map((prop, key) => {
      if (prop.id_role.includes(id_role))
        return (
          <Route
            path={prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
    });
  };
  React.useEffect(() => {
    if (users === null) {
      /* getUser() */
      /* verifyToken(dispatch);
      setUsers("eee") */
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar user={users} />
          <div className="content">
            <Switch>
              {getRoutes(routes)}
              <Route exact path="/">
                <Redirect from="*" to="/user/list" />
              </Route>
              {/* <Route path="/*">
                <Redirect to="/notFound" />
              </Route> */}
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
