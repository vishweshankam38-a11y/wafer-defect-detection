import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models

# Image preprocessing
train = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

# Training dataset
train_data = train.flow_from_directory(
    "../dataset/images",   # Correct dataset path
    target_size=(64,64),
    batch_size=32,
    class_mode="categorical",
    subset="training"
)

# Validation dataset
val_data = train.flow_from_directory(
    "../dataset/images",
    target_size=(64,64),
    batch_size=32,
    class_mode="categorical",
    subset="validation"
)

# CNN Model
model = models.Sequential([
    layers.Conv2D(32,(3,3),activation='relu',input_shape=(64,64,3)),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(64,(3,3),activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(128,(3,3),activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Flatten(),

    layers.Dense(128,activation='relu'),
    layers.Dense(train_data.num_classes,activation='softmax')
])

# Compile model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
model.fit(
    train_data,
    validation_data=val_data,
    epochs=3
)

# Save model
model.save("wafer_model.h5")

print("Model training completed and saved as wafer_model.h5")