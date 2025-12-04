import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to FixIt Civic Platform</h1>
      <div className="flex gap-4">
        <Link to="/report" className="bg-blue-500 text-white px-4 py-2 rounded">Report Issue</Link>
        <Link to="/map" className="bg-green-500 text-white px-4 py-2 rounded">View Map</Link>
        <Link to="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded">Gov Dashboard</Link>
      </div>
    </div>
  );
};

export default Landing;
