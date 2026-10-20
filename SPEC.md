# Feature Specification: Asset 360 Investigation Workspace

## User Scenarios & Testing

### User Stories

1. Search equipment by tag, external ID, name or description, with enough parent/space context to disambiguate.
2. Open one shareable investigation showing identity, related series, recent activities and documents.
3. Select series and investigate historical behavior without opening a historian.
4. Read activities and preview documentation without leaving the investigation.
5. Return to the last 10 assets opened on this device.

### Acceptance Scenarios

- Search is ranked and keyboard accessible; no match shows refinement guidance.
- Selecting a result opens its 360 view. A host-generated shared link restores the asset by **space and externalId**, series selection, range and open details.
- All linked series are listed with pagination; none is selected by default.
- The common chart window ends at the **maximum latest timestamp across selected series**, using the chosen duration. Never anchor historical data to wall-clock now.
- Selection/range changes fetch data. Refresh is manual, with no polling, streaming or focus refetch.
- Distinguish no datapoints, no samples in the chosen window and unsupported series types individually.
- Activities show identifier, title, recency and honest unavailable status. Selecting a row opens all retrieved details in place.
- Preview PDF, PNG, JPEG, GIF and WEBP inline. Other types offer external open/download. Unuploaded files show unavailable content.
- Each panel has independent loading, empty, retryable error and 403/no-access states; one failure never hides other panels.
- Recent history persists in localStorage, newest first, deduplicated by (space, externalId) and capped at 10. Storage failure cannot crash the app. Opening a recent asset revalidates it through CDF. Allow clearing history.
- An application error boundary offers recovery after an uncaught render error.

## Requirements

### Functional Requirements

- FR-001: Ranked CogniteAsset search including partial/full external IDs.
- FR-001a: A manual "Find an asset with signals" action samples up to 25 numeric time series with asset relations and offers the related assets. This bounded discovery aid does not guarantee available history or documents.
- FR-001b: A manual "Find an asset with documents" action searches at most 5 pages of 100 uploaded files with asset relations, then at most 5 pages of any linked file metadata if no IDs were found. It stops on the first actual linked asset IDs. This is bounded discovery, not a complete inventory; a linked record may not have uploaded content.
- FR-002: Results show identity, description, parent and instance space.
- FR-003: Deep links use host syncInternalState/initialState and preserve both identity fields.
- FR-004: Header shows externalId/tag, name, description, type and parent from CDF where available.
- FR-005: Paginate all linked series; none plotted initially. Anchor at latest selected datapoint.
- FR-006: Select/deselect series and choose 1h/24h/7d/30d windows in place.
- FR-006a: Explicit empty states per selected series; chart numeric series, clearly label unsupported string/state series in v1.
- FR-006b: Manual refresh only; bounded history aggregation with aggregation labeled.
- FR-007: Read CogniteActivity, sorted by endTime, scheduledEndTime, startTime or scheduledStartTime descending, missing dates last. Status is unavailable because the core view has no status property.
- FR-008: Activity detail opens without leaving the workspace.
- FR-009: Files show name, MIME type and sourceUpdatedTime (fallback instance lastUpdatedTime, with an appropriate label).
- FR-010: Inline PDF/common-image preview; other types open via the host. Resolve a fresh authorized download link on demand; never persist it.
- FR-010a: Classify inline preview MIME types consistently, ignoring capitalization, surrounding whitespace and parameters such as charset; parameterized PDFs must use the PDF viewer rather than the image renderer.
- FR-011: Independent loading, empty, error/retry and no-access states for lists, chart and preview.
- FR-012: Persist at most 10 recent assets per device; no cross-device sync.
- FR-013: Authenticate with CogniteSdkProvider and the Flows host. No tokens/secrets in code or localStorage.
- FR-014: All production domain data comes live from the authenticated CDF project. Fixtures are test-only, with no demo fallback.
- FR-015: Fit desktop/laptop screens at 1280px and above without page horizontal scrolling; wrap responsively below that.
- FR-015a: Related activity and document tables must keep long action labels inside their cells, preserve the full accessible label and detail action, and give identifiers/status/dates appropriate column widths. Stack these panels at supported desktop widths and constrain large lists to an independently scrollable table so hundreds of rows do not expand the entire page.
- FR-016: Root and panel error boundaries with recovery controls.

## Success Criteria

Workshop targets, not measured results:

- SC-001: Find and inspect an asset in under 30 seconds.
- SC-002: Complete at least 80% of investigations without other siloed tools.
- SC-003: Median investigation under 15 minutes versus a 1-2 hour baseline.
- SC-004: Header and all panels show content or accurate states within 3 seconds on a representative office network.
- SC-005: At least 90% of weekly sessions search and open a document.
- SC-006: At least 95% of sessions with one unavailable source still render remaining panels.

## Clarifications

- One common time axis ends at the maximum latest timestamp. Older selected series may have no samples inside that window; explain this explicitly.
- Activities represent work orders; no SAP calls and no invented status or custom views.
- cdf_cdm hosts views; instance spaces come from actual results and must not be assumed equal to cdf_cdm.
- Reverse traversal through a list of direct relations is unsupported. Filter the owning view's assets property with containsAny and the selected (space, externalId), paginate and deduplicate.
- Cognite Docs MCP is configured at https://docs.cognite.com/mcp. This session uses scripts/cognite-docs.mjs because native Cognite tools are not exposed.

## Assumptions

- App-Brief.md records the user-confirmed case and facts. Publicdata access is confirmed by the user; live data and effective permissions need an authenticated Fusion check.
- Read-only CDF integration. No writes to schema, instances, SAP, historians or SharePoint.
- Mobile optimization, editing, provisioning, alerts and cross-device history are outside v1.
- Certification requires real data, clean reviews and formal submission with repository, deployment and demo links. Local build success alone is insufficient.

---

## Data Models & CDF Integration *(mandatory)*

### Existing views

All in cdf_cdm, version v1:

| View | Fields / use |
| --- | --- |
| CogniteAsset | name, description, tags, aliases, sourceId, parent, type; externalId is a node system field |
| CogniteAssetType | name for optional asset type relation |
| CogniteTimeSeries | name, description, assets, type, isStep, sourceUnit; datapoints queried by instanceId |
| CogniteActivity | name, description, sourceId, assets, startTime, endTime, scheduledStartTime, scheduledEndTime; no status |
| CogniteFile | name, description, mimeType, assets, isUploaded, sourceUpdatedTime; file links by instanceId |

### New views

None. No schema changes.

### Spaces

- Schema: cdf_cdm (read-only).
- Instances: spaces returned by CDF; preserve exact space for every ID, filter and navigation state.
- Only recent asset identities/labels persist locally; host owns URL state.

### Documentation verified

Official Cognite Docs MCP checked on 2026-10-19:

- [Core model](https://docs.cognite.com/cdf/dm/dm_reference/dm_core_data_model)
- [Direct relations and reverse-list limitation](https://docs.cognite.com/cdf/dm/dm_concepts/dm_spaces_instances#direct-relations-vs-edges)
- [Querying](https://docs.cognite.com/cdf/dm/dm_concepts/dm_querying)
- [Latest datapoints](https://docs.cognite.com/20230101/time-series/retrieve-latest-data-point)

Check installed SDK declarations before coding. Live acceptance is separate from documentation and automated tests.
