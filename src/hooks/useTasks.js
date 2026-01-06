import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();

        const socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            secure: true,
            reconnection: true
        });

        socket.on('taskCreated', (task) => {
            setTasks(prev => [task, ...prev]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev =>
                prev.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
        });

        socket.on('taskDeleted', (id) => {
            setTasks(prev =>
                prev.filter(task => task.id !== Number(id))
            );
        });

        return () => socket.disconnect();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const url =
                filter === 'all'
                    ? API_URL
                    : `${API_URL}?status=${filter}`;

            const res = await axios.get(url);
            setTasks(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const createTask = async ({ title, description }) => {
        try {
            await axios.post(API_URL, { title, description });
        } catch (err) {
            console.error(err);
            setError('Failed to create task');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${API_URL}/${id}`, { status });
        } catch (err) {
            console.error(err);
            setError('Failed to update task');
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (err) {
            console.error(err);
            setError('Failed to delete task');
        }
    };

    return {
        tasks,
        loading,
        error,
        filter,
        setFilter,
        createTask,
        updateStatus,
        deleteTask
    };
};
