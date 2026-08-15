import { Loader2 } from 'lucide-react';

export default function FeedHeader({ connectionStatus }) {
  return (
    <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center z-10">
      <h1 className="text-xl font-bold tracking-tight">Real-Time Portal</h1>
      <div className="flex items-center gap-2" aria-live="polite">
        {connectionStatus === 'CONNECTING' && (
          <span className="flex items-center gap-2 text-yellow-400 text-sm font-medium">
            <Loader2 className="animate-spin h-4 w-4" />
            Connecting...
          </span>
        )}
        {connectionStatus === 'CONNECTED' && (
          <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <span className="h-2.5 w-2.5 bg-green-400 rounded-full animate-pulse"></span>
            Live
          </span>
        )}
        {connectionStatus === 'DISCONNECTED' && (
          <span className="flex items-center gap-2 text-red-400 text-sm font-medium">
            <span className="h-2.5 w-2.5 bg-red-400 rounded-full"></span>
            Disconnected
          </span>
        )}
      </div>
    </header>
  );
}
