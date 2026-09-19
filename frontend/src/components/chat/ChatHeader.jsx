const ChatHeader = ({ onOpenSidebar, title }) => {
    return (
        <header className="chat-header">
            <div className="header-title">
                <button className="icon-button mobile-only" type="button" onClick={onOpenSidebar} aria-label="Open chat history">☰</button>
                <div>
                    <p className="eyebrow">Personal workspace</p>
                    <h1>{title}</h1>
                </div>
            </div>
            <button className="icon-button" type="button" aria-label="More conversation options">•••</button>
        </header>
    );
};

export default ChatHeader;
