import React from "react";
import { Brain, MessageSquare, HandMetal } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning models trained to recognize and interpret sign language with high accuracy.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      title: "Real-Time Translation",
      description:
        "Instant translation of sign language gestures into text, making communication seamless and efficient.",
    },
    {
      icon: <HandMetal className="h-6 w-6 text-indigo-600" />,
      title: "Easy to Use",
      description:
        "Simple and intuitive interface designed for users of all technical backgrounds.",
    },
  ];

  return (
    <section className="container px-4 py-16 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
        Why Choose <span className="text-indigo-600">SignAI?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full px-4 md:px-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 blur-md"></div>

            <div className="relative z-10">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

