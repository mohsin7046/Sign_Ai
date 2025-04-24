import React from "react";
import { PlayCircle, Eye, Settings } from "lucide-react";

const HowToUseSection = () => {
  const steps = [
    {
      icon: <PlayCircle className="h-8 w-8 text-indigo-600" />,
      title: "Step 1: Start the Model",
      description:
        "Click on the 'Start Detection' button on the homepage to initiate the AI-powered sign language model.",
    },
    {
      icon: <Eye className="h-8 w-8 text-indigo-600" />,
      title: "Step 2: Enable Your Camera",
      description:
        "Allow camera access when prompted. The system uses your webcam to detect and interpret sign language gestures.",
    },
    {
      icon: <Settings className="h-8 w-8 text-indigo-600" />,
      title: "Step 3: View Real-Time Output",
      description:
        "The detected gestures will be translated into text in real-time. Use it to communicate effectively and bridge the gap.",
    },
  ];

  return (
    <section className="container px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">How to Use SignAI</h2>
        <p className="text-lg text-gray-600">
          Follow these simple steps to start detecting and interpreting sign language gestures in real time.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {step.title}
            </h3>
            <p className="text-gray-600 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToUseSection;
