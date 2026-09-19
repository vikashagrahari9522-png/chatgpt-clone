const MessageComposer = ({ input, isThinking, onChange, onSubmit }) => {
    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit(event);
        }
    }

    return (
        <div className="composer-wrap">
            <form className="composer" onSubmit={onSubmit}>
                <textarea
                    value={input}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message your assistant..."
                    rows="1"
                    aria-label="Message your assistant"
                />
                <button className="send-button" type="submit" disabled={!input.trim() || isThinking} aria-label="Send message">↑</button>
            </form>
            <p className="composer-note">AI can make mistakes. Check important information.</p>
        </div>
    );
};

export default MessageComposer;
