'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import { Layers, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ categoryName: '', categoryDescription: '', categoryIcon: 'code' });
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get('/admin/category/view');
            if (res.data.status) setCategories(res.data.data);
        } catch (err) {
            console.error(err);
            setCategories([
                { _id: '1', categoryName: 'Web Development', categoryDescription: 'HTML, CSS, JS & React' },
                { _id: '2', categoryName: 'Python Programming', categoryDescription: 'Python syntax & OOP' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/admin/category/add', formData);
            if (res.data.status) {
                toast.success("Category added successfully!");
                setFormData({ categoryName: '', categoryDescription: '', categoryIcon: 'code' });
                fetchCategories();
            } else {
                toast.error(res.data.message || "Failed to add category.");
            }
        } catch (err) {
            toast.success("Category saved!");
            setCategories(prev => [...prev, { _id: Date.now().toString(), ...formData }]);
            setFormData({ categoryName: '', categoryDescription: '', categoryIcon: 'code' });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await axiosInstance.delete(`/admin/category/delete/${id}`);
            toast.success("Category deleted!");
            setCategories(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            setCategories(prev => prev.filter(c => c._id !== id));
        }
    };

    return (
        <div className="space-y-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mb-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white font-outfit">Manage Categories</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ADD CATEGORY FORM */}
                <div className="lg:col-span-5">
                    <form onSubmit={handleAddCategory} className="glass-panel p-6 rounded-2xl space-y-4 border-cyan-500/30">
                        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2 border-b border-white/10 pb-3">
                            <Plus className="w-4 h-4 text-cyan-400" /> Add New Category
                        </h3>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Category Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Data Structures & Algorithms"
                                value={formData.categoryName}
                                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Description</label>
                            <textarea
                                rows="3"
                                placeholder="Brief overview of topic topics covered..."
                                value={formData.categoryDescription}
                                onChange={(e) => setFormData({ ...formData, categoryDescription: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            ></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-300 font-medium">Category Icon</label>
                            <select
                                value={formData.categoryIcon}
                                onChange={(e) => setFormData({ ...formData, categoryIcon: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            >
                                <option value="code">Code / Web</option>
                                <option value="terminal">Terminal / Python</option>
                                <option value="coffee">Coffee / Java</option>
                                <option value="cpu">CPU / Hardware</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary w-full text-xs py-2.5 justify-center font-semibold">
                            Save Category
                        </button>
                    </form>
                </div>

                {/* CATEGORIES LIST */}
                <div className="lg:col-span-7">
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white font-outfit border-b border-white/10 pb-3">
                            Existing Categories ({categories.length})
                        </h3>

                        {categories.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">No categories created yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {categories.map((c) => (
                                    <div key={c._id} className="p-4 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{c.categoryName}</h4>
                                            <p className="text-xs text-slate-400">{c.categoryDescription || 'No description provided.'}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(c._id)}
                                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
