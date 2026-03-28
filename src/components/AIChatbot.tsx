import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; value: string }[];
};

type FlowState =
  | 'main'
  | 'file'
  | 'file-category'
  | 'file-describe'
  | 'file-confirm'
  | 'track'
  | 'track-input'
  | 'stats'
  | 'faq'
  | 'free';

const mainOptions = [
  { label: '📝 File a Complaint', value: 'file' },
  { label: '🔍 Track Complaint', value: 'track' },
  { label: '📊 View Statistics', value: 'stats' },
  { label: '❓ Ask a Question', value: 'faq' },
];

const faqOptions = [
  { label: 'How to file complaint?', value: 'faq-file' },
  { label: 'How to track complaint?', value: 'faq-track' },
  { label: 'Resolution timeline?', value: 'faq-timeline' },
  { label: 'Languages supported?', value: 'faq-lang' },
  { label: '🏠 Main Menu', value: 'main' },
];

const initialMessage: Message = {
  id: '0',
  text: "🙏 Namaste! I'm JanSunwai AI Assistant. How can I help you today?",
  sender: 'bot',
  options: mainOptions,
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[80px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 inline-block"
          style={{
            animation: 'bounce 1.2s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flow, setFlow] = useState<FlowState>('main');
  const [pendingDept, setPendingDept] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addUserMessage(text: string) {
    setMessages((prev) => [...prev, { id: genId(), text, sender: 'user' }]);
  }

  function addBotMessage(msg: Omit<Message, 'id'>) {
    setMessages((prev) => [...prev, { ...msg, id: genId() }]);
  }

  function respond(text: string, options?: Message['options'], newFlow?: FlowState) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addBotMessage({ text, sender: 'bot', options });
      if (newFlow) setFlow(newFlow);
    }, 500);
  }

  function handleOption(value: string, label: string) {
    addUserMessage(label);

    if (value === 'main') {
      respond("🙏 Namaste! I'm JanSunwai AI Assistant. How can I help you today?", mainOptions, 'main');
      return;
    }

    if (value === 'file') {
      respond('What is your complaint about?', [
        { label: '🏗️ Roads/Infrastructure', value: 'dept-roads' },
        { label: '💧 Water Supply', value: 'dept-water' },
        { label: '⚡ Electricity', value: 'dept-electricity' },
        { label: '🏠 Other', value: 'dept-other' },
      ], 'file-category');
      return;
    }

    if (value === 'dept-roads') {
      setPendingDept('roads');
      respond('Please describe your road issue briefly.', undefined, 'file-describe');
      return;
    }
    if (value === 'dept-water') {
      setPendingDept('water');
      respond('Please describe your water supply issue briefly.', undefined, 'file-describe');
      return;
    }
    if (value === 'dept-electricity') {
      setPendingDept('electricity');
      respond('Please describe your electricity issue briefly.', undefined, 'file-describe');
      return;
    }
    if (value === 'dept-other') {
      setPendingDept('other');
      respond('Please describe your issue and I\'ll suggest the right department.', undefined, 'file-describe');
      return;
    }

    if (value === 'file-yes') {
      respond('Taking you to the complaint form with pre-filled details! 🚀', undefined, 'main');
      setTimeout(() => { window.location.href = '/citizen/file'; }, 800);
      return;
    }
    if (value === 'file-change') {
      respond('What is your complaint about?', [
        { label: '🏗️ Roads/Infrastructure', value: 'dept-roads' },
        { label: '💧 Water Supply', value: 'dept-water' },
        { label: '⚡ Electricity', value: 'dept-electricity' },
        { label: '🏠 Other', value: 'dept-other' },
      ], 'file-category');
      return;
    }
    if (value === 'file-cancel') {
      respond('No problem! Is there anything else I can help with?', [...mainOptions], 'main');
      return;
    }

    if (value === 'track') {
      respond('Please enter your Tracking ID (format: GRV-2024-XXXXX)', undefined, 'track-input');
      return;
    }
    if (value === 'track-view') {
      respond('Opening complaint details...', undefined, 'main');
      setTimeout(() => { window.location.href = '/track?id=GRV-2024-00001'; }, 800);
      return;
    }
    if (value === 'track-another') {
      respond('Please enter your Tracking ID (format: GRV-2024-XXXXX)', undefined, 'track-input');
      return;
    }

    if (value === 'stats') {
      respond(
        '📊 Here are today\'s live statistics:\n\n📋 Total Complaints: 15,847\n✅ Resolved: 12,456 (78.6%)\n⏱️ Avg Resolution: 4.2 days\n⭐ Satisfaction: 94.2%\n\nWant to know more?',
        [
          { label: '🏢 Department Stats', value: 'stats-dept' },
          { label: '📝 File Complaint', value: 'file' },
          { label: '🏠 Main Menu', value: 'main' },
        ],
        'stats'
      );
      return;
    }
    if (value === 'stats-dept') {
      respond(
        '🏢 Department-wise Stats:\n\n🏗️ Public Works: 4,210 resolved\n💧 Water Supply: 3,890 resolved\n⚡ Electricity: 3,120 resolved\n🌳 Others: 1,236 resolved',
        [{ label: '🏠 Main Menu', value: 'main' }],
        'main'
      );
      return;
    }

    if (value === 'faq') {
      respond('What would you like to know?', faqOptions, 'faq');
      return;
    }
    if (value === 'faq-file') {
      respond(
        "Filing is easy! Click 'File a Complaint', select department and category, describe your issue, add location, and submit. You'll get a tracking ID instantly. You can also record a voice complaint! 🎤",
        [{ label: '🏠 Main Menu', value: 'main' }],
        'main'
      );
      return;
    }
    if (value === 'faq-track') {
      respond(
        "Enter your Tracking ID (GRV-2024-XXXXX) on the Track page. No login needed! You can see real-time status and full timeline of actions taken.",
        [{ label: '🏠 Main Menu', value: 'main' }],
        'main'
      );
      return;
    }
    if (value === 'faq-timeline') {
      respond(
        "Each complaint has a 7-day SLA. Officers must resolve within this time. You can see the countdown timer on your dashboard. Overdue complaints get auto-escalated! ⏰",
        [{ label: '🏠 Main Menu', value: 'main' }],
        'main'
      );
      return;
    }
    if (value === 'faq-lang') {
      respond(
        "JanSunwai supports English, हिंदी (Hindi), and తెలుగు (Telugu). You can switch language anytime from the top bar. Voice complaints can be in any language! 🌐",
        [{ label: '🏠 Main Menu', value: 'main' }],
        'main'
      );
      return;
    }

    if (value === 'yes-file-pothole') {
      respond('What is your complaint about?', [
        { label: '🏗️ Roads/Infrastructure', value: 'dept-roads' },
        { label: '💧 Water Supply', value: 'dept-water' },
        { label: '⚡ Electricity', value: 'dept-electricity' },
        { label: '🏠 Other', value: 'dept-other' },
      ], 'file-category');
      return;
    }
    if (value === 'no-thanks') {
      respond('No problem! Is there anything else I can help with?', mainOptions, 'main');
      return;
    }

    respond("I'm not sure I understand. Let me help you with these options:", mainOptions, 'main');
  }

  function getDeptInfo(dept: string) {
    if (dept === 'roads') return { name: 'Public Works (PWD)', cat: 'Road Damage', priority: 'High 🔴' };
    if (dept === 'water') return { name: 'Water Supply (WSS)', cat: 'Water Issue', priority: 'High 🔴' };
    if (dept === 'electricity') return { name: 'Electricity (EPD)', cat: 'Power Issue', priority: 'Medium 🟡' };
    return null;
  }

  function detectKeyword(text: string): string | null {
    const lower = text.toLowerCase();
    if (['hello', 'hi', 'hey', 'namaste'].some((k) => lower.includes(k))) return 'greet';
    if (['pothole', 'road', 'bridge', 'footpath'].some((k) => lower.includes(k))) return 'roads';
    if (['water', 'tap', 'supply', 'pipe', 'leak'].some((k) => lower.includes(k))) return 'water';
    if (['electricity', 'power', 'light', 'transformer'].some((k) => lower.includes(k))) return 'electricity';
    if (['thank', 'thanks', 'dhanyavaad'].some((k) => lower.includes(k))) return 'thanks';
    if (['complaint', 'file', 'submit'].some((k) => lower.includes(k))) return 'file';
    if (['track', 'status', 'check'].some((k) => lower.includes(k))) return 'track';
    if (lower.includes('help')) return 'help';
    return null;
  }

  function handleFreeText(text: string) {
    if (flow === 'track-input') {
      if (text.trim().toUpperCase().startsWith('GRV')) {
        respond(
          `🔍 Searching...\n\n✅ Complaint Found!\n📋 ${text.trim().toUpperCase()}\n📌 Status: In Progress\n🏢 Department: Public Works\n⏱️ Filed: 15 days ago\n\nWant to see full details?`,
          [
            { label: '📄 View Full Details', value: 'track-view' },
            { label: '🔍 Track Another', value: 'track-another' },
            { label: '🏠 Main Menu', value: 'main' },
          ],
          'main'
        );
      } else {
        respond(
          "That doesn't look like a valid tracking ID. The format is GRV-2024-XXXXX. Please try again.",
          undefined,
          'track-input'
        );
      }
      return;
    }

    if (flow === 'file-describe') {
      const info = getDeptInfo(pendingDept);
      if (info) {
        respond(
          `🤖 AI Analysis Complete!\n\n🏢 Department: ${info.name}\n📂 Category: ${info.cat}\n${info.priority} Suggested Priority: High\n\nWould you like to file this complaint now?`,
          [
            { label: '✅ Yes, File Now', value: 'file-yes' },
            { label: '✏️ Change Details', value: 'file-change' },
            { label: '❌ Cancel', value: 'file-cancel' },
          ],
          'file-confirm'
        );
      } else {
        const kw = detectKeyword(text);
        let dept = '';
        if (kw === 'roads') dept = 'roads';
        else if (kw === 'water') dept = 'water';
        else if (kw === 'electricity') dept = 'electricity';

        if (dept) {
          setPendingDept(dept);
          const dinfo = getDeptInfo(dept)!;
          respond(
            `🤖 AI Analysis Complete!\n\n🏢 Department: ${dinfo.name}\n📂 Category: ${dinfo.cat}\n🔴 Suggested Priority: High\n\nWould you like to file this complaint now?`,
            [
              { label: '✅ Yes, File Now', value: 'file-yes' },
              { label: '✏️ Change Details', value: 'file-change' },
              { label: '❌ Cancel', value: 'file-cancel' },
            ],
            'file-confirm'
          );
        } else {
          respond(
            "I've noted your issue. Based on your description, I'll route this to the appropriate department.\n\nWould you like to proceed?",
            [
              { label: '✅ Yes, File Now', value: 'file-yes' },
              { label: '❌ Cancel', value: 'file-cancel' },
            ],
            'file-confirm'
          );
        }
      }
      return;
    }

    const kw = detectKeyword(text);
    if (kw === 'greet') {
      respond("🙏 Namaste! How can I help you today?", mainOptions, 'main');
    } else if (kw === 'roads') {
      respond(
        "Sounds like a Public Works issue! Want me to help you file a complaint?",
        [
          { label: 'Yes, help me file', value: 'yes-file-pothole' },
          { label: 'No thanks', value: 'no-thanks' },
        ],
        'main'
      );
    } else if (kw === 'water') {
      respond(
        "Sounds like a Water Supply issue! Want me to help you file a complaint?",
        [
          { label: 'Yes, help me file', value: 'yes-file-pothole' },
          { label: 'No thanks', value: 'no-thanks' },
        ],
        'main'
      );
    } else if (kw === 'electricity') {
      respond(
        "Sounds like an Electricity issue! Want me to help you file a complaint?",
        [
          { label: 'Yes, help me file', value: 'yes-file-pothole' },
          { label: 'No thanks', value: 'no-thanks' },
        ],
        'main'
      );
    } else if (kw === 'thanks') {
      respond("You're welcome! 🙏 Is there anything else I can help with?", mainOptions, 'main');
    } else if (kw === 'file') {
      handleOption('file', '📝 File a Complaint');
      return;
    } else if (kw === 'track') {
      handleOption('track', '🔍 Track Complaint');
      return;
    } else if (kw === 'help') {
      respond("I'm here to help! Here's what I can do:", mainOptions, 'main');
    } else {
      respond("I'm not sure I understand. Let me help you with these options:", mainOptions, 'main');
    }
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    addUserMessage(text);
    handleFreeText(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  function toggleOpen() {
    setIsOpen((prev) => {
      if (!prev) {
        setMessages([initialMessage]);
        setFlow('main');
        setInputValue('');
      }
      return !prev;
    });
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes chatbot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,153,51,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(255,153,51,0); }
        }
      `}</style>

      {isOpen && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{
            bottom: '96px',
            right: '24px',
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(500px, 70vh)',
          }}
        >
          <div className="bg-[#0C2340] text-white p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-bold text-sm leading-tight">JanSunwai AI Assistant</p>
                <p className="text-xs text-blue-200">Online · Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'bot' ? (
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>
                    {msg.options && msg.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleOption(opt.value, opt.label)}
                            className="border border-[#FF9933] text-[#FF9933] rounded-full px-3 py-1.5 text-xs font-medium hover:bg-[#FF9933] hover:text-white transition-colors cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-[#FF9933] text-white rounded-xl rounded-tr-none p-3 shadow-sm text-sm max-w-[80%] whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="max-w-[80%]">
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-3 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FF9933] transition-colors"
            />
            <button
              onClick={handleSend}
              className="bg-[#FF9933] text-white rounded-lg px-3 py-2 hover:bg-[#E8870D] transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(to right, #FF9933, #E8870D)',
          animation: isOpen ? 'none' : 'chatbot-pulse 2s ease-in-out infinite',
        }}
        aria-label="Open AI Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </>
  );
}
