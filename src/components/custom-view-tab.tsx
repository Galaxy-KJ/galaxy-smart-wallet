"use client"

import { ChartColumn, Table2, Wallet, Plus } from "lucide-react";
import React, { useState } from "react";

interface CustomView {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isDefault: boolean;
}

const CustomViewTab: React.FC = () => {
  const [views, setViews] = useState<CustomView[]>([
    {
      id: "trading",
      title: "Trading View",
      description: "Optimized for active trading",
      icon: <ChartColumn className="text-purple-500 w-10 h-10" />,
      isDefault: true,
    },
    {
      id: "portfolio",
      title: "Portfolio View",
      description: "Focus on portfolio performance",
      icon: <Wallet className="text-purple-500 w-10 h-10" />,
      isDefault: false,
    },
    {
      id: "minimal",
      title: "Minimal View",
      description: "Simplified dashboard with essentials",
      icon: <Table2 className="text-purple-500 w-10 h-10" />,
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<CustomView | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Reset form state when opening the modal
  const openModal = (view: CustomView | null) => {
    setActiveView(view);
    setNewTitle(view?.title || "");
    setNewDescription(view?.description || "");
    setIsModalOpen(true);
  };

  const handleSetDefault = (id: string) => {
    setViews((prev) =>
      prev.map((view) => ({
        ...view,
        isDefault: view.id === id,
      }))
    );
  };

  const handleEdit = (id: string) => {
    const selectedView = views.find((v) => v.id === id) || null;
    openModal(selectedView);
  };

  const handleCreate = () => {
    openModal(null);
  };

  const handleSave = () => {
    if (activeView) {
      // Edit existing view
      setViews((prev) =>
        prev.map((view) =>
          view.id === activeView.id
            ? { ...view, title: newTitle, description: newDescription }
            : view
        )
      );
    } else {
      // Create new view
      const newView: CustomView = {
        id: `view-${Date.now()}`, // Generate unique ID
        title: newTitle,
        description: newDescription,
        icon: <ChartColumn className="text-purple-500 w-10 h-10" />, // Default icon
        isDefault: false,
      };
      setViews((prev) => [...prev, newView]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-medium text-white">Custom Views</h2>
        <button 
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm font-medium text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Create New View
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {views.map((view) => (
          <div
            key={view.id}
            className="backdrop-blur-sm border border-gray-800 rounded-lg shadow-lg p-5 text-gray-200"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between mb-1">
                <h3 className="text-base font-medium text-white">{view.title}</h3>
                {view.isDefault && (
                  <span className="text-xs text-green-400 font-medium px-2 py-0.5 rounded">Default</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-4">{view.description}</p>
              
              <div className="flex bg-gray-800/30 justify-center py-10 mb-4 text-center">
                {view.icon}
              </div>
              
              <div className="flex justify-between mt-auto">
                <button
                  onClick={() => handleEdit(view.id)}
                  className="px-3 py-1 text-xs font-medium bg-gray-900 hover:bg-gray-700 rounded text-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleSetDefault(view.id)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    view.isDefault
                      ? "bg-gray-700 text-gray-300 cursor-default"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                  }`}
                >
                  Set as Default
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 border-dashed rounded-lg shadow-lg p-5 flex flex-col items-center justify-center hover:bg-gray-800/30 transition text-gray-400 h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full" onClick={handleCreate}>
            <div className="text-gray-500 text-4xl mb-3">+</div>
            <p className="text-sm mb-1">Create a new custom view</p>
            <button className="mt-4 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium text-white">
              Create View
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-gray-200 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeView ? `Edit ${activeView.title}` : "Create New View"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <span className="text-gray-400 hover:text-white text-xl">×</span>
              </button>
            </div>

            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm mb-4"
              placeholder="View Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm mb-4"
              rows={3}
              placeholder="View Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>

            <button
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-white"
              onClick={handleSave}
              disabled={!newTitle.trim()}
            >
              Save View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomViewTab;