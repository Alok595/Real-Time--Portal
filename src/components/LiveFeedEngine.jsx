import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import FeedHeader from './FeedHeader';
import FeedMessageList from './FeedMessageList';
import FeedInputArea from './FeedInputArea';

const MAX_BACKOFF = 10000;
const INITIAL_BACKOFF = 1000;
const WS_URL = 'wss://ws.postman-echo.com/raw';
// const WS_URL = 'wss://echo.websocket.events';  // not live in my case i have tested 

export default function LiveFeedEngine() {
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');
  const [messageLog, setMessageLog] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const wsRef = useRef(null);
  const backoffRef = useRef(INITIAL_BACKOFF);
  const feedEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const { logEvent } = useAnalytics();

  useEffect(() => {
    let reconnectTimeout;

    function connect() {
      setConnectionStatus('CONNECTING');

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('CONNECTED');
        backoffRef.current = INITIAL_BACKOFF;
        logEvent('WebSocket Connected');
      };

      ws.onmessage = (event) => {
        try {
          const newMsg = {
            id: crypto.randomUUID(),
            text: event.data,
            timestamp: Date.now()
          };

          setMessageLog(prev => [...prev, newMsg]);
          logEvent('Payload Received');
        } catch (err) {
          console.error('Error parsing message', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error', error);

      };

      ws.onclose = () => {
        setConnectionStatus('DISCONNECTED');
        logEvent('WebSocket Disconnected', { backoff: backoffRef.current });


        reconnectTimeout = setTimeout(() => {
          backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF);
          connect();
        }, backoffRef.current);
      };
    }

    function handleOffline() {

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }

    function handleOnline() {

      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        clearTimeout(reconnectTimeout);
        backoffRef.current = INITIAL_BACKOFF;
        connect();
      }
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    connect();

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        // Prevent onclose from triggering reconnection during cleanup
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [logEvent]);

  // Auto-scroll 
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && feedEndRef.current) {
      const threshold = 150;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
      if (isNearBottom) {
        feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messageLog]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const sanitizedInput = inputValue.trim();

    if (!sanitizedInput) return; // Prevent empty/whitespace

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(sanitizedInput);
      logEvent('User emitted payload', { length: sanitizedInput.length });
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans">

      {/* Header */}
      <FeedHeader connectionStatus={connectionStatus} />

      {/* Disconnected Toast  Banner */}
      {connectionStatus === 'DISCONNECTED' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-sm flex items-center justify-between animate-fade-in" role="alert">
          <div>
            <p className="font-bold">Connection Lost</p>
            <p className="text-sm">Attempting to reconnect...</p>
          </div>
        </div>
      )}

      {/*  Feed Area */}
      <FeedMessageList
        messageLog={messageLog}
        connectionStatus={connectionStatus}
        feedEndRef={feedEndRef}
        scrollContainerRef={scrollContainerRef}
      />

      {/* input area */}
      <FeedInputArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        connectionStatus={connectionStatus}
      />

    </div>
  );
}
