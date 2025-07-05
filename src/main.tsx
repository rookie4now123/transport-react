import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import 'leaflet/dist/leaflet.css';
import App from './App.tsx'
import Dashboard from './page/Dashboard.tsx';
import Monitor from './page/Monitor.tsx';
import Lines from './page/Lines.tsx';
import Station from './page/Station.tsx';
import Student from './page/Student.tsx';
import Tracks from './page/Tracks.tsx';
import MainGrid from './dashboard/components/MainGrid.tsx';
import ProtectedRoute from './helpers/ProtectedRoute.tsx';
import Test from './page/Test.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  {/* <AuthNavigator /> */}
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<ProtectedRoute />}>
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<MainGrid />} />
        <Route path="tracks" element={<Tracks />} />
        <Route path="monitors" element={<Monitor />} />
        <Route path="stations" element={<Station />} />
        <Route path="lines" element={<Lines />} />
        <Route path="students" element={<Student />} />
        <Route path="test" element={<Test />} />
      </Route>
      </Route>
    </Routes>
  </BrowserRouter>
)
