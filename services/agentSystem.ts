import { AgentStatus, AppSchema, TabContext } from "../types";
import { generateAppFromContext, refineAppWithChat } from "./geminiService";

type AgentCallback = (status: AgentStatus[]) => void;

export class AgentOrchestrator {
  private updateCallback: AgentCallback;

  constructor(callback: AgentCallback) {
    this.updateCallback = callback;
  }

  private setStatuses(statuses: AgentStatus[]) {
    this.updateCallback(statuses);
  }

  async processRequest(tabs: TabContext[], query: string): Promise<AppSchema> {
    // 1. Context Collector
    this.setStatuses([
      { name: 'Context Collector', status: 'working', message: 'กำลังรวบรวมข้อมูล...' },
      { name: 'Intent Reasoner', status: 'idle' },
      { name: 'App Architect', status: 'idle' }
    ]);
    await new Promise(r => setTimeout(r, 600)); // Simulate work

    // 2. Intent Reasoner
    this.setStatuses([
      { name: 'Context Collector', status: 'done', message: 'พร้อมใช้งาน' },
      { name: 'Intent Reasoner', status: 'working', message: 'กำลังวิเคราะห์เป้าหมาย...' },
      { name: 'App Architect', status: 'idle' }
    ]);
    
    try {
        // 3. App Architect (Gemini)
        const appConfig = await generateAppFromContext(tabs, query);
        
        this.setStatuses([
            { name: 'Context Collector', status: 'done' },
            { name: 'Intent Reasoner', status: 'done', message: `ระบุประเภท: ${appConfig.type}` },
            { name: 'App Architect', status: 'working', message: 'กำลังสร้างแอป...' }
        ]);

        await new Promise(r => setTimeout(r, 400)); // Simulate UI gen

        this.setStatuses([
            { name: 'Context Collector', status: 'done' },
            { name: 'Intent Reasoner', status: 'done' },
            { name: 'App Architect', status: 'done', message: 'เสร็จสิ้น' }
        ]);

        return appConfig;

    } catch (error) {
         this.setStatuses([
            { name: 'Context Collector', status: 'done' },
            { name: 'Intent Reasoner', status: 'done' },
            { name: 'App Architect', status: 'error', message: 'เกิดข้อผิดพลาด' }
        ]);
        throw error;
    }
  }

  async refineRequest(currentApp: AppSchema, history: any[], instruction: string): Promise<AppSchema> {
      this.setStatuses([
          { name: 'App Architect', status: 'working', message: 'กำลังปรับปรุงแอป...' }
      ]);
      
      const updatedApp = await refineAppWithChat(currentApp, history, instruction);
      
      this.setStatuses([
          { name: 'App Architect', status: 'done', message: 'อัปเดตเรียบร้อย' }
      ]);
      return updatedApp;
  }
}