import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Signer, SystemProgram, Transaction } from "@solana/web3.js";
import { useState, FC } from "react";

import { useRecoilValue, useRecoilState } from "recoil";
import { ANIMATION, BALANCE } from "./context";

const Game: FC = () => {
    const [bet, setBet] = useState<number>(0);
    const [guess, setGuess] = useState<number>(-1);

    /* Global States */
    const [_ANIMATION, SET_ANIMATION] = useRecoilState(ANIMATION);
    const _BALANCE = useRecoilValue(BALANCE);

    const { publicKey, sendTransaction } = useWallet();
    const connection = useConnection();

    function transferSOL(from: PublicKey, amount_sol: number) {
        if(!publicKey || !connection) {
            console.error(connection);
            throw new Error("Failed");
        }
        try {
            const to_pk = new PublicKey("CYLEgYnmUF6vtKc6wBfQhhVJxKrY34PPECA4k8Vfaipn");
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: from,
                    toPubkey: to_pk,
                    lamports: amount_sol * LAMPORTS_PER_SOL
                })
            );
    
            const conn = new Connection(clusterApiUrl("devnet"), "confirmed");
            sendTransaction(transaction, conn).then(sig => {
                console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
            })
        } catch (error) {
            console.error(error);
        }
    }

    function roll() {
        SET_ANIMATION(true);
        try {
            new Promise(() => setTimeout(handle_game, 5000))
        } catch(error) {
            console.error(error);
            SET_ANIMATION(false);
        }
    }

    function handle_game() {
        console.log('timoueted');
        if((bet <= _BALANCE && bet > 0) && (guess > 0 && guess < 5)) {
            if(publicKey) {
                transferSOL(publicKey, bet);
            } else {
                throw new Error("Failed");
            }
            const rand = Math.floor(Math.random() + 5 - 1);
            if(guess == rand) {
                /* Transfer won amount of SOL from my wallet to recivier */
                transferSOL(new PublicKey("CYLEgYnmUF6vtKc6wBfQhhVJxKrY34PPECA4k8Vfaipn"), bet * 1.5);
                console.log("Congrats, you won");
            } else {
                console.log("You lost, try next time");
            }
        } else {
            alert("Enter valid bet and guess");
        }    
        SET_ANIMATION(false);
    }

    return (
        <div className="Game">
            <h1>Bet and win Sol</h1>
            <input type="number" placeholder="Bet" onChange={e => setBet(Number(e.target.value))}/>
            <input type="number" placeholder="Guess..." onChange={e => setGuess(Number(e.target.value))}/>
            <button onClick={() => roll()}>Play</button>
        </div>
    );
}

export default Game;