import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState('');

   // use proxy to automatically forward all requests at /api
   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);

   return (
      <>
         <div className="p-4">
            <p className="font-bold text-3xl">{message}</p>
            <Button>Click me!</Button>
         </div>
      </>
   );
}

export default App;
