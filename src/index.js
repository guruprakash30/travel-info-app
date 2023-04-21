import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Map from "./MapRoutingMachine";
import UserDetails from "./userDetails";

ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>

<Routes>

    <Route path="/" element={<App/>}/>
    <Route path="/get/:id" element={<Map/>}/>
    <Route exact path="/user/details/:travelType" element={<UserDetails/>}/>
</Routes>
</Router>, document.getElementById("root"));
