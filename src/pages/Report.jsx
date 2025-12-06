import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import { AlertCircle } from 'lucide-react';

const Report = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    console.log('Submitting report:', formData);
    
    // TODO: Replace with actual API call
    // const response = await axios.post('/api/reports', formData);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert('Report submitted successfully!');
    navigate('/map');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">
            Help improve your community by reporting local problems
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> Before submitting, check if someone has already reported this issue nearby. You can upvote existing reports instead!
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ReportForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default Report;
