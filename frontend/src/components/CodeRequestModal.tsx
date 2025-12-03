import React, { useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import { Textarea } from "@/components/ui/8bit/textarea";
import { Label } from "@/components/ui/8bit/label";

interface CodeRequestModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; from: string; reason: string }) => void;
  isSubmitting: boolean;
}

const CodeRequestModal: React.FC<CodeRequestModalProps> = ({ 
  isVisible, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    from: "",
    reason: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.from && formData.reason) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 animate-fade-in" onClick={onClose} />
      <Card className="bg-black border-red-400 max-w-lg w-full relative z-10 transform transition-all duration-300 scale-100 hover:scale-[1.02] animate-slide-up">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="font-pressstart2p text-red-400 text-xl mb-3">
              Request Code Access
            </h2>
            <p className="font-pixellari text-white text-sm leading-relaxed">
              This repository is private. Request access by filling out the form below.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-red-300 text-sm font-pixellari">
                Your Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Enter your full name"
                className="border-red-400 bg-black/50 text-white placeholder-gray-400 font-pixellari"
                required
              />
            </div>

            <div>
              <Label htmlFor="from" className="text-red-300 text-sm font-pixellari">
                Where are you from? *
              </Label>
              <Input
                id="from"
                type="text"
                value={formData.from}
                onChange={handleInputChange("from")}
                placeholder="Company, University, or Independent"
                className="border-red-400 bg-black/50 text-white placeholder-gray-400 font-pixellari"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-red-300 text-sm font-pixellari">
                Why do you need the code? *
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={handleInputChange("reason")}
                placeholder="Please explain why you'd like access to this portfolio website code..."
                className="border-red-400 bg-black/50 text-white placeholder-gray-400 font-pixellari min-h-[120px]"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                size="sm"
                font="retro"
                className="flex-1 border-red-400 text-red-400 hover:bg-red-900/20 font-pixellari"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                font="retro"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-400 font-pixellari"
                disabled={isSubmitting || !formData.name || !formData.from || !formData.reason}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeRequestModal;
