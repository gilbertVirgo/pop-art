import React, {useState} from 'react';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FaDownload } from 'react-icons/fa';

import Toolbar from "./components/Toolbar";


const App = () => {
  const [image, setImage] = useState("");

  const handleChange = image => setImage(image);

  return (
    // Because 15px either side of padding
    <Container style={{maxWidth: "530px", padding: "30px 15px", marginBottom: "15px"}}> 
      <h1>Pop Art</h1>
      <h4 className="text-muted">A little idea I had</h4>
      <p>Upload an image to play with. Faces work well.</p>
      <hr/>
      <Toolbar onChange={handleChange}/>
      {image && (<>
        <img style={{maxWidth: "500px", width: "100%"}} src={image}/>
        
        <a download={`popart-${Date.now()}.png`} href={image} style={{display: "block", margin: "15px 0 0"}}>
          <Button variant="dark">Download <FaDownload/></Button>
        </a>
      </>)}
    </Container>
  );
}

export default App;
