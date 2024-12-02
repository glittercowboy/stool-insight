# Stool Insight - Complete Project Files

## Project Structure
```
stool-insight/
├── README.md
├── package.json
├── tailwind.config.js
├── .gitignore
├── .env
└── src/
    ├── index.js
    ├── App.js
    ├── index.css
    └── components/
        └── StoolInsight.jsx
```

## package.json
```json
{
  "name": "stool-insight",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4",
    "tailwindcss": "^3.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

## tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## .env
```
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

## src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## src/App.js
```javascript
import React from 'react';
import StoolInsight from './components/StoolInsight';

function App() {
  return (
    <div>
      <StoolInsight />
    </div>
  );
}

export default App;
```

## src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## src/components/StoolInsight.jsx
```jsx
import React, { useState } from 'react';

const StoolInsight = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        analyzeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData) => {
    setLoading(true);
    // Simulating API call - would be replaced with actual OpenAI API call
    setTimeout(() => {
      setAnalysis({
        consistency: "Normal (Type 4 on Bristol Stool Scale)",
        color: "Medium Brown",
        health_score: 85,
        dietary_analysis: {
          fiber_content: "Adequate",
          hydration: "Good",
          gut_health: "Healthy",
        },
        recommendations: [
          "Add more fermented foods (kimchi, sauerkraut) to increase probiotic intake",
          "Consider incorporating more leafy greens for increased micronutrients",
          "Maintain current water intake of 8-10 glasses daily",
          "Add prebiotic-rich foods like garlic, onions, and bananas"
        ],
        warnings: [],
        nutrients: {
          fiber: "Good",
          protein_digestion: "Efficient",
          fat_digestion: "Normal"
        }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Stool Insight</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          
          <div className="flex flex-col items-center gap-4">
            <label className="w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
            </label>
            
            {selectedImage && (
              <div className="w-full">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4">Analyzing your sample...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            
            {/* Health Score */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Health Score</span>
                <span className="text-2xl font-bold text-green-600">{analysis.health_score}/100</span>
              </div>
            </div>

            {/* Basic Characteristics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Consistency</h3>
                <p>{analysis.consistency}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Color</h3>
                <p>{analysis.color}</p>
              </div>
            </div>

            {/* Dietary Analysis */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Dietary Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(analysis.dietary_analysis).map(([key, value]) => (
                  <div key={key} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <p className="text-blue-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Nutrient Breakdown */}
            <div>
              <h3 className="font-semibold mb-3">Nutrient Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(analysis.nutrients).map(([key, value]) => (
                  <div key={key} className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <p className="text-purple-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoolInsight;
```

## Installation Instructions
1. Create a new directory and copy all these files into their respective locations
2. Open a terminal in the project directory
3. Run `npm install` to install dependencies
4. Run `npm start` to start the development server
5. The app will be available at http://localhost:3000

## Next Steps
1. Add OpenAI API integration
2. Set up a backend server
3. Add user authentication
4. Implement data storage for analysis history
5. Add the leaderboard feature