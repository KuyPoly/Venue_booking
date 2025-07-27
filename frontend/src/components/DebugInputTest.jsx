import React, { useState } from 'react';

const DebugInputTest = () => {
  const [testForm, setTestForm] = useState({
    capacity: '',
    price: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = "${value}"`);
    
    setTestForm(prev => {
      console.log('Previous state:', prev);
      const newState = {
        ...prev,
        [name]: value
      };
      console.log('New state:', newState);
      return newState;
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Debug Input Test</h3>
      <p>Use this to test if inputs work correctly in isolation</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={testForm.name}
          onChange={handleChange}
          placeholder="Enter name"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <span style={{ marginLeft: '10px' }}>Value: "{testForm.name}"</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Capacity:</label>
        <input
          type="number"
          name="capacity"
          value={testForm.capacity}
          onChange={handleChange}
          placeholder="Enter capacity"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <span style={{ marginLeft: '10px' }}>Value: "{testForm.capacity}"</span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={testForm.price}
          onChange={handleChange}
          step="0.01"
          placeholder="Enter price"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
        <span style={{ marginLeft: '10px' }}>Value: "{testForm.price}"</span>
      </div>

      <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '10px' }}>
        <strong>Current State:</strong>
        <pre>{JSON.stringify(testForm, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugInputTest;
