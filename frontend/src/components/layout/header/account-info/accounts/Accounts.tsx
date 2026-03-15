import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount } from '@gear-js/react-hooks';
import { isLoggedIn } from '@/app/utils';
import { ACCOUNT_ID_LOCAL_STORAGE_KEY } from '@/app/consts';
import { AccountButton } from '../account-button';
import { TbWalletOff } from 'react-icons/tb';

type Props = {
  list: InjectedAccountWithMeta[];
  onChange: () => void;
};

function Accounts({ list, onChange }: Props) {
  const { login } = useAccount();
  const isAnyAccount = list.length > 0;

  const handleAccountButtonClick = (account: InjectedAccountWithMeta) => {
    login(account);
    localStorage.setItem(ACCOUNT_ID_LOCAL_STORAGE_KEY, account.address);
    onChange();
  };

  const getAccounts = () =>
    list.map((account) => (
      <li key={account.address} className='w-full'>
        <AccountButton
          address={account.address}
          name={account.meta.name}
          isActive={isLoggedIn(account)}
          onClick={() => handleAccountButtonClick(account)}
          block
        />
      </li>
    ));

  return isAnyAccount ? (
    <div className='w-full'>
      <div className='mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-slate-700/50'>
        <p className='text-xs sm:text-sm text-slate-400 font-medium px-1'>
          Select an account to connect
        </p>
      </div>
      <ul className='flex flex-col gap-2 sm:gap-3 w-full'>{getAccounts()}</ul>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center py-6 sm:py-8 px-3 sm:px-4 md:px-6 text-center'>
      <div className='mb-3 sm:mb-4 p-3 sm:p-4 rounded-full bg-slate-700/30 border border-slate-600/50'>
        <TbWalletOff className='text-slate-400 text-2xl sm:text-3xl' />
      </div>
      <h3 className='text-base sm:text-lg font-semibold text-white mb-2 px-2'>
        No Accounts Found
      </h3>
      <p className='text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed px-2'>
        Please open the Polkadot extension, create a new account or import an existing one and reload the page.
      </p>
    </div>
  );
}

export { Accounts };
