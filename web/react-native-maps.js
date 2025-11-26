
// Minimal web shim for `react-native-maps` used only on web builds.
// Exports a simple placeholder MapView, Marker and Callout so imports don't pull
// native-only code into the web bundle.

export function Marker({ children }) {
  return <>{children}</>;
}

export function Callout({ children }) {
  return <div style={{ padding: 6 }}>{children}</div>;
}

export default function MapView(props) {
  const style = props.style || { width: '100%', height: 300 };
  const content = (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', color: '#333' }}>
      Map (web shim)
    </div>
  );

  // If children exist (markers), render them below the placeholder to keep markup useful
  return (
    <div>
      {content}
      {props.children}
    </div>
  );
}
