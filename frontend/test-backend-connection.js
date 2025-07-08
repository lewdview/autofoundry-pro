// Simple test to verify backend connection
const API_BASE = 'http://localhost:3000';

const testConnection = async () => {
    try {
        console.log('🔍 Testing backend connection...');
        console.log(`📍 Backend URL: ${API_BASE}`);
        
        const response = await fetch(`${API_BASE}/health`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('✅ Backend connection successful!');
        console.log('📊 Health response:', data);
        console.log('🚀 Frontend ready to connect to backend');
        
    } catch (error) {
        console.log('❌ Backend connection failed:', error.message);
        console.log('💡 Make sure the backend is running on port 3000');
        console.log('   Run: cd ../bat-backend-clean && npm start');
    }
};

testConnection();
