import './App.css';
import Navbar from './components/Navbar.jsx';
import Map from './components/Map.jsx';


function App() {
  const permissions = 1;
  return (
    <div className="App">
    <Navbar/>
    <Map permissions={permissions}/>
    </div>
  );
}

export default App;