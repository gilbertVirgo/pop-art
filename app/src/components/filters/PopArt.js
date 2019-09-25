import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import axios from "axios";
import LoadingModal from "../LoadingModal";

const defaults = {
    highlights: "#eeffdd", // light 
    shadows: "#11331e", // dark
    range: "50"
}

const PopArt = ({context, image, onChange}) => {
    const [highlights, setHighlights] = useState(defaults.highlights);
    const [shadows, setShadows] = useState(defaults.shadows);
    const [range, setRange] = useState(defaults.range);
    const [map, setMap] = useState(null);
    const [length, setLength] = useState(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getIndex = (range, length) => Math.ceil(range * (length / 100));

    const renderFrame = (map, frameIndex) => {
        const {canvas} = context;

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();

        let x = frameIndex * canvas.width;

        context.drawImage(
            map, 
            x, 0, canvas.width, canvas.height, // Relative to map
            0, 0, canvas.width, canvas.height     
        );

        // set composite mode
        context.globalCompositeOperation = "source-in";

        // draw color
        context.fillStyle = shadows;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.globalCompositeOperation = "destination-over";

        context.fillStyle = highlights;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        // For later download
        onChange(canvas.toDataURL("image/png"));
    }

    const request = async () => {
        setLoading(true);

        const startTime = Date.now();

        const formData = new FormData();
        formData.append("image", image);

        let {data: {id, length, success, error}} = await axios.post('/api/v2/filter/popart', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log("Finished. Took ", (Date.now() - startTime) / 1000, " seconds.");

        let map = await new Promise(resolve => {
            let image = new Image();
            image.onload = () => resolve(image);
            image.src = `/images/${id}.png`;
        });

        if(success) {
            context.canvas.width = map.width / length;
            context.canvas.height = map.height;

            setLoading(false);
            setMap(map);
            setLength(length);
        } else {
            setError(error);
        }
    };

    useEffect(() => {
        (async function() {
            await request()
        })();
    }, [image]);

    useEffect(() => {
        if(map) {
            const frameIndex = getIndex(range, length);
            renderFrame(map, frameIndex);
        }
    }, [map, range, highlights, shadows]);

    return (<>
        {error && <p className="text-danger" style={{textAlign: "center"}}>{error}</p>}
        <Form.Group>
            <Form.Row>
                <Col>
                    <Form.Label>Highlights</Form.Label>
                    <Form.Control 
                        defaultValue={highlights}
                        type="color"
                        className="custom-color-input"
                        onBlur={({target: {value}}) => setHighlights(value)}/>
                </Col>
                <Col>
                    <Form.Label>Shadows</Form.Label>
                    <Form.Control 
                        defaultValue={shadows}
                        type="color"
                        className="custom-color-input"
                        onBlur={({target: {value}}) => setShadows(value)}/>
                </Col>
            </Form.Row>
        </Form.Group>
        <Form.Group>
            <Form.Control 
                value={range}
                type="range"
                className="custom-range"
                onChange={({target: {value}}) => setRange(+value)}/>
        </Form.Group>
        <LoadingModal show={loading} message="Running filter"/>
    </>)
}

export default PopArt;