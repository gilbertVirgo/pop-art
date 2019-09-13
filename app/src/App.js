import React, {useState} from 'react';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaDownload } from 'react-icons/fa';

import Toolbar from "./components/Toolbar";

import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon
} from "react-share";

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
        
        <ButtonGroup style={{display: "block", margin: "15px 0"}}>
          <a download={`popart-${Date.now()}.png`} href={image} style={{display: "inline-block", marginRight: "15px"}}>
            <Button variant="dark">Download <FaDownload/></Button>
          </a>
          <FacebookShareButton url={window.location.href} style={{display: "inline-block", marginRight: "15px"}} quote="I just created a thing" hashtag="#filter">
            <FacebookIcon size="30px" round />
          </FacebookShareButton>
          <TwitterShareButton url={window.location.href} style={{display: "inline-block", marginRight: "15px"}} title="I just created a thing">
            <TwitterIcon size="30px" round />
          </TwitterShareButton>
        </ButtonGroup>
      </>)}
    </Container>
  );
}

export default App;
