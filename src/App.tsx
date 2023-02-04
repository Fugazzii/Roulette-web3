import { Suspense, lazy } from 'react';
import WalletContextProvider from './context/walletContextProvider';
import Navbar from './components/navbar';
import Game from './components/game';
import { IS_AUTHED } from './context/context';
import { useRecoilValue } from 'recoil';

function App() {
  const Scene = lazy(() => import("./components/model"));
  const _IS_AUTHED = useRecoilValue(IS_AUTHED);
  
  return (
    <Suspense fallback={<>Loading...</>}>
      <WalletContextProvider>
        <Navbar />
        {_IS_AUTHED ? (
          <main>
            <Game />
            <Scene />
          </main>
        ) : <>Connect your wallet to play</>}
      </WalletContextProvider>
    </Suspense >
  );
}

export default App;
