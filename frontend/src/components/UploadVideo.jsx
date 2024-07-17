import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="block w-full mb-2 p-2 border"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="block w-full mb-2 p-2 border"
      ></textarea>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
        className="block w-full mb-2 p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Upload</button>
    </form>
  );
};

export default UploadVideo;
