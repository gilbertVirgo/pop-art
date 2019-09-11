import React, {useRef, useEffect, useState, useGlobal} from "reactn";

const Preview = () => {
    const canvas = useRef(null);

    const [context, setContext] = useState(null);
    const [toolbar, setToolbar] = useGlobal("toolbar");

    const loadImage = () => {
        if(context) {
            console.log({context, image: toolbar.image});

            context.putImageData(toolbar.image, 300, 150);
        }
    }

    useEffect(() => {
        if(canvas.current !== null) {
            setContext(canvas.current.getContext("2d"));   
        }    
    }, []); 

    useEffect(() => {
        // fix this stuff never getting fired
        console.log("Effecting");

        if(toolbar && toolbar.image){
            console.log("Loading image");
            loadImage();
        }
    }, [toolbar]);

    return (
        <canvas ref={canvas}></canvas>
    )
}

export default Preview;