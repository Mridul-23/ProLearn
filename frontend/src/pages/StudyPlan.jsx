import React, { useState, useEffect } from 'react';
import { FiBook, FiPlus, FiTrash, FiCheckCircle, FiCircle, FiMap, FiX } from 'react-icons/fi';
import api from '../utils/api';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    useNodesState, 
    useEdgesState, 
    MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';

const StudyPlan = () => {
    const [plans, setPlans] = useState([]);
    const [newPlanTitle, setNewPlanTitle] = useState('');
    const [newPlanDesc, setNewPlanDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    
    // React Flow States
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/api/study-plans/');
            setPlans(res.data);
        } catch (error) {
            console.error("Error fetching study plans", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Transform steps into graph nodes/edges when a plan is selected
    useEffect(() => {
        if (selectedPlan && selectedPlan.steps) {
            const newNodes = selectedPlan.steps.map((step, index) => ({
                id: step.id.toString(),
                position: { x: 250, y: index * 150 },
                data: { label: step.description },
                style: { 
                    background: step.is_completed ? '#10b981' : '#1e293b',
                    color: '#f8fafc',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    padding: '10px',
                    width: 200,
                },
                type: 'default'
            }));

            const newEdges = selectedPlan.steps.slice(0, -1).map((step, index) => ({
                id: `e${step.id}-${selectedPlan.steps[index+1].id}`,
                source: step.id.toString(),
                target: selectedPlan.steps[index+1].id.toString(),
                animated: true,
                style: { stroke: '#6366f1' },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#6366f1',
                },
            }));

            setNodes(newNodes);
            setEdges(newEdges);
        }
    }, [selectedPlan, setNodes, setEdges]);


    const createPlan = async (e) => {
        e.preventDefault();
        if (!newPlanTitle) return;
        setLoading(true);
        try {
            const res = await api.post('/api/study-plans/', {
                title: newPlanTitle,
                description: newPlanDesc
            });
            setPlans([...plans, res.data]);
            setNewPlanTitle('');
            setNewPlanDesc('');
        } catch (error) {
            console.error("Error creating plan", error);
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (id, e) => {
        e.stopPropagation();
        try {
            await api.delete(`/api/study-plans/${id}/`);
            setPlans(plans.filter(p => p.id !== id));
            if (selectedPlan?.id === id) setSelectedPlan(null);
        } catch (error) {
           console.error("Error deleting plan", error);
        }
    };

    return (
        <div className="p-8 min-h-screen text-slate-100 font-poppins relative">
            <h1 className="text-3xl font-bold mb-8 text-indigo-400 flex items-center gap-3">
                 <FiBook /> My Study Plans
            </h1>

            {/* Create New Plan */}
            <div className="mb-10 p-6 rounded-xl border border-slate-700 bg-slate-800 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-slate-200">Create New Plan</h2>
                <form onSubmit={createPlan} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Plan Title (e.g., Master React)" 
                            value={newPlanTitle}
                            onChange={(e) => setNewPlanTitle(e.target.value)}
                            className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-slate-100 placeholder-slate-400"
                        />
                         <textarea 
                            placeholder="Description" 
                            value={newPlanDesc}
                            onChange={(e) => setNewPlanDesc(e.target.value)}
                            className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-slate-100 placeholder-slate-400 h-12 resize-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                    >
                        <FiPlus /> {loading ? 'Creating...' : 'Create Plan'}
                    </button>
                </form>
            </div>

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                    <div 
                        key={plan.id} 
                        onClick={() => setSelectedPlan(plan)}
                        className={`bg-slate-800 border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer relative group ${
                            selectedPlan?.id === plan.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <button 
                            onClick={(e) => deletePlan(plan.id, e)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <FiTrash />
                        </button>
                        <h3 className="text-xl font-bold text-indigo-300 mb-2 truncate pr-6">{plan.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{plan.description}</p>
                        
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
                             <span>Created: {new Date(plan.created_at).toLocaleDateString()}</span>
                             <span className="bg-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-1">
                                <FiMap /> {plan.steps?.length || 0} Steps
                             </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Roadmap Modal/Section */}
            {selectedPlan && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 w-full max-w-5xl h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FiMap className="text-indigo-400"/> Roadmap: {selectedPlan.title}
                                </h2>
                                <p className="text-slate-400 text-sm">Follow the path to master this skill.</p>
                            </div>
                            <button 
                                onClick={() => setSelectedPlan(null)}
                                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-slate-950 relative">
                             {/* React Flow Graph */}
                             <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                fitView
                            >
                                <Background color="#334155" gap={16} />
                                <Controls className="bg-slate-800 border-slate-700 text-slate-200 fill-slate-200" />
                                <MiniMap style={{background: '#1e293b'}} nodeColor={() => '#6366f1'} />
                            </ReactFlow>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyPlan;