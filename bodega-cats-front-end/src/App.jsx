import './App.css';
import Navbar from './components/Navbar.jsx';
import Map from './components/Map.jsx';


function App() {
  const permissions = 0;
  return (
    <div className="App">
    <Navbar/>
    <Map permissions={permissions}/>
    </div>
  );
}

export default App;