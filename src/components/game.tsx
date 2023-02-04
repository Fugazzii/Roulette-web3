import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Signer, SystemProgram, Transaction } from "@solana/web3.js";
import { useState, FC, useEffect } from "react";

import { useRecoilValue, useRecoilState } from "recoil";
import { ANIMATION, BALANCE } from "../context/context";

const Game: FC = () => {

    const [bet, setBet] = useState<string>("-1");
    const [guess, setGuess] = useState<number>(-1);

    useEffect(() => {}, [bet]);
    useEffect(() => {}, [guess]);

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
        if((+bet <= _BALANCE && +bet > 0) && (guess > 0 && guess < 37) && Number.isInteger(guess)) {
            if(publicKey) {
                transferSOL(publicKey, +bet);
            } else {
                throw new Error("Failed");
            }
            const rand = Math.floor(Math.random() + 36 - 0);
            if(guess == rand) {
                /* Transfer won amount of SOL from my wallet to recivier */
                transferSOL(new PublicKey("CYLEgYnmUF6vtKc6wBfQhhVJxKrY34PPECA4k8Vfaipn"), +bet * 1.5);
                console.log("Congrats, you won");
            } else {
                console.log("You lost, try next time");
            }
        } else {
            alert("Enter valid bet and guess");
        }    
        SET_ANIMATION(false);
    }

    function changeBet(newBet: string) {
        if(+newBet < 0) {
            setBet("0.0");
            return;
        }
        if(+newBet > _BALANCE) {
            setBet(_BALANCE + "");
            return;
        }

        setBet(newBet);
    }

    function changeGuess(newGuess: string) {
        if(+newGuess > 36) {
            setGuess(36);
            return;
        };
        if(+newGuess < 0) {
            setGuess(0);
            return;
        }
        if(!Number.isInteger(+newGuess)) {
            setGuess(prev => Math.floor(prev));
            return;
        }

        setGuess(+newGuess);
    }

    function handle_inc(isBet: boolean) {
        isBet ? changeBet((+bet + 0.1).toFixed(3)) : changeGuess(guess + 1 + "");
    }

    function handle_dec(isBet: boolean) {
        isBet ? changeBet((+bet - 0.1).toFixed(3)) : changeGuess(guess - 1 + "");
    }

    console.log(bet);
    return (
        <div className="Game">
            <h1>Bet and win Sol</h1>
            <div className="input-field">
                <button className="dec" onClick={() => handle_dec(true)}>-0.1 SOL</button>
                <input type="number"
                    value={+bet == -1 ? "" : bet}
                    placeholder="Bet"
                    onChange={e => changeBet(e.target.value)} 
                />
                <button className="inc" 
                onClick={() => handle_inc(true)}>+0.1 SOL</button>
            </div>
            <div className="input-field">
                <button className="dec" onClick={() => handle_dec(false)}>-1</button>
                <input type="text"
                    placeholder="Guess... (0-36)"
                    value={guess == -1 ? "" : guess.toString()}
                    onChange={e => changeGuess(e.target.value)} 
                />
                <button className="inc" 
                onClick={() => handle_inc(false)}>+1</button>
            </div>
            <button onClick={() => roll()}>Play</button>
        </div>
    );
}

export default Game;