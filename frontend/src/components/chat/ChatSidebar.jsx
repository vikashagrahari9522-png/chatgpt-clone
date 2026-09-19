const ChatSidebar = ({
    isOpen,
    previousChats,
    activeChatId,
    onClose,
    onNewChat,
    onSelectChat,
}) => {
    return (
        <aside className={`chat-sidebar ${isOpen ? "is-open" : ""}`}>
            <div className="sidebar-topline">
                <div className="brand-mark" aria-label="ChatGPT home">✦</div>
                <button className="icon-button mobile-only" type="button" onClick={onClose} aria-label="Close chat history">×</button>
            </div>
            <button className="new-chat-button" type="button" onClick={onNewChat}>
                <span aria-hidden="true">＋</span> New conversation
            </button>
            <div className="history-heading">
                <span>Recent conversations</span>
                <span className="history-count">{previousChats.length}</span>
            </div>
            <nav className="chat-history" aria-label="Previous chats">
                {previousChats.map((chat) => (
                    <button
                        className={`history-item ${activeChatId === chat.id ? "is-active" : ""}`}
                        key={chat.id}
                        type="button"
                        onClick={() => onSelectChat(chat)}
                    >
                        <span className="history-icon" aria-hidden="true">◌</span>
                        <span className="history-copy">
                            <strong>{chat.title}</strong>
                            <small>{chat.preview}</small>
                        </span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="profile-button" type="button">
                    <span className="avatar">V</span>
                    <span><strong>Visitor</strong><small>Personal workspace</small></span>
                    <span className="more-icon" aria-hidden="true">•••</span>
                </button>
            </div>
        </aside>
    );
};

export default ChatSidebar;
