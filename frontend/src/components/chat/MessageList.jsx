const MessageList = ({ messages, isThinking }) => {
    return (
        <div className="message-scroller">
            <div className="message-list" aria-live="polite">
                {messages.map((message) => (
                    <article className={`message-row ${message.role}`} key={message.id}>
                        <div className="message-avatar">{message.role === "assistant" ? "✦" : "V"}</div>
                        <div className="message-content">
                            <span className="message-author">{message.role === "assistant" ? "Assistant" : "You"}</span>
                            <p>{message.content}</p>
                        </div>
                    </article>
                ))}
                {isThinking && (
                    <article className="message-row assistant">
                        <div className="message-avatar">✦</div>
                        <div className="message-content">
                            <span className="message-author">Assistant</span>
                            <p className="thinking"><i /><i /><i /></p>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
};

export default MessageList;
