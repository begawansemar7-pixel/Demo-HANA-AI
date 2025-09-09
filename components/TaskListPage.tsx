import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { Task } from '../types';

const LOCAL_STORAGE_KEY = 'tasks';

const TaskListPage: React.FC = () => {
    const { t } = useTranslations();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');

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
    
    const isOverdue = (dueDate: string | undefined): boolean => {
        if (!dueDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dueDate) < today;
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-halal-green">{t('home.services.items.taskList')}</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleAddTask} className="bg-white p-6 rounded-2xl shadow-lg border mb-8 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-grow w-full">
                        <label htmlFor="new-task-text" className="sr-only">New task description</label>
                        <input
                            id="new-task-text"
                            type="text"
                            value={newTaskText}
                            onChange={e => setNewTaskText(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green"
                        />
                    </div>
                     <div className="w-full sm:w-auto">
                        <label htmlFor="new-task-due-date" className="sr-only">Due date</label>
                        <input
                            id="new-task-due-date"
                            type="date"
                            value={newDueDate}
                            onChange={e => setNewDueDate(e.target.value)}
                            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-halal-green"
                        />
                     </div>
                    <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-halal-green text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                        Add
                    </button>
                </form>

                <div className="space-y-4">
                    {sortedTasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${task.isCompleted ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                            <label htmlFor={`task-${task.id}`} className="sr-only">{`Mark task "${task.text}" as complete`}</label>
                            <input
                                id={`task-${task.id}`}
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggleTask(task.id)}
                                className="h-6 w-6 rounded border-gray-300 text-halal-green focus:ring-halal-green flex-shrink-0"
                            />
                            <div className="flex-1">
                                <p className={`font-medium text-gray-800 ${task.isCompleted ? 'line-through' : ''}`}>{task.text}</p>
                                {task.dueDate && (
                                    <p className={`text-sm mt-1 ${!task.isCompleted && isOverdue(task.dueDate) ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                        Due: {new Date(task.dueDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                                        {!task.isCompleted && isOverdue(task.dueDate) && ' (Overdue)'}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Your task list is empty.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskListPage;