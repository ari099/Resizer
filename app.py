#!/bin/python

import os
from PIL import Image
from resizeimage import resizeimage
from flask import *
from werkzeug.utils import *

UPLOAD_FOLDER = '.\\img'
ALLOWED_EXTENSIONS = {'jpg','jpeg','png'}

# Flask app object...
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', page='Home Page')

@app.route('/about/', methods=['GET'])
def about():
    return render_template('about.html', page='Home Page')

@app.route('/contact/', methods=['GET'])
def contact():
    return render_template('contact.html', page='Home Page')

@app.route('/resize/', methods=['POST'])
def resize():
    # Load image file
    data = request.files['img-upload']
    filename = secure_filename(data.filename)
    data.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # Resize image file
    with open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'rb') as f:
        with Image.open(f) as image:
            try:
                cover = resizeimage.resize_cover(image, [500, 500])
            except resizeimage.ImageSizeError as e:
                return jsonify({'error' : e.message})
            cover.save(os.path.join(app.config['UPLOAD_FOLDER'], filename), image.format)

    # Send it back to front-end
    safe_path = safe_join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(safe_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
