import { Scene } from './scene/Scene';
import { Panel } from './ui/Panel';
import { InversionScrubber } from './ui/InversionScrubber';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Scene />
      <Panel />
      <InversionScrubber />
    </div>
  );
}
