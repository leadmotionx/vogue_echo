import React, { useState, useRef, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
    const { backendUrl, products } = useContext(ShopContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! 👋 Welcome to Vogue Echo. I\'m your AI fashion assistant. Ask me about products, collections, outfit suggestions, or order tracking. How can I help you today? ✨'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const quickReplies = [
        '🔥 Show Bestsellers',
        '🆕 New Arrivals',
        '👗 Wedding Outfits',
        '📦 Track My Order'
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (messageText) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Build history for context (last 10 messages)
            const history = messages.slice(-10).map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                content: m.content
            }));

            const response = await fetch(backendUrl + '/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble right now. Please try again in a moment! 🙏' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please check your internet and try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleProductClick = (productId) => {
        setIsOpen(false);
        navigate(`/product/${productId}`);
    };

    // Find product image by ID for inline previews
    const getProductImage = (productId) => {
        const product = products.find(p => p._id === productId);
        if (product && product.image && product.image[0]) {
            const img = product.image[0];
            return img.startsWith('http') ? img : `${backendUrl}/uploads/${img}`;
        }
        return null;
    };

    const getProductPrice = (productId) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            const discounted = Math.round(product.price - (product.price * product.discount / 100));
            return `Rs.${discounted}`;
        }
        return null;
    };

    // Parse message content and render product links as clickable cards
    const renderMessage = (text) => {
        // Split text by product link pattern [[PRODUCT:id:name]]
        const parts = text.split(/(\[\[PRODUCT:[^\]]+\]\])/g);

        return parts.map((part, index) => {
            const productMatch = part.match(/\[\[PRODUCT:([^:]+):([^\]]+)\]\]/);

            if (productMatch) {
                const productId = productMatch[1].trim();
                const productName = productMatch[2].trim();
                const imgUrl = getProductImage(productId);
                const price = getProductPrice(productId);

                return (
                    <button
                        key={index}
                        className="chatbot-product-link"
                        onClick={() => handleProductClick(productId)}
                    >
                        {imgUrl && (
                            <img src={imgUrl} alt={productName} className="chatbot-product-thumb" />
                        )}
                        <span className="chatbot-product-name">{productName}</span>
                        {price && <span className="chatbot-product-price">{price}</span>}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chatbot-product-arrow">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                );
            }

            // Render normal text with formatting
            if (part.trim()) {
                let formatted = part;
                // Bold
                formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Bullet points
                formatted = formatted.replace(/^[•\-\*]\s(.+)$/gm, '<div class="chat-bullet">$1</div>');
                // Line breaks
                formatted = formatted.replace(/\n/g, '<br/>');

                return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
            }

            return null;
        });
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                id="chatbot-toggle-btn"
                className={`chatbot-fab ${isOpen ? 'chatbot-fab-active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with AI Assistant"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                        <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
                        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                    </svg>
                )}
                {!isOpen && <span className="chatbot-fab-pulse"></span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window" id="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                    <path d="M2 17l10 5 10-5"></path>
                                    <path d="M2 12l10 5 10-5"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 className="chatbot-title">Vogue Echo AI</h4>
                                <span className="chatbot-status">
                                    <span className="chatbot-status-dot"></span>
                                    Online • Fashion Assistant
                                </span>
                            </div>
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages" id="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chatbot-message ${msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-assistant'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="chatbot-msg-avatar">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                            <path d="M2 17l10 5 10-5"></path>
                                            <path d="M2 12l10 5 10-5"></path>
                                        </svg>
                                    </div>
                                )}
                                <div className="chatbot-msg-bubble">
                                    {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="chatbot-message chatbot-message-assistant">
                                <div className="chatbot-msg-avatar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                        <path d="M2 17l10 5 10-5"></path>
                                        <path d="M2 12l10 5 10-5"></path>
                                    </svg>
                                </div>
                                <div className="chatbot-msg-bubble chatbot-typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {messages.length <= 1 && !isLoading && (
                            <div className="chatbot-quick-replies">
                                {quickReplies.map((reply, idx) => (
                                    <button
                                        key={idx}
                                        className="chatbot-quick-btn"
                                        onClick={() => sendMessage(reply)}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-area">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about products, styles, outfits..."
                            className="chatbot-input"
                            id="chatbot-input"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => sendMessage()}
                            className={`chatbot-send-btn ${input.trim() ? 'chatbot-send-active' : ''}`}
                            disabled={!input.trim() || isLoading}
                            id="chatbot-send-btn"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
