import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import PoopRain from './PoopRain';
import Leaderboard from './Leaderboard';
import html2canvas from 'html2canvas';

const RateMyPoop = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToAnalyze, setImageToAnalyze] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [gradedImageUrl, setGradedImageUrl] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const mainRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#22c55e',
      'A': '#22c55e',
      'A-': '#22c55e',
      'B+': '#84cc16',
      'B': '#84cc16',
      'B-': '#84cc16',
      'C+': '#eab308',
      'C': '#eab308',
      'C-': '#eab308',
      'D+': '#f97316',
      'D': '#f97316',
      'D-': '#f97316',
      'F': '#ef4444'
    };
    return gradeColors[grade] || '#ef4444';
  };

  const getGradeComment = (grade) => {
    const comments = {
      'A+': "I'm basically a poop artist! 🎨",
      'A': "Now that's what I call a masterpiece! 🏆",
      'A-': "Almost perfect! 🌟",
      'B+': "That's some quality 💩!",
      'B': "Pretty solid performance! 💪",
      'B-': "Not bad, not bad at all! 😊",
      'C+': "Room for improvement! 📈",
      'C': "Room for improvement, but not bad! 📈",
      'C-': "Could be better... 😕",
      'D+': "Yikes... 😬",
      'D': "Rough day at the office... 😅",
      'D-': "Is everything okay? 😰",
      'F': "Back to Poop School for me! 📚"
    };
    return comments[grade] || "Check out my grade!";
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setShowResults(false);
      setAnalysis(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageToAnalyze(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async (platform) => {
    const gradedImage = await generateGradedImage();
    const emoji = analysis.grade.startsWith('A') ? '🏆' : analysis.grade.startsWith('B') ? '🌟' : '💩';
    const shareText = `${emoji} My poop just scored ${analysis.score}/100 (${analysis.grade}) on RateMyPoop! ${getGradeComment(analysis.grade)} Think you can do better? Rate yours at RateMyPoop.com 🚽`;
    const url = 'https://ratemypoop.com';
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${url}`);
        break;
    }
  };

  const handleAnalyzeClick = async () => {
    if (imageToAnalyze) {
      // Play fart sound
      const fartSound = new Audio('/fart.mp3');
      fartSound.play();
      
      // Analyze the image
      await analyzeImage(imageToAnalyze);
    }
  };

  const cleanJsonResponse = (text) => {
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return cleaned.trim();
  };

  const analyzeImage = async (imageData) => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `You are a hilarious poop grader. Look at this stool image and grade it based on:

1) Appearance
2) Impressiveness
3) Overall artistic merit
4) Entertainment value

Be funny and irreverent in your assessment. Focus on humor over health.

Return ONLY a JSON object with these fields:
{
  grade: string (letter grade A+ to F),
  score: number (0-100),
  title: string (funny title for this masterpiece),
  description: string (hilarious description of what you're seeing),
  oneliners: string[] (3-4 funny one-liners about this poop)
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });

      const analysisText = response.choices[0].message.content;
      try {
        const analysisJson = JSON.parse(cleanJsonResponse(analysisText));
        setAnalysis(analysisJson);
        setTimeout(() => {
          setShowResults(true);
          setShowRain(true);
          setTimeout(() => setShowRain(false), 5000);
        }, 500);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        setError('Failed to grade your masterpiece. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      if (err.message?.includes('rate limit') || err.message?.includes('resource_exhausted')) {
        setError('Whoa there! Our grading professor is taking a quick break. Please try again in a few minutes. 💩');
      } else {
        setError('Failed to grade your masterpiece. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateGradedImage = async () => {
    if (!imageRef.current) return null;
    const canvas = await html2canvas(imageRef.current);
    return canvas.toDataURL('image/jpeg');
  };

  return (
    <div className="min-h-screen bg-amber-50 overflow-x-hidden" ref={mainRef}>
      {showRain && <PoopRain />}
      
      <div className={`min-h-screen flex flex-col items-center transition-all duration-1000`}>
        <div className="w-full max-w-4xl p-8">
          <h1 className={`text-4xl font-bold text-center mb-12 text-brown-800 flex items-center justify-center gap-4 transition-all duration-1000 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
            <span role="img" aria-label="poop emoji" className="animate-bounce">💩</span>
            Rate My Poop
            <span role="img" aria-label="poop emoji" className="animate-bounce" style={{ animationDelay: '0.5s' }}>💩</span>
          </h1>
          
          {/* Main Upload and Display Section */}
          <div className={`bg-white p-6 rounded-lg shadow mb-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
            <h2 className="text-xl font-semibold mb-4 text-brown-700">Upload Your Masterpiece</h2>
            
            <div className="flex flex-col items-center gap-4">
              {!selectedImage && (
                <label className="w-full p-6 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <p className="text-sm text-amber-700">Click to upload or drag and drop</p>
                    <p className="text-xs text-amber-600 mt-1">Let's see what you've created! 💩</p>
                  </div>
                </label>
              )}

              {selectedImage && (
                <div className="max-w-2xl mx-auto w-full">
                  <div ref={imageRef} className="relative">
                    <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    {analysis && showResults && (
                      <div className="absolute top-4 right-4 transform rotate-[-20deg]">
                        <div className="bg-white/90 p-6 rounded shadow-lg">
                          <div className="text-center space-y-1">
                            <span className="text-7xl font-['Permanent_Marker'] tracking-wider" style={{ color: getGradeColor(analysis.grade) }}>
                              {analysis.grade}
                            </span>
                            <div className="text-2xl font-['Permanent_Marker']" style={{ color: getGradeColor(analysis.grade) }}>
                              {analysis.score}/100
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
                          <p className="mt-4 text-lg font-semibold">Grading your masterpiece...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!loading && !analysis && (
                    <button
                      onClick={handleAnalyzeClick}
                      className="mt-4 w-full px-6 py-3 bg-brown-600 text-white rounded-lg font-semibold hover:bg-brown-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Rate My Poop! 💩
                    </button>
                  )}
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {analysis && showResults && (
                <div className="mt-4 space-y-4 text-center w-full">
                  <h3 className="text-xl font-bold text-brown-800">{analysis.title}</h3>
                  <p className="text-brown-700">{analysis.description}</p>
                  <p className="text-2xl font-bold" style={{ color: getGradeColor(analysis.grade) }}>
                    {getGradeComment(analysis.grade)}
                  </p>
                  <div className="space-y-2">
                    {analysis.oneliners.map((line, index) => (
                      <p key={index} className="text-brown-600 italic">{line}</p>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateMyPoop;