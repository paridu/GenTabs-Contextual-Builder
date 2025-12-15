import React from 'react';
import { AgentStatus } from '../types';
import { Bot, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
    statuses: AgentStatus[];
}

export const AgentStatusPanel: React.FC<Props> = ({ statuses }) => {
    return (
        <div id="agent-status-panel" className="flex items-center space-x-4 py-2 px-4 bg-white border-b border-slate-200">
            {statuses.map((agent, idx) => {
                let icon = <Bot className="w-4 h-4 text-slate-300" />;
                let textClass = "text-slate-400";
                
                if (agent.status === 'working') {
                    icon = <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />;
                    textClass = "text-brand-600 font-medium";
                } else if (agent.status === 'done') {
                    icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                    textClass = "text-slate-700";
                } else if (agent.status === 'error') {
                    icon = <AlertCircle className="w-4 h-4 text-red-500" />;
                    textClass = "text-red-600";
                }

                return (
                    <div key={idx} className="flex items-center space-x-2 text-xs">
                        {icon}
                        <span className={textClass}>{agent.name}</span>
                        {agent.status === 'working' && agent.message && (
                            <span className="text-slate-400 hidden sm:inline">- {agent.message}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};