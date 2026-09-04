# ⚖️ LegalMetrix AI

### 🚀 AI-Powered Legal Metrology Compliance Checking System

> An intelligent inspection platform that analyzes packaged commodity labels using OCR, structured data extraction, and rule-based compliance validation to identify potential violations under India's Legal Metrology framework.

---

## 📌 About The Project

**LegalMetrix AI** is an AI-assisted compliance inspection system designed to automate the first-level inspection of packaged commodities.

The system allows an inspector to upload or capture images of packaged products. It then uses **Computer Vision and OCR** to extract information from the packaging and converts the extracted text into structured declarations.

The structured information is then passed to a **Compliance Rule Engine**, which checks the detected declarations against applicable requirements under the **Legal Metrology (Packaged Commodities) Rules, 2011**.

The system can identify potential issues such as:

- ❌ Missing mandatory declarations
- ⚠️ Incomplete declarations
- ⚠️ Incorrect or invalid formats
- ⚠️ Potential readability issues
- ⚠️ Potential font-size issues
- ⚠️ Other configured compliance violations

The platform also provides evidence, compliance summaries, inspection history, dashboards, and digital reports.

---

## 🎯 Core Concept

```text
📸 SCAN
   ↓
🔍 EXTRACT
   ↓
🧠 STRUCTURE
   ↓
⚖️ VALIDATE
   ↓
🚨 DETECT
   ↓
👁️ EVIDENCE
   ↓
📊 ANALYZE
   ↓
📄 REPORT


---


```md
# 🎯 Problem Statement

Packaged commodities are widely sold through retail stores, supermarkets, wholesale markets, and e-commerce platforms across India.

Under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011**, packaged commodities are required to display prescribed declarations and information.

These declarations may include:

- 📦 Name of the commodity
- ⚖️ Net quantity
- 💰 Maximum Retail Price (MRP)
- 🏭 Name and address of manufacturer/packer/importer
- 📅 Applicable date information
- 📞 Consumer-care details
- 🌍 Country of origin where applicable
- 💵 Unit sale price where applicable
- 📋 Other applicable declarations

## 🚨 Existing Challenges

Manual inspection of packaged commodities creates several challenges:

- ⏳ Large amount of inspection time
- 👨‍💼 High dependence on manual effort
- 📦 Large number and variety of products
- 🔤 Different fonts and packaging layouts
- 🔍 Small or difficult-to-read declarations
- 💡 Poor lighting and image quality
- 📐 Different package orientations
- 🗄️ Difficulty maintaining inspection history
- 📊 Difficulty analyzing large-scale inspection data

Therefore, there is a need for a software system that can automatically analyze product packaging and assist enforcement personnel in identifying potential non-compliance.

---

## 💡 Problem We Are Solving

Traditional inspection:

```text
📦 Product
   ↓
👨‍💼 Manual Inspection
   ↓
📝 Manual Verification
   ↓
📄 Manual Report
   ↓
🗄️ Manual Record Keeping
📦 Product
   ↓
📸 Image Capture
   ↓
🤖 AI + OCR
   ↓
🧠 Structured Data
   ↓
⚖️ Compliance Engine
   ↓
🚨 Violation Detection
   ↓
👁️ Evidence
   ↓
📄 Digital Report
   ↓
🗄️ Inspection Repository

---

# PART 3 — Proposed Solution

```md
# 💡 Proposed Solution

**LegalMetrix AI** proposes an AI-assisted software platform for automated first-level compliance analysis of packaged commodities.

The system combines:

- 🤖 Artificial Intelligence
- 👁️ Computer Vision
- 🔍 Optical Character Recognition (OCR)
- 🧠 Structured Information Extraction
- ⚖️ Rule-Based Compliance Engine
- 🚨 Violation Detection
- 👁️ Evidence Management
- 📊 Analytics
- 📄 Automated Reporting

---

The inspector uploads an image of a packaged commodity.

The system processes the image through multiple stages:

```text
📸 Product Image
       ↓
🖼️ Image Preprocessing
       ↓
🔍 OCR
       ↓
🧠 Information Extraction
       ↓
📋 Structured Product Data
       ↓
⚖️ Applicable Rule Selection
       ↓
⚙️ Compliance Validation
       ↓
🚨 Violation Detection
       ↓
👁️ Evidence Generation
       ↓
📊 Compliance Summary
       ↓
📄 Report Generation
       ↓
🗄️ Database Storage

---


```md
# 🎯 Objectives

The major objectives of LegalMetrix AI are:

### 🤖 1. Automate Inspection

Reduce the manual effort involved in inspecting packaged commodity labels.

### 🔍 2. Extract Information

Automatically extract text and declarations from product images.

### 🧠 3. Structure Data

Convert raw OCR output into structured product information.

### ⚖️ 4. Validate Compliance

Compare extracted information against applicable Legal Metrology requirements.

### 🚨 5. Detect Potential Violations

Identify missing, incomplete, incorrectly formatted, or potentially non-compliant declarations.

### 👁️ 6. Provide Evidence

Show the image and relevant detected region associated with a potential violation.

### 📊 7. Generate Compliance Summary

Provide an easy-to-understand compliance result.

### 📄 8. Generate Digital Reports

Automatically create inspection reports containing product information, violations, and evidence.

### 🗄️ 9. Maintain Inspection History

Store previous inspections for future search and analysis.

### 📈 10. Provide Analytics

Provide dashboards for monitoring compliance trends and inspection activities.

### 👨‍⚖️ 11. Support Human Review

Allow authorized users to verify and correct uncertain AI-generated results.
# ✨ Key Features

## 📸 Product Image Upload

- Upload packaged commodity images
- Support multiple images per inspection
- Capture front, back, and side views
- Store original images as inspection evidence

---

## 🔍 OCR-Based Text Extraction

Extract text from packaging using OCR.

Example:

```text
ABC FOODS PVT LTD

MOONG DAL

Net Quantity: 500 g

MRP ₹120.00

Packed: 06/2026

Consumer Care:
1800-123-4567


---

```md
# 🔄 System Workflow

The complete LegalMetrix AI workflow consists of the following stages:

```text
                    👮 INSPECTOR
                         │
                         ▼
                  📸 CAPTURE IMAGE
                         │
                         ▼
                 🖼️ IMAGE UPLOAD
                         │
                         ▼
               🧹 IMAGE PREPROCESSING
                         │
                         ▼
                      🔍 OCR
                         │
                         ▼
              🧠 INFORMATION EXTRACTION
                         │
                         ▼
                📋 STRUCTURED DATA
                         │
                         ▼
                ⚖️ RULE SELECTION
                         │
                         ▼
               ⚙️ COMPLIANCE ENGINE
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         PRESENCE      FORMAT      VISUAL
          CHECK        CHECK       CHECK
             │           │           │
             └───────────┼───────────┘
                         ▼
                  🚨 VIOLATION
                    DETECTION
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          🟢 PASS     🔴 FAIL    🟠 REVIEW
              │          │          │
              └──────────┼──────────┘
                         ▼
                  👁️ EVIDENCE
                         │
                         ▼
                  📊 SUMMARY
                         │
                         ▼
                   📄 REPORT
                         │
                         ▼
                   🗄️ DATABASE
                         │
                         ▼
                  📈 DASHBOARD


---

```md
# 🤖 AI & OCR Module

The AI layer is responsible for converting product images into machine-readable information.

## 🔍 OCR Pipeline

```text
📸 Product Image
       ↓
🖼️ Preprocessing
       ↓
🔍 Text Detection
       ↓
📝 OCR
       ↓
📄 Raw Text
       ↓
🧠 Information Extraction
       ↓
📋 Structured Data

Input:
[Product Package Image]

Output:

"MRP ₹120.00
Net Quantity: 500 g
Packed: 06/2026"

OCR:
"Net Quantity: 500 g"

        ↓

Field:
net_quantity

        ↓

Value:
500 g

{
  "product_name": "...",
  "manufacturer": "...",
  "address": "...",
  "net_quantity": "...",
  "mrp": "...",
  "date": "...",
  "consumer_care": "..."
}


---

```md
# ⚖️ Compliance Rule Engine

The Compliance Rule Engine is the core validation component of LegalMetrix AI.

Its purpose is to compare extracted product declarations against applicable Legal Metrology requirements.

---

## 🔄 Compliance Pipeline

```text
📋 Structured Product Data
           ↓
      ⚖️ Rule Selection
           ↓
     📚 Rule Repository
           ↓
      ⚙️ Validation
           ↓
     📊 Check Results
           ↓
    🚨 Violation Engine

Rule ID
Rule Reference
Declaration
Applicable Category
Requirement
Validation Type
Validation Logic
Severity
Effective Date
Source
Version



---
# 🚨 Violation Detection & Evidence

Once the compliance engine completes its checks, failed validations are converted into potential violation records.

---

## 🚨 Violation Structure

A violation can contain:

```text
Violation ID
Inspection ID
Rule ID
Description
Category
Severity
Confidence
Evidence
Status
Reviewer
Timestamp


---



```md
# 📊 Dashboard

The dashboard provides a centralized view of inspection activities.

## 📈 Dashboard Metrics

```text
┌─────────────────────────────────────────┐
│       ⚖️ LEGAL METROLOGY DASHBOARD     │
├─────────────────────────────────────────┤
│                                         │
│ 📦 Total Inspections       1,248        │
│                                         │
│ 🟢 Compliant                 876        │
│ 🔴 Non-Compliant             254        │
│ 🟠 Needs Review              118        │
│                                         │
└─────────────────────────────────────────┘


---

```md
# 🏗️ System Architecture

```text
                    👮 USER
                      │
                      ▼
               🌐 FRONTEND
                      │
                      ▼
               ⚙️ BACKEND API
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       🔍 OCR      ⚖️ RULES     🗄️ DATABASE
          │           │           │
          └───────────┼───────────┘
                      ▼
               🚨 COMPLIANCE
                      │
                      ▼
                👁️ EVIDENCE
                      │
                      ▼
                📄 REPORTS
                      │
                      ▼
                📊 DASHBOARD

---


```md
# 📂 Project Structure

```text
LegalMetrix-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ocr/
│   │   ├── compliance/
│   │   ├── rules/
│   │   ├── reports/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ml/
│   ├── datasets/
│   ├── preprocessing/
│   ├── models/
│   ├── training/
│   └── inference/
│
├── rules/
│   ├── rule_matrix.json
│   └── rule_versions/
│
├── tests/
│
├── docs/
│
├── reports/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE

---


```md
# 🚀 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/ayansh-codes/LegalMetrix-AI.git
cd LegalMetrix-AI

---

# PART 14 — Current Status + Roadmap

```md
# 🚧 Current Development Status

## ✅ Completed

- 📸 Product image input
- 🖼️ Image preprocessing
- 🔍 OCR pipeline
- 🧠 Structured declaration extraction
- 📋 Structured product information
- 🧪 OCR testing on project dataset

---

## 🔄 In Development

- ⚖️ Compliance Rule Engine
- 📚 Rule Repository
- 🚨 Violation Detection
- 👁️ Evidence Highlighting
- 📊 Compliance Scoring
- 📄 Report Generation
- 🗄️ Inspection Repository
- 📈 Dashboard
- 👨‍⚖️ Human Review Workflow

---

# 🗺️ Project Roadmap

```text
✅ Phase 1 — Problem Analysis
        ↓
✅ Phase 2 — Dataset Preparation
        ↓
✅ Phase 3 — Image Processing
        ↓
✅ Phase 4 — OCR Development
        ↓
✅ Phase 5 — Structured Extraction
        ↓
🔄 Phase 6 — Rule Matrix
        ↓
🔄 Phase 7 — Compliance Engine
        ↓
🔄 Phase 8 — Violation Detection
        ↓
🔄 Phase 9 — Evidence System
        ↓
🔄 Phase 10 — Report Generation
        ↓
🔄 Phase 11 — Dashboard & History
        ↓
🧪 Phase 12 — Testing
        ↓
🚀 Phase 13 — Deployment

---


```md
# 🔮 Future Scope

LegalMetrix AI can be extended with several advanced capabilities.

## 🌐 E-Commerce Compliance

Analyze product listings from e-commerce platforms and compare online declarations with packaging information.

## 🌍 Multi-Language Support

Support packaging information written in multiple Indian languages.

## 📱 Mobile Application

Allow field inspectors to capture product images directly using smartphones.

## 🤖 Advanced Computer Vision

Improve detection of:

- Text regions
- Labels
- Packaging regions
- Font size
- Layout
- Declaration placement

## 🔄 Automated Rule Updates

Introduce version-controlled updates from official regulatory sources.

## 📍 Geographic Analytics

Analyze violations based on:

- Region
- District
- Market
- Product category

## 📈 Predictive Analytics

Use historical inspection data to identify product categories or patterns that may require increased inspection attention.

## ☁️ Large-Scale Deployment

Deploy the platform as a centralized cloud-based system for multiple enforcement offices.

---

# 📚 Research & References

## ⚖️ Government Sources

### Legal Metrology Act, 2009

Department of Consumer Affairs, Government of India.

https://consumeraffairs.gov.in/index.php/pages/legal-metrology-act

### Legal Metrology (Packaged Commodities) Rules, 2011

Government of India.

https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/Book_on_Legal_Metrology_Packaged_Commodities_Rules%2C2011_with_all_amendments_whatsnews.pdf

---

## 🔬 Research Papers

### 1. EAST: An Efficient and Accurate Scene Text Detector

https://arxiv.org/abs/1704.03155

### 2. An End-to-End Trainable Neural Network for Image-Based Sequence Recognition

https://arxiv.org/abs/1507.05717

### 3. Recent Advancements in Machine Vision Methods for Product Code Recognition

https://pmc.ncbi.nlm.nih.gov/articles/PMC10521108/

---

# ⚠️ Disclaimer

LegalMetrix AI is designed as an **AI-assisted inspection and decision-support system**.

The automated output of the system should not be considered a final legal determination.

Actual compliance decisions, enforcement actions, penalties, or legal proceedings should be performed by authorized officials based on:

- Applicable laws
- Rules
- Amendments
- Notifications
- Exemptions
- Product-specific requirements
- Other relevant evidence

The compliance rule database should be regularly reviewed and updated using authoritative government sources.

---

# 🤝 Contribution

Contributions, suggestions, and improvements are welcome.

### Contribution Workflow

```text
🍴 Fork Repository
      ↓
🌿 Create Branch
      ↓
💻 Make Changes
      ↓
🧪 Test Changes
      ↓
📤 Push Changes
      ↓
🔀 Create Pull Request
