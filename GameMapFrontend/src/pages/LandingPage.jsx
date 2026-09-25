import { useEffect, useState } from "react";
import { SimpleSectionCard } from '../components/SimpleSectionCard';
import ThemeToggle from '../components/ThemeToggle';
import LogIn from '../components/LogIn';
import CreateGame from '../components/CreateGame';
import Button from '../components/atoms/buttons/Button';
import Cookies from "../components/Cookies";

export default function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isJoinGame, setIsJoinGame] = useState(false);
    const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCookieModalOpen(true);
        }, 2000); // 5000ms = 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleCloseModal = () => {
        setIsCookieModalOpen(false);
    };
    
    return (
        <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-background px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <SimpleSectionCard className="flex flex-row gap-4 w-full">
                <Button variant='primary' size='lg' onClick={() => setIsJoinGame(true)}>Join Game</Button>
                <Button variant='secondary' size='lg' onClick={() => setIsLoginOpen(true)}>Log In</Button>
            </SimpleSectionCard>

            {/* Render Modals */}
            <CreateGame isOpen={isJoinGame} onClose={() => setIsJoinGame(false)} />
            <LogIn isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Cookies isOpen={isCookieModalOpen} onClose={handleCloseModal} />
        </div>
  );
}
