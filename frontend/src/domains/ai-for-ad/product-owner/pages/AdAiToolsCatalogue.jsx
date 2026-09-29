import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  X,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode,
  Terminal,
  Activity,
  Database,
  GitFork,
  BookOpen,
  Lock,
  Kanban,
  Send,
  Plus,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  AlignJustify,
  Zap,
  Play
} from 'lucide-react';
import '../adAiToolsCatalogue.css';
import { SelNexusFlow } from '../../sel-nexus-implementation/SelNexusFlow.jsx';

// 10 Engineering Lifecycle Categories (PRD §5.5)
const CATEGORIES = [
  { id: 'coding', num: '1', name: 'Coding Assistants', icon: FileCode, desc: 'Embedded C/C++, Python & MISRA-C Compliance' },
  { id: 'testing', num: '2', name: 'Testing Tools', icon: CheckCircle2, desc: 'Hardware-in-the-Loop & ASIL-D Safety Validation' },
  { id: 'architecture', num: '3', name: 'Architecture Tools', icon: Layers, desc: 'AUTOSAR Adaptive & Service-Oriented Topology' },
  { id: 'devops', num: '4', name: 'DevOps Tools', icon: Terminal, desc: 'Vehicle Flashing & OTA Release Automation' },
  { id: 'observability', num: '5', name: 'Observability Tools', icon: Activity, desc: 'Model Drift, Sensor Covariate Shift & Telemetry' },
  { id: 'dataeng', num: '6', name: 'Data Engineering Tools', icon: Database, desc: 'Sensor Data Lakes & 50K Pedestrian Dataset ETL' },
  { id: 'modernization', num: '7', name: 'Modernization Tools', icon: GitFork, desc: 'AUTOSAR Classic to Adaptive C++17 Porting' },
  { id: 'docs', num: '8', name: 'Documentation & Knowledge', icon: BookOpen, desc: 'ISO 26262 Safety-Case Search & Indexing' },
  { id: 'security', num: '9', name: 'Security & Compliance', icon: Lock, desc: 'ISO 21434 Automotive Threat Hunting & TARA' },
  { id: 'product', num: '10', name: 'Product Management', icon: Kanban, desc: 'AI Story Splitting, INVEST Scoring & Backlog' }
];

// Comprehensive 23 Automotive AI Tools (2-3 tools max per category)
const TOOLS_DATA = [
  // 1. Coding Assistants (3)
  {
    id: 'codepilot',
    categoryId: 'coding',
    title: 'CodePilot Pro',
    edition: 'Embedded Systems Edition · v3.4',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'MISRA-C Compliance & C++ Static Guard',
    highlightDesc: 'Automates automotive coding standards, ISO 26262 syntax checks, and memory leak detection across embedded vehicle ECUs.',
    metrics: '128 / 150 licenses used (85%)',
    description: 'Automates automotive C/C++ coding standards, MISRA-C compliance checking, and memory leak analysis across AUTOSAR embedded vehicle ECU target platforms.',
    useCases: [
      'Automatic MISRA-C 2012 guideline compliance checking during PR review.',
      'Static memory leak & buffer overflow detection in C++14/C++17 safety-critical firmware.',
      'Automated unit test generation for ISO 26262 code coverage targets.'
    ],
    integrations: 'VS Code Enterprise Extension, CLion, GitLab CI MISRA-C gating hook, Bazel build toolchain.',
    licensing: 'Per-seat enterprise subscription (CC-8812-AD Systems Engineering).',
    approvedProjects: 'All Autonomous Driving, ADAS, and SDV Platform embedded programs.',
    dataRestrictions: 'EU Sovereign On-Premise telemetry; zero external model training. Code tokens processed in Frankfurt VPC.',
    ownerName: 'M. Rossi (Embedded Tooling Lead)',
    ownerEmail: 'm.rossi@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-logged)',
      step2: 'Team Lead Seat Approval (Pending Review)',
      step3: 'License Key & VS Code Token Provisioning (24h SLA)'
    }
  },
  {
    id: 'deepcode_cpp',
    categoryId: 'coding',
    title: 'DeepCode C++ Safety Guard',
    edition: 'Autonomous Firmware Safety · v2.9',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Real-Time Pointer & Concurrency Linter',
    highlightDesc: 'Enforces AUTOSAR Adaptive C++14 guidelines, identifying race conditions in multi-threaded sensor fusion pipelines.',
    metrics: '94 / 100 licenses used (94%)',
    description: 'Specialized static semantic analysis engine tailored for real-time automotive operating environments, verifying strict thread-safety and deterministic latency.',
    useCases: [
      'Race condition and deadlock detection in POSIX-based Adaptive AUTOSAR threads.',
      'Validation of raw pointer safety rules under ISO 26262 Part 6 guidelines.',
      'CI/CD gating hook blocking builds with unhandled hardware exception vectors.'
    ],
    integrations: 'GitLab CI, Clang-Tidy plugin, QNX Neutrino toolchain, Jenkins Automotive.',
    licensing: 'Floating developer pool license (AD Embedded Core BU).',
    approvedProjects: 'All ASIL-C and ASIL-D autonomous driving software modules.',
    dataRestrictions: 'All analysis executed on local build runners; no code snippet leaves Stellantis intranet.',
    ownerName: 'L. Bianchi (Software Quality Lead)',
    ownerEmail: 'l.bianchi@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-logged)',
      step2: 'Safety Manager Review (1-2 days)',
      step3: 'Static Analysis Runner Provisioning'
    }
  },
  {
    id: 'starcoder_orin',
    categoryId: 'coding',
    title: 'StarCoder Orin Optimizer',
    edition: 'NVIDIA DRIVE AGX / Orin CUDA · v1.8',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'TensorRT & CUDA Embedded Kernel Synthesizer',
    highlightDesc: 'Auto-optimizes deep learning kernels for DriveOS and Orin SoC hardware accelerators, cutting inference latency by 32%.',
    metrics: '45 / 50 licenses used (90%)',
    description: 'Hardware-aware generative AI assistant fine-tuned on NVIDIA DRIVE Orin architecture and TensorRT C++ APIs for low-latency perception model execution.',
    useCases: [
      'Automated conversion of PyTorch model layers into quantized TensorRT FP16/INT8 kernels.',
      'Memory bandwidth optimization for camera-radar sensor fusion on Orin SoCs.',
      'Real-time GPU profiling and kernel fusion code generation.'
    ],
    integrations: 'NVIDIA Nsight Systems, DriveOS 6.0 SDK, TensorRT CLI, Bazel CUDA rules.',
    licensing: 'Restricted high-performance compute license ($1,200/seat/year).',
    approvedProjects: 'Next-Gen Perception R&D, Level 3 Highway Chauffeur programs.',
    dataRestrictions: 'Strictly restricted to authorized NVIDIA Orin target hardware sandbox environments.',
    ownerName: 'A. Novotny (Compute Optimization Lead)',
    ownerEmail: 'a.novotny@stellantis.com',
    stepper: {
      step1: 'Complete (Captured via Portal)',
      step2: 'Compute Architecture Board Approval',
      step3: 'Target SoC Access & SDK Token Provisioning (3 days)'
    }
  },

  // 2. Testing Tools (3)
  {
    id: 'hil_orchestrator',
    categoryId: 'testing',
    title: 'HIL Test Orchestrator',
    edition: 'Balocco & Vélizy Rigs 1–4 · v4.1',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Powers 86% HIL Coverage Metric',
    highlightDesc: 'Automates HIL test bench scheduling across physical test racks, aggregating pass/fail logs against ASIL-D requirements.',
    metrics: '6 of 8 AD programs active (340 runs/sprint)',
    description: 'Automates HIL test bench scheduling, aggregates pass/fail results across physical test rigs (Rigs 1–4 in Balocco & Vélizy), and flags test coverage gaps against ASIL-D safety requirements.',
    useCases: [
      'Orchestrates automated nightly regression test suites across physical HIL test racks 1–4.',
      'Direct source of truth for the 86% HIL Simulation Coverage metric on Release Readiness dashboards.',
      'Automatic ASIL-D traceability mapping for Euro NCAP active safety protocol test cases.'
    ],
    integrations: 'HIL Test Bench Controller REST API (Rigs 1–4 in Balocco & Vélizy), Jenkins CI/CD pipeline webhooks, dSPACE & NI testbed buses.',
    licensing: 'Enterprise site license, funded centrally under Systems Engineering Tools budget.',
    approvedProjects: 'Safety-critical Autonomous Driving programs only (ASIL-B and above).',
    dataRestrictions: 'Raw telemetry and hardware test logs must remain within EU sovereign data centers per ISO 26262 traceability requirements.',
    ownerName: 'J. Fischer (Systems Engineering Tooling Lead)',
    ownerEmail: 'j.fischer@stellantis.com',
    stepper: {
      step1: 'Complete (Captured via PM portal)',
      step2: 'Systems Engineering Approval (Capacity check on Rigs 1–4)',
      step3: 'Test Rig Access Provisioning (3–5 day SLA)'
    }
  },
  {
    id: 'vectorcast_ai',
    categoryId: 'testing',
    title: 'VectorCAST AI Test Synthesizer',
    edition: 'ASIL-D MC/DC Structural Coverage · v6.2',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Automated MC/DC Branch Vector Generation',
    highlightDesc: 'Synthesizes synthetic stimulus vectors to achieve 100% Modified Condition/Decision Coverage for ISO 26262 compliance.',
    metrics: '88 / 100 licenses used (88%)',
    description: 'AI-driven test input synthesizer designed for safety-critical vehicle ECUs, generating edge-case boundary stimuli to satisfy ASIL-D certification.',
    useCases: [
      'Automated test case generation to reach 100% MC/DC branch coverage in perception fusion logic.',
      'Boundary value analysis on integer overflows and CAN bus communication delays.',
      'Automated export of certified ISO 26262 test dossiers for TÜV SÜD auditors.'
    ],
    integrations: 'VectorCAST Embedded, Vector DaVinci Configurator, Polarion ALM, Jira.',
    licensing: 'Per-seat site subscription (Systems Safety Engineering BU).',
    approvedProjects: 'All ASIL-D software projects across STLA Large & Medium platforms.',
    dataRestrictions: 'Test models and coverage archives stored in dedicated ISO 26262 audit vault.',
    ownerName: 'E. Becker (Software Safety & Verification Lead)',
    ownerEmail: 'e.becker@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-logged)',
      step2: 'Verification Lead Approval',
      step3: 'VectorCAST Server License Token (24h)'
    }
  },
  {
    id: 'scenariosynth_pro',
    categoryId: 'testing',
    title: 'ScenarioSynth Pro',
    edition: 'Balocco Proving Ground Simulator · v3.0',
    security: 'public',
    securityLabel: 'Public',
    highlightTitle: 'Generates 1,200 Virtual Traffic Scenarios',
    highlightDesc: 'Synthesizes high-risk edge cases (cut-ins, blinding glare, ghost braking) from physical Balocco proving ground telemetry.',
    metrics: '35 / 40 licenses used (87%)',
    description: 'Generative physics-based scenario generator synthesizing millions of photorealistic virtual sensor feeds to stress-test Level 2+ perception algorithms.',
    useCases: [
      'Edge-case scenario synthesis based on Euro NCAP 2026 pedestrian and cyclist protocols.',
      'Adverse weather simulation including torrential rain, sleet, and night-time direct headlight glare.',
      'Closed-loop trajectory planner evaluation against unpredictable highway cut-in maneuvers.'
    ],
    integrations: 'CARLA simulator bridge, Unreal Engine 5.3, OpenSCENARIO 2.0 exporter, AWS Batch.',
    licensing: 'Project-funded subscription (Autonomous Driving Perception CC).',
    approvedProjects: 'All Level 2+ and Level 3 Automated Driving programs.',
    dataRestrictions: 'Synthetic scenario assets cleared for open collaborative research and tier-1 vendor testing.',
    ownerName: 'D. Klein (Simulation & Virtual Verification Lead)',
    ownerEmail: 'd.klein@stellantis.com',
    stepper: {
      step1: 'Complete (Recorded)',
      step2: 'Simulation Cluster Allocation Check',
      step3: 'Cloud Simulation Credentials (48h)'
    }
  },

  // 3. Architecture Tools (2)
  {
    id: 'archmap',
    categoryId: 'architecture',
    title: 'ArchMap AI',
    edition: 'Enterprise Topology Engine · v2.8',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Auto-Generates Dependency & Risk Graphs',
    highlightDesc: 'Extracts ECU call trees and message interfaces across Bazel builds, mapping SOA communications with latency risk bounds.',
    metrics: '12 teams active (42 ECU service graphs)',
    description: 'Auto-generates dependency diagrams, SOA service graphs, and latency risk bounds by analyzing Bazel build trees and AUTOSAR adaptive manifests.',
    useCases: [
      'Automatic dependency topology generation for STLA Brain service-oriented architecture.',
      'ECU communication latency bottleneck detection across SOME/IP and DDS bridges.',
      'Architectural drift detection against formal system design specifications.'
    ],
    integrations: 'Enterprise Architect REST sync, GitHub dependency graph, Bazel build graph analyzer.',
    licensing: 'Enterprise domain license (Global Software Architecture Office).',
    approvedProjects: 'All AUTOSAR Adaptive, SOA & SDV Architecture initiatives.',
    dataRestrictions: 'Internal Stellantis network only; proprietary ECU architectural schematics.',
    ownerName: 'C. Dupont (Global Architecture Office Lead)',
    ownerEmail: 'c.dupont@stellantis.com',
    stepper: {
      step1: 'Complete (Captured)',
      step2: 'Architecture Domain Review (Pending)',
      step3: 'Graph Workspace Provisioning (2-day SLA)'
    }
  },
  {
    id: 'autosar_schemagen',
    categoryId: 'architecture',
    title: 'AUTOSAR SchemaGen',
    edition: 'STLA Brain SOA Interface Synthesizer · v3.2',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'ARXML & SOME/IP Interface Synthesizer',
    highlightDesc: 'Validates and auto-generates AUTOSAR Adaptive service interface descriptions with deterministic latency budget guarantees.',
    metrics: '18 teams active (115 service contracts)',
    description: 'Specialized language model assistant that reads system requirement specifications and outputs standardized, validated ARXML interface definitions.',
    useCases: [
      'Transforms English service requirements into AUTOSAR 4.4 and Adaptive ARXML schemas.',
      'Automated SOME/IP serialization stub generator for C++17 adaptive applications.',
      'Conflict resolution between multiple ECU service communication matrices.'
    ],
    integrations: 'Vector DaVinci Developer, IBM Rhapsody, GitLab CI ARXML schema linter.',
    licensing: 'Corporate engineering license (Central Software Organization).',
    approvedProjects: 'STLA Brain, STLA AutoDrive, and SmartCockpit programs.',
    dataRestrictions: 'Interface contracts restricted to internal vehicle network security groups.',
    ownerName: 'V. Laurent (Interface Governance Lead)',
    ownerEmail: 'v.laurent@stellantis.com',
    stepper: {
      step1: 'Complete (Submitted)',
      step2: 'SOA Governance Board Sign-Off',
      step3: 'Schema Repository Write Permission (24h)'
    }
  },

  // 4. DevOps Tools (2)
  {
    id: 'pipelinesense',
    categoryId: 'devops',
    title: 'PipelineSense',
    edition: 'OTA Release Automation · v5.2',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Vehicle Flash CI/CD & OTA Verification',
    highlightDesc: 'Validates binary signatures, manages ECU flash manifests, and runs virtual bench regression gates before target deployment.',
    metrics: '56 teams active (1,420 pipeline runs/wk)',
    description: 'Specialized vehicle flash CI/CD & OTA verification engine. Validates cryptographic signatures, verifies ECU flash manifests, and orchestrates virtual test bench deployment gates.',
    useCases: [
      'Automated verification of OTA firmware delta packages before fleet flashing.',
      'Cryptographic signature validation and secure boot certificate check.',
      'Virtual ECU staging and automated deployment gate orchestration.'
    ],
    integrations: 'GitHub Actions, Jenkins, Artifactory, Stellantis OTA Flash Server, HSM Key Vault.',
    licensing: 'Central DevOps platform license (Free for all internal AD teams).',
    approvedProjects: 'All Vehicle Software Integration & OTA Flash Programs.',
    dataRestrictions: 'Firmware binaries strictly locked to EU Sovereign Artifact Registry.',
    ownerName: 'D. Weber (DevOps Platforms Core Lead)',
    ownerEmail: 'd.weber@stellantis.com',
    stepper: {
      step1: 'Complete (Automated)',
      step2: 'CI/CD Target Cluster Validation',
      step3: 'Pipeline Secret Provisioning (24h SLA)'
    }
  },
  {
    id: 'flashci_sentinel',
    categoryId: 'devops',
    title: 'FlashCI ECU Flasher',
    edition: 'Automated Hardware Bench Flashing · v4.4',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Multi-Target Hardware Bench Automation',
    highlightDesc: 'Orchestrates rapid parallel flashing and health verification across physical test benches in Balocco, Turin, and Auburn Hills.',
    metrics: '38 teams active (620 hardware flash cycles/wk)',
    description: 'High-speed flashing orchestration system interfacing with Vector CANoe and Lauterbach debuggers to reliably provision physical vehicle ECUs in CI pipelines.',
    useCases: [
      'Automated recovery and recovery-mode flashing of bricked bench ECUs.',
      'Simultaneous flashing of Radar, Camera, and Fusion ECUs across CAN-FD/Ethernet.',
      'Bench health telemetry streaming and hardware fault isolation.'
    ],
    integrations: 'Lauterbach TRACE32, Vector VN1630, Jenkins Hardware Agent, Artifactory.',
    licensing: 'Hardware bench site license pool (Balocco & Vélizy labs).',
    approvedProjects: 'Autonomous Driving integration test benches and pre-series prototypes.',
    dataRestrictions: 'Firmware images decrypted inside secure hardware module at flash time.',
    ownerName: 'G. Morales (Hardware Bench Operations)',
    ownerEmail: 'g.morales@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-registered)',
      step2: 'Lab Hardware Rig Assignment',
      step3: 'Bench SSH & Flasher Access (24h)'
    }
  },

  // 5. Observability Tools (2)
  {
    id: 'observa',
    categoryId: 'observability',
    title: 'ObservaAI',
    edition: 'Automotive ML Drift Monitor · v3.1',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Originator of VisionTransformer v2 Drift Alert',
    highlightDesc: 'Continuously samples vehicle fleet telemetry for sensor distribution shift, rain/glare degradation, and confidence score divergence.',
    metrics: '41 teams active (18 Production Models Tracked)',
    description: 'Continuously monitors model drift, sensor data distribution shift, and edge inference confidence drops across vehicle fleet telemetry. The originator of the VisionTransformer v2 Drift Alert.',
    useCases: [
      'Fleet telemetry monitoring for sensor data distribution drift (rain, fog, direct headlight glare).',
      'Originator of the VisionTransformer v2 Drift Alert in perception models.',
      'UNECE R156 compliance monitoring and post-deployment model performance auditing.'
    ],
    integrations: 'Kafka Telemetry Bus, Prometheus, MLflow model registry, Grafana dashboards.',
    licensing: 'Platform consumption tier (Systems Engineering Cost Center).',
    approvedProjects: 'Production Vision, Radar, and Trajectory Planning AI models.',
    dataRestrictions: 'Compliant with UNECE R156 software update & model monitoring traceability.',
    ownerName: 'S. Mehta (MLOps Operations Lead)',
    ownerEmail: 's.mehta@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-registered)',
      step2: 'Telemetry Ingest Validation',
      step3: 'Metric Stream Provisioning (48h SLA)'
    }
  },
  {
    id: 'can_sentinel',
    categoryId: 'observability',
    title: 'CAN-Ethernet Telemetry Sentinel',
    edition: 'In-Vehicle Bus Anomaly Detector · v2.6',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'In-Vehicle SOME/IP & CAN Packet Inspector',
    highlightDesc: 'Zero-overhead telemetry tap detecting communication jitter, frame drops, and payload corruption on high-speed vehicle Ethernet buses.',
    metrics: '29 teams active (3.2B packets inspected/day)',
    description: 'Passive in-vehicle telemetry inspector running lightweight eBPF probes on STLA Brain gateway ECUs to capture microscopic network anomalies.',
    useCases: [
      'Latency spike detection during high-bandwidth camera-to-fusion transmission.',
      'SOME/IP message deserialization error tracking across distributed vehicle domains.',
      'Automated root-cause telemetry capture upon ASIL safety gate triggers.'
    ],
    integrations: 'Vector CANalyzer, Wireshark Automotive dissectors, Grafana, AWS OpenSearch.',
    licensing: 'Per-vehicle test fleet subscription (Vehicle Network Architecture BU).',
    approvedProjects: 'High-speed Ethernet and AD sensor bus validation programs.',
    dataRestrictions: 'Raw packet logs scrubbed of GPS locations and vehicle VIN identifiers.',
    ownerName: 'T. Richter (Vehicle Network Architecture Lead)',
    ownerEmail: 't.richter@stellantis.com',
    stepper: {
      step1: 'Complete (Submitted)',
      step2: 'Network Security Audit',
      step3: 'Probe Telemetry Feed Access (3 days)'
    }
  },

  // 6. Data Engineering Tools (2)
  {
    id: 'dataweaver',
    categoryId: 'dataeng',
    title: 'DataWeaver',
    edition: 'Sensor Data Lake Pipeline · v4.0',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'Perception Data Lake & 50K Pedestrian Dataset',
    highlightDesc: 'Extracts, filters, and anonymizes raw camera-radar point cloud streams from Balocco proving ground runs, packaging training batches.',
    metrics: '50K-frame pedestrian dataset pipeline (8 Active Sensor Suites)',
    description: 'High-throughput perception data lake and ETL pipeline managing the 50K-frame pedestrian dataset, raw radar point-clouds, and multi-sensor synchronization.',
    useCases: [
      'High-resolution perception data ingestion from Balocco proving ground test drives.',
      '50K pedestrian dataset pipeline management with automated bbox annotations.',
      'Synthetic data augmentation and scenario extraction for edge-case simulation.'
    ],
    integrations: 'AWS S3 Sovereign Frankfurt, Apache Spark, LabelBox Automotive, NuScenes connector.',
    licensing: 'High-compute data infrastructure allocation (AD Perception CC).',
    approvedProjects: 'Level 2+ and Level 3 Perception & Sensor Fusion R&D.',
    dataRestrictions: 'GDPR pedestrian facial/license-plate anonymization mandatory; restricted access boundary.',
    ownerName: 'L. Chen (Perception Data Engineering Lead)',
    ownerEmail: 'l.chen@stellantis.com',
    stepper: {
      step1: 'Complete (Logged)',
      step2: 'Data Protection & GDPR Compliance Review',
      step3: 'S3 Bucket Access Token Provisioning (3–5 day SLA)'
    }
  },
  {
    id: 'pointpillars_lake',
    categoryId: 'dataeng',
    title: 'PointPillars LiDAR Lake',
    edition: '3D Point Cloud Ingestion & Anonymization · v2.4',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'Automated 3D Bounding Box Labeling & Calibration',
    highlightDesc: 'Synchronizes 128-beam LiDAR point clouds with 8MP front cameras, performing automated temporal calibration and auto-labeling.',
    metrics: '14 programs active (180 TB synchronized sensor data)',
    description: 'Specialized 3D sensor cloud storage and preprocessing platform designed for raw point cloud registration, ground plane filtering, and 3D bounding box auto-labeling.',
    useCases: [
      'Automated temporal synchronization between LiDAR rotational timestamps and camera frames.',
      'Dynamic ground-plane removal and spatial voxel clustering for object detection training.',
      'Automated anonymization of pedestrian silhouettes and background structures.'
    ],
    integrations: 'Apache Arrow, ROS 2 bag analyzer, AWS S3 Sovereign, PyTorch Geometric.',
    licensing: 'High-throughput cloud storage grant (Advanced Perception Engineering).',
    approvedProjects: 'Level 3 Automated Highway Drive and Urban Pilot R&D.',
    dataRestrictions: 'Strict sovereign boundary enforcement; raw LIDAR point clouds cannot leave EU.',
    ownerName: 'H. Berg (LiDAR & Sensor Infrastructure Lead)',
    ownerEmail: 'h.berg@stellantis.com',
    stepper: {
      step1: 'Complete (Captured)',
      step2: 'Storage Budget & Quota Sign-Off',
      step3: 'Direct S3 IAM Role Provisioning (48h)'
    }
  },

  // 7. Modernization Tools (2)
  {
    id: 'modernizeiq',
    categoryId: 'modernization',
    title: 'ModernizeIQ',
    edition: 'Legacy ECU Code Porting · v1.9',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Legacy AUTOSAR Classic → Adaptive Refactor',
    highlightDesc: 'Parses legacy C ECU firmware and generates modern C++17 wrappers compliant with STLA Brain SOA communication contracts.',
    metrics: '8 teams active (34 legacy stacks refactored)',
    description: 'Automated legacy AUTOSAR classic to adaptive migration engine. Converts legacy C codebases and OSEK configurations into C++17 adaptive services.',
    useCases: [
      'Legacy ECU firmware migration into STLA Brain adaptive service modules.',
      'Automated ARXML model translation between AUTOSAR 4.2 and AUTOSAR Adaptive R20.',
      'Automated test wrapper generation for regression safety verification.'
    ],
    integrations: 'Vector DaVinci, EB tresos, Artop C++ code transform plugins.',
    licensing: 'Per-repository modernization grant.',
    approvedProjects: 'Legacy ECU platform porting, STLA Brain migration programs.',
    dataRestrictions: 'Source code remains strictly within isolated on-premise container runner.',
    ownerName: 'P. Becker (Embedded Core Modernization Lead)',
    ownerEmail: 'p.becker@stellantis.com',
    stepper: {
      step1: 'Complete (Recorded)',
      step2: 'Legacy ECU Compatibility Review',
      step3: 'Migration Runner Sandbox Setup (3-day SLA)'
    }
  },
  {
    id: 'classic_bridge',
    categoryId: 'modernization',
    title: 'Classic-to-Adaptive Bridge AI',
    edition: 'ARXML Contract Transformer · v2.1',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'OSEK Task to POSIX Thread Refactoring',
    highlightDesc: 'Refactors legacy micro-controller OS task schedules into POSIX multi-threaded service contracts for STLA Brain Linux nodes.',
    metrics: '11 teams active (28 ECU controllers modernized)',
    description: 'AI code refactoring engine that automatically inspects cyclic task configurations, memory maps, and interrupt handlers in legacy C code, generating POSIX compliant C++17 services.',
    useCases: [
      'Automated migration of fixed-priority cyclic OSEK tasks into adaptive POSIX worker threads.',
      'Inter-process communication translation from raw memory registers to SOME/IP events.',
      'Generates regression compatibility test benches validating timing equivalence.'
    ],
    integrations: 'Vector DaVinci Developer, GCC/Clang tooling, CMake build modernizer.',
    licensing: 'Central Vehicle Software Modernization Fund.',
    approvedProjects: 'Powertrain and Chassis Gateway migration to STLA Brain.',
    dataRestrictions: 'Proprietary ECU legacy firmware kept strictly on on-premise compilation servers.',
    ownerName: 'K. Lindholm (Core Architecture Migration)',
    ownerEmail: 'k.lindholm@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-registered)',
      step2: 'Platform Engineering Assessment',
      step3: 'Modernization Workspace Access (24h)'
    }
  },

  // 8. Documentation & Knowledge Tools (2)
  {
    id: 'docmind',
    categoryId: 'docs',
    title: 'DocMind',
    edition: 'ISO 26262 Knowledge Index · v2.5',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'ASIL-D / ISO 26262 Safety-Case Semantic Search',
    highlightDesc: 'Indexes hazard analyses, safety requirements, and test verification logs across Polarion, Confluence, and Euro NCAP protocols.',
    metrics: '63 teams active (14,800 specs indexed)',
    description: 'Semantic search and indexer across ISO 26262 safety cases, hazard & risk analyses (HARA), and Euro NCAP protocol requirements.',
    useCases: [
      'ASIL-D safety-case argument generation and cross-reference validation.',
      'Instant retrieval of proving ground test verification dossiers.',
      'Automated compliance audit readiness reports for ISO 26262 Part 3, 4, 6.'
    ],
    integrations: 'Confluence, Jira, PTC Integrity, Polarion ALM, SharePoint DMS.',
    licensing: 'Stellantis Enterprise Knowledge Site License.',
    approvedProjects: 'All Systems Engineering, NCAP & ISO 26262 programs.',
    dataRestrictions: 'Role-based access control (RBAC) enforced per safety classification tier.',
    ownerName: 'A. Kowalski (Engineering Knowledge Lead)',
    ownerEmail: 'a.kowalski@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-verified)',
      step2: 'Department Scope Assignment',
      step3: 'Instant Enterprise Access (Automated)'
    }
  },
  {
    id: 'safetycase_indexer',
    categoryId: 'docs',
    title: 'SafetyCase Indexer',
    edition: 'Polarion & DOORS Live Traceability · v3.3',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Bidirectional Requirement-to-Test Traceability',
    highlightDesc: 'Monitors requirement coverage, flags orphaned safety goals, and predicts audit risk score across all active carlines.',
    metrics: '47 teams active (100% ASIL-D traceability on R4.2)',
    description: 'Graph-based safety traceability copilot that scans requirements databases, architectural models, and HIL test executions to highlight broken safety verification chains.',
    useCases: [
      'Real-time identification of orphaned technical safety requirements without test coverage.',
      'Automated generation of ISO 26262 Work Product Traceability Matrix (WPTM).',
      'Instant audit-trail diffing between baseline releases.'
    ],
    integrations: 'Siemens Polarion ALM, IBM Rational DOORS, Jira Safety, Confluence.',
    licensing: 'Enterprise Engineering Systems license (All Stellantis systems engineers).',
    approvedProjects: 'All active car programs with safety-relevant electronic systems.',
    dataRestrictions: 'Controlled safety documentation; export watermarking enforced.',
    ownerName: 'M. Fournier (Functional Safety Compliance Director)',
    ownerEmail: 'm.fournier@stellantis.com',
    stepper: {
      step1: 'Complete (Logged)',
      step2: 'Project Safety Manager Endorsement',
      step3: 'Polarion Live Connector Provisioning (24h)'
    }
  },

  // 9. Security & Compliance Tools (3)
  {
    id: 'securescan',
    categoryId: 'security',
    title: 'SecureScan AI',
    edition: 'ISO 21434 Threat Scanner · v3.7',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'ISO 21434 Threat Catalog Scanner',
    highlightDesc: 'Automated cybersecurity vulnerability scanner for automotive embedded software, ECU firmware builds, and connected cloud services.',
    metrics: '71 teams (1,204 scans · 3 crit resolved)',
    description: 'Automated static/dynamic cybersecurity vulnerability scanner for automotive embedded software, mapped directly to the ISO 21434 threat catalog; scans ECU firmware and cloud telemetry services.',
    useCases: [
      'Automated static/dynamic cybersecurity vulnerability scanning for automotive embedded software.',
      'Continuous mapping of firmware vulnerabilities against the ISO 21434 threat catalog.',
      'Automated gating of production release builds with unresolved High or Critical CVEs.'
    ],
    integrations: 'Read-only Git repository access, CI/CD pipeline blocking plugin, Jira Product Security tickets.',
    licensing: 'Per-repository subscription, billed directly to the subscribing Business Unit.',
    approvedProjects: 'All connected, software-defined vehicle (SDV) and ADAS ECU projects.',
    dataRestrictions: 'Scan results are strictly classified Confidential; access restricted to designated Security & Compliance role holders.',
    ownerName: 'R. Kapoor (Product Security Team Lead)',
    ownerEmail: 'r.kapoor@stellantis.com',
    stepper: {
      step1: 'Complete (Request Submitted)',
      step2: 'Security Team Review & Threat Assessment (In Progress)',
      step3: 'Repository Access Token Granted (5–7 day SLA)'
    }
  },
  {
    id: 'threathunter_ad',
    categoryId: 'security',
    title: 'ThreatHunter AD',
    edition: 'ECU Firmware TARA & Fuzzing Engine · v4.2',
    security: 'restricted',
    securityLabel: 'Restricted',
    highlightTitle: 'Autonomous Bus Protocol Fuzzing & TARA',
    highlightDesc: 'Automates Threat Analysis & Risk Assessment (TARA), executing automated attack scenarios on virtual ECU interfaces.',
    metrics: '32 teams active (840 automated fuzzing sessions/mo)',
    description: 'AI-guided fuzzing engine and threat modeler designed to discover zero-day attack surfaces in automotive telematics, V2X, and infotainment gateway stacks.',
    useCases: [
      'Automated generation of UNECE R155 / ISO 21434 cybersecurity compliance dossiers.',
      'Intelligent fuzz testing of SOME/IP and UDS diagnostic services.',
      'Attack graph modeling for compromised gateway scenarios.'
    ],
    integrations: 'Vector CANoe Cybersecurity, Synopsys Defensics, GitLab Security Dashboard.',
    licensing: 'High-security specialist license (Product Cybersecurity Office).',
    approvedProjects: 'All connected vehicle architectures, Telematics Box (T-Box), and Gateway ECUs.',
    dataRestrictions: 'Vulnerability exploit payloads classified Secret; strictly sandboxed hardware rigs.',
    ownerName: 'N. Zhao (Cybersecurity Testing Lead)',
    ownerEmail: 'n.zhao@stellantis.com',
    stepper: {
      step1: 'Complete (Captured)',
      step2: 'Chief Security Officer Authorization',
      step3: 'Hardware Sandbox & Fuzzer Node Provisioning (5 days)'
    }
  },
  {
    id: 'autosar_crypto_guard',
    categoryId: 'security',
    title: 'CryptoGuard HSM',
    edition: 'UNECE R155 Key & Certificate Validator · v2.0',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Automotive Root-of-Trust & Certificate Manager',
    highlightDesc: 'Verifies Hardware Security Module (HSM) secure boot chains, key storage schemas, and OTA firmware cryptographic integrity.',
    metrics: '54 teams active (98.9% secure boot pass rate)',
    description: 'Hardware security integration assistant that validates HSM firmware interfaces (SHE/EVITA standards) and verifies asymmetric key generation.',
    useCases: [
      'Automated validation of HSM cryptomodule firmware integration against AUTOSAR SecOC standards.',
      'Certificate expiry tracking and automated renewal for connected fleet PKI infrastructures.',
      'Zero-trust cryptographic gating for production software binary releases.'
    ],
    integrations: 'HashiCorp Vault, Stellantis PKI Infrastructure, Lauterbach HSM debugger.',
    licensing: 'Central Security Infrastructure allocation.',
    approvedProjects: 'All vehicle ECUs implementing Secure Boot, SecOC, or OTA capabilities.',
    dataRestrictions: 'Cryptographic keys never exposed; only public certificates and validation attestations processed.',
    ownerName: 'O. Dubois (Vehicle Cryptography Lead)',
    ownerEmail: 'o.dubois@stellantis.com',
    stepper: {
      step1: 'Complete (Recorded)',
      step2: 'PKI Security Group Approval',
      step3: 'HSM Simulator Key Ring Access (24h)'
    }
  },

  // 10. Product Management Tools (2)
  {
    id: 'roadmapgenie',
    categoryId: 'product',
    title: 'RoadmapGenie',
    edition: 'Agile Story & Backlog Engine · v2.2',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'AI Story Splitting & INVEST Validator',
    highlightDesc: 'Feeds Backlog & Requirements Engines with structured user stories, Gherkin acceptance criteria, and INVEST validation scores.',
    metrics: '19 teams active (312 epics INVEST scored)',
    description: 'Automates user story splitting, INVEST quality auditing, and Gherkin acceptance criteria drafting; feeds the Backlog & Requirements Engines directly.',
    useCases: [
      'Splits high-level autonomous driving PRD epics into INVEST-compliant user stories.',
      'Automates Gherkin acceptance test criteria generation from NCAP protocol specifications.',
      'Direct integration pipeline to Requirements Engine (AI) in Tab 4.'
    ],
    integrations: 'Jira Software Cloud, Azure DevOps, Miro roadmapping boards, Slack channels.',
    licensing: 'Agile Tooling Suite Enterprise Allocation.',
    approvedProjects: 'All Software & AD Product Backlog Management teams.',
    dataRestrictions: 'Internal confidential product backlogs and release roadmap milestones.',
    ownerName: 'E. Marchetti (Agile Product Operations Lead)',
    ownerEmail: 'e.marchetti@stellantis.com',
    stepper: {
      step1: 'Complete (PM Portal)',
      step2: 'Agile PM Lead Endorsement',
      step3: 'Jira Workspace Plugin Enabled (24h SLA)'
    }
  },
  {
    id: 'ad_feature_impact',
    categoryId: 'product',
    title: 'FeatureImpact Predictor',
    edition: 'AD Release Risk & Capacity Forecaster · v1.7',
    security: 'internal',
    securityLabel: 'Internal Only',
    highlightTitle: 'Safety Testing Latency & Risk Forecaster',
    highlightDesc: 'Analyzes proposed feature scope changes and forecasts HIL test rig capacity impact and release readiness delivery risk.',
    metrics: '14 programs active (92% sprint delivery forecast accuracy)',
    description: 'Predictive machine learning forecaster that correlates feature scope additions with historic bug density, HIL simulation run times, and safety sign-off latencies.',
    useCases: [
      'Forecasts verification lag time and HIL rig bottleneck risk when new AD features are scheduled.',
      'Predicts release readiness milestone slip probability based on code commit velocity.',
      'Optimizes sprint capacity allocation between feature development and safety debt remediation.'
    ],
    integrations: 'Jira Software, GitHub commit stream, Jenkins test metrics, Persona Dashboard API.',
    licensing: 'Product Operations Suite allocation.',
    approvedProjects: 'All Autonomous Driving Release Programs (Release 4.2, Release 3.4).',
    dataRestrictions: 'Aggregated sprint analytics only; personal developer performance data scrubbed.',
    ownerName: 'M. Santoro (Product Delivery Director)',
    ownerEmail: 'm.santoro@stellantis.com',
    stepper: {
      step1: 'Complete (Auto-logged)',
      step2: 'Program PM Lead Sign-Off',
      step3: 'Program Capacity Model Activation (24h)'
    }
  }
];

export default function AdAiToolsCatalogue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSecurity, setSelectedSecurity] = useState('all');
  const [viewMode, setViewMode] = useState('shelves'); // 'shelves' | 'grid'

  // Modals and Drawer state
  const [activeDrawerTool, setActiveDrawerTool] = useState(null);
  const [subscribeModalTool, setSubscribeModalTool] = useState(null);
  const [guideModalTool, setGuideModalTool] = useState(null);
  const [isNewToolModalOpen, setIsNewToolModalOpen] = useState(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState(false);

  // Subscription Form state
  const [subTeam, setSubTeam] = useState('AI for AD Perception & Planning');
  const [subProject, setSubProject] = useState('Release 4.2 Program (ASIL-D)');
  const [subSeats, setSubSeats] = useState(5);
  const [subJustification, setSubJustification] = useState('Required for upcoming sprint HIL testbed automation and ISO 26262 compliance review.');

  // New Tool Form state
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('coding');
  const [newToolVendor, setNewToolVendor] = useState('');
  const [newToolJustification, setNewToolJustification] = useState('');

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, icon = Sparkles) => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.categoryId !== selectedCategory) {
        return false;
      }
      // Security filter
      if (selectedSecurity !== 'all' && tool.security !== selectedSecurity) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tool.title.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesHighlight = tool.highlightTitle.toLowerCase().includes(q) || tool.highlightDesc.toLowerCase().includes(q);
        const matchesIntegrations = tool.integrations.toLowerCase().includes(q);
        const matchesCategory = tool.categoryId.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesHighlight && !matchesIntegrations && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedSecurity]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: TOOLS_DATA.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = TOOLS_DATA.filter((t) => t.categoryId === cat.id).length;
    });
    return counts;
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSecurity('all');
  };

  const handleOpenSubscribe = (tool) => {
    setSubscribeModalTool(tool);
    if (activeDrawerTool) setActiveDrawerTool(null);
  };

  const handleOpenGuide = (tool) => {
    setGuideModalTool(tool);
    if (activeDrawerTool) setActiveDrawerTool(null);
  };

  const handleConfirmSubscription = (e) => {
    e.preventDefault();
    if (!subscribeModalTool) return;
    const toolTitle = subscribeModalTool.title;
    const owner = subscribeModalTool.ownerName;
    setSubscribeModalTool(null);
    showToast(`Subscription requested for ${toolTitle} (${subSeats} seats) on ${subProject}. Routed to ${owner}.`, CheckCircle2);
  };

  const handleCopyGuideSnippet = () => {
    if (!guideModalTool) return;
    const snippet = `# Stellantis CI/CD Pipeline Integration: ${guideModalTool.title}
# Environment: EU-Frankfurt Sovereign Cluster (ISO 26262 Gate)
tool_integration:
  name: "${guideModalTool.title}"
  version: "${guideModalTool.edition}"
  endpoint: "https://tools.ad.stellantis.internal/v1/${guideModalTool.id}/webhook"
  auth_header: "Bearer \${STELLANTIS_TOOL_TOKEN}"
  compliance_check:
    enabled: true
    block_on_violation: true
    telemetry_egress: "PROHIBITED"
  target_cluster: "hil-rig-balocco-01"
  security_tier: "${guideModalTool.security.toUpperCase()}"`;

    navigator.clipboard?.writeText(snippet);
    showToast('Integration configuration YAML copied to clipboard.', Copy);
  };

  const handleProposeNewTool = (e) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    const name = newToolName;
    setIsNewToolModalOpen(false);
    setNewToolName('');
    setNewToolVendor('');
    setNewToolJustification('');
    showToast(`Tool evaluation request submitted for "${name}". Routed to Engineering Architecture Council.`, CheckCircle2);
  };

  return (
    <div className="ad-tools-container">
      {/* 1. Header Box */}
      <div className="ad-tools-header">
        <div className="ad-tools-header-left">
          <div className="ad-tools-header-icon">
            <Wrench size={22} />
          </div>
          <div className="ad-tools-header-text">
            <div className="ad-tools-title-row">
              <h2 className="ad-tools-title">AI Tools &amp; Engineering Capabilities Catalogue</h2>
              <span className="ad-tools-header-badge">
                10 Lifecycle Categories · {TOOLS_DATA.length} Curated Tools
              </span>
            </div>
            <p className="ad-tools-header-subtitle">
              Curated automotive engineering toolchain spanning embedded coding, HIL testbeds, ISO 21434 cybersecurity, and safety-case indexing.
            </p>
            <div className="ad-tools-header-subactions">
              <div className="ad-tools-stat-pill">
                <span className="ad-tools-indicator-dot"></span>
                <span>{TOOLS_DATA.length} Enterprise Licenses Active</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewToolModalOpen(true)}
                className="ad-tools-btn-primary"
              >
                <Plus size={14} />
                <span>Request New Tool</span>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Glowing Flowing Border SEL Nexus Button - Centered on height on right */}
        <div className="ad-tools-header-nexus-slot">
          <button
            type="button"
            onClick={() => setIsNexusModalOpen(true)}
            className="ad-sel-nexus-btn"
            title="Invoke SEL Nexus Automation Pipeline"
          >
            <span className="ad-sel-nexus-btn-inner">
              <Zap size={17} className="ad-sel-nexus-btn-icon" />
              <span>SEL Nexus</span>
            </span>
          </button>
        </div>
      </div>

      {/* 2. Toolbar, Search & Category Filter Chips */}
      <div className="ad-tools-toolbar-box">
        <div className="ad-tools-search-row">
          <div className="ad-tools-search-wrapper">
            <Search size={15} className="ad-tools-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tools across 10 lifecycle categories (e.g. MISRA-C, HIL, ISO 21434, telemetry)..."
              className="ad-tools-search-input"
            />
          </div>

          <select
            value={selectedSecurity}
            onChange={(e) => setSelectedSecurity(e.target.value)}
            className="ad-tools-filter-select"
          >
            <option value="all">All Security Tiers</option>
            <option value="internal">Internal Only</option>
            <option value="restricted">Restricted</option>
            <option value="public">Public</option>
          </select>

          <div className="ad-tools-view-toggle">
            <button
              onClick={() => setViewMode('shelves')}
              className={`ad-tools-toggle-btn ${viewMode === 'shelves' ? 'active' : ''}`}
              title="Horizontal Shelves (App Store View)"
            >
              <AlignJustify size={14} />
              <span>Shelves</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`ad-tools-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Compact Card Grid"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedSecurity !== 'all') && (
            <button onClick={handleResetFilters} className="ad-tools-btn-reset">
              Reset Filters
            </button>
          )}

          <div className="ad-tools-count-pill">
            {filteredTools.length} of {TOOLS_DATA.length} Tools Match
          </div>
        </div>

        {/* Quick Category Jump Chips */}
        <div className="ad-tools-chips-row">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`ad-tools-chip ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            All 10 Categories ({categoryCounts.all})
          </button>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`ad-tools-chip ${isActive ? 'active' : ''}`}
              >
                {cat.num}. {cat.name} ({categoryCounts[cat.id] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Content: Shelves View vs Grid View */}
      {viewMode === 'shelves' ? (
        <div className="ad-tools-shelves-container">
          {CATEGORIES.map((cat) => {
            const shelfTools = filteredTools.filter((t) => t.categoryId === cat.id);
            if (shelfTools.length === 0) return null;
            const CatIcon = cat.icon;

            return (
              <section key={cat.id} className="ad-tools-shelf" id={`shelf-${cat.id}`}>
                <div className="ad-tools-shelf-header">
                  <div className="ad-tools-shelf-header-left">
                    <span className="ad-tools-shelf-num">{cat.num}</span>
                    <h3 className="ad-tools-shelf-title">
                      Shelf {cat.num}: {cat.name}
                    </h3>
                    <span className="ad-tools-shelf-desc">· {cat.desc}</span>
                  </div>
                  <span className="ad-tools-shelf-count">
                    {shelfTools.length} {shelfTools.length === 1 ? 'Featured Tool' : 'Featured Tools'}
                  </span>
                </div>

                <div className="ad-tools-shelf-track">
                  {shelfTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onOpenProfile={() => setActiveDrawerTool(tool)}
                      onOpenSubscribe={() => handleOpenSubscribe(tool)}
                      onOpenGuide={() => handleOpenGuide(tool)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
          {filteredTools.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No AI tools found matching current filters.</p>
              <button onClick={handleResetFilters} className="ad-tools-btn-primary" style={{ margin: '12px auto 0 auto' }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Compact Grid View */
        <div className="ad-tools-grid-mode">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpenProfile={() => setActiveDrawerTool(tool)}
              onOpenSubscribe={() => handleOpenSubscribe(tool)}
              onOpenGuide={() => handleOpenGuide(tool)}
            />
          ))}
          {filteredTools.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No AI tools found matching current filters.</p>
              <button onClick={handleResetFilters} className="ad-tools-btn-primary" style={{ margin: '12px auto 0 auto' }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================================================
          SLIDE-OVER TOOL PROFILE DRAWER (PRD §5.5 Part 2 & 3)
          ========================================================================== */}
      {activeDrawerTool && (
        <div className="ad-tools-drawer-backdrop" onClick={() => setActiveDrawerTool(null)}>
          <div className="ad-tools-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ad-tools-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="ad-tool-icon-box" style={{ width: '42px', height: '42px' }}>
                  <Wrench size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                      {activeDrawerTool.title}
                    </h3>
                    <span className={`ad-tool-sec-pill ${activeDrawerTool.security}`}>
                      {activeDrawerTool.securityLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {activeDrawerTool.edition}
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveDrawerTool(null)} className="ad-tools-drawer-close">
                <X size={16} />
              </button>
            </div>

            <div className="ad-tools-drawer-body">
              {/* Description & Overview */}
              <div className="ad-tools-drawer-section">
                <span className="ad-tools-drawer-label">Tool Description &amp; Scope</span>
                <div className="ad-tools-drawer-box">
                  {activeDrawerTool.description}
                </div>
              </div>

              {/* Primary Use Cases */}
              <div className="ad-tools-drawer-section">
                <span className="ad-tools-drawer-label">Key Engineering Use Cases</span>
                <ul className="ad-tools-usecase-list">
                  {activeDrawerTool.useCases.map((uc, i) => (
                    <li key={i} className="ad-tools-usecase-item">
                      <CheckCircle2 size={15} className="ad-tools-usecase-icon" />
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Metadata Grid */}
              <div className="ad-tools-meta-grid">
                <div className="ad-tools-meta-item">
                  <span className="ad-tools-meta-sublabel">Integration Requirements</span>
                  <span className="ad-tools-meta-value">{activeDrawerTool.integrations}</span>
                </div>
                <div className="ad-tools-meta-item">
                  <span className="ad-tools-meta-sublabel">Licensing Model</span>
                  <span className="ad-tools-meta-value">{activeDrawerTool.licensing}</span>
                </div>
                <div className="ad-tools-meta-item">
                  <span className="ad-tools-meta-sublabel">Approved Project Types</span>
                  <span className="ad-tools-meta-value">{activeDrawerTool.approvedProjects}</span>
                </div>
                <div className="ad-tools-meta-item">
                  <span className="ad-tools-meta-sublabel">Data-Handling Restrictions</span>
                  <span className="ad-tools-meta-value">{activeDrawerTool.dataRestrictions}</span>
                </div>
              </div>

              {/* Stepper Progress */}
              <div className="ad-tools-drawer-section">
                <span className="ad-tools-drawer-label">3-Step Provisioning Workflow</span>
                <div className="ad-tools-stepper">
                  <div className="ad-tools-step-item">
                    <div className="ad-tools-step-num">1</div>
                    <div className="ad-tools-step-content">
                      <span className="ad-tools-step-title">Step 1: Request Submitted</span>
                      <span className="ad-tools-step-status">{activeDrawerTool.stepper.step1}</span>
                    </div>
                  </div>
                  <div className="ad-tools-step-item">
                    <div className="ad-tools-step-num">2</div>
                    <div className="ad-tools-step-content">
                      <span className="ad-tools-step-title">Step 2: Engineering Review</span>
                      <span className="ad-tools-step-status">{activeDrawerTool.stepper.step2}</span>
                    </div>
                  </div>
                  <div className="ad-tools-step-item">
                    <div className="ad-tools-step-num">3</div>
                    <div className="ad-tools-step-content">
                      <span className="ad-tools-step-title">Step 3: Provisioning &amp; Token</span>
                      <span className="ad-tools-step-status">{activeDrawerTool.stepper.step3}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Lead Info */}
              <div className="ad-tools-drawer-section">
                <span className="ad-tools-drawer-label">Designated Support Owner</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated, #0b1a30)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, border: '1px solid var(--border-color)' }}>
                      {activeDrawerTool.ownerName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeDrawerTool.ownerName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{activeDrawerTool.ownerEmail}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Opened internal chat ticket to ${activeDrawerTool.ownerEmail}`, Mail)}
                    className="ad-tool-btn-guide"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
                  >
                    <Mail size={13} />
                    <span>Contact Lead</span>
                  </button>
                </div>
              </div>

              {/* Usage & Adoption Readout */}
              <div className="ad-tools-drawer-section">
                <span className="ad-tools-drawer-label">Adoption &amp; Usage Telemetry</span>
                <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'var(--badge-info-bg)', border: '1px solid var(--badge-info-border)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--badge-info-text)' }}>
                  {activeDrawerTool.metrics}
                </div>
              </div>
            </div>

            <div className="ad-tools-drawer-footer">
              <button
                onClick={() => handleOpenGuide(activeDrawerTool)}
                className="ad-tools-btn-cancel"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <CodeIcon size={14} />
                <span>Integration Guide</span>
              </button>
              <button
                onClick={() => handleOpenSubscribe(activeDrawerTool)}
                className="ad-tools-btn-submit"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span>Request Subscription</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          SUBSCRIPTION REQUEST MODAL (PRD §5.5 Part 3)
          ========================================================================== */}
      {subscribeModalTool && (
        <div className="ad-tools-modal-backdrop" onClick={() => setSubscribeModalTool(null)}>
          <div className="ad-tools-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-tools-modal-header">
              <div>
                <h3 className="ad-tools-modal-title">Request Tool Subscription</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {subscribeModalTool.title} · {subscribeModalTool.edition}
                </span>
              </div>
              <button onClick={() => setSubscribeModalTool(null)} className="ad-tools-drawer-close">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubscription} className="ad-tools-modal-body">
              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Subscribing Team Context</label>
                <input
                  type="text"
                  value={subTeam}
                  onChange={(e) => setSubTeam(e.target.value)}
                  className="ad-tools-form-input"
                  required
                />
              </div>

              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Target Program / Vehicle Project</label>
                <select
                  value={subProject}
                  onChange={(e) => setSubProject(e.target.value)}
                  className="ad-tools-form-select"
                >
                  <option value="Release 4.2 Program (ASIL-D)">Release 4.2 Program (ASIL-D Level 2+)</option>
                  <option value="Next-Gen Perception R&D (Radar-Vision)">Next-Gen Perception R&D (Radar-Vision Fusion)</option>
                  <option value="Release 3.4 Maintenance (Highway Assist)">Release 3.4 Maintenance (Highway Assist)</option>
                  <option value="STLA Brain SDV Platform v2">STLA Brain SDV Platform v2</option>
                  <option value="Urban Pilot L3 Pilot Initiative">Urban Pilot L3 Pilot Initiative</option>
                </select>
              </div>

              <div className="ad-tools-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="ad-tools-form-label">Requested Seat Allocation</label>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#0369a1' }}>
                    {subSeats} Licenses
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={subSeats}
                  onChange={(e) => setSubSeats(parseInt(e.target.value, 10))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Business Justification &amp; Milestones</label>
                <textarea
                  value={subJustification}
                  onChange={(e) => setSubJustification(e.target.value)}
                  className="ad-tools-form-textarea"
                  required
                />
              </div>

              <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Approval Routing:</div>
                Request will be routed to <strong>{subscribeModalTool.ownerName}</strong> ({subscribeModalTool.ownerEmail}) under <strong>{subscribeModalTool.licensing}</strong>. Standard SLA: 24–48 hours.
              </div>

              <div className="ad-tools-modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                <button
                  type="button"
                  onClick={() => setSubscribeModalTool(null)}
                  className="ad-tools-btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="ad-tools-btn-submit">
                  Submit Subscription Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================================
          INTEGRATION GUIDE MODAL (PRD §5.5 Part 3)
          ========================================================================== */}
      {guideModalTool && (
        <div className="ad-tools-modal-backdrop" onClick={() => setGuideModalTool(null)}>
          <div className="ad-tools-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="ad-tools-modal-header">
              <div>
                <h3 className="ad-tools-modal-title">{guideModalTool.title} Integration Guide</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Stellantis CI/CD Pipeline &amp; Webhook Setup
                </span>
              </div>
              <button onClick={() => setGuideModalTool(null)} className="ad-tools-drawer-close">
                <X size={15} />
              </button>
            </div>

            <div className="ad-tools-modal-body">
              <div style={{ fontSize: '0.74rem', color: '#334155' }}>
                Add the following configuration to your project&apos;s <code>.stellantis-ci.yml</code> or Bazel workspace configuration:
              </div>

              <div className="ad-tools-code-block">
{`# Stellantis CI/CD Pipeline Integration: ${guideModalTool.title}
# Environment: EU-Frankfurt Sovereign Cluster (ISO 26262 Gate)
tool_integration:
  name: "${guideModalTool.title}"
  version: "${guideModalTool.edition}"
  endpoint: "https://tools.ad.stellantis.internal/v1/${guideModalTool.id}/webhook"
  auth_header: "Bearer \${STELLANTIS_TOOL_TOKEN}"
  compliance_check:
    enabled: true
    block_on_violation: true
    telemetry_egress: "PROHIBITED"
  target_cluster: "hil-rig-balocco-01"
  security_tier: "${guideModalTool.security.toUpperCase()}"`}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--badge-success-bg)', border: '1px solid var(--badge-success-border)', fontSize: '0.72rem', color: 'var(--badge-success-text)' }}>
                <span>Certified for ASIL-D production build gating.</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>v{guideModalTool.edition.split('v')[1] || '1.0'}</span>
              </div>
            </div>

            <div className="ad-tools-modal-footer">
              <button
                onClick={handleCopyGuideSnippet}
                className="ad-tools-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Copy size={13} />
                <span>Copy Configuration</span>
              </button>
              <button
                onClick={() => setGuideModalTool(null)}
                className="ad-tools-btn-cancel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          REQUEST NEW TOOL PROPOSAL MODAL
          ========================================================================== */}
      {isNewToolModalOpen && (
        <div className="ad-tools-modal-backdrop" onClick={() => setIsNewToolModalOpen(false)}>
          <div className="ad-tools-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-tools-modal-header">
              <div>
                <h3 className="ad-tools-modal-title">Propose New Engineering Tool</h3>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Submit candidate software for Stellantis Automotive Toolchain onboarding
                </span>
              </div>
              <button onClick={() => setIsNewToolModalOpen(false)} className="ad-tools-drawer-close">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleProposeNewTool} className="ad-tools-modal-body">
              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Tool / Software Name</label>
                <input
                  type="text"
                  placeholder="e.g. Synopsys Coverity 2026, dSPACE Automotive Studio"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="ad-tools-form-input"
                  required
                />
              </div>

              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Lifecycle Discipline</label>
                <select
                  value={newToolCategory}
                  onChange={(e) => setNewToolCategory(e.target.value)}
                  className="ad-tools-form-select"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.num}. {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Vendor or Open-Source Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Vector Informatik, NVIDIA, Internal Stellantis R&D"
                  value={newToolVendor}
                  onChange={(e) => setNewToolVendor(e.target.value)}
                  className="ad-tools-form-input"
                />
              </div>

              <div className="ad-tools-form-group">
                <label className="ad-tools-form-label">Technical Justification &amp; Benefit</label>
                <textarea
                  placeholder="Explain why this tool is required and how it augments our AD engineering efficiency..."
                  value={newToolJustification}
                  onChange={(e) => setNewToolJustification(e.target.value)}
                  className="ad-tools-form-textarea"
                  required
                />
              </div>

              <div className="ad-tools-modal-footer" style={{ padding: '12px 0 0 0', background: 'transparent' }}>
                <button
                  type="button"
                  onClick={() => setIsNewToolModalOpen(false)}
                  className="ad-tools-btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="ad-tools-btn-submit">
                  Submit Tool Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SEL Nexus Automation Flow (Green Field & Brownfield Pipeline) */}
      {isNexusModalOpen && (
        <SelNexusFlow
          isOpen={isNexusModalOpen}
          onClose={() => setIsNexusModalOpen(false)}
          onToast={showToast}
        />
      )}

      {/* 4. Bottom-Right Floating Toast Alert */}
      {toast && (
        <div className="ad-tools-toast">
          <toast.icon size={16} className="ad-tools-toast-icon" />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ad-tools-toast-close">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Tool Card Component
 */
function ToolCard({ tool, onOpenProfile, onOpenSubscribe, onOpenGuide }) {
  return (
    <div className="ad-tool-card">
      <div className="ad-tool-card-top">
        <div className="ad-tool-card-header">
          <div className="ad-tool-card-identity">
            <div className="ad-tool-icon-box">
              <Wrench size={18} />
            </div>
            <div>
              <h4 className="ad-tool-name">{tool.title}</h4>
              <span className="ad-tool-edition">{tool.edition}</span>
            </div>
          </div>
          <span className={`ad-tool-sec-pill ${tool.security}`}>
            {tool.securityLabel}
          </span>
        </div>

        <div className="ad-tool-capability-box">
          <div className="ad-tool-capability-title">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
            <span>{tool.highlightTitle}</span>
          </div>
          <p className="ad-tool-capability-desc">{tool.highlightDesc}</p>
        </div>

        <div className="ad-tool-metric-row">
          <span>Adoption / Scope:</span>
          <span className="ad-tool-metric-val">{tool.metrics}</span>
        </div>
      </div>

      <div className="ad-tool-card-actions">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button onClick={onOpenSubscribe} className="ad-tool-btn-sub">
            Request Subscription
          </button>
          <button onClick={onOpenGuide} className="ad-tool-btn-guide">
            View Guide
          </button>
        </div>
        <button onClick={onOpenProfile} className="ad-tool-btn-profile">
          <span>Profile</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function CodeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}
