export default function FeedInputArea({ inputValue, setInputValue, handleSendMessage, connectionStatus }) {
  return (
    <footer className="bg-white border-t border-slate-200 p-4 shrink-0">
      <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          aria-label="Message Input"
          disabled={connectionStatus !== 'CONNECTED'}
          className="flex-1 rounded-md border-slate-300 border px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={connectionStatus !== 'CONNECTED' || !inputValue.trim()}
          aria-label="Send Message"
          className="bg-slate-900 text-white px-6 py-3 rounded-md font-medium shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Send
        </button>
      </form>
    </footer>
  );
}
