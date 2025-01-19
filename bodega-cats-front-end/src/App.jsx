import './App.css';
import Navbar from './components/Navbar.jsx';
import dotenv from 'dotenv';

dotenv.config();

function App() {
  // const apiKey = process.env.MAPTILER_API_KEY;
  console.log(process.env.REACT_APP_WEATHER_API_KEY)
  return (
    <div className="App">
    <Navbar/>
    </div>
  );
}

export default App;