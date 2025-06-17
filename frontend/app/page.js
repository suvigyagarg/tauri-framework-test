'use client';

import { useState } from 'react';
import { Command } from '@tauri-apps/plugin-shell';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetWizard = () => {
    setCurrentStep(1);
    setOutput('');
    setIsLoading(false);
  };

  const runExecutable = async () => {
    try {
      setIsLoading(true);
      setOutput('Running executable...');
      
      const command = Command.sidecar('binaries/main');
      const result = await command.execute();
      
      // Log the full result for debugging
      console.log('Command result:', result);
      
      // Check both stdout and stderr
      const outputText = result.stdout || result.stderr || 'No output received';
      setOutput(outputText);
      
    } catch (error) {
      console.error('Full error:', error);
      setOutput(`Error: ${error?.message || JSON.stringify(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
            <p className="text-xl mb-8">Let's get started with the setup process</p>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Setup
            </button>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Run</h2>
            <p className="text-lg mb-8">We're about to run the setup script. Click Next to proceed.</p>
            <button
              onClick={() => {
                setCurrentStep(3);
                runExecutable();
              }}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-xl">Running setup...</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Setup Complete!</h2>
                <div className="w-full max-w-2xl mt-4 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-white">Output:</h3>
                  <pre className=" text-white font-extrabold ">{output}</pre>
                </div>
                <button
                  onClick={resetWizard}
                  className="mt-8 px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Start Over
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="flex justify-between mb-2">
            <span className={currentStep >= 1 ? 'text-blue-500' : 'text-gray-500'}>Welcome</span>
            <span className={currentStep >= 2 ? 'text-blue-500' : 'text-gray-500'}>Ready</span>
            <span className={currentStep >= 3 ? 'text-blue-500' : 'text-gray-500'}>Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}
      </main>
    </div>
  );
}
