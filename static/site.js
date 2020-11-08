'use strict';

/**
 * Main application component
 */
const App = props => {
    const [image, setImage] = React.useState(null);
    const [resized, setResized] = React.useState(false);
    const [tooSmall, setTooSmall] = React.useState(false);
    const showImage = e => {
        setImage(e.target.files[0]);
        setResized(false);
        setTooSmall(false);
    };
    const resizeImage = e => {
        // Upload the image....
        if(image !== null) {
            const formData = new FormData();
            formData.append(
                "img-upload",
                image,
                image.name
            );
            
            // Resize the image....
            axios.post("/resize/", formData, { responseType: "blob" }).then(response => {
                // console.log(response.data);
                // console.log(response.data.type);
                if(response.data.type !== "application/json") { setImage(response.data); setResized(true); }
                else { setTooSmall(true); setResized(false); }
            });
        }
    };
    const downloadImage = e => {
        // ...
    }
    return (
        <div className="container-fluid">
            <form className="resizer-form" action="/" method="POST" encType="multipart/form-data">
                <div className="form-group">
                    <label className="text text-primary" htmlFor="imageUploadControl">Please upload an image (if it's less than 500x500, this won't work, btw)</label>
                    <input className="resizer-input-file"
                        type="file" onChange={showImage} id="imageUploadControl" />
                </div>
            </form>
            <img className="resizer-img" src={(image === null) ? image : window.URL.createObjectURL(image)} />
            {image !== null && <button className="btn btn-primary resizer-button" onClick={resizeImage}>Resize</button>}
            {image !== null && resized === true && <a href={window.URL.createObjectURL(image)} className="btn btn-primary resizer-button" download>Download</a>}
            {image !== null && tooSmall === true && <p className="text text-danger">Image is too small. Please upload something over 500x500.</p>}
        </div>
    );
};

ReactDOM.render(
   <App />,
   document.getElementById("root")
);
