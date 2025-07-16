import { useContext } from 'react';
import './App.css';
import { FontContext } from './Context/mmfontContext';
import { ToastProvider } from './Context/toastContext';
import { LeftControlPanel } from './components/LeftControlPanel';
import { RightPreviewPanel } from './components/RightPreviewPanel';

function App() {
  const { leftPanelCollapsed, toggleLeftPanel } = useContext(FontContext) || {};

  const handleTogglePanel = () => {
    toggleLeftPanel?.(!leftPanelCollapsed);
  };

  return (
    <ToastProvider>
      <div className="app-container">


        {/* Two-Panel Layout */}
        <div className="two-panel-layout" role="main">
          {/* Left Control Panel */}
          <LeftControlPanel
            isCollapsed={leftPanelCollapsed || false}
            onToggleCollapse={handleTogglePanel}
          />

          {/* Right Preview Panel */}
          <RightPreviewPanel
            isLeftPanelCollapsed={leftPanelCollapsed || false}
          />
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
