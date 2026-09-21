import React, { useState, useEffect } from 'react';
import { adDashboardData } from '../mockData.js';
import '../adDashboard.css';

// 8 Modular PRD Dashboard Cards
import RoadmapHorizonCard from '../components/dashboard/RoadmapHorizonCard';
import BacklogHealthCard from '../components/dashboard/BacklogHealthCard';
import FeatureStatusCard from '../components/dashboard/FeatureStatusCard';
import BusinessValueCard from '../components/dashboard/BusinessValueCard';
import ReleaseReadinessCard from '../components/dashboard/ReleaseReadinessCard';
import RequirementQualityCard from '../components/dashboard/RequirementQualityCard';
import DependencyRiskCard from '../components/dashboard/DependencyRiskCard';
import DeliveryMetricsCard from '../components/dashboard/DeliveryMetricsCard';

// Interactive Modals
import ReleaseSimulationModal from '../components/dashboard/ReleaseSimulationModal';
import StoryDoctorModal from '../components/dashboard/StoryDoctorModal';

// Lucide Icons
import { CheckCircle2 } from 'lucide-react';

export default function AdDashboard() {
  const [data, setData] = useState(adDashboardData);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real-time data from backend on mount, with graceful local fallback
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ad/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setData(json.data);
        }
      })
      .catch((err) => {
        console.log('Backend API not ready, using local mockData.js fallback:', err.message);
      });
  }, []);

  // Show auto-dismissing toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Synthetic Emulator Mitigation (Card 7)
  const handleToggleMitigation = () => {
    setIsSubmitting(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ad/apply-mitigation`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setIsSubmitting(false);
        if (json.success) {
          // Re-sync local state
          setData((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.dependencyRisk.mitigationApplied = json.mitigationApplied;
            next.dependencyRisk.blockerActive = !json.mitigationApplied;
            next.dependencyRisk.nodes[2].status = json.mitigationApplied ? 'Mitigated (Synthetic Stream)' : 'Blocked';
            next.dependencyRisk.nodes[2].color = json.mitigationApplied ? '#10b981' : '#ef4444';
            return next;
          });
          showToast(json.message);
        }
      })
      .catch(() => {
        // Fallback for offline mode
        setIsSubmitting(false);
        setData((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          const currentMitigated = next.dependencyRisk.mitigationApplied;
          next.dependencyRisk.mitigationApplied = !currentMitigated;
          next.dependencyRisk.blockerActive = currentMitigated;
          next.dependencyRisk.nodes[2].status = !currentMitigated ? 'Mitigated (Synthetic Stream)' : 'Blocked';
          next.dependencyRisk.nodes[2].color = !currentMitigated ? '#10b981' : '#ef4444';
          return next;
        });
        showToast('Synthetic LiDAR Emulator active: Physical hardware delay bypassed.');
      });
  };

  // Apply Release Simulation (Card 5)
  const handleApplySimulation = ({ grantWaiver, injectSyntheticData, simulatedScore }) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ad/simulate-release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grantWaiver, injectSyntheticData })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setData((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.releaseReadiness.overallScore = json.simulatedScore;
            next.releaseReadiness.status = json.status;
            next.releaseReadiness.statusType = json.simulatedScore >= 95 ? 'success' : 'high';
            return next;
          });
          showToast(json.message);
        }
      })
      .catch(() => {
        // Fallback for offline mode
        setData((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          next.releaseReadiness.overallScore = simulatedScore;
          next.releaseReadiness.status = simulatedScore >= 95 ? 'Full Go (Simulated)' : 'Conditional Go';
          next.releaseReadiness.statusType = simulatedScore >= 95 ? 'success' : 'high';
          return next;
        });
        showToast(`Release simulated with score ${simulatedScore}%.`);
      });
  };

  // Auto-Enhance Story via AI Story Doctor (Card 6)
  const handleApplyStoryEnhancement = () => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ad/auto-enhance-backlog`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setData((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            next.requirementQuality.storyDoctor.enhanced = true;
            next.requirementQuality.investScore = 97;
            next.requirementQuality.status = 'INVEST: 97/100 (Enhanced)';
            return next;
          });
          showToast(json.message);
        }
      })
      .catch(() => {
        // Fallback for offline mode
        setData((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          next.requirementQuality.storyDoctor.enhanced = true;
          next.requirementQuality.investScore = 97;
          next.requirementQuality.status = 'INVEST: 97/100 (Enhanced)';
          return next;
        });
        showToast('US-389 enhanced with Gherkin rain condition criteria.');
      });
  };

  return (
    <div className="animate-fade-in ad-dashboard-container" id="ad-dashboard-root">
      
      {/* ========================================================= */}
      {/* DECK 1: STRATEGIC ROADMAP HORIZON & RELEASE COCKPIT       */}
      {/* ========================================================= */}
      <div className="ad-deck-1">
        <RoadmapHorizonCard data={data.roadmapHorizon} />
        <ReleaseReadinessCard
          data={data.releaseReadiness}
          onOpenSimulationModal={() => setIsSimModalOpen(true)}
        />
      </div>

      {/* ========================================================= */}
      {/* DECK 2: AGILE DELIVERY, FEATURE PULSE & RISK TOPOLOGY     */}
      {/* ========================================================= */}
      <div className="ad-deck-2">
        <BacklogHealthCard data={data.backlogHealth} />
        <FeatureStatusCard data={data.featureStatus} />
        <DependencyRiskCard
          data={data.dependencyRisk}
          onToggleMitigation={handleToggleMitigation}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* ========================================================= */}
      {/* DECK 3: QUALITY GOVERNANCE & AI VELOCITY ACCELERATION     */}
      {/* ========================================================= */}
      <div className="ad-deck-3">
        <RequirementQualityCard
          data={data.requirementQuality}
          onOpenStoryDoctorModal={() => setIsDoctorModalOpen(true)}
        />
        <DeliveryMetricsCard data={data.deliveryMetrics} />
      </div>

      {/* ========================================================= */}
      {/* DECK 4: MACRO VALUE REALIZATION (FULL-WIDTH PANORAMIC)    */}
      {/* ========================================================= */}
      <div className="ad-deck-4">
        <BusinessValueCard data={data.businessValue} />
      </div>

      {/* ========================================================= */}
      {/* MODALS & OVERLAYS                                         */}
      {/* ========================================================= */}
      <ReleaseSimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        onApplySimulation={handleApplySimulation}
        currentScore={data.releaseReadiness.overallScore}
      />

      <StoryDoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onApplyStoryEnhancement={handleApplyStoryEnhancement}
        storyDoctorData={data.requirementQuality.storyDoctor}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="ad-toast-banner">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
