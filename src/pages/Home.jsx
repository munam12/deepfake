
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

function Home() {
  const slides = [
    {
      title: "Understanding DeepFakes",
      description: "Learn about the technology behind deepfake creation and its potential risks.",
      image: "deepfake-technology"
    },
    {
      title: "Protect Yourself",
      description: "Discover ways to identify and protect yourself from deepfake content.",
      image: "digital-security"
    },
    {
      title: "Stay Informed",
      description: "Keep up with the latest developments in deepfake detection technology.",
      image: "ai-news"
    }
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold">Welcome to DeepFake Detector</h1>
        <p className="text-xl text-muted-foreground">
          Your trusted platform for detecting and understanding deepfake content
        </p>
      </motion.div>

      <div className="h-[500px] rounded-xl overflow-hidden">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img 
                className="w-full h-full object-cover"
                alt={slide.title}
               src="https://images.unsplash.com/photo-1632998772668-afc7ae2bc054" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl max-w-2xl text-center">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="p-6 rounded-lg bg-card shadow-lg">
          <h3 className="text-xl font-semibold mb-4">What are DeepFakes?</h3>
          <p className="text-muted-foreground">
            Deepfakes are synthetic media where a person's likeness is replaced with someone else's using artificial intelligence.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-card shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Why Detection Matters</h3>
          <p className="text-muted-foreground">
            As deepfake technology advances, being able to identify manipulated content becomes crucial for maintaining trust in digital media.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-card shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Our Solution</h3>
          <p className="text-muted-foreground">
            We provide cutting-edge technology to help you identify potential deepfake content and stay informed about the latest developments.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
