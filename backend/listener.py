from flask import Flask, request, jsonify
from create_template import create_template
from upload_file_api import upload_file_api
from upload_image_api import upload_image_api
from upload_text_api import upload_text_api
app = Flask(__name__)

# Endpoint for file upload
@app.route('/upload/file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    slownik = asyncio.run(upload_file_api(file))

    slownik = json.loads(slownik)

    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], int(1))
    file.save(f"./uploads/{file.filename}")
    return jsonify({"message": f"File {file.filename} uploaded successfully"}), 200

# Endpoint for text submission
@app.route('/submit/text', methods=['POST'])
def submit_text():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    text = data['text']
    slownik = asyncio.run(upload_text_api(text))

    slownik = json.loads(slownik)

    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], int(1))
    return jsonify({"message": f"Text received: {text}"}), 200

# Endpoint for image upload
@app.route('/upload/image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected image"}), 400
    slownik = asyncio.run(upload_image_api(image))

    slownik = json.loads(slownik)

    for i in slownik["ListaZagadnien"]:
        create_template(i["przedmiot"], i["description"], int(1))
    image.save(f"./uploads/{image.filename}")
    return jsonify({"message": f"Image {image.filename} uploaded successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)