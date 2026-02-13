import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ZenithProvider } from '@/context/ZenithContext';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { OrbitalTracker } from '@/components/orbital-tracker/OrbitalTracker';
import { MartianArchive } from '@/components/martian-archive/MartianArchive';
import { AsteroidSentinel } from '@/components/asteroid-sentinel/AsteroidSentinel';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <ZenithProvider>
      <BrowserRouter basename="/Zenith">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="orbital-tracker" element={<OrbitalTracker />} />
            <Route path="martian-archive" element={<MartianArchive />} />
            <Route path="asteroid-sentinel" element={<AsteroidSentinel />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ZenithProvider>
  );
}
