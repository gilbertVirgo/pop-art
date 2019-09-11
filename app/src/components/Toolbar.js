import React, {useGlobal} from "reactn";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import ImageSelect from "./ImageSelect";

const Toolbar = () => {
    const [toolbar, setToolbar] = useGlobal("toolbar");

    const handleFieldChange = (name, value) => {
        const copy = {...toolbar};

        copy[name] = value;

        setToolbar(copy);
    }

    return (
        <Form>
            <Form.Group>
                <ImageSelect onChange={image => handleFieldChange("image", image)}/>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Col>
                        <Form.Label>Color 1</Form.Label>
                        <Form.Control 
                            defaultValue="#FF0D0D" 
                            type="color"
                            onChange={({target: {value}}) => handleFieldChange("color1", value)}/>
                    </Col>
                    <Col>
                        <Form.Label>Color 2</Form.Label>
                        <Form.Control 
                            defaultValue="#34CE4B" 
                            type="color"
                            onChange={({target: {value}}) => handleFieldChange("color2", value)}/>
                    </Col>
                </Form.Row>
            </Form.Group>
        </Form>
    )
}

export default Toolbar;