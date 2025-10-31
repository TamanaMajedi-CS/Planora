
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
    
    if (typeof this.props.onError === "function") {
      this.props.onError(error, info);
    }
  }

  handleReset = () => {
    
    if (typeof this.props.onReset === "function") this.props.onReset();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" role="alert">
          <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
          <p>Try reloading the page or resetting this section.</p>
          {import.meta?.env?.DEV && this.state.error && (
            <pre style={{ whiteSpace: "pre-wrap", opacity: 0.8 }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={this.handleReset}>Reset</button>
            <button className="btn--secondary" onClick={() => location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
