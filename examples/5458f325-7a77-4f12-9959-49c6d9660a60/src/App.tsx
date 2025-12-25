import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">待办事项列表</h1>
        
        {/* 添加新待办事项 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={20} />
            添加
          </button>
        </div>

        {/* 待办事项列表 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              暂无待办事项，开始添加吧！
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map(todo => (
                <li key={todo.id} className="p-4 hover:bg-gray-50">
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        className="w-5 h-5 rounded text-blue-600"
                      />
                      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.text}
                      </span>
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 统计信息 */}
        <div className="mt-4 text-center text-gray-600">
          总计: {todos.length} 项 | 已完成: {todos.filter(t => t.completed).length} 项
        </div>
      </div>
    </div>
  );
}

export default App;