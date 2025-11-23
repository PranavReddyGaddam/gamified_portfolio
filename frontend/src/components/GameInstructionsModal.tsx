import React from "react";
import { Button } from "@/components/ui/8bit/button";
import { Card, CardContent } from "@/components/ui/8bit/card";

interface GameInstructionsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const GameInstructionsModal: React.FC<GameInstructionsModalProps> = ({ 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Card className="bg-black border-green-400 max-w-md w-full">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h2 className="font-pressstart2p text-green-400 text-xl mb-2">
              Game Instructions:
            </h2>
          </div>
          <ul className="space-y-2 text-white font-pixellari text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Scroll down to explore different levels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Click on skills to unlock them and earn XP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Unlock projects to view details and links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Collect achievements by exploring the portfolio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Complete all levels to reach the contact form</span>
            </li>
          </ul>
          <div className="text-center mt-6">
            <Button
              onClick={onClose}
              variant="default"
              size="lg"
              font="retro"
              className="border-green-400 bg-green-600 hover:bg-green-700 text-white"
            >
              GOT IT!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInstructionsModal;
