import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/posts"; // Backend API

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">Create Post</Link>
      <div className="mt-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 my-2 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/post/${post._id}`} className="text-blue-500">Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => setPost(res.data));
  }, [id]);

  const handleDelete = () => {
    axios.delete(`${API_URL}/${id}`).then(() => navigate("/"));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Delete</button>
      <Link to={`/edit/${post._id}`} className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded">Edit</Link>
    </div>
  );
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API_URL, { title, content }).then(() => navigate("/"));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input className="border p-2 w-full my-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="border p-2 w-full my-2" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">Submit</button>
      </form>
    </div>
  );
};

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
    });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/${id}`, { title, content }).then(() => navigate("/"));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Edit Post</h1>
      <form onSubmit={handleUpdate}>
        <input className="border p-2 w-full my-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="border p-2 w-full my-2" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Update</button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white">
        <Link to="/" className="text-xl">Blog</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
};

export default App;