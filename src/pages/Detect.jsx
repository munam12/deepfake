import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { predict } from '@/lib/tfjs-utils';

function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const imageRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null); 
      
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      toast({
        title: "Analysis in progress",
        description: "Please wait while we analyze your content..."
      });

      if (imageRef.current) {
        const prediction = await predict(imageRef.current);
        
        setResult(prediction);
        
        toast({
          title: "Analysis complete",
          description: `The uploaded content appears to be ${prediction.prediction} with ${prediction.confidence}% confidence.`
        });
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Analysis failed",
        description: "An error occurred during image analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">DeepFake Detection</h1>
        <p className="text-xl text-muted-foreground">
          Upload your content to check if it's authentic or manipulated
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card p-8 rounded-lg shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-primary/50 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer block ${isLoading ? 'opacity-50' : ''}`}
            >
              {preview ? (
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Preview"
                  className="max-h-[300px] mx-auto rounded-lg"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl text-primary/50">📁</div>
                  <p className="text-lg">
                    Drag and drop your file here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports images only
                  </p>
                </div>
              )}
            </label>
          </div>

          {file && (
            <div className="text-center text-sm text-muted-foreground">
              Selected file: {file.name}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!file || isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Content"}
          </Button>

          {result && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              result.prediction === 'REAL' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
            }`}>
              <h3 className="text-xl font-bold mb-2">Result</h3>
              <p className="text-lg">
                This image appears to be 
                <span className={`font-bold mx-2 ${
                  result.prediction === 'REAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.prediction}
                </span>
                with {result.confidence}% confidence
              </p>
            </div>
          )}
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">How it Works</h3>
          <p className="text-muted-foreground">
            Our advanced AI model analyzes the content for signs of manipulation
            using a MobileNetV2 backbone with CBAM attention block.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Supported Formats</h3>
          <p className="text-muted-foreground">
            We support various image formats (JPG, PNG, etc.) for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Detect;
