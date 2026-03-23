import "./App.css";
import { DefinitionView, DotLogo, Spinner, TemplateRow, truncate } from "./components.tsx";
import { useConnect } from "./hooks/useConnect.ts";
import { useEffect } from "react";
import { useTemplates } from "./hooks/useTemplates.ts";

export function App() {
  const { status, provider, handleConnect } = useConnect();
  const { templateList, selectTemplate, selectedAddress, definition, definitionLoading, definitionError } =
    useTemplates({ provider });

  useEffect(() => {
    if (status !== "disconnected") return;
    void handleConnect();
  }, [handleConnect, status]);

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-left">
          <DotLogo size={28} />
          <span className="topbar-title">Transaction Example</span>
        </div>

        <div className="topbar-right">
          <span>{status}</span>
        </div>
      </header>
      <div className="body">
        {/* ── Left: template list ── */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="panel-title">Templates</h2>
          </div>

          {templateList.length === 0 && <p className="empty-state">{"No templates found."}</p>}

          <div className="template-list">
            {templateList.map((t) => (
              <TemplateRow
                key={t.address}
                template={t}
                selected={selectedAddress === t.address}
                onSelect={() => void selectTemplate(t.address)}
              />
            ))}
          </div>
        </aside>

        {/* ── Right: definition viewer ── */}
        <main className="detail">
          {!selectedAddress && (
            <div className="empty-detail">
              <DotLogo size={48} />
              <p>Select a template to inspect its ABI</p>
            </div>
          )}

          {selectedAddress && (
            <>
              <div className="detail-header">
                <h2 className="panel-title">ABI</h2>
                <span className="mono address-chip" title={selectedAddress}>
                  {truncate(selectedAddress, 14, 10)}
                </span>
              </div>

              {definitionLoading && (
                <div className="loading-state">
                  <Spinner dark /> Fetching definition…
                </div>
              )}

              {definitionError && (
                <div className="error-banner" role="alert">
                  {definitionError}
                </div>
              )}

              {definition && !definitionLoading && <DefinitionView definition={definition} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
