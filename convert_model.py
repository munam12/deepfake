import sys
import os
import tensorflow as tf
import tensorflowjs as tfjs
from tensorflow import keras

class CBAMBlock(keras.layers.Layer):
    def __init__(self, **kwargs):
        super(CBAMBlock, self).__init__(**kwargs)
        self.shared_mlp = None
        self.spatial_attention_conv = None

    def build(self, input_shape):
        self.input_dim = input_shape[-1]

        self.shared_mlp = keras.Sequential([
            keras.layers.Dense(self.input_dim // 8, activation='relu'),
            keras.layers.Dense(self.input_dim)
        ])

        self.spatial_attention_conv = keras.layers.Conv2D(
            1, kernel_size=7, padding='same', activation='sigmoid')

        super(CBAMBlock, self).build(input_shape)

    def call(self, input_tensor):
        avg_pool = tf.reduce_mean(input_tensor, axis=[1, 2], keepdims=True)
        max_pool = tf.reduce_max(input_tensor, axis=[1, 2], keepdims=True)

        ca = keras.activations.sigmoid(self.shared_mlp(avg_pool) + self.shared_mlp(max_pool))
        x = keras.layers.multiply([input_tensor, ca])

        avg_pool_spatial = tf.reduce_mean(x, axis=-1, keepdims=True)
        max_pool_spatial = tf.reduce_max(x, axis=-1, keepdims=True)
        concat = keras.layers.concatenate([avg_pool_spatial, max_pool_spatial], axis=-1)

        sa = self.spatial_attention_conv(concat)
        x = keras.layers.multiply([x, sa])

        return x

def convert_h5_to_tfjs():
    """
    Convert the H5 model to TensorFlow.js format
    """
    h5_model_path = 'src/lib/model.h5'
    
    tfjs_model_path = 'public/tfjs_model'
    
    if not os.path.exists(h5_model_path):
        print(f"Error: H5 model not found at {h5_model_path}")
        return False
    
    try:
        custom_objects = {'CBAMBlock': CBAMBlock}
        
        print(f"Loading model from {h5_model_path}...")
        model = keras.models.load_model(h5_model_path, custom_objects=custom_objects)
        
        print(f"Converting model to TensorFlow.js format...")
        tfjs.converters.save_keras_model(model, tfjs_model_path)
        
        print(f"Model successfully converted and saved to {tfjs_model_path}")
        return True
    
    except Exception as e:
        print(f"Error converting model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = convert_h5_to_tfjs()
    
    sys.exit(0 if success else 1) 