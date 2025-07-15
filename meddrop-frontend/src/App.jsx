import Signup from './pages/signup';
import Login from './pages/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Medicines from './pages/medicines';
import PublicRoute from './components/publicroute';
import PrivateRoute from './components/privateroute';
import NotFound from "./pages/notfound";
import AddMedicine from './pages/addmedicine';
import EditMedicine from './pages/editmedicine';
import MapView from './pages/mapview';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={
                <div>Home Page</div>
            } />

            <Route path="/signup" element={
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            } />

            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />

            <Route path="/medicines" element={
                <PrivateRoute>
                    <Medicines />
                </PrivateRoute>
            } />

            <Route path="/add-medicine" element={
                <PrivateRoute>
                    <AddMedicine />
                </PrivateRoute>
            } />

            <Route
                path="/edit-medicine/:id"
                element={
                    <PrivateRoute>
                        <EditMedicine />
                    </PrivateRoute>
                }
            />
            <Route
                path="/map"
                element={
                    <PrivateRoute>
                    <MapView />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;
