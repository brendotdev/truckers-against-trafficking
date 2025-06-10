import { useEffect, useState } from "react";
import axios from "axios";
import backendUrl from "../backendUrl";

const baseUrl = `${backendUrl}/api/posts`;

function AdminPanel () {

    const [posts, setPosts] = useState([]);

    const getPosts = async (sortBy, limit, page) => {
        const response = await axios.get(
          `${baseUrl}/?sortby=${sortBy}&limit=${100}&page=${page}&query=isFlagged=true`
        );
        return response.data;
    };


    const deletePost = async (id) => {
        const response = await axios.delete(`${baseUrl}/${id}`, setConfig());
        window.location.reload();
        return response.data;
    };

    useEffect(() => {
        getPosts()
        .then(data => {
            setPosts(data.results);
        });
    }, []);

    return (
        <div style={{ zIndex: 999, padding: 16, }}>
            <h1>ADMIN PANEL</h1>
            {
                posts.map(p => {
                    return (
                        <div style={{ borderBottom: "1px solid grey", padding: 4, }}>
                            <p style={{ fontWeight: "bold" }}>{p.title}</p>
                            <p>{p.author?.username}</p>
                        <button style={{ backgroundColor: "red", color: "white", padding: "8px 16px", border: "none", borderRadius: "20px", cursor: "pointer" }} onClick={() => deletePost(p.id)}>Delete</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminPanel;