import React from 'react';

import Container from "react-bootstrap/Container";

import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";

const App = () => (
  <Container style={{maxWidth: "500px"}}>
    <h1>Pop Art</h1>
    <p>Some pop art</p>
    <hr/>
    <Toolbar />
    <Preview />
  </Container>
)

export default App;
