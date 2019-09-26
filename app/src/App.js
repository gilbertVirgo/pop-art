import React, {useState, useRef, useEffect} from 'react';

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
	const [frame, setFrame] = useState(null);
	const [context, setContext] = useState(null);

	const canvas = useRef(null);

	useEffect(() => {
		if(canvas.current) setContext(canvas.current.getContext("2d"));
	}, [canvas]);

	return (
		// Because 15px either side of padding
		<Container style={{maxWidth: "530px", padding: "30px 15px", marginBottom: "15px"}}> 
			<h1>Pop Art</h1>
			<h4 className="text-muted">A little idea I had</h4>
			<p>Upload an image to play with. Faces work well.</p>
			<hr/>

			{context && <Toolbar 
				context={context} 
				image={image} 
				onImage={setImage} 
				onFrame={setFrame}/>}

			<canvas 
				ref={canvas} 
				style={{maxWidth: "500px", width: "100%"}}/>
			
			<ButtonGroup style={{display: "block", margin: "15px 0"}}>
				{frame && <a download={`popart-${Date.now()}.png`} href={frame} style={{display: "inline-block", marginRight: "15px"}}>
					<Button variant="dark">Download <FaDownload/></Button>
				</a>}
				<FacebookShareButton url="http://filter.gilbertvirgo.com" style={{display: "inline-block", marginRight: "15px"}} hashtag="#filter">
					<FacebookIcon size={30} round />
				</FacebookShareButton>
				<TwitterShareButton url="http://filter.gilbertvirgo.com" style={{display: "inline-block", marginRight: "15px"}}>
					<TwitterIcon size={30} round />
				</TwitterShareButton>
			</ButtonGroup>

			<MetaTags>
				<meta property="og:title" content="Filter | Gilbert Virgo" />
				<meta property="og:image" content={image} />
			</MetaTags>
		</Container>
	);
}

export default App;
