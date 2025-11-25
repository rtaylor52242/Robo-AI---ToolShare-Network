import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import Button from './Button';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  title: string;
  subtitle: string;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit, title, subtitle }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Rate Experience</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{subtitle}</p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={32} 
                    className={`${
                      star <= (hoverRating || rating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 dark:text-gray-700'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>

            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-2">
                 <MessageSquare size={14} /> Review (Optional)
              </label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your experience..."
                className="w-full h-24 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-robo-500 focus:ring-1 focus:ring-robo-500 resize-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
              <Button type="submit" fullWidth disabled={rating === 0}>Submit Review</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;