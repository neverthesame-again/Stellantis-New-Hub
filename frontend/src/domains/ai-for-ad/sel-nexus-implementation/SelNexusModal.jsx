import React from "react";
import { Zap, ExternalLink, Play, X } from "lucide-react";
import "./selNexus.css";

export const SelNexusModal = ({
  isOpen,
  onClose,
  onSelectGreenField,
  onSelectBrownfield,
}) => {
  if (!isOpen) return null;

  const handleGreenFieldClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSelectGreenField) {
      onSelectGreenField(e);
    } else {
      window.open("https://sel-nexus.com/agents/automation/brd", "_blank", "noopener,noreferrer");
      if (onClose) onClose();
    }
  };

  const handleBrownfieldClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[SelNexusModal] handleBrownfieldClick called");
    if (onSelectBrownfield) {
      onSelectBrownfield(e);
    }
  };

  return (
    <div className="bf-modal-overlay" onClick={onClose}>
      <div
        className="ad-nexus-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ad-nexus-modal-header">
          <span className="ad-nexus-modal-title">Automation Pipeline</span>
          <button
            type="button"
            onClick={onClose}
            className="ad-nexus-modal-close"
            title="Close"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="ad-nexus-modal-body">
          <div className="ad-nexus-icon-row">
            <div className="ad-nexus-decor-line" />
            <div className="ad-nexus-center-icon">
              <Zap size={30} fill="white" color="white" />
            </div>
            <div className="ad-nexus-decor-line" />
          </div>

          <h3 className="ad-nexus-heading">Invoke SEL Nexus</h3>
          <p className="ad-nexus-description">
            Run SEL Nexus for &ldquo;Product Owner Backlog &amp; AC&rdquo; - governed, autonomous delivery from requirements through implementation.
          </p>

          <div className="ad-nexus-actions-grid">
            <button
              type="button"
              onClick={handleGreenFieldClick}
              className="ad-nexus-action-card"
            >
              <div className="ad-nexus-action-icon-box">
                <ExternalLink size={20} />
              </div>
              <div className="ad-nexus-action-content">
                <div className="ad-nexus-action-title">Green Field</div>
                <div className="ad-nexus-action-subtitle">L3 Autonomous Pipeline</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleBrownfieldClick}
              className="ad-nexus-action-card"
            >
              <div className="ad-nexus-action-icon-box">
                <Play size={20} />
              </div>
              <div className="ad-nexus-action-content">
                <div className="ad-nexus-action-title">Application Enhancements</div>
                <div className="ad-nexus-action-subtitle">L3 Autonomous Pipeline</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelNexusModal;
