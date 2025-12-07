import React, { useState, useEffect } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

const PhotoUpload = ({ onPhotoChange, maxPhotos = 3 }) => {
  const [photos, setPhotos] = useState([]); // Store File objects
  const [previews, setPreviews] = useState([]); // Store preview URLs

  // Notify parent when photos change
  useEffect(() => {
    if (onPhotoChange) {
      onPhotoChange(photos);
    }
  }, [photos]); // Only call when photos actually change

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (photos.length + files.length > maxPhotos) {
      // Keep alert for immediate feedback on file selection
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const newPreviews = [];
    let hasErrors = false;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        hasErrors = true;
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 5MB.`);
        hasErrors = true;
        return;
      }

      validFiles.push(file);
      // Create object URL for preview
      newPreviews.push(URL.createObjectURL(file));
    });

    if (hasErrors && validFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG, WebP)');
      return;
    }

    if (validFiles.length > 0) {
      setPhotos((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    // Reset input
    e.target.value = '';
  };

  const removePhoto = (index) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(previews[index]);
    
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Upload Photos (Optional)
      </label>

      {/* Upload Button */}
      {photos.length < maxPhotos && (
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <Camera size={32} />
            <span className="text-sm">
              Click to upload or take a photo
            </span>
            <span className="text-xs text-gray-400">
              {photos.length}/{maxPhotos} photos
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* Photo Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="flex items-center justify-center h-20 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-400">
            <ImageIcon size={20} />
            <span className="text-sm">No photos uploaded yet</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
