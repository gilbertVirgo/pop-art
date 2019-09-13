import React, {useRef, useEffect, useState} from "react";

const MAX_WIDTH = 500;

const Preview = ({image, onLoad}) => {
    const canvas = useRef(null);

    const [screenWidth, setScreenWidth] = useState(image.width);
    const [screenHeight] = useState(image.height);

    const setupCanvas = canvas => {
        const context = canvas.getContext("2d");

        context.imageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;

        return context;
    }

    useEffect(() => {
        const getWidth = () => (window.innerWidth > 500) ? 500 : window.innerWidth;

        setScreenWidth(getWidth());

        window.addEventListener("resize", () => setScreenWidth(getWidth()));
    }, []);  

    useEffect(() => {
        if(canvas.current !== null) {
            const context = setupCanvas(canvas.current);

            onLoad(context); 
        }
    }, [canvas]);

    return <canvas style={{width: image.width, height: image.height}} width={image.width} height={image.height} ref={canvas}></canvas>;
}

export default Preview;