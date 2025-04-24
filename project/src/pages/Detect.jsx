import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

const SignLanguageDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectedSign, setDetectedSign] = useState(null);
  const [handposeModel, setHandposeModel] = useState(null);
  const [signModel, setSignModel] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Labels for ASL alphabet (excluding J and Z which require motion)
  const signLabels = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y','Z'
  ];

  // Load models when component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load handpose model for hand landmark detection
        const handModel = await handpose.load();
        setHandposeModel(handModel);
        console.log("Handpose model loaded");
        
        // In a real application, you would either:
        // 1. Load a pre-trained sign language model
        // const model = await tf.loadLayersModel('path/to/your/model.json');
        
        // Or 2. Train a custom model
        // We'll create a simple placeholder model for demonstration
        const model = createSignModel();
        setSignModel(model);
        
        setIsModelLoading(false);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    
    loadModels();
    if (cameraActive) {
      setupCamera();
    }
    
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  // Create a simple model for demonstration
  const createSignModel = () => {
    // In a real application, you would:
    // 1. Collect training data (hand landmarks for each sign)
    // 2. Train a model on this data
    // 3. Save and load the model
    
    // This is a placeholder model that would take hand landmarks and output sign probabilities
    const model = tf.sequential();
    model.add(tf.layers.dense({
      inputShape: [21 * 3], // 21 landmarks with x,y,z coordinates
      units: 128,
      activation: 'relu'
    }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu'
    }));
    model.add(tf.layers.dense({
      units: signLabels.length,
      activation: 'softmax'
    }));
    
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  };

  // Setup webcam access
  const setupCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser doesn't support webcam access");
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: 640,
          height: 480
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectHands();
        };
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (cameraActive && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(!cameraActive);
  };

  // Main detection loop
  const detectHands = async () => {
    if (!handposeModel || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    async function detect() {
      if (!cameraActive) return;
      
      // Get hand landmarks
      const predictions = await handposeModel.estimateHands(video);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw video frame on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      if (predictions.length > 0) {
        // Draw landmarks
        drawHand(ctx, predictions[0].landmarks);
        
        // Process landmarks for sign detection
        const signPrediction = await predictSign(predictions[0].landmarks);
        if (signPrediction) {
          setDetectedSign(signPrediction);
        }
      } else {
        setDetectedSign(null);
      }
      
      // Continue detection loop
      requestAnimationFrame(detect);
    }
    
    detect();
  };
  
  // Draw hand landmarks on canvas
  const drawHand = (ctx, landmarks) => {
    // Draw points
    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#10B981'; // Tailwind emerald-500
      ctx.fill();
    }
    
    // Draw connections (simplified)
    // In a real app, you would connect specific landmarks to form a hand skeleton
    ctx.beginPath();
    ctx.moveTo(landmarks[0][0], landmarks[0][1]);
    for (let i = 1; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#3B82F6'; // Tailwind blue-500
    ctx.lineWidth = 2;
    ctx.stroke();
  };
  
  // Predict sign from landmarks
  const predictSign = async (landmarks) => {
    if (!signModel) return null;
    
    // Flatten landmarks to a feature vector
    // In a real application, you might want to normalize these values
    const features = [];
    landmarks.forEach(landmark => {
      features.push(landmark[0]); // x
      features.push(landmark[1]); // y
      features.push(landmark[2]); // z
    });
    
    // Make prediction
    const tensor = tf.tensor([features]);
    const prediction = signModel.predict(tensor);
    const result = await prediction.data();
    tensor.dispose();
    prediction.dispose();
    
    // Get the index with highest probability
    const maxIndex = result.indexOf(Math.max(...result));
    return signLabels[maxIndex];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500">
          <h1 className="text-3xl font-bold text-white text-center">
            Sign Language Detector
          </h1>
        </div>
        
        {isModelLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-700">Loading AI models...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Video feed */}
              <div className="md:w-2/3">
                <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-inner">
                  <video 
                    ref={videoRef}
                    className="w-full object-cover" 
                    playsInline
                    style={{ display: 'none' }}
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="w-full bg-black"
                  />
                  
                  {/* Camera controls overlay */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={toggleCamera}
                      className={`px-4 py-2 rounded-full flex items-center ${
                        cameraActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      } text-white font-medium transition-colors duration-200`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d={
                          cameraActive
                            ? "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            : "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        } clipRule="evenodd" />
                      </svg>
                      {cameraActive ? 'Stop Camera' : 'Start Camera'}
                    </button>
                  </div>
                </div>
                
                {/* Detection result */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Detection Result</h3>
                  
                  {detectedSign ? (
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white text-5xl font-bold w-20 h-20 rounded-lg flex items-center justify-center">
                        {detectedSign}
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">Detected sign language character</p>
                        <p className="text-sm text-gray-500">Continue signing to test different characters</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      <span>No hand detected. Please position your hand in view of the camera.</span>
                    </div>
                  )}
                </div>
              </div>
              
              
              <div className="md:w-1/3 mt-6 md:mt-0">
                {/* Character reference */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-800">ASL Alphabet Guide</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Reference</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {signLabels.map(letter => (
                      <div key={letter} className="aspect-square bg-gray-100 rounded flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                        {letter}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Note: J and Z require motion and are excluded from detection.</p>
                </div>
                
                
                <div className="bg-white rounded-lg border border-gray-200 shadow">
                  <div className="p-4 border-b border-gray-200">
                    <button 
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="w-full flex justify-between items-center"
                    >
                      <h3 className="text-lg font-medium text-gray-800">Instructions</h3>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-gray-500 transition-transform ${showInstructions ? 'transform rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  {showInstructions && (
                    <div className="p-4">
                      <ol className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 mr-2 bg-blue-500 text-white rounded-full text-sm">1</span>
                          <span>Allow camera access when prompted</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 mr-2 bg-blue-500 text-white rounded-full text-sm">2</span>
                          <span>Position your hand clearly in view of the camera</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 mr-2 bg-blue-500 text-white rounded-full text-sm">3</span>
                          <span>Form ASL letter signs with your hand</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex items-center justify-center w-6 h-6 mr-2 bg-blue-500 text-white rounded-full text-sm">4</span>
                          <span>Hold each position steady for accurate detection</span>
                        </li>
                      </ol>
                      
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <strong>Note:</strong> This is a demonstration model. For accurate detection in a production environment, a properly trained model with real sign language data would be required.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Hand gesture detection powered by TensorFlow.js and MediaPipe
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignLanguageDetector;