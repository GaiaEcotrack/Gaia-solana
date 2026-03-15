import Identicon from '@polkadot/react-identicon';
import { TbCheck } from 'react-icons/tb';

type Props = {
  address: string;
  name: string | undefined;
  onClick: () => void;
  isActive?: boolean;
  block?: boolean;
  isCollapsed?: boolean;
};

function AccountButton({ address, name, onClick, isActive, block, isCollapsed = false }: Props) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  if (isCollapsed) {
    return (
      <button
        type="button"
        className={`
          w-full flex items-center justify-center p-2 rounded-lg
          border transition-all duration-200 aspect-square
          ${isActive
            ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50'
          }
          group
        `}
        onClick={onClick}
        title={name || 'Unnamed'}
      >
        <div className={`
          relative flex-shrink-0
          ${isActive ? 'ring-2 ring-blue-500/50' : ''}
          rounded-full transition-all duration-200
        `}>
          <div className="w-8 h-8">
            <Identicon value={address} theme="polkadot" size={32} />
          </div>
          {isActive && (
            <div className='absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 border-2 border-slate-900'>
              <TbCheck className='text-white text-[8px]' />
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`
        w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg
        border transition-all duration-200
        ${isActive
          ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50'
        }
        group
      `}
      onClick={onClick}
    >
      <div className={`
        relative flex-shrink-0
        ${isActive ? 'ring-2 ring-blue-500/50' : ''}
        rounded-full transition-all duration-200
      `}>
        <div className="w-9 h-9 sm:w-10 sm:h-10">
          <Identicon value={address} theme="polkadot" size={block ? 36 : 40} />
        </div>
        {isActive && (
          <div className='absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 bg-blue-500 rounded-full p-0.5 border-2 border-slate-900'>
            <TbCheck className='text-white text-[10px] sm:text-xs' />
          </div>
        )}
      </div>
      
      <div className='flex-1 min-w-0 text-left'>
        <div className='flex items-center gap-2'>
          <p className={`
            text-sm sm:text-base font-medium truncate
            ${isActive ? 'text-blue-400' : 'text-white group-hover:text-slate-100'}
            transition-colors duration-200
          `}>
            {name || 'Unnamed'}
          </p>
        </div>
        <p className={`
          text-[10px] sm:text-xs mt-0.5 font-mono
          ${isActive ? 'text-blue-300/70' : 'text-slate-400 group-hover:text-slate-300'}
          transition-colors duration-200
        `}>
          {formatAddress(address)}
        </p>
      </div>

      {isActive && (
        <div className='flex-shrink-0 hidden sm:block'>
          <div className='px-2 py-1 rounded-md bg-blue-500/20 border border-blue-500/30'>
            <span className='text-xs font-medium text-blue-400'>Active</span>
          </div>
        </div>
      )}
    </button>
  );
}

export { AccountButton };
