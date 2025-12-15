import { TabContext, AppSchema, AppType } from './types';

export const MOCK_TABS: TabContext[] = [
  {
    id: 'tab-1',
    title: 'สรุปฟีเจอร์ React 19',
    url: 'https://react.dev/blog/react-19',
    content: 'React 19 มาพร้อมกับ Actions, การปรับปรุง useTransition, และการรองรับ Server Component ที่ดีขึ้น Compiler ใหม่ทำงานได้มีประสิทธิภาพมากขึ้น',
    timestamp: Date.now(),
    favicon: 'https://react.dev/favicon.ico'
  },
  {
    id: 'tab-2',
    title: 'ความสามารถใหม่ใน Vue.js 3.4',
    url: 'https://vuejs.org/releases/3-4',
    content: 'Vue 3.4 มีระบบ reactivity ที่มีประสิทธิภาพมากขึ้น (vapor mode preview), defineModel macro เสถียรแล้ว, และ parser เร็วขึ้น 2 เท่า',
    timestamp: Date.now() - 10000,
    favicon: 'https://vuejs.org/logo.svg'
  },
  {
    id: 'tab-3',
    title: 'ภาพรวม Angular 17',
    url: 'https://angular.io/blog/v17',
    content: 'Angular 17 เปิดตัว block syntax ใหม่สำหรับ control flow, deferrable views, และ signal-based inputs การทำ Hydration ได้รับการปรับปรุง',
    timestamp: Date.now() - 20000,
    favicon: 'https://angular.io/assets/images/logos/angular/angular.svg'
  }
];

export const MOCK_SHOPPING_TABS: TabContext[] = [
  {
    id: 'shop-1',
    title: 'iPhone 15 Pro Max - Apple Store TH',
    url: 'https://www.apple.com/th/shop/buy-iphone/iphone-15-pro',
    content: 'iPhone 15 Pro Max สีไทเทเนียมธรรมชาติ 256GB ราคา 48,900 บาท จัดส่งฟรี รับเองที่ร้านได้ ผ่อน 0% 10 เดือน วัสดุไทเทเนียม A17 Pro Chip',
    timestamp: Date.now(),
    favicon: 'https://www.apple.com/favicon.ico'
  },
  {
    id: 'shop-2',
    title: 'Samsung Galaxy S24 Ultra - Shopee Mall',
    url: 'https://shopee.co.th/samsung-s24-ultra',
    content: 'Samsung Galaxy S24 Ultra AI Phone (12/256GB) ราคาโปรโมชั่น 40,900 บาท (จาก 46,900) โค้ดส่วนลด 2,000 Coins แถม Care+ 1 ปี จัดส่งภายใน 3 วัน',
    timestamp: Date.now() - 5000,
    favicon: 'https://shopee.co.th/favicon.ico'
  },
  {
    id: 'shop-3',
    title: 'Google Pixel 8 Pro - ร้านหิ้ว TreeMobile',
    url: 'https://treemobile.com/pixel-8-pro',
    content: 'Google Pixel 8 Pro เครื่องหิ้ว JP/US Ram 12 Rom 128GB ราคา 31,500 บาท ประกันร้าน 7 วัน ไม่มีประกันศูนย์ไทย กล้องเทพ AI Magic Eraser',
    timestamp: Date.now() - 8000,
    favicon: 'https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-Pc85uzbIVNJ9UGroSC7672Abcastu955uxvW7zYu58iP0Qf_n2tY72sprk5fF_hL8t82tXjME=s0'
  }
];

export const DEMO_APP: AppSchema = {
  type: AppType.COMPARISON,
  title: 'เปรียบเทียบ Frontend Frameworks 2024',
  description: 'ตารางเปรียบเทียบจุดเด่นของ React, Vue และ Angular จากข้อมูลล่าสุด',
  createdAt: Date.now(),
  sources: ['tab-1', 'tab-2', 'tab-3'],
  data: {
    columns: ['ฟีเจอร์เด่น', 'Performance', 'Learning Curve'],
    rows: [
      {
        'ฟีเจอร์เด่น': 'Server Components, Actions',
        'Performance': 'สูง (React Compiler)',
        'Learning Curve': 'ปานกลาง'
      },
      {
        'ฟีเจอร์เด่น': 'Vapor Mode, defineModel',
        'Performance': 'สูงมาก (Optimized Reactivity)',
        'Learning Curve': 'ง่าย'
      },
      {
        'ฟีเจอร์เด่น': 'Control Flow Syntax, Signals',
        'Performance': 'ดี (Hydration improvements)',
        'Learning Curve': 'ยาก'
      }
    ]
  }
};

export const DEMO_SHOPPING_APP: AppSchema = {
  type: AppType.COMPARISON,
  title: 'เปรียบเทียบราคามือถือเรือธง (ซื้อที่ไหนคุ้มสุด)',
  description: 'วิเคราะห์ความคุ้มค่า iPhone 15 Pro Max vs S24 Ultra vs Pixel 8 Pro จากร้านค้าต่างๆ',
  createdAt: Date.now(),
  sources: ['shop-1', 'shop-2', 'shop-3'],
  data: {
    columns: ['รุ่น/ร้านค้า', 'ราคา (บาท)', 'โปรโมชั่น/ของแถม', 'การรับประกัน', 'ข้อสังเกต'],
    rows: [
      {
        'รุ่น/ร้านค้า': 'iPhone 15 Pro Max (Apple Store)',
        'ราคา (บาท)': '48,900',
        'โปรโมชั่น/ของแถม': 'ผ่อน 0% 10 เดือน',
        'การรับประกัน': 'ศูนย์ไทย 1 ปี',
        'ข้อสังเกต': 'ราคามาตรฐาน, ได้ของแน่นอน'
      },
      {
        'รุ่น/ร้านค้า': 'S24 Ultra (Shopee)',
        'ราคา (บาท)': '40,900 (ลดจาก 46,900)',
        'โปรโมชั่น/ของแถม': 'ลดราคา + คืน Coin + Care+ 1 ปี',
        'การรับประกัน': 'ศูนย์ไทย 1 ปี + ประกันจอแตก',
        'ข้อสังเกต': 'คุ้มที่สุดถ้ามีโค้ด'
      },
      {
        'รุ่น/ร้านค้า': 'Pixel 8 Pro (ร้านหิ้ว)',
        'ราคา (บาท)': '31,500',
        'โปรโมชั่น/ของแถม': 'ราคาถูกกว่าศูนย์',
        'การรับประกัน': 'ประกันใจ 7 วัน (ไม่มีศูนย์ไทย)',
        'ข้อสังเกต': 'เสี่ยงเรื่องประกัน, ซ่อมยาก'
      }
    ]
  }
};

export const SYSTEM_PROMPT = `
You are the "App Architect Agent" for GenTabs. 
Your goal is to analyze the user's provided context (browser tabs/text) and their intent, then generate a JSON configuration for a specific "Ephemeral App".

**IMPORTANT: The output content MUST be in THAI language (Mainly Thai, technical terms can be English).**

Output must be a single JSON object with the following structure:
{
  "type": "comparison" | "timeline" | "kanban" | "summary" | "quiz",
  "title": "App Title (Thai)",
  "description": "Brief description (Thai)",
  "sources": ["tab-id-1", "tab-id-2"],
  "data": { ... specific data structure in Thai ... }
}

Supported App Types and their 'data' structures:
1. 'comparison':
   Data format: { "columns": ["Criteria 1", "Criteria 2"], "rows": [{ "Criteria 1": "Value A", "Criteria 2": "Value B" }] }

2. 'timeline':
   Data format: { "items": [{ "date": "YYYY-MM-DD or Period", "title": "Event", "description": "Details" }] }

3. 'kanban':
   Data format: { "columns": [{ "id": "col1", "title": "To Do", "items": [{ "id": "item1", "title": "Task", "description": "Details" }] }] }

4. 'summary':
   Data format: { "summary": "Full text", "keyPoints": ["Point 1", "Point 2"], "actionItems": ["Action 1"] }

5. 'quiz':
   Data format: { "questions": [{ "question": "Text", "options": ["A", "B"], "correctIndex": 0, "explanation": "Why..." }] }

Rules:
- Output JSON ONLY.
- Ensure 'sources' array contains the IDs of the tabs used.
- If the intent is unclear, default to 'summary'.
- ALL USER FACING TEXT MUST BE IN THAI.
`;