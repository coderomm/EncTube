import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('userId', 'your-user-id'); // Replace with actual user ID
    formData.append('editorId', 'your-editor-id'); // Replace with actual editor ID

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error uploading video');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full p-2 border"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="block w-full p-2 border"
        ></textarea>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="block w-full p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Upload</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default UploadVideo;
