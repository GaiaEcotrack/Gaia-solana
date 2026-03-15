import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Modal } from '@gear-js/ui';
import { Accounts } from '../accounts';
import { TbWallet, TbAlertCircle } from 'react-icons/tb';

type Props = {
  accounts: InjectedAccountWithMeta[] | undefined;
  close: () => void;
};

function AccountsModal({ accounts, close }: Props) {
  return (
    <Modal heading='Connect Account' close={close}>
      <div className='py-2 sm:py-4'>
        {accounts ? (
          <Accounts list={accounts} onChange={close} />
        ) : (
          <div className='flex flex-col items-center justify-center py-6 sm:py-8 px-3 sm:px-4 md:px-6 text-center'>
            <div className='mb-3 sm:mb-4 p-3 sm:p-4 rounded-full bg-amber-500/10 border border-amber-500/20'>
              <TbAlertCircle className='text-amber-400 text-2xl sm:text-3xl' />
            </div>
            <h3 className='text-base sm:text-lg font-semibold text-white mb-2 px-2'>
              Wallet Extension Not Found
            </h3>
            <p className='text-slate-400 text-xs sm:text-sm mb-4 max-w-md leading-relaxed px-2'>
              Wallet extension was not found or disconnected. Please check how to install a compatible wallet and create an account.
            </p>
            <a
              href='https://wiki.gear-tech.io/docs/idea/account/create-account'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors duration-200 hover:underline px-2'
            >
              <TbWallet className='text-sm sm:text-base' />
              <span>Installation Guide</span>
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}

export { AccountsModal };
