import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Task } from '../types';
import InputField from './InputField';

const LOCAL_STORAGE_KEY = 'tasks';

const EditTaskModal: React.FC<{
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, newText: string, newDueDate?: string) => void;
}> = ({ task, isOpen, onClose, onSave }) => {
    const { t } = useTranslations();
    const [editText, setEditText] = useState(task.text);
    const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

    useEffect(() => {
        if (isOpen) {
            setEditText(task.text);
            setEditDueDate(task.dueDate || '');
        }
    }, [isOpen, task]);

    const handleSave = () => {
        onSave(task.id, editText, editDueDate);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadein" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-halal-green dark:text-accent-gold">{t('taskList.editModalTitle')}</h3>
                </div>
                <div className="p-6 space-y-4">
                    <InputField
                        id="edit-task-text"
                        label={t('taskList.descriptionLabel')}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                    />
                    <InputField
                        id="edit-task-due-date"
                        label={t('taskList.dueDateLabel')}
                        type="date"
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                    />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-2xl flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        {t('taskList.cancelButton')}
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                        {t('taskList.saveButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const TaskListPage: React.FC = () => {
    const { t } = useTranslations();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        try {
            const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);
    
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) {
                return a.isCompleted ? 1 : -1;
            }
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });
    }, [tasks]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim() === '') return;
        const newTask: Task = {
            id: Date.now().toString(),
            text: newTaskText.trim(),
            isCompleted: false,
            dueDate: newDueDate || undefined,
        };
        setTasks(prev => [newTask, ...prev]);
        setNewTaskText('');
        setNewDueDate('');
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ));
    };

    const deleteTask = (id: string) => {
        if(window.confirm(t('taskList.deleteConfirm'))) {
            setTasks(prev => prev.filter(task => task.id !== id));
        }
    };
    
    const handleSaveTask = (id: string, newText: string, newDueDate?: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, text: newText, dueDate: newDueDate } : task
        ));
    };
    
    const isOverdue = (dueDate: string | undefined): boolean => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dueDate) < today;
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-halal-green dark:text-accent-gold">{t('home.services.items.taskList')}</h1>
                </div>

                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleAddTask} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700 mb-8 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-grow w-full">
                            <label htmlFor="new-task-text" className="sr-only">{t('taskList.descriptionLabel')}</label>
                            <input
                                id="new-task-text"
                                type="text"
                                value={newTaskText}
                                onChange={e => setNewTaskText(e.target.value)}
                                placeholder={t('taskList.addTaskPlaceholder')}
                                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green dark:focus:ring-accent-gold bg-white dark:bg-gray-700"
                            />
                        </div>
                         <div className="w-full sm:w-auto">
                            <label htmlFor="new-task-due-date" className="sr-only">{t('taskList.dueDateLabel')}</label>
                            <input
                                id="new-task-due-date"
                                type="date"
                                value={newDueDate}
                                onChange={e => setNewDueDate(e.target.value)}
                                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green dark:focus:ring-accent-gold bg-white dark:bg-gray-700"
                            />
                         </div>
                        <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                            {t('taskList.addButton')}
                        </button>
                    </form>

                    <div className="space-y-4">
                        {sortedTasks.map(task => (
                            <div key={task.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-300 ${task.isCompleted ? 'bg-gray-100 dark:bg-gray-800/50 opacity-60' : 'bg-white dark:bg-gray-800'}`}>
                                <label htmlFor={`task-${task.id}`} className="sr-only">{`Mark task "${task.text}" as complete`}</label>
                                <input
                                    id={`task-${task.id}`}
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={() => toggleTask(task.id)}
                                    className="h-6 w-6 mt-1 rounded border-gray-300 dark:border-gray-600 text-halal-green focus:ring-halal-green flex-shrink-0 bg-gray-100 dark:bg-gray-900"
                                />
                                <div className="flex-1">
                                    <p className={`relative font-medium task-text ${task.isCompleted ? 'task-completed text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>{task.text}</p>
                                    {task.dueDate && (
                                        <p className={`text-sm mt-1 ${!task.isCompleted && isOverdue(task.dueDate) ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {t('taskList.dueDateLabel')}: {new Date(task.dueDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                                            {!task.isCompleted && isOverdue(task.dueDate) && ` (${t('taskList.overdueLabel')})`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setEditingTask(task)} className="p-2 text-gray-400 hover:text-halal-green dark:hover:text-accent-gold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={t('taskList.editTooltip')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                    </button>
                                     <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors" aria-label={t('taskList.deleteTooltip')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('taskList.emptyState')}</p>
                        )}
                    </div>
                </div>
            </div>
            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveTask}
                />
            )}
        </>
    );
};

export default TaskListPage;