import { BrowserRouter as Router } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationSystem from './components/NotificationSystem';
import FloatingXpDisplay from './components/FloatingXpDisplay';


function App() {
  return (
    <GameProvider>
      <Router basename="/FunTime_project">
        <div className="min-h-screen bg-gray-950 font-sans text-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <NotificationSystem />
          <FloatingXpDisplay />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
