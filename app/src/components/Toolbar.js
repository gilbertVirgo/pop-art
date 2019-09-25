import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import ImageSelect from "./ImageSelect";
import Filter from "./Filter";

const Toolbar = ({image, context, onImage, onFrame}) => (
    <Form>
        <Form.Group>
            <ImageSelect onChange={onImage}/>
        </Form.Group>
        {(context && image) && <Filter.PopArt context={context} image={image} onChange={onFrame}/>}
    </Form>
);

export default Toolbar;