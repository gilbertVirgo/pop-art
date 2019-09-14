import React, {useState} from 'react';

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { FaDownload } from 'react-icons/fa';
import MetaTags from "react-meta-tags";

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
          <FacebookShareButton url="http://filter.gilbertvirgo.com" style={{display: "inline-block", marginRight: "15px"}} hashtag="#filter">
            <FacebookIcon size="30px" round />
          </FacebookShareButton>
          <TwitterShareButton url="http://filter.gilbertvirgo.com" style={{display: "inline-block", marginRight: "15px"}}>
            <TwitterIcon size="30px" round />
          </TwitterShareButton>
        </ButtonGroup>

        <MetaTags>
            <title>Page 1</title>
            <meta property="og:title" content="Filter | Gilbert Virgo" />
            <meta property="og:image" content={image} />
          </MetaTags>
      </>)}
    </Container>
  );
}

export default App;
