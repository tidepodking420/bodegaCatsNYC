import Map from './components/Map.tsx';


function App() {
  const permissions = 0;
  return (
    <div className="App">
    <Map permissions={permissions}/>
    </div>
  );
}

export default App;