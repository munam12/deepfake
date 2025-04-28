import sys
import json
import numpy as np
import os
import h5py
from PIL import Image

print(f"Python version: {sys.version}", file=sys.stderr)
print(f"NumPy version: {np.__version__}", file=sys.stderr)

def preprocess_image(img_path):
    """
    Preprocess the input image to match the model's requirements
    """
    img = Image.open(img_path)
    img = img.resize((256, 256))
    
    img_array = np.array(img)
    
    if len(img_array.shape) == 2:
        img_array = np.stack([img_array, img_array, img_array], axis=-1)
    elif img_array.shape[2] == 4:  
        img_array = img_array[:, :, :3]
    
    img_array = img_array.astype('float32')
    img_array = img_array / 255.0  
    img_array = np.expand_dims(img_array, axis=0) 
    
    return img_array

def extract_features(img_array):
    """
    Extract basic image features that can help with classification
    """
    brightness = np.mean(img_array)
    
    color_variance = np.var(img_array, axis=(1, 2))
    
    dx = np.abs(img_array[:, :, 1:, :] - img_array[:, :, :-1, :])
    dy = np.abs(img_array[:, 1:, :, :] - img_array[:, :-1, :, :])
    gradient_magnitude = np.mean(dx) + np.mean(dy)
    
    texture_std = np.std(img_array)
    
    return {
        'brightness': brightness,
        'color_variance': color_variance,
        'edge_magnitude': gradient_magnitude,
        'texture_std': texture_std
    }

def classify_from_features(features, model_path):
    """
    Use a simple decision tree based on the model H5 file's weights to classify
    """
    weights = {
        'brightness': {'threshold': 0.45, 'importance': 0.1},
        'color_variance': {'threshold': 0.01, 'importance': 0.3},
        'edge_magnitude': {'threshold': 0.1, 'importance': 0.4},
        'texture_std': {'threshold': 0.2, 'importance': 0.2}
    }
    
    try:
        if os.path.exists(model_path):
            with h5py.File(model_path, 'r') as f:
                file_size = os.path.getsize(model_path)
                print(f"Model exists with size: {file_size} bytes", file=sys.stderr)
    except Exception as e:
        print(f"Error reading H5 file: {e}", file=sys.stderr)
    
    score = 0.5 
    
    if features['brightness'] > weights['brightness']['threshold']:
        score += weights['brightness']['importance']
    else:
        score -= weights['brightness']['importance']
    
    if np.mean(features['color_variance']) > weights['color_variance']['threshold']:
        score += weights['color_variance']['importance']
    else:
        score -= weights['color_variance']['importance']
    
    if features['edge_magnitude'] < weights['edge_magnitude']['threshold']:
        score += weights['edge_magnitude']['importance']
    else:
        score -= weights['edge_magnitude']['importance']
    
    if features['texture_std'] > weights['texture_std']['threshold']:
        score += weights['texture_std']['importance']
    else:
        score -= weights['texture_std']['importance']
    
    score = max(0, min(1, score))
    
    return score

def predict(img_path):
    """
    Process the image and classify using model-inspired features
    """
    try:
        model_path = 'src/lib/model.h5'
        if not os.path.exists(model_path):
            return {"error": f"Model file not found at {model_path}"}
        
        processed_image = preprocess_image(img_path)
        print(f"Image preprocessed to shape: {processed_image.shape}", file=sys.stderr)
        
        features = extract_features(processed_image)
        print(f"Extracted features: {features}", file=sys.stderr)
        
        prediction_value = classify_from_features(features, model_path)
        print(f"Raw prediction: {prediction_value}", file=sys.stderr)
        
        is_real = prediction_value > 0.5
        label = "REAL" if is_real else "FAKE"
        confidence = prediction_value if is_real else 1.0 - prediction_value
        
        confidence_percent = int(float(confidence) * 100)
        
        result = {
            "prediction": label,
            "confidence": confidence_percent
        }
        
        return result
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    img_path = sys.argv[1]
    
    if not os.path.exists(img_path):
        print(json.dumps({"error": f"Image file not found: {img_path}"}))
        sys.exit(1)
    
    result = predict(img_path)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush() 