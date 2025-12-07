import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createReport } from '../services/api';
import Header from '../components/Header';
import { useToast } from "@/hooks/use-toast";

const Report = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Submitting report:', formData);
      
      // Call real API
      const createdReport = await createReport(formData);
      
      console.log('Report created successfully:', createdReport);
      
      // Show success toast
      toast({
        title: "✅ Report Submitted!",
        description: "Your report has been submitted successfully. Thank you for helping improve your community!",
        duration: 5000,
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "❌ Submission Failed",
        description: err.response?.data?.details || "Failed to submit report. Please try again.",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-md p-6 mb-6 border">
            <h1 className="text-3xl font-bold mb-2">Report an Issue</h1>
            <p className="text-muted-foreground">
              Help improve your community by reporting local problems
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <strong>Tip:</strong> Before submitting, check if someone has already reported this issue nearby. You can upvote existing reports instead!
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border">
            <ReportForm 
              onSubmit={handleSubmit} 
              onCancel={handleCancel}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
