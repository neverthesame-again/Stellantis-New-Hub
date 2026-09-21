import React, { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import { SelNexusModal } from "./SelNexusModal.jsx";
import { BrownfieldModal } from "./BrownfieldModal.jsx";
import "./selNexus.css";

export const SelNexusFlow = ({
  isOpen,
  onClose,
  onToast = () => {},
}) => {
  const [step, setStep] = useState("options"); // 'options' | 'brownfield'

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("options");
    if (onClose) onClose();
  };

  const handleSelectGreenField = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open("https://sel-nexus.com/agents/automation/brd", "_blank", "noopener,noreferrer");
    handleClose();
    onToast("Opening SEL Nexus Green Field Autonomous Pipeline in new tab...", ExternalLink);
  };

  const handleSelectBrownfield = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[SEL Nexus] Switching step from options to brownfield");
    setStep("brownfield");
  };

  const handleBrownfieldSuccess = (result) => {
    onToast(
      `SEL Nexus Brownfield pipeline "${result.name}" started (Task #${result.taskId}). Tracking launched in new tab.`,
      Zap
    );
  };

  return (
    <>
      {step === "options" && (
        <SelNexusModal
          isOpen={isOpen}
          onClose={handleClose}
          onSelectGreenField={handleSelectGreenField}
          onSelectBrownfield={handleSelectBrownfield}
        />
      )}

      {step === "brownfield" && (
        <BrownfieldModal
          isOpen={isOpen}
          onClose={handleClose}
          onBack={() => setStep("options")}
          appName="Application Enhancements"
          defaultDescription=""
          onSuccess={handleBrownfieldSuccess}
        />
      )}
    </>
  );
};

export default SelNexusFlow;
