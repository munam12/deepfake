
import React from 'react';
import { motion } from 'framer-motion';

function News() {
  const articles = [
    {
      title: "Latest Advances in DeepFake Detection",
      date: "April 24, 2025",
      summary: "New AI models achieve 95% accuracy in detecting manipulated videos.",
      image: "ai-detection"
    },
    {
      title: "The Impact of DeepFakes on Social Media",
      date: "April 23, 2025",
      summary: "Social platforms implement new measures to combat deepfake content.",
      image: "social-media-impact"
    },
    {
      title: "Protecting Against DeepFake Threats",
      date: "April 22, 2025",
      summary: "Expert guidelines for identifying and avoiding deepfake content.",
      image: "cybersecurity"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Latest DeepFake News</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest developments in deepfake technology and detection
        </p>
      </motion.div>

      <div className="grid gap-8">
        {articles.map((article, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col md:flex-row gap-6 bg-card rounded-lg overflow-hidden shadow-lg"
          >
            <div className="md:w-1/3 h-[200px] md:h-auto relative">
              <img 
                className="w-full h-full object-cover"
                alt={article.title}
               src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
            </div>
            <div className="flex-1 p-6">
              <div className="text-sm text-muted-foreground mb-2">{article.date}</div>
              <h2 className="text-2xl font-semibold mb-4">{article.title}</h2>
              <p className="text-muted-foreground">{article.summary}</p>
              <button className="mt-4 text-primary hover:underline">Read more →</button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default News;
