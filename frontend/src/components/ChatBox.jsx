import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, X } from 'lucide-react';

const socket = io('http://localhost:5000');

const ChatBox = ({ room, hostName, onClose }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (room) {
      socket.emit('join_room', room);
    }
  }, [room]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        room: room,
        author: user.name,
        message: message,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col h-96">
      <div className="bg-rose-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat with {hostName || 'Host'}</h3>
        <button onClick={onClose} className="hover:bg-rose-700 p-1 rounded-full text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
        {messageList.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.author === user.name ? 'items-end' : 'items-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.author === user.name ? 'bg-rose-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
              <p className="text-sm">{msg.message}</p>
            </div>
            <span className="text-[10px] text-gray-400 mt-1">{msg.time} • {msg.author === user.name ? 'You' : msg.author}</span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 rounded-b-lg">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 text-sm border rounded-full focus:outline-none focus:border-rose-500"
        />
        <button 
          onClick={sendMessage}
          className="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
