import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const TestConnection = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const testConnection = async () => {
    setStatus('loading');
    try {
      // Test backend connection
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test`);
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Backend connected: ${data.message}`);
        setStatus('success');
      } else {
        setMessage('❌ Backend connection failed');
        setStatus('error');
      }
    } catch (error) {
      setMessage(`❌ Connection error: ${error}`);
      setStatus('error');
    }
  };

  const testAuth = async () => {
    setStatus('loading');
    try {
      // Test registration
      const result = await authService.register(
        'react-test@example.com',
        'react123',
        'React Test User',
        'user'
      );
      
      setMessage(`✅ Registration successful! User: ${result.user.email}`);
      setStatus('success');
      
      // Test login
      setTimeout(async () => {
        const loginResult = await authService.login(
          'react-test@example.com',
          'react123'
        );
        console.log('Login successful:', loginResult);
      }, 1000);
      
    } catch (error: any) {
      setMessage(`❌ Auth test failed: ${error.response?.data?.detail || error.message}`);
      setStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h3>API Connection Test</h3>
      <div style={{ marginBottom: '10px' }}>
        Status: 
        <span style={{ 
          color: status === 'success' ? 'green' : status === 'error' ? 'red' : status === 'loading' ? 'orange' : 'gray',
          marginLeft: '10px'
        }}>
          {status.toUpperCase()}
        </span>
      </div>
      
      {message && (
        <div style={{ marginBottom: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={testConnection}
          disabled={status === 'loading'}
          style={{ padding: '8px 16px' }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={testAuth}
          disabled={status === 'loading'}
          style={{ padding: '8px 16px' }}
        >
          Test Authentication
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <div>Backend URL: {import.meta.env.VITE_API_URL}</div>
        <div>Frontend URL: {window.location.origin}</div>
      </div>
    </div>
  );
};

export default TestConnection;