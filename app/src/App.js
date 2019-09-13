import React, {useState} from 'react';

import Container from "react-bootstrap/Container";

import Toolbar from "./components/Toolbar";

const App = () => {
  const [image, setImage] = useState("");

  const handleChange = image => setImage(image);

  return (
    // Because 15px either side of padding
    <Container style={{maxWidth: "530px", padding: "30px 15px", marginBottom: "15px"}}> 
      <h1>Pop Art</h1>
      <p>Some pop art</p>
      <hr/>
      <Toolbar onChange={handleChange}/>
      {image && <img style={{maxWidth: "500px", width: "100%"}} src={image}/>}
    </Container>
  );
}

export default App;
