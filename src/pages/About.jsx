
import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground">
          Dedicated to making the digital world safer through advanced deepfake detection
        </p>
      </motion.div>

      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <img 
          className="w-full h-full object-cover"
          alt="Team working on AI technology"
         src="https://images.unsplash.com/photo-1684369585053-2b35888b3ae8" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            We are committed to developing cutting-edge technology that helps
            individuals and organizations identify and combat deepfake content.
            Our goal is to promote digital truth and maintain trust in online media.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Technology</h2>
          <p className="text-muted-foreground">
            Using advanced artificial intelligence and deep learning algorithms,
            our platform can analyze images and videos to detect signs of manipulation
            and synthetic generation with high accuracy.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Accuracy</h3>
          <p className="text-muted-foreground">
            High-precision detection algorithms with continuous improvement.
          </p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Support</h3>
          <p className="text-muted-foreground">
            Dedicated team providing expert guidance and assistance.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default About;
