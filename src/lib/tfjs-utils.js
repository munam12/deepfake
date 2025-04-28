import * as tf from '@tensorflow/tfjs';

const SERVER_API_ENDPOINT = 'http://localhost:5000/api/predict';

export async function loadModel() {
  try {
    const model = await tf.loadLayersModel('/model.h5');
    
    model.compile({
      optimizer: 'adam',
      loss: 'binary_crossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}


export async function preprocessImage(imageElement) {
  return tf.tidy(() => {
    const img = tf.browser.fromPixels(imageElement);
    
    const resized = tf.image.resizeBilinear(img, [224, 224]);
    
    const normalized = resized.div(tf.scalar(255));
    
    const batched = normalized.expandDims(0);
    
    return batched;
  });
}


/**
 * Sends an image to the backend server for prediction
 * @param {HTMLImageElement} imageElement - The image element to analyze
 * @returns {Promise<Object>} - The prediction result
 */
export async function predict(imageElement) {
  try {
    console.log("Sending image to server for prediction");
    
    const blob = await getImageBlob(imageElement);
    
    const formData = new FormData();
    formData.append('image', blob);
    
    const response = await fetch(SERVER_API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.error) {
      console.error("Server returned error:", result.error);
      throw new Error(result.error);
    }
    
    console.log("Prediction received from server:", result);
    return result;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

/**
 * Converts an image element to a Blob
 * @param {HTMLImageElement} imageElement - The image element to convert
 * @returns {Promise<Blob>} - A promise that resolves to a blob
 */
async function getImageBlob(imageElement) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);
    
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert image to blob'));
      }
    }, 'image/jpeg', 0.95);
  });
} 