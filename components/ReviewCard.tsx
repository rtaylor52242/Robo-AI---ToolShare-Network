import React from 'react';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <img 
            src={review.authorAvatar || 'https://via.placeholder.com/40'} 
            alt={review.authorName} 
            className="w-10 h-10 rounded-full bg-gray-700 object-cover"
          />
          <div>
            <h4 className="font-bold text-white text-sm">{review.authorName}</h4>
            <div className="flex items-center gap-2">
               <div className="flex text-yellow-500">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-600"} />
                 ))}
               </div>
               <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        {review.verified && (
           <div className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
              <ShieldCheck size={10} /> Verified Rental
           </div>
        )}
      </div>
      <p className="text-gray-300 text-sm mt-2 leading-relaxed">{review.text}</p>
      <div className="mt-3 flex items-center gap-4">
         <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
            <ThumbsUp size={12} /> Helpful ({review.helpfulCount})
         </button>
      </div>
    </div>
  );
};

export default ReviewCard;