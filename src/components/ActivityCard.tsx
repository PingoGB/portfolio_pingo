import React from 'react';
import { Activity, ContentType, OriginTag } from "../types";
import { ExternalLink, User, BookOpen, Trash2, Edit, FileText, Video as VideoIcon, Palette, Code as CodeIcon, Presentation, Box } from "lucide-react";
import { motion } from "motion/react";

interface ActivityCardProps {
  activity: Activity;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (activity: Activity) => void;
  key?: any;
}

export default function ActivityCard({ activity, isAdmin, onDelete, onEdit }: ActivityCardProps) {
  const isImage = activity.contentType === 'image';
  
  const getIconForType = (type: ContentType) => {
    switch (type) {
      case 'docs': return <FileText size={40} strokeWidth={1} />;
      case 'canva': return <Presentation size={40} strokeWidth={1} />;
      case 'video': return <VideoIcon size={40} strokeWidth={1} />;
      case 'code': return <CodeIcon size={40} strokeWidth={1} />;
      case 'image': return <Box size={40} strokeWidth={1} />;
      default: return <ExternalLink size={40} strokeWidth={1} />;
    }
  };

  const getLabelForType = (type: ContentType) => {
    switch (type) {
      case 'docs': return 'GOOGLE DOCS / PDF';
      case 'canva': return 'CANVA / DESIGNS';
      case 'video': return 'VIDEO CLIP / MP4';
      case 'code': return 'SOURCE CODE / DEV';
      case 'image': return 'IMAGE FILE / RAW';
      default: return 'EXTERNAL RESOURCE';
    }
  };

  const getColorForType = (type: ContentType) => {
    switch (type) {
      case 'docs': return 'text-blue-400';
      case 'canva': return 'text-purple-400';
      case 'video': return 'text-red-400';
      case 'code': return 'text-green-400';
      case 'image': return 'text-resolve-gold';
      default: return 'text-white/20';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="resolve-panel overflow-hidden flex flex-col h-full group bg-[#0a0a0d] border-white/5"
    >
      <div className="relative aspect-video bg-black/60 border-b border-resolve-border h-32 overflow-hidden flex items-center justify-center">
        {isImage ? (
          <img 
            src={activity.contentUrl} 
            alt={activity.title} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 relative">
             <div className={`${getColorForType(activity.contentType)} opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`}>
                {getIconForType(activity.contentType)}
             </div>
             <span className="absolute bottom-3 text-[7px] text-white/20 uppercase font-black tracking-widest text-center group-hover:text-resolve-gold transition-colors">
               {getLabelForType(activity.contentType)}
             </span>
             
             {/* Efeito de scanline estilizado */}
             <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          </div>
        )}
        
        <div className="absolute top-1.5 left-1.5 flex gap-1">
          <span className={`tag flex items-center gap-1 ${
            activity.originTag === 'Indicada pelo professor' 
              ? 'bg-resolve-teal text-black' 
              : 'border border-resolve-gold text-resolve-gold'
          }`}>
            {activity.originTag}
          </span>
        </div>

        {isAdmin && (
          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit?.(activity)}
              className="p-1 bg-resolve-gold text-resolve-bg rounded-sm hover:scale-105"
            >
              <Edit size={10} />
            </button>
            <button 
              onClick={() => activity.id && onDelete?.(activity.id)}
              className="p-1 bg-red-500 text-white rounded-sm hover:scale-105"
            >
              <Trash2 size={10} />
            </button>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-[11px] mb-1 uppercase tracking-tight line-clamp-1 group-hover:text-resolve-gold transition-colors">
          {activity.title}
        </h3>
        
        <div className="text-white/40 text-[9px] mb-3 line-clamp-2 leading-relaxed">
          {activity.description}
        </div>

        <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
          <span className="text-[8px] uppercase tracking-tighter text-white/20 font-black">
            TYPE: {activity.contentType}
          </span>
          <a 
            href={activity.contentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-resolve-gold hover:text-white transition-colors flex items-center gap-1 text-[9px] font-bold uppercase"
          >
            Open <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
