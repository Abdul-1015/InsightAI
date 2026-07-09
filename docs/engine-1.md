# Engine 1 — Analytics Engine

## Overview

Engine 1 is the deterministic analytics engine that powers InsightAI.

Its responsibility is to transform an uploaded dataset into a fully structured
DashboardSpec without using any AI or LLMs.

The output of Engine 1 is deterministic:
- Same input dataset
- Same DashboardSpec
- No randomness
- No AI dependency

This keeps dashboard generation fast, explainable and inexpensive.

---

# Pipeline

Upload
    │
    ▼
Parser
    │
    ▼
Semantic Engine
    │
    ▼
Statistical Profiling
    │
    ▼
Pattern Discovery
    │
    ▼
KPI Discovery
    │
    ▼
Visualization Recommendation
    │
    ▼
Dashboard Layout
    │
    ▼
DashboardSpec Generator

---

# Module Responsibilities

## 1. Parser

Responsible for:

- Reading CSV/XLSX
- Extracting rows
- Detecting column names
- Detecting primitive data types
- Counting rows

Output:

- Parsed dataset

---

## 2. Semantic Engine

Responsible for understanding what each column represents.

Examples:

Revenue → Currency

Country → Geography

Order Date → Timeline

Email → Email

Customer ID → Identifier

Output:

semantic.json

---

## 3. Statistical Profiling

Responsible for generating statistics.

Examples:

- Mean
- Median
- Min
- Max
- Standard deviation
- Null %
- Unique %
- Top values

Output:

profile.json

---

## 4. Pattern Discovery

Responsible for discovering patterns.

Examples:

- Correlations
- Outliers
- Skewness
- Missing data
- Candidate dimensions
- Candidate measures

Output:

patterns.json

---

## 5. KPI Discovery

Responsible for determining important metrics.

Examples:

Revenue

Average Price

Total Sales

Average Quantity

Each KPI includes:

- Aggregation
- Confidence
- Reason

Output:

kpis.json

---

## 6. Visualization Recommendation

Responsible for recommending charts.

Examples:

Line Chart

Bar Chart

Scatter Plot

Pie Chart

Histogram

KPI Card

Each recommendation includes:

- Chart type
- Axes
- Aggregation
- Confidence
- Reason

Output:

visualizations.json

---

## 7. Dashboard Layout

Responsible for arranging widgets.

Determines:

- Widget positions
- Widget sizes
- Priority
- Grid layout

Output:

layout.json

---

## 8. DashboardSpec Generator

Creates the final dashboard specification.

Output:

dashboardSpec.json

Contains:

- Dataset metadata
- KPIs
- Visualizations
- Layout
- Filters
- Metadata

DashboardSpec is the only object consumed by the frontend.

---

# Design Principles

Engine 1 must always be:

- Deterministic
- Fast
- Explainable
- Modular
- Strongly Typed
- Easy to Extend

Engine 1 must never:

- Call an LLM
- Depend on AI
- Generate UI
- Render React components

---

# Engine 2

Engine 2 is separate from Engine 1.

Engine 2 consumes DashboardSpec and provides:

- Dashboard explanations
- Business insights
- Q&A
- Recommendations
- AI chat

Engine 2 never generates dashboards.

It explains dashboards.

---

# Folder Structure

src/lib/analytics/

semantic/

profile/

patterns/

kpi/

visualizations/

layout/

dashboard/

---

# Data Flow

Dataset

↓

Semantic

↓

Profile

↓

Patterns

↓

KPIs

↓

Visualizations

↓

Layout

↓

DashboardSpec

↓

Frontend

↓

Engine 2 (AI)

---

# Future Improvements

Potential future enhancements:

- Forecasting
- Time-series decomposition
- Anomaly detection
- ML clustering
- Dashboard templates
- Industry-specific layouts
- Custom KPI rules
- User-defined metrics
- Dashboard themes