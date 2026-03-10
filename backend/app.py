from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image
import io

app = Flask(__name__)

# Load model
model = tf.keras.models.load_model("wafer_model.h5")

# Class labels
classes = [
    "Center",
    "Donut",
    "Edge-Loc",
    "Edge-Ring",
    "Loc",
    "Near-full",
    "Random",
    "Scratch",
    "None"
]

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["file"]
    image = Image.open(file.stream).convert("RGB")
    image = image.resize((224,224))

    img = np.array(image)/255.0
    img = np.expand_dims(img, axis=0)

    predictions = model.predict(img)[0]

    predicted_index = np.argmax(predictions)
    predicted_class = classes[predicted_index]

    confidence = float(predictions[predicted_index] * 100)

    probabilities = {
        classes[i]: float(predictions[i])
        for i in range(len(classes))
    }

    return jsonify({
        "predicted_class": predicted_class,
        "confidence": round(confidence,2),
        "defect_detected": predicted_class != "None",
        "all_probabilities": probabilities
    })

if __name__ == "__main__":
    app.run(debug=True)