import { AccountButton } from '../account-button';
import styles from './Wallet.module.scss';

type Props = {
  balance: {
    value: string;
    unit: string;
  } | undefined;//Account['balance'];
  address: string;
  name: string | undefined;
  onClick: () => void;
  isCollapsed?: boolean;
};

function Wallet({ balance, address, name, onClick, isCollapsed = false }: Props) {
  return (
    <div className={styles.wallet}>
      <p className='hidden'>
        {balance?.value} <span className={styles.currency}>{balance?.unit}</span>
      </p>
      <AccountButton 
        address={address} 
        name={name} 
        onClick={onClick}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}

export { Wallet };
