import {Map} from './components/Map.tsx';
import { Provider } from "react-redux";
import { store } from "./components/redux/CatStore.ts";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Admin } from './components/Admin.tsx';


function App() {
  const permissions = 0;
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Map permissions={permissions}/>} />
            <Route path="/secretadmin" element={<Admin/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;