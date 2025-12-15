import React from 'react';
import { TabContext } from '../types';
import { Layers, Globe, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  tabs: TabContext[];
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tabs, onAddTab, onRemoveTab }) => {
  return (
    <div id="sidebar-panel" className="w-64 bg-slate-50 border-r border-slate-200 h-full flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Layers className="w-5 h-5 text-brand-600" />
          <span>กราฟบริบท (Context)</span>
        </div>
        <button onClick={onAddTab} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-600 transition-colors" title="เพิ่มข้อมูล">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          แหล่งข้อมูลที่ใช้งาน
        </div>
        {tabs.map((tab) => (
          <div key={tab.id} className="group flex flex-col bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 overflow-hidden">
                    {tab.favicon ? (
                        <img src={tab.favicon} alt="" className="w-4 h-4 rounded-sm" />
                    ) : (
                        <Globe className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-700 truncate">{tab.title}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveTab(tab.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
            <div className="mt-2 text-xs text-slate-500 line-clamp-2">
                {tab.content}
            </div>
            <div className="mt-2 flex items-center space-x-1">
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded border border-slate-200">
                    HTML
                </span>
                <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] rounded border border-green-100">
                    Active
                </span>
            </div>
          </div>
        ))}
        {tabs.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
                ไม่มีแหล่งข้อมูล <br/> กด + เพื่อเพิ่ม
            </div>
        )}
      </div>
      
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
        GenTabs v0.1 • Local Context
      </div>
    </div>
  );
};