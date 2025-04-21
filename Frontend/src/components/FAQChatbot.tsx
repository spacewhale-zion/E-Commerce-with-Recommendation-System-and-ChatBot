import React, { useState, useRef, useEffect } from 'react';

const faqs = [
  { question: "What is your return policy?", answer: "You can return any product within 30 days of purchase." },
  { question: "Do you offer international shipping?", answer: "Yes, we ship worldwide with some additional charges." },
  { question: "How can I track my order?", answer: "You will receive a tracking link via email once your order is shipped." },
  { question: "What payment methods are accepted?", answer: "We accept Credit/Debit Cards, UPI, PayPal, and Net Banking." },
  { question: "How do I cancel my order?", answer: "You can cancel your order from your account dashboard within 12 hours of placing it." },
  { question: "How long does delivery take?", answer: "Delivery typically takes 3-7 business days depending on your location." },
  { question: "Can I change my shipping address after ordering?", answer: "Yes, contact our support within 2 hours of ordering to change your address." },
  { question: "Do you offer gift wrapping?", answer: "Yes, you can select gift wrapping at checkout for a small additional fee." },
  { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page and follow the instructions." },
  { question: "Where can I view my order history?", answer: "Log in to your account and go to the 'My Orders' section." },
  { question: "Do you offer discounts for bulk orders?", answer: "Yes, please contact our sales team for bulk order discounts." },
  { question: "Are your products eco-friendly?", answer: "Many of our products are made from sustainable materials. Look for the eco-label on product pages." },
  { question: "Can I get a refund if the product is damaged?", answer: "Absolutely! If the product is damaged, we will either replace it or issue a full refund." },
  { question: "Do you have a physical store?", answer: "We currently operate online only, but we do plan to open physical stores soon." },
  { question: "What if I receive the wrong product?", answer: "Please contact our support immediately, and we'll arrange a replacement." }
];
const FAQChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBox, setShowBox] = useState(false);
    const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([]);
    const [bottomOffset, setBottomOffset] = useState(80);
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const draggingRef = useRef(false);
    const startYRef = useRef(0);
    const startOffsetRef = useRef(0);
    const chatbotRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    const email = "ar559993@gmail.com"; 
  
    useEffect(() => {
      if (isOpen) setShowBox(true);
      else setTimeout(() => setShowBox(false), 300);
    }, [isOpen]);
  
    useEffect(() => {
      scrollToBottom();
    }, [messages, isTyping]);
  
    useEffect(() => {
      if (messages.length > 0 && messages[messages.length - 1].type === 'user') {
        const latestMessage = messages[messages.length - 1].text.toLowerCase();
        const match = faqs.find(faq => faq.question.toLowerCase() === latestMessage);
  
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (match) {
            setMessages(prev => [...prev, { type: 'bot', text: match.answer }]);
          } else {
            setMessages(prev => [
              ...prev,
              {
                type: 'bot',
                text: `Sorry, I couldn't find an answer to your question. You can email us directly at `,
              },
              {
                type: 'bot',
                text: `<a href="mailto:${email}" style="color: #007bff;">${email}</a>`,
              }
            ]);
          }
        }, 1500);
      }
    }, [messages]);
  
    const handleMouseDown = (e: React.MouseEvent) => {
      draggingRef.current = true;
      startYRef.current = e.clientY;
      startOffsetRef.current = bottomOffset;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const deltaY = startYRef.current - e.clientY;
      const newOffset = Math.min(window.innerHeight - 100, Math.max(0, startOffsetRef.current + deltaY));
      setBottomOffset(newOffset);
    };
  
    const handleMouseUp = () => {
      draggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  
    const handleQuestionClick = (faq: typeof faqs[number]) => {
      setMessages(prev => [...prev, { type: 'user', text: faq.question }]);
    };
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
    const toggleMinimize = () => {
      setIsMinimized(!isMinimized);
    };
  
    const handleSend = () => {
      if (input.trim()) {
        setMessages(prev => [...prev, { type: 'user', text: input.trim() }]);
        setInput('');
      }
    };
  
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
    };
  
    return (
      <div>
        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '15px',
            borderRadius: '50%',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          💬
        </button>
  
        {/* Chatbox */}
        {showBox && (
          <div
            ref={chatbotRef}
            style={{
              position: 'fixed',
              bottom: `${bottomOffset}px`,
              right: '20px',
              width: '90%',
              maxWidth: '360px',
              minWidth: '280px',
              maxHeight: isMinimized ? '60px' : '70vh',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 999,
              transform: `scale(${isOpen ? 1 : 0.8})`,
              opacity: isOpen ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Header */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                padding: '10px',
                backgroundColor: '#f0f0f0',
                fontWeight: 'bold',
                cursor: 'grab',
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              FAQ Chatbot
              <div style={{ display: 'flex', gap: '8px' }}>
                <span onClick={toggleMinimize} style={{ cursor: 'pointer' }}>
                  {isMinimized ? '⬇️' : '⬆️'}
                </span>
                <span onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>
                  ❌
                </span>
              </div>
            </div>
  
            {/* Messages */}
            {!isMinimized && (
              <>
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign: msg.type === 'user' ? 'right' : 'left',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '8px 12px',
                          backgroundColor: msg.type === 'user' ? '#007bff' : '#eaeaea',
                          color: msg.type === 'user' ? 'white' : 'black',
                          borderRadius: '12px',
                          maxWidth: '80%',
                        }}
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ textAlign: 'left', marginBottom: '8px', color: '#888' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '8px 12px',
                          backgroundColor: '#eaeaea',
                          borderRadius: '12px',
                        }}
                      >
                        Typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
  
                {/* FAQ options */}
                <div style={{ borderTop: '1px solid #ddd', padding: '10px', overflowY: 'auto', maxHeight: '120px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 5 }}>Ask a Question:</div>
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      style={{ cursor: 'pointer', color: '#007bff', marginBottom: '6px', fontSize: '14px' }}
                      onClick={() => handleQuestionClick(faq)}
                    >
                      {faq.question}
                    </div>
                  ))}
                </div>
  
                {/* Input field for custom question */}
                <div style={{ display: 'flex', borderTop: '1px solid #ccc' }}>
                  <input
                    type="text"
                    placeholder="Ask your question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '10px',
                      fontSize: '14px',
                      borderTopLeftRadius: '10px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    style={{
                      border: 'none',
                      background: '#007bff',
                      color: 'white',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderTopRightRadius: '10px',
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default FAQChatbot;
