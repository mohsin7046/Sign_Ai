import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HandMetal, ArrowRight, Github } from 'lucide-react';
import FeaturesSection from './FeaturesSection';
import HowToUseSection from './howToUse';

function Home() {
  const navigate = useNavigate();

  const handleStartDetection = () => {
    navigate('/detect');
  };

  return (
    <div className="max-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <HandMetal className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-800">SignAI</span>
        </div>
        <a
          href="https://github.com"
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Github className="h-5 w-5" />
          <span>GitHub</span>
        </a>
      </header>

      <main className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Breaking Barriers in
            <span className="text-indigo-600">Sign Language</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Bridge the communication gap for the deaf community using our AI-powered sign language detection system.
            Real-time interpretation made simple and accessible for everyone.
          </p>
          <button
            onClick={handleStartDetection}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Start Detection
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </main>

        <FeaturesSection />
        <HowToUseSection />

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-48">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">SignAI</h2>
            <p className="text-gray-400 max-w-md">
              SignAI is dedicated to breaking communication barriers for the deaf community by offering AI-powered
              real-time sign language detection and translation. Join us in making a difference!
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Subscribe to our Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Stay updated on our latest developments and features. Sign up today!
            </p>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-60 px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-indigo-600 px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-white">
          <p>© 2024 SignAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
