"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { AlertTriangle, ServerOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApiChecker() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [retryCount, setRetryCount] = useState(0)

  const checkApiStatus = async () => {
    try {
      // Set a short timeout to quickly detect if API is down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${api.getBaseUrl()}/health-check`, {
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);
      
      if (response && response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      console.error('API check failed:', error);
      setApiStatus('offline');
    }
  }

  useEffect(() => {
    checkApiStatus();
    
    // Only set up polling if we haven't already determined it's online
    const interval = setInterval(() => {
      if (apiStatus !== 'online') {
        checkApiStatus();
        setRetryCount(prev => prev + 1);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [apiStatus]);

  if (apiStatus === 'checking' || apiStatus === 'online') {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <ServerOff className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Backend Server is Offline</h2>
            <p className="text-sm text-muted-foreground">We couldn't connect to the API server</p>
          </div>
        </div>
        
        <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r mb-6">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">The application cannot function without the backend server</p>
              <p className="text-sm text-amber-700 mt-1">
                Please make sure that the backend API server is running at {api.getBaseUrl()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-sm border rounded p-4 mb-4">
          <h3 className="font-medium mb-2">How to start the backend server:</h3>
          <ol className="space-y-1 list-decimal pl-4 mb-2 text-muted-foreground">
            <li>Open a new terminal</li>
            <li>Navigate to the backend directory: <code className="bg-slate-100 px-1 py-0.5 rounded">cd backend</code></li>
            <li>Start the virtual environment: <code className="bg-slate-100 px-1 py-0.5 rounded">.\venv\Scripts\activate</code></li>
            <li>Run the server: <code className="bg-slate-100 px-1 py-0.5 rounded">uvicorn main:app --reload --port 8000</code></li>
          </ol>
          <p className="italic text-xs">If this is your first time, please follow the setup instructions in the README.md file.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => {
              checkApiStatus();
              setRetryCount(prev => prev + 1);
            }}
            className="w-full"
          >
            {retryCount > 0 ? `Retry Connection (${retryCount})` : 'Retry Connection'}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground mt-2">
            The application will automatically retry connecting to the server.
          </div>
        </div>
      </div>
    </div>
  );
} 