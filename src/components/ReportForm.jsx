import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import PhotoUpload from './PhotoUpload';
import NearbyReports from './NearbyReports';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Category and type mappings
const CATEGORIES = {
  water: {
    label: 'Water',
    types: ['Leak', 'No Supply', 'Contamination', 'Burst Pipe'],
  },
  roads: {
    label: 'Roads',
    types: ['Pothole', 'Flooding', 'Damaged Surface', 'Missing Sign'],
  },
  power: {
    label: 'Power',
    types: ['Outage', 'Damaged Line', 'Flickering', 'Transformer Issue'],
  },
  waste: {
    label: 'Waste Management',
    types: ['Uncollected Waste', 'Illegal Dumping', 'Overflowing Bin'],
  },
};

const ReportForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    location: [8.485488, -13.226863],
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset type when category changes
      ...(name === 'category' ? { type: '' } : {}),
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handlePhotoChange = (photos) => {
    setFormData((prev) => ({ ...prev, photos }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      // Call parent's onSubmit handler
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        type: '',
        location: [8.485488, -13.226863],
        photos: [],
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableTypes = formData.category ? CATEGORIES[formData.category].types : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.category || undefined} 
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              category: value,
              type: '', // Reset type when category changes
            }));
            if (errors.category) {
              setErrors((prev) => ({ ...prev, category: null }));
            }
          }}
        >
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">
          Type <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.type || undefined} 
          onValueChange={(value) => {
            setFormData((prev) => ({
              ...prev,
              type: value,
            }));
            if (errors.type) {
              setErrors((prev) => ({ ...prev, type: null }));
            }
          }}
          disabled={!formData.category}
        >
          <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Provide more details about the issue..."
        />
      </div>

      {/* Location Picker */}
      <LocationPicker onLocationSelect={handleLocationChange} />

      {/* Nearby Reports */}
      {formData.location && (
        <NearbyReports 
          location={formData.location} 
          onUpvote={(id) => {
            alert(`Upvoted report #${id}! Thank you for verifying.`);
            // In a real app, we might redirect to the report page or update the UI
          }} 
        />
      )}



      {/* Photo Upload */}
      <PhotoUpload onPhotoChange={handlePhotoChange} maxPhotos={3} />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1"
        >
          <Send size={20} className="mr-2" />
          {submitting ? 'Submitting...' : 'Submit Report'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReportForm;
