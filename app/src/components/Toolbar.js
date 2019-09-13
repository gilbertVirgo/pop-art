import React, {useState} from "reactn";
import Form from "react-bootstrap/Form";
import ImageSelect from "./ImageSelect";
import Filter from "./Filter";

const Toolbar = ({onChange}) => {
    const [image, setImage] = useState(null);

    return (
        <Form>
            <Form.Group>
                <ImageSelect onChange={value => setImage(value)}/>
            </Form.Group>
            {image && <Filter.PopArt image={image} onChange={image => onChange(image)}/>}
        </Form>
    )
}

export default Toolbar;