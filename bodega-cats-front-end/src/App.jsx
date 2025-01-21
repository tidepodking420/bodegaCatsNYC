import './App.css';
import Navbar from './components/Navbar.jsx';
import MapChooser from './components/MapChooser.jsx'

function App() {
  // const apiKey = process.env.MAPTILER_API_KEY;
  // console.log(process.env.REACT_APP_WEATHER_API_KEY)
  const role = 1;
  return (
    <div className="App">
    <Navbar/>
    <MapChooser role={role}/>
    </div>
  );
}

export default App;