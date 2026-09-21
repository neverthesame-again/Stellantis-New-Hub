import React, { useState, useEffect } from "react";
import "./selNexus.css";

const DEFAULT_ENDPOINT = "/api/automation-agents/external/start";

export const BrownfieldModal = ({
  isOpen,
  onClose,
  onBack,
  appName = "Application Enhancements",
  defaultDescription = "",
  endpoint = DEFAULT_ENDPOINT,
  onSuccess = () => {},
}) => {
  const [pipelineName, setPipelineName] = useState(() => {
    const slug = appName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const randomSuffix = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    return `${slug || "brownfield"}_${randomSuffix}`;
  });
  const [description, setDescription] = useState(defaultDescription);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = pipelineName.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter a pipeline name.");
      return;
    }
    if (!file) {
      setErrorMessage("Please upload a requirement document (PRD).");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // 1. Build multipart/form-data
      const formData = new FormData();
      formData.append("prd_file", file);
      formData.append("pipeline_name", trimmedName);

      // 2. POST to pipeline backend
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { message: raw };
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || `Failed to start pipeline (Status ${response.status})`);
      }

      // 3. Normalize tracking link
      const rawTrackingLink = data.tracking_link || "";
      const trackingLink = rawTrackingLink.replace(
        "https://mnnb9bbkgu.ap-south-1.awsapprunner.com",
        "https://sel-nexus.com"
      );

      const pipelineResult = {
        name: data.name || trimmedName,
        taskId: data.task_id || "",
        trackingLink: trackingLink,
      };

      setResult(pipelineResult);

      // 4. Automatic redirection in a new tab
      if (trackingLink) {
        window.open(trackingLink, "_blank", "noopener,noreferrer");
      }

      onSuccess(pipelineResult);
    } catch (err) {
      setErrorMessage(err.message || "Failed to start pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitReady = Boolean(pipelineName.trim()) && Boolean(file);

  return (
    <div className="bf-modal-overlay" onClick={loading ? null : onClose}>
      <div className="bf-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bf-modal-header">
          <div className="bf-modal-header-left">
            {onBack && !loading && !result && (
              <button
                type="button"
                className="bf-modal-back-btn"
                onClick={onBack}
                title="Back to options"
                aria-label="Back"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div className="bf-modal-title">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Invoke Automation Pipeline</span>
            </div>
          </div>
          <button
            type="button"
            className="bf-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bf-modal-body">
          {/* 1. Pipeline Name */}
          <div className="bf-form-group">
            <label htmlFor="bf-pipeline-name" className="bf-form-label">
              Pipeline Name
            </label>
            <input
              type="text"
              id="bf-pipeline-name"
              className="bf-form-input"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="e.g., brownfield_1234"
              disabled={loading || !!result}
            />
          </div>

          {/* 2. Feature Description (No AI Enhance Button) */}
          <div className="bf-form-group">
            <label htmlFor="bf-pipeline-desc" className="bf-form-label">
              Feature Description
            </label>
            <textarea
              id="bf-pipeline-desc"
              className="bf-form-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the enhancements or hotfix requirements..."
              disabled={loading || !!result}
            />
          </div>

          {/* 3. PRD Document Upload */}
          <div className="bf-form-group">
            <label className="bf-form-label">Requirement Doc Sources</label>
            {file ? (
              <div className="bf-upload-file">
                <span className="bf-upload-file-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <span className="bf-upload-file-name">{file.name}</span>
                {!result && (
                  <button
                    type="button"
                    className="bf-upload-file-remove"
                    onClick={() => setFile(null)}
                    disabled={loading}
                    title="Remove file"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <label
                htmlFor="bf-prd-file"
                className={`bf-upload-dropzone${dragOver ? " dragover" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <span className="bf-upload-dropzone-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </span>
                <span className="bf-upload-text">
                  <span>Click to upload</span> or drag and drop
                </span>
                <span className="bf-upload-hint">Supports .pdf, .md, .txt, .docx</span>
                <input
                  type="file"
                  id="bf-prd-file"
                  className="bf-upload-input"
                  accept=".pdf,.md,.txt,.docx"
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bf-banner error">{errorMessage}</div>
          )}

          {/* Success Banner & Redirect Link */}
          {result && (
            <div className="bf-banner success">
              <span>
                Pipeline &quot;{result.name}&quot; started successfully
                {result.taskId ? ` (Task #${result.taskId})` : ""}.
                {result.trackingLink && (
                  <>
                    {" "}
                    <a
                      href={result.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bf-tracking-link"
                    >
                      View tracking &rarr;
                    </a>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="bf-form-actions">
            {!result && (
              <button
                type="button"
                className="bf-btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type={result ? "button" : "submit"}
              className="bf-btn-primary"
              onClick={result ? onClose : undefined}
              disabled={!result && (!isSubmitReady || loading)}
            >
              {result ? "Done" : loading ? "Starting Pipeline..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrownfieldModal;
