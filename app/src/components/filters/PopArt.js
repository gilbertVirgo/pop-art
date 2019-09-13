import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import {hexToRGB, applyColorToPixel} from "../../functions";

const defaults = {
    color1: "#63ffdd", // light
    color2: "#232185", // dark
    range: "50"
}

const PopArt = ({image, context}) => {
    const {width, height} = image;

    const [color1, setColor1] = useState(defaults.color1);
    const [color2, setColor2] = useState(defaults.color2);
    const [range, setRange] = useState(defaults.range);


    const apply = () => {
        const imageData = context.getImageData(0, 0, width, height);

        let {data} = imageData;

        let index;
        for(index = 0; index < data.length; index += 4) {
            const [r, g, b, a] = data.slice(index, index + 3);

            // (255 + 255 + 255) / 2
            if((r + g + b) > ((765 / 100) * +range)) {
                data = applyColorToPixel({
                    data,
                    rgba: hexToRGB(color1), 
                    index
                });
            } else {
                data = applyColorToPixel({
                    data,
                    rgba: hexToRGB(color2), 
                    index
                });
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    useEffect(() => {
        context.drawImage(image, 0, 0, width, height);
        apply();
    }, [image, color1, color2, range, height]);

    return (<>
        <Form.Group>
            <Form.Row>
                <Col>
                    <Form.Label>Color 1</Form.Label>
                    <Form.Control 
                        value={color1}
                        type="color"
                        onChange={({target: {value}}) => setColor1(value)}/>
                </Col>
                <Col>
                    <Form.Label>Color 2</Form.Label>
                    <Form.Control 
                        value={color2}
                        type="color"
                        onChange={({target: {value}}) => setColor2(value)}/>
                </Col>
            </Form.Row>
        </Form.Group>
        <Form.Group>
            <Form.Control 
                value={range}
                type="range"
                onChange={({target: {value}}) => setRange(value)}/>
        </Form.Group>
    </>)
}

export default PopArt;