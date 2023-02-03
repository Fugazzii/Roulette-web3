import { Suspense, lazy } from 'react';
import WalletContextProvider from './walletContextProvider';
import Navbar from './navbar';
import Game from './game';

function App() {
  const Scene = lazy(() => import("./model"));
  return (
    <Suspense fallback={<>Loading...</>}>
      <WalletContextProvider>
        <Navbar />
          <main>
            <Game />
            <Scene />
          </main>
      </WalletContextProvider>
    </Suspense >
  );
}

export default App;
