import React, {useState} from 'react';

import Container from "react-bootstrap/Container";

import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";



const App = () => {
  const [image, setImage] = useState(null);
  const [context, setContext] = useState(null);

  return (
    // Because 15px either side of padding
    <Container style={{maxWidth: "530px"}}> 
      <h1>Pop Art</h1>
      <p>Some pop art</p>
      <hr/>
      {context && <Toolbar onLoad={image => setImage(image)} context={context}/>}
      <Preview onLoad={context => setContext(context)} image={image || {width: 500, height: 500}}/>
    </Container>
  );
}

export default App;
