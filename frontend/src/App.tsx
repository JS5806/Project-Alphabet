import React, { useState, useEffect } from 'react';

function App() {
  const [profile, setProfile] = useState({ nickname: '', bio: '', profile_image_url: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/users/me')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setPreview(data.profile_image_url);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nickname', profile.nickname);
    formData.append('bio', profile.bio);
    if (selectedFile) formData.append('profileImage', selectedFile);

    try {
      const res = await fetch('http://localhost:5000/api/v1/users/me', {
        method: 'PATCH',
        body: formData,
      });
      if (res.ok) {
        setStatus('Profile updated successfully!');
      } else {
        setStatus('Update failed. Try another nickname.');
      }
    } catch (err) {
      setStatus('Error connecting to server.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md" />
            <input type="file" onChange={handleImageChange} className="mt-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nickname</label>
            <input 
              type="text" 
              className="mt-1 block w-full border rounded-md p-2"
              value={profile.nickname} 
              onChange={e => setProfile({...profile, nickname: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea 
              className="mt-1 block w-full border rounded-md p-2"
              value={profile.bio} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Save Changes
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm font-semibold text-blue-600">{status}</p>}
      </div>
    </div>
  );
}

export default App;