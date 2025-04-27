
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/') ) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive"
      });
      return;
    }

    // Simulated detection process
    toast({
      title: "Analysis in progress",
      description: "Please wait while we analyze your content..."
    });

    setTimeout(() => {
      toast({
        title: "Analysis complete",
        description: "The uploaded content appears to be authentic.",
      });
    }, 3000);
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
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer block"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[300px] mx-auto rounded-lg"
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
            disabled={!file}
          >
            Analyze Content
          </Button>
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">How it Works</h3>
          <p className="text-muted-foreground">
            Our advanced AI algorithms analyze the content for signs of manipulation
            and synthetic generation, providing you with accurate results.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Supported Formats</h3>
          <p className="text-muted-foreground">
            We support various image formats (JPG)  for analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Detect;
