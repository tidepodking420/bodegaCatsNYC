import './assets/App.css';
import Navbar from './components/Navbar.tsx';
import Map from './components/Map.tsx';


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