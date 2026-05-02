import { Sidebar } from './components/Sidebar';
import { MapContainer } from './components/MapContainer';
import { Timeline } from './components/Timeline';

function App() {
  return (
    <div className="flex h-screen w-full bg-stone-950 font-sans text-stone-200 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <MapContainer />
        <Timeline />
      </div>
    </div>
  );
}

export default App;
