import React from 'react';
import './Message.css';


  return (
    <>
      {/* Main Content */}
      <main className="main-content">
        <h1 className="messages-title">Messages</h1>
        <div className="messages-list">
          <div className="message-card">
            <div className="message-card-header">Inbox</div>
            <div className="message-card-body">You don't have any message yet.</div>
          </div>
        </div>
      </main>
    </>
  );


export default Messages;