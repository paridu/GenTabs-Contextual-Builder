import React, { useState } from 'react';
import { AppSchema, AppType, ComparisonData, KanbanData, SummaryData, TimelineData } from '../types';
import { CheckCircle2, Circle, Clock, ArrowRight, Globe, Plus, X } from 'lucide-react';

// --- Sub-components for specific App Types ---

const ComparisonTable: React.FC<{ data: ComparisonData }> = ({ data }) => {
    // If no data or incorrect format
    if (!data?.columns || !data?.rows) return <div>ข้อมูลไม่ถูกต้อง</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50">
                    <tr>
                        {data.columns.map((col, i) => (
                            <th key={i} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {data.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            {data.columns.map((col, j) => (
                                <td key={j} className="px-6 py-4 whitespace-pre-wrap text-sm text-slate-700">
                                    {row[col] || row[col.toLowerCase()] || row[Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase()) || ''] || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TimelineView: React.FC<{ data: TimelineData }> = ({ data }) => {
    if (!data?.items) return <div>ข้อมูลไม่ถูกต้อง</div>;
    return (
        <div className="relative border-l-2 border-brand-200 ml-4 space-y-8 py-2">
            {data.items.map((item, i) => (
                <div key={i} className="mb-8 relative pl-6">
                    <span className="absolute -left-[9px] top-1 bg-white border-2 border-brand-500 rounded-full w-4 h-4"></span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                        <span className="text-xs font-mono font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">{item.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

const KanbanBoard: React.FC<{ data: KanbanData; onUpdate?: (data: KanbanData) => void }> = ({ data, onUpdate }) => {
    const [addingColId, setAddingColId] = useState<string | null>(null);
    const [newItemTitle, setNewItemTitle] = useState("");

    if (!data?.columns) return <div>ข้อมูลไม่ถูกต้อง</div>;

    const handleAddItem = () => {
        if (!newItemTitle.trim() || !addingColId || !onUpdate) return;

        const newColumns = data.columns.map(col => {
            if (col.id === addingColId) {
                return {
                    ...col,
                    items: [...col.items, { 
                        id: `item-${Date.now()}`, 
                        title: newItemTitle,
                        description: ""
                    }]
                };
            }
            return col;
        });

        onUpdate({ ...data, columns: newColumns });
        setAddingColId(null);
        setNewItemTitle("");
    };

    return (
        <div className="flex overflow-x-auto gap-4 h-full pb-4 items-start">
            {data.columns.map((col) => (
                <div key={col.id} className="min-w-[280px] w-80 bg-slate-100 rounded-lg p-3 flex flex-col max-h-full">
                    <div className="font-bold text-slate-700 mb-3 px-1 flex justify-between items-center">
                        <span>{col.title}</span>
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{col.items.length}</span>
                    </div>
                    <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                        {col.items.map((item) => (
                            <div key={item.id} className="bg-white p-3 rounded shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                <div className="font-medium text-slate-800 text-sm mb-1">{item.title}</div>
                                {item.description && <div className="text-xs text-slate-500 line-clamp-3">{item.description}</div>}
                            </div>
                        ))}
                    </div>
                    
                    {addingColId === col.id ? (
                        <div className="mt-3 bg-white p-2 rounded shadow-sm border border-brand-200 animate-in fade-in zoom-in duration-200">
                             <input 
                                autoFocus
                                className="w-full text-sm outline-none bg-transparent placeholder-slate-400 text-slate-700 mb-2"
                                placeholder="ใส่ชื่อรายการ..."
                                value={newItemTitle}
                                onChange={e => setNewItemTitle(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleAddItem();
                                    if (e.key === 'Escape') {
                                        setAddingColId(null); 
                                        setNewItemTitle("");
                                    }
                                }}
                             />
                             <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={() => { setAddingColId(null); setNewItemTitle(""); }} 
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={handleAddItem} 
                                    className="flex items-center space-x-1 text-xs bg-brand-600 hover:bg-brand-700 text-white px-2 py-1 rounded transition-colors"
                                >
                                    <span>เพิ่ม</span>
                                </button>
                             </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => { setAddingColId(col.id); setNewItemTitle(""); }}
                            className="mt-3 w-full py-2 flex items-center justify-center space-x-1 rounded border-2 border-dashed border-slate-300 text-slate-400 text-sm hover:border-brand-300 hover:text-brand-500 hover:bg-slate-50 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>เพิ่มรายการ</span>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

const SummaryView: React.FC<{ data: SummaryData }> = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-lg">
                <h3 className="text-indigo-900 font-bold mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" /> บทสรุปผู้บริหาร
                </h3>
                <p className="text-indigo-800 text-sm leading-relaxed">{data.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> ประเด็นสำคัญ
                    </h3>
                    <ul className="space-y-2">
                        {data.keyPoints?.map((pt, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-600">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-green-400 rounded-full shrink-0"></span>
                                {pt}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-brand-500" /> สิ่งที่ต้องทำต่อ
                    </h3>
                    <ul className="space-y-2">
                        {data.actionItems?.map((item, i) => (
                            <li key={i} className="flex items-center text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                                <Circle className="w-3 h-3 mr-2 text-slate-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Main Renderer ---

export const DynamicRenderer: React.FC<{ app: AppSchema; onUpdateApp?: (app: AppSchema) => void }> = ({ app, onUpdateApp }) => {
    
    const handleKanbanUpdate = (newData: KanbanData) => {
        if (onUpdateApp) {
            onUpdateApp({ ...app, data: newData });
        }
    };

    const renderContent = () => {
        switch (app.type) {
            case AppType.COMPARISON:
                return <ComparisonTable data={app.data} />;
            case AppType.TIMELINE:
                return <TimelineView data={app.data} />;
            case AppType.KANBAN:
                return <KanbanBoard data={app.data} onUpdate={handleKanbanUpdate} />;
            case AppType.SUMMARY:
                return <SummaryView data={app.data} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <p>ไม่รองรับแอปประเภท: {app.type}</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="mb-6 flex items-baseline justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{app.title}</h1>
                    <p className="text-slate-500 mt-1">{app.description}</p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                    สร้างโดย {app.type} agent
                </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
};