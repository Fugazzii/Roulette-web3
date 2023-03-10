import { useEffect } from 'react';
import * as web3 from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from "@solana/wallet-adapter-react";
import { BALANCE, IS_AUTHED } from '../context/context';
import { useRecoilState } from 'recoil';

export default function Navbar() {
    const { publicKey } = useWallet();
    
    const [_BALANCE, SET_BALANCE] = useRecoilState(BALANCE);
    const [_IS_AUTHED, SET_IS_AUTHED] = useRecoilState(IS_AUTHED);

    useEffect(() => {
        async function get_balance() {
            if(publicKey != null) {
                SET_IS_AUTHED(true);
                const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
                let blc = await connection.getBalance(publicKey) / web3.LAMPORTS_PER_SOL;  
                SET_BALANCE(blc);
            } else {
                SET_IS_AUTHED(false);
            }
        }
        get_balance();
    }, [publicKey]);

    console.log(publicKey);

    return (
        <nav>
            {publicKey ? (<div className="balance">Balance: {_BALANCE} SOL</div>) : <></>}
            <WalletMultiButton />
        </nav>
    );
}