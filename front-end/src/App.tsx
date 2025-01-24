import Navbar from './components/Navbar.tsx';
import Map from './components/Map.tsx';


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