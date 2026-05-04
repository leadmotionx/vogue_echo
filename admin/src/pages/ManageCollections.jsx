import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2, Plus, Upload, Edit, X } from 'lucide-react'
import { backendUrl } from '../config'

const ManageCollections = ({ token }) => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/collection/list");
      if (response.data.success) {
        setList(response.data.collections);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage(false);
    setEditingId(null);
  }

  const handleEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description || "");
    setImage(false); // Reset image input, will only update if new file selected
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);
      
      let response;
      if (editingId) {
          formData.append("id", editingId);
          response = await axios.post(backendUrl + "/api/collection/update", formData, { headers: { token } });
      } else {
          response = await axios.post(backendUrl + "/api/collection/add", formData, { headers: { token } });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const removeCollection = async (id) => {
    if (window.confirm("Are you sure? Products in this collection will stay but the collection tag will be removed.")) {
      try {
        const response = await axios.post(backendUrl + "/api/collection/remove", { id }, { headers: { token } });
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className="dashboard-container">
      <div className="table-header" style={{ border: 'none', padding: '0', marginBottom: '40px' }}>
        <h3 className="serif" style={{ fontSize: '32px' }}>Manage Collections</h3>
        <p>Define themes and seasonal archives</p>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2 gap-10">
        {/* Create / Edit Collection Form */}
        <div className="bg-white p-10 border border-[#eee]">
          <div className="flex justify-between items-center mb-6">
            <p className="stat-title">{editingId ? 'Edit Collection' : 'Create New Collection'}</p>
            {editingId && (
                <button onClick={resetForm} className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-black">
                    <X size={12}/> CANCEL EDIT
                </button>
            )}
          </div>
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
            <div className="input-group">
              <label>Collection Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="e.g. Summer Archive 2024" required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea onChange={(e) => setDescription(e.target.value)} value={description} rows={3} placeholder="Describe the theme..." />
            </div>
            <div className="input-group">
              <label>Banner Image {editingId ? '(Optional - Leave empty to keep existing)' : '(Optional)'}</label>
              <label htmlFor="col-image" className="cursor-pointer">
                <div style={{ width: '100%', height: '100px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc' }}>
                   {!image ? <Upload size={20} color="#ccc" /> : <p style={{ fontSize: '10px' }}>{image.name}</p>}
                </div>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="col-image" hidden />
              </label>
            </div>
            <button type="submit" className="login-btn">{editingId ? 'Update Collection' : 'Create Collection'}</button>
          </form>
        </div>

        {/* Collections List */}
        <div className="bg-white p-10 border border-[#eee]">
          <p className="stat-title mb-6">Existing Collections</p>
          <div className="flex flex-col gap-4">
            {list.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-[#f9f9f9] hover:border-[#eee] transition-all">
                <div className="flex items-center gap-4">
                    {item.image && (
                        <img src={item.image.startsWith('http') ? item.image : backendUrl + '/uploads/' + item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    )}
                    <div>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</p>
                        <p style={{ fontSize: '11px', color: '#888' }}>{item.description || 'No description'}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                        <Edit size={16} />
                    </button>
                    <button onClick={() => removeCollection(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))}
            {list.length === 0 && <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', padding: '20px' }}>No collections found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageCollections
