
import React, { useState } from 'react';
import { Search, Shield, User as UserIcon, CheckCircle, Ban, Trash2, Mail, Edit, X, Plus, Unlock } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';

const UserManagement: React.FC = () => {
  const { allUsers, manageUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'User',
    location: ''
  });

  // Filtering Logic
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || 
                          (filterStatus === 'Active' && user.status === 'Active') ||
                          (filterStatus === 'Suspended' && user.status === 'Suspended');
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      manageUser('delete', { id });
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    const user = allUsers.find(u => u.id === id);
    if (user) {
        manageUser('update', { id, status: user.status === 'Active' ? 'Suspended' : 'Active' });
    }
  };

  const handleEmailSelected = () => {
    const recipients = allUsers
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.email);
    
    if (recipients.length > 0) {
        window.location.href = `mailto:${recipients.join(',')}`;
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setUserForm({ name: '', email: '', role: 'User', location: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: typeof allUsers[0]) => {
    setEditingId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role || 'User',
      location: user.location
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Edit existing user
      manageUser('update', {
          id: editingId,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role as any,
          location: userForm.location
      });
    } else {
      // Create new user
      const newUser = {
        id: `u_${Date.now()}`,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role as any,
        status: 'Active' as const,
        location: userForm.location || 'Unknown',
        joinDate: new Date().toISOString(),
        rentalsCount: 0,
        verified: false,
        badges: [],
        stats: { rentalsCount: 0, listingsCount: 0, avgRating: 0 },
        privacy: { publicProfile: true, showExactLocation: false, allowMessages: true, twoFactorEnabled: false },
        loyaltyPoints: 0,
        referralCode: 'NEWUSER',
        tier: 'Bronze' as const,
        phone: '',
        bio: 'New User',
        avatar: `https://ui-avatars.com/api/?name=${userForm.name.replace(' ', '+')}&background=random&color=fff`
      };
      manageUser('add', newUser);
    }

    setIsModalOpen(false);
    setUserForm({ name: '', email: '', role: 'User', location: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage accounts, permissions, and platform access.</p>
          </div>
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               className="gap-2"
               onClick={handleEmailSelected}
               disabled={selectedUsers.length === 0}
             >
                <Mail size={16} /> Email Selected {selectedUsers.length > 0 && `(${selectedUsers.length})`}
             </Button>
             <Button className="gap-2" onClick={openAddModal}>
                <Plus size={16} /> Add User
             </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Search users by name or email..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-robo-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
           </div>
           
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              {['All', 'Active', 'Suspended'].map(status => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status as any)}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status 
                         ? 'bg-robo-500 text-white shadow-lg shadow-robo-500/30' 
                         : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                   }`}
                 >
                    {status}
                 </button>
              ))}
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-bold tracking-wider">
                       <th className="p-4 w-10">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-robo-500 focus:ring-robo-500"
                            onChange={handleSelectAll}
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          />
                       </th>
                       <th className="p-4">User</th>
                       <th className="p-4">Role</th>
                       <th className="p-4">Status</th>
                       <th className="p-4">Location</th>
                       <th className="p-4">Joined</th>
                       <th className="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredUsers.length > 0 ? (
                       filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                             <td className="p-4">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-robo-500 focus:ring-robo-500"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleSelectUser(user.id)}
                                />
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-3">
                                   <div className="relative">
                                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 object-cover" />
                                      {user.verified && (
                                         <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                                            <CheckCircle size={12} className="text-blue-500 fill-blue-500/10" />
                                         </div>
                                      )}
                                   </div>
                                   <div>
                                      <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                   user.role === 'Admin' 
                                      ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' 
                                      : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                }`}>
                                   {user.role === 'Admin' ? <Shield size={10} /> : <UserIcon size={10} />}
                                   {user.role}
                                </span>
                             </td>
                             <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                   user.status === 'Active'
                                      ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' 
                                      : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                }`}>
                                   <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                   {user.status}
                                </span>
                             </td>
                             <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                {user.location}
                             </td>
                             <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                                {new Date(user.joinDate).toLocaleDateString()}
                             </td>
                             <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   <button 
                                      onClick={() => openEditModal(user)}
                                      className="p-2 text-gray-500 hover:text-robo-500 hover:bg-robo-50 dark:hover:bg-robo-500/10 rounded-lg transition-colors" 
                                      title="Edit"
                                   >
                                      <Edit size={16} />
                                   </button>
                                   <button 
                                      onClick={() => handleToggleStatus(user.id)}
                                      className={`p-2 rounded-lg transition-colors ${user.status === 'Active' ? 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10' : 'text-yellow-600 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10'}`} 
                                      title={user.status === 'Active' ? 'Suspend' : 'Activate'}
                                   >
                                      {user.status === 'Active' ? <Ban size={16} /> : <Unlock size={16} />}
                                   </button>
                                   <button 
                                      onClick={() => handleDelete(user.id)}
                                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" 
                                      title="Delete"
                                   >
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                             No users found matching your criteria.
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
           
           {/* Pagination Mockup */}
           <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Showing {filteredUsers.length} of {allUsers.length} users</span>
              <div className="flex gap-2">
                 <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50">Previous</button>
                 <button className="px-3 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">Next</button>
              </div>
           </div>
        </div>

      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
               <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 {editingId ? <Edit size={18} className="text-robo-500" /> : <Plus size={18} className="text-robo-500" />} 
                 {editingId ? 'Edit User' : 'Add New User'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Full Name</label>
                  <input 
                     type="text"
                     required
                     value={userForm.name}
                     onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-robo-500"
                     placeholder="e.g. John Smith"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email Address</label>
                  <input 
                     type="email"
                     required
                     value={userForm.email}
                     onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-robo-500"
                     placeholder="john@example.com"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Location</label>
                  <input 
                     type="text"
                     value={userForm.location}
                     onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-robo-500"
                     placeholder="City, State"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Role</label>
                  <select 
                     value={userForm.role}
                     onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-robo-500"
                  >
                     <option value="User">User</option>
                     <option value="Admin">Admin</option>
                  </select>
               </div>
               
               <div className="pt-4 flex gap-3">
                  <Button type="button" variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" fullWidth>{editingId ? 'Save Changes' : 'Create User'}</Button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
