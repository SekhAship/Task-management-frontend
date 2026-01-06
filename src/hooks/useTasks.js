import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Assuming server is on localhost:5000 from current defaults
const API_URL = 'http://127.0.0.1:5000/api/tasks';
const SOCKET_URL = 'http://127.0.0.1:5000';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();

        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [newTask, ...prev]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
        });

        socket.on('taskDeleted', (deletedTaskId) => {
            setTasks(prev => prev.filter(task => task.id !== parseInt(deletedTaskId, 10)));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const url = filter === 'all' ? API_URL : `${API_URL}?status=${filter}`;
            const response = await axios.get(url);
            setTasks(response.data);
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

    const createTask = async (taskData) => {
        try {
            await axios.post(API_URL, taskData);
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
            setError('Failed to update status');
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
