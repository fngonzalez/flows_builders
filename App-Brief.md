---
appName: "Asset 360 Investigation Workspace"
externalId: "asset-360"
infra: "appsApi"
customer: "Ejercicio de certificación con publicdata"
tier: "Tier 1: Monitoring & reporting"
owner: "fngonzalez <nahuelfedericog@gmail.com>"
userCount: ""
businessValue: "Target: reduce investigations from 1-2 hours to under 15 minutes."
milestones: ""
repoUrl: ""
userRole: "Operations Analyst or Reliability Engineer at an industrial facility, investigating equipment anomalies on a desktop or laptop in an office or control room."
currentProblem: "After an equipment tag is flagged, the analyst switches between SAP for work orders, a historian for sensor data and SharePoint for documents. An investigation takes 1-2 hours; spreadsheets and colleagues become unreliable shortcuts."
oneSentenceStory: "As an Operations Analyst, I want to search for a specific piece of equipment and instantly see its connected time series data, recent work orders, and related documents in one unified view, so that I can quickly understand its status without switching between five different systems."
successCriteria: "Find and inspect an asset within 30 seconds; reduce investigation time to under 15 minutes; search, chart and open a document from one workspace. Targets are not yet measured."
userEvidence: "Workshop assumption from the supplied Asset 360 example. No independent user interview has been conducted for this exercise."
reviewedSections:
  - appDetails
  - who
  - problem
  - tasksAndSuccess
---

# App Brief - Asset 360 Investigation Workspace

## App details

- **Customer:** Ejercicio de certificación con publicdata
- **Tier:** Tier 1: Monitoring & reporting
- **Owner:** fngonzalez <nahuelfedericog@gmail.com>
- **Expected users:** Not specified
- **Business value:** Target investigation time below 15 minutes, versus 1-2 hours.
- **Milestones:** Not specified
- **Repository:** Local only; remote URL not provided.
- **App externalId:** asset-360
- **Infra:** appsApi
- **Environment:** publicdata / publicdatacdm / https://api.cognitedata.com

## Who is this app for?

This application is designed for an Operations Analyst (or Reliability Engineer) working at an industrial facility. Their typical day: They start their morning reviewing daily shift reports or alarms. When an anomaly is flagged on a specific piece of equipment (e.g., a pump or compressor), it is their job to investigate its history, current state, and relevant documentation to brief the maintenance team. Environment: They work primarily at a desk in an office environment, occasionally visiting the control room. They use a standard desktop or laptop with a large monitor.

## What problem does this solve?

The specific moment of pain occurs right after an asset is flagged for review. The Analyst knows the equipment tag (e.g., "PUMP-101"), but to understand what is happening, they have to play "data detective." The breakdown: They have to log into SAP to see open work orders, open a separate historian tool to view live sensor data, and dig through a messy SharePoint drive to find the P&ID diagram. The workaround: Because this takes 1-2 hours per asset, they often rely on outdated Excel spreadsheets, ask colleagues on Teams for "tribal knowledge," or make decisions with incomplete data to save time.

## Tasks and success

**One-sentence story.** As an Operations Analyst, I want to search for a specific piece of equipment and instantly see its connected time series data, recent work orders, and related documents in one unified view, so that I can quickly understand its status without switching between five different systems.

**Success criteria.** The analyst searches an asset, views a time-series chart and opens an associated file from the same dashboard, reducing investigation time from hours to minutes. Measurable workshop targets are recorded in SPEC.md; none have been validated yet.

**User evidence.** Because this is a generalized Tier 1 Certification App, this need is a highly informed assumption based on aggregated historical data rather than a single direct user interview. Across dozens of real-world CDF deployments, the "Asset 360" pattern (unifying SAP work orders, historian data, and P&ID files) is consistently the most requested first-value use case. We are simulating this universally understood industrial pain point to ensure the certification exercise is directly relevant to what developers will actually be asked to build in the field.

The preceding examples are from the supplied workshop guide, not independent research performed for this project. The user confirmed this case, customer, owner and tier on 2026-10-19.
