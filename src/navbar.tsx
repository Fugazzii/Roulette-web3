import { useEffect } from 'react';
import * as web3 from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import { BALANCE } from './context';
import { useRecoilState } from 'recoil';

export default function Navbar() {
    const { publicKey } = useWallet();
    
    const [_BALANCE, SET_BALANCE] = useRecoilState(BALANCE);

    useEffect(() => {
        async function get_balance() {
            if(publicKey != null) {
                const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
                let blc = await connection.getBalance(publicKey) / web3.LAMPORTS_PER_SOL;  
                SET_BALANCE(blc);
            }
        }
        get_balance();
    }, [publicKey]);

    console.log(publicKey);

    return (
        <nav>
            {publicKey ? (<div>Balance: {_BALANCE}SOL</div>) : <></>}
            <WalletMultiButton />
        </nav>
    );
}