import { MessageSquare } from 'lucide-react';

export default function FeedMessageList({ messageLog, connectionStatus, feedEndRef, scrollContainerRef }) {
  return (
    <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col" role="log" aria-live="polite">
      {messageLog.length === 0 && connectionStatus === 'CONNECTED' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <MessageSquare className="w-16 h-16 text-slate-300" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Be the first to send a message to the team.</p>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col w-full max-w-4xl mx-auto">
          {messageLog.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 w-full animate-slide-up self-start">
              <p className="text-slate-800 break-words">{msg.text}</p>
              <span className="text-xs text-slate-400 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={feedEndRef} />
        </div>
      )}
    </main>
  );
}
