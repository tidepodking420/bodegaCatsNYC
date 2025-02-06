import {Map} from './components/Map.tsx';
import { Provider } from "react-redux";
import { store } from "./components/redux/PinStore";


function App() {
  const permissions = 0;
  return (
    <div>
      <Provider store={store}>
        <Map permissions={permissions}/>
      </Provider>
    </div>
  );
}

export default App;