import { Routes, Route } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import AppLayout from '../layouts/AppLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import MinesPage from '../pages/Mines/MinesPage';
import AddMinesPage from '../pages/AddMines/AddMinesPage';
import EquipmentPage from '../pages/Equipment/EquipmentPage';
import MapExplorerPage from '../pages/MapExplorer/MapExplorerPage';
import SimulatorPage from '../pages/Simulator/SimulatorPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTE_PATHS.MINES} element={<MinesPage />} />
        <Route path={ROUTE_PATHS.ADD_MINES} element={<AddMinesPage />} />
        <Route path={ROUTE_PATHS.EQUIPMENT} element={<EquipmentPage />} />
        <Route path={ROUTE_PATHS.MAP_EXPLORER} element={<MapExplorerPage />} />
        <Route path={ROUTE_PATHS.SIMULATOR} element={<SimulatorPage />} />
        <Route path={ROUTE_PATHS.REPORTS} element={<ReportsPage />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
