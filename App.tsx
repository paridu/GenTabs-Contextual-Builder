import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DynamicRenderer } from './components/DynamicRenderer';
import { AgentStatusPanel } from './components/AgentStatusPanel';
import { AgentOrchestrator } from './services/agentSystem';
import { TabContext, AppSchema, AgentStatus, Message } from './types';
import { MOCK_TABS, DEMO_APP, MOCK_SHOPPING_TABS, DEMO_SHOPPING_APP } from './constants';
import { Send, Wand2, RefreshCw, PlayCircle, HelpCircle, ShoppingBag } from 'lucide-react';
import { TourGuide, Step } from './components/TourGuide';

const TOUR_STEPS: Step[] = [
    {
        targetId: 'sidebar-panel',
        title: 'แหล่งข้อมูล (Context)',
        content: 'พื้นที่นี้แสดงแท็บและข้อมูลทั้งหมดที่ AI จะนำไปใช้ประมวลผล คุณสามารถเพิ่มหรือลบข้อมูลได้ที่นี่'
    },
    {
        targetId: 'agent-status-panel',
        title: 'สถานะ AI Agent',
        content: 'ติดตามการทำงานของ AI ได้ที่นี่ ตั้งแต่การรวบรวมข้อมูล วิเคราะห์ความต้องการ ไปจนถึงการสร้างแอป'
    },
    {
        targetId: 'chat-interface',
        title: 'สั่งงาน AI',
        content: 'พิมพ์สิ่งที่คุณต้องการสร้างลงในช่องนี้ เช่น "เปรียบเทียบ Framework", "ทำ Timeline", หรือ "สรุปข้อมูล"'
    },
    {
        targetId: 'demo-buttons',
        title: 'ลองเล่น Demo',
        content: 'ถ้านึกไม่ออกว่าจะเริ่มยังไง ลองกดปุ่ม Demo เพื่อดูตัวอย่างการเปรียบเทียบสินค้าหรือ Framework'
    }
];

export default function App() {
  const [tabs, setTabs] = useState<TabContext[]>(MOCK_TABS);
  const [app, setApp] = useState<AppSchema | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: 'สวัสดีครับ! ผมเห็นคุณเปิดแท็บอยู่ อยากให้ผมช่วยสร้างแอปอะไรดีครับ?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
      { name: 'Context Collector', status: 'idle' },
      { name: 'Intent Reasoner', status: 'idle' },
      { name: 'App Architect', status: 'idle' }
  ]);
  
  // Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  const orchestrator = useRef<AgentOrchestrator>(new AgentOrchestrator(setAgentStatuses));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
        if (!app) {
            // First generation
            const generatedApp = await orchestrator.current.processRequest(tabs, userMsg.content);
            setApp(generatedApp);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `ผมสร้างแอปประเภท ${generatedApp.type} ให้แล้วครับ คุณสามารถพิมพ์คุยเพื่อปรับแก้เพิ่มเติมได้เลย`,
                timestamp: Date.now()
            }]);
        } else {
            // Refinement
            const updatedApp = await orchestrator.current.refineRequest(app, messages, userMsg.content);
            setApp(updatedApp);
             setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `อัปเดตแอปเรียบร้อยครับ`,
                timestamp: Date.now()
            }]);
        }
    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'system',
            content: 'ขออภัย เกิดข้อผิดพลาดในการประมวลผล',
            timestamp: Date.now()
        }]);
    }
  };

  const handleAddTab = () => {
      // Mock adding a tab
      const newTab: TabContext = {
          id: `tab-${Date.now()}`,
          title: 'หน้าค้นคว้าใหม่',
          url: 'https://example.com/research',
          content: 'ข้อมูลเพิ่มเติมที่ผู้ใช้เพิ่มเข้ามาเพื่อการค้นคว้า',
          timestamp: Date.now()
      };
      setTabs([...tabs, newTab]);
  };

  const handleRemoveTab = (id: string) => {
      setTabs(tabs.filter(t => t.id !== id));
  };

  const handleTechDemo = () => {
      setTabs(MOCK_TABS);
      setApp(DEMO_APP);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'นี่คือตัวอย่างแอปเปรียบเทียบ Framework ครับ',
          timestamp: Date.now()
      }]);
  };

  const handleShoppingDemo = () => {
      setTabs(MOCK_SHOPPING_TABS);
      setApp(DEMO_SHOPPING_APP);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'นี่คือตัวอย่างการช่วยตัดสินใจซื้อสินค้าครับ ผมรวบรวมข้อมูลราคาและโปรโมชั่นจากเว็บต่างๆ มาให้เปรียบเทียบกันง่ายๆ',
          timestamp: Date.now()
      }]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      <TourGuide steps={TOUR_STEPS} isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      
      {/* 1. Context Sidebar */}
      <Sidebar tabs={tabs} onAddTab={handleAddTab} onRemoveTab={handleRemoveTab} />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Agent Status Bar */}
        <div className="relative">
            <AgentStatusPanel statuses={agentStatuses} />
            <button 
                onClick={() => setIsTourOpen(true)}
                className="absolute right-4 top-2 flex items-center space-x-1 text-slate-400 hover:text-brand-600 text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>วิธีใช้งาน</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col md:flex-row gap-6">
            
            {/* App Canvas (Ephemeral App) */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                {app ? (
                    <div className="h-full flex flex-col p-6 overflow-hidden">
                       <DynamicRenderer app={app} onUpdateApp={setApp} />
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Wand2 className="w-8 h-8 text-slate-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-600">ยังไม่มีแอปที่ใช้งานอยู่</h2>
                        <p className="max-w-md mt-2 text-sm">
                            ผมพร้อมช่วยคุณสร้างเครื่องมือ สั่งให้ผมเปรียบเทียบข้อมูล สร้างไทม์ไลน์ หรือสรุปเนื้อหาจากแท็บที่มีอยู่ได้เลย
                        </p>
                        
                        <div className="mt-8 flex flex-col items-center space-y-4">
                             <div className="flex flex-wrap gap-2 justify-center">
                                {['เปรียบเทียบ Frameworks', 'สร้าง Timeline การปล่อยเวอร์ชัน', 'สรุปฟีเจอร์เด่น'].map(suggestion => (
                                    <button 
                                        key={suggestion}
                                        onClick={() => { setInputText(suggestion); }}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs hover:border-brand-400 hover:text-brand-600 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="relative flex py-2 items-center w-full max-w-xs">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-300 text-xs">หรือ</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div id="demo-buttons" className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={handleTechDemo}
                                    className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow transition-all group"
                                >
                                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Demo: Research</span>
                                </button>
                                <button 
                                    onClick={handleShoppingDemo}
                                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 hover:shadow transition-all group"
                                >
                                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Demo: Shopping</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Interface (Refinement) */}
            <div id="chat-interface" className="w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 shrink-0 h-[400px] md:h-auto">
                <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 flex justify-between">
                    <span>ผู้ช่วย GenTabs</span>
                    <button onClick={() => setApp(null)} className="text-xs text-slate-400 hover:text-red-500 flex items-center">
                        <RefreshCw className="w-3 h-3 mr-1" /> รีเซ็ต
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-brand-600 text-white rounded-br-none' 
                                : msg.role === 'system'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="พิมพ์สิ่งที่ต้องการให้ช่วย..."
                            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}