interface ProfileFrameProps {
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'ONLINE' | 'OFFLINE';
  onClick?: () => void;
  isHighlighted?: boolean;
}

export const ProfileFrame = ({ imageUrl, size = 'md', status, onClick, isHighlighted }: ProfileFrameProps) => {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-24 h-24' };

  return (
    <div 
      onClick={onClick}
      className={`relative ${sizeMap[size]} -skew-x-12 border-2 transition-all duration-500
        ${isHighlighted ? 'border-cyan-400 shadow-[0_0_20px_#22d3ee] scale-110' : 
          status === 'ONLINE' ? 'border-cyan-500/40' : 'border-slate-800'}
        ${onClick ? 'cursor-none hover:border-white' : ''} bg-slate-900 overflow-hidden`}
    >
      <div className="absolute inset-0 skew-x-12 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="op" className="w-[140%] h-full object-cover grayscale hover:grayscale-0 transition-all" />
        ) : (
          <div className="text-[8px] font-black text-slate-700 uppercase italic">No_Signal</div>
        )}
      </div>
      {status && (
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-t-2 border-l-2 border-slate-950 
          ${status === 'ONLINE' ? 'bg-cyan-500' : 'bg-slate-700'}`} 
        />
      )}
    </div>
  );
};