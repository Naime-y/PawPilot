import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReminderRule } from '../../types';
import { Bell, MessageSquare, Check, Edit3, Smartphone, Sparkles, Send } from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { reminders, toggleReminderRule, updateReminderTemplate, showToast } = useApp();
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editTemplate, setEditTemplate] = useState('');

  const handleStartEdit = (rule: ReminderRule) => {
    setEditingRuleId(rule.id);
    setEditTemplate(rule.templateMessage);
  };

  const handleSaveTemplate = (ruleId: string) => {
    updateReminderTemplate(ruleId, editTemplate);
    setEditingRuleId(null);
  };

  const handleSendTestMessage = (title: string) => {
    showToast(`Test automated message dispatched for "${title}"`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Automated Reminders & Messaging</h2>
          <p className="text-xs text-slate-500">
            Configure automated WhatsApp notifications, appointment confirmations, and routine maintenance prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp Automation Active
          </span>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {reminders.map((rule) => {
          const isEditing = editingRuleId === rule.id;

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                rule.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-800 flex items-center justify-center text-xs font-bold">
                      <Smartphone className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{rule.title}</h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Channel: {rule.channel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Triggers: {rule.leadTimeHours >= 24 ? `${rule.leadTimeHours / 24} day(s)` : `${rule.leadTimeHours} hour(s)`} prior to appointment
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminderRule(rule.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      rule.enabled
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleSendTestMessage(rule.title)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-200 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3 text-slate-400" />
                    <span>Send Test</span>
                  </button>
                </div>
              </div>

              {/* Message Template Body */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Edit WhatsApp Template Message
                    </label>
                    <textarea
                      rows={3}
                      value={editTemplate}
                      onChange={(e) => setEditTemplate(e.target.value)}
                      className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700 font-mono text-slate-800"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Available placeholders: {'{{customer_name}}'}, {'{{pet_name}}'}, {'{{appointment_time}}'}, {'{{staff_name}}'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingRuleId(null)}
                          className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveTemplate(rule.id)}
                          className="px-3 py-1 bg-teal-800 text-white rounded text-xs font-semibold hover:bg-teal-900"
                        >
                          Save Template
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Template Preview
                      </span>
                      <button
                        onClick={() => handleStartEdit(rule)}
                        className="text-xs text-teal-800 hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Template</span>
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-700 leading-relaxed">
                      {rule.templateMessage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
