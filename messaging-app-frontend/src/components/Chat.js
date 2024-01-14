import React, { useEffect, useState } from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon } from '@material-ui/icons'
import MicIcon from '@material-ui/icons/Mic'
import './Chat.css'
import axios from './axios'
import { useStateValue } from './StateProvider';

const Chat = ({ messages }) => {
    const [seed, setSeed] = useState("")
    const [input, setInput] = useState("")
    const [{ user }, dispatch] = useStateValue()

    const sendMessage = async (e) => {
        e.preventDefault()
        await axios.post('/messages/new', {
            message: input,
            name: user.displayName, 
            timestamp: new Date().toUTCString(),
            received: true
        })
        setInput("")
    }

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])
    const handleImageChange = async (e) => {
        const imageFile = e.target.files[0];
        console.log('Selected image:', imageFile);
    
        if (imageFile) {
          const formData = new FormData();
          formData.append('file', imageFile);
    
          // Use axios to upload the image
          await axios.post('/messages/upload-image', formData)
            .then(response => {
              console.log('Image uploaded:', response.data);
              // You can handle the response or update the UI as needed
            })
            .catch(error => {
              console.error('Error uploading image:', error);

              // Handle the error
            });

        }
      };
    
      useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
      }, []);
      const handleImageUpload = () => {
        const inputElement = document.getElementById('imageInput');
        inputElement.click();
      };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/b${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>Dev Help</h3>
                    <p>Last seen at {" "}
                        {messages[messages.length -1]?.timestamp}
                    </p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton onClick={handleImageUpload}>
          <AttachFile />
        </IconButton>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <MicIcon />
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(message => (
                    <p className={`chat__message ${message.name === user.displayName && 'chat__receiver'}`}>
                        <span className="chat__name">{message.name}</span>
                            {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p>
                ))}
            </div>
            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)} 
                        placeholder="Type a message"
                        type="text"
                    />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
