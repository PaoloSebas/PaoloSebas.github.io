# GEOS-Chem Atmospheric Chemistry ML Project

## 🌍 Project Overview

This capstone project was completed as part of the **HarvardX PH125.9x Data Science Professional Certificate** program. The objective was to apply machine learning algorithms to atmospheric chemistry modeling, specifically predicting sulfur dioxide (SO₂) concentrations using GEOS-Chem simulation data.

**Inspiration:** Based on the work of Keller and Evans (2019) on using ML for gas-phase chemistry in atmospheric Chemistry Transport Models (CTMs).

---

## 🔬 Scientific Context

### GEOS-Chem Model
**GEOS-Chem** is a global 3D chemical transport model developed by Harvard University and used by hundreds of research groups worldwide. It simulates atmospheric composition from local to global scales.

**Purpose:** CTMs like GEOS-Chem are computationally expensive. This project explores whether ML algorithms can replace numerical integration steps, potentially accelerating atmospheric chemistry simulations.

### Why This Matters
- 🌱 Environment, vegetation, and human health are impacted by air pollutants
- 🔧 CTMs are central tools for studying atmospheric chemistry
- ⚡ Faster CTM implementations enable more comprehensive analysis of environmental impacts
- 🚀 ML-driven models could revolutionize atmospheric science research

---

## 📊 Dataset

**Source:** [Research Data Australia](https://researchdata.edu.au/geos-chem-model-australis-voyages/1701891) (Australian Research Data Commons)  
**Provider:** University of Wollongong (Jenny Fisher)  
**License:** CC-BY Attribution License

### Dataset Characteristics

| Property | Value |
|----------|-------|
| **Model Version** | GEOS-Chem 12.8.1 |
| **Simulation Period** | March 2018 (1 month) |
| **File Format** | NetCDF4 (.nc4) files |
| **File Size** | >5GB (original), processed to .txt |
| **Latitude Range** | -89.5° to 30.0° |
| **Longitude Range** | -180° to 177.5° |
| **Grid Cells** | 4,464 observations (144 lon × 31 lat) |
| **Vertical Levels** | 47 levels (surface analyzed) |
| **Time Resolution** | Daily (first day analyzed) |
| **Total Features** | 234 variables |

### Variables
- **203** chemical species concentrations (dry mixing ratio, mol·mol⁻¹)
- **36** meteorological variables
- **1** target variable: **SO₂ concentration**

### Target Variable
**Sulfur Dioxide (SO₂)** - Predominant anthropogenic sulfur-containing air pollutant

---

## 🛠️ Methodology

### Data Processing

#### NetCDF File Handling
Due to large file sizes (>5GB), the original .nc4 files were processed and converted to a .txt file:

```r
# Data available at:
url <- "https://raw.githubusercontent.com/PaoloSebas/DATA_SCIENCE/main/GC_tot_Dat3.txt"
```

**Key Libraries Used:**
- `tidync` - NetCDF manipulation
- `ncdf4` - NetCDF operations
- `RNetCDF` - NetCDF reading

#### Data Preparation Pipeline
1. ✅ **Dimension Activation:** time, longitude, latitude, vertical level
2. ✅ **Data Slicing:** Surface level (lev > 0.980), first day (time = 720)
3. ✅ **Data Merging:** Combined species concentrations with meteorological data
4. ✅ **Duplicate Removal:** Eliminated redundant columns
5. ✅ **Feature Selection:** Removed zero-variance features

### Features Removed (Zero Variance)
- `lev` (constant)
- `time` (constant)
- `FracOfTimeInTrop`
- `Met_DTRAIN`
- `SpeciesConc_H1301`
- `SpeciesConc_CFC114`

**Final Feature Set:** 228 predictors

---

## 📈 Exploratory Data Analysis

### SO₂ Concentration Insights

**Mean SO₂ Concentration:** `2.577628e-11 mol·mol⁻¹` dry air (**25 ppb**)

**Geographic Distribution:**
- Multiple hotspots identified above mean concentration
- **Maximum concentration location:** Ingwe Local Municipality, South Africa (`-30° lat, 30° lon`)
- Significant spatial variability across the study region

### Correlation Analysis

**Highest correlation with SO₂:**
- **Anthropogenic iron (pFe):** Strong positive correlation (>0.55)
- Multiple chemical species showed moderate correlations
- Correlation matrix revealed complex interdependencies among 228 features

---

## 🤖 Machine Learning Models

### Dataset Split
```r
Training Set: 90% (4,017 observations)
Test Set:     10% (447 observations)
```

### Performance Metric

**Normalized Root Mean Square Error (NRMSE):**

```
NRMSE = (RMSE / σ(y_train)) × 100
```

Expressed as a percentage, showing how far predictions deviate from actual GEOS-Chem concentrations.

---

## 📋 Models Implemented & Results

### 1️⃣ Baseline: Average Model
Simply predicts mean SO₂ concentration for all locations.

```r
# Configuration
prediction <- mean(train_set$SpeciesConc_SO2)
```

**Performance:** `NRMSE = 49.82%`

---

### 2️⃣ Linear Regression
Multiple linear regression with all 228 predictors.

```r
# Configuration
method = "lm"
cross_validation = repeated 10-fold (3 repeats)
preprocessing = centering + scaling
```

**Performance:** `NRMSE = 26.35%`  
**Improvement:** 47% reduction in error vs. baseline ✅

---

### 3️⃣ Glmnet (Elastic Net Regularization)
Regularized regression combining L1 (Lasso) and L2 (Ridge) penalties.

```r
# Configuration
method = "glmnet"
tuning_params = alpha (mixing), lambda (regularization)
cross_validation = repeated 10-fold (3 repeats)
preprocessing = centering + scaling
```

**Performance:** `NRMSE = 26.20%`  
**Improvement:** Marginal improvement over linear regression

---

### 4️⃣ Random Forest (randomForest package)
Ensemble of decision trees with averaged predictions.

```r
# Configuration
ntree = 55  # number of trees
mtry = 72   # variables per split
preprocessing = centering + scaling
```

**Performance:** `NRMSE = 18.26%`  
**Improvement:** 30% reduction vs. linear regression ✅✅

---

### 5️⃣ Random Forest (ranger package) 🏆
High-performance implementation of Random Forest.

```r
# Configuration
num.trees = 55
mtry = 71
```

**Performance:** `NRMSE = 18.06%` 🎯  
**Best Model Achievement:** 64% improvement over baseline ✅✅✅

---

## 📊 Results Summary

| Model | NRMSE (%) | Improvement vs. Baseline | Status |
|-------|-----------|--------------------------|--------|
| Average | 49.82 | - | ❌ |
| Linear Regression | 26.35 | 47% | ✅ |
| glmnet | 26.20 | 47% | ✅ |
| Random Forest (randomForest) | 18.26 | 63% | ✅✅ |
| **Random Forest (ranger)** | **18.06** | **64%** | **🏆 Best** |

---

## 🔍 Key Findings

### Model Performance
1. ✅ **Random Forest achieved best performance** with NRMSE of 18.06%
2. ✅ **Significant improvement over linear methods** (30% error reduction)
3. ✅ **Predictions within ~18% of actual GEOS-Chem concentrations**

### Feature Importance
```r
# Most important predictor
Variable: SpeciesConc_pFe (Anthropogenic iron)
Importance: 3.319607e-18
```

- **Anthropogenic iron (pFe)** identified as most important predictor
- Complex interactions between chemical species captured by RF
- Meteorological variables contribute to prediction accuracy

### Scientific Implications
- 🌍 ML algorithms show promise for atmospheric chemistry modeling
- ⚡ Potential to reduce computational burden of CTM simulations
- 🔬 Random Forest effectively captures non-linear relationships

---

## 💻 Technical Implementation

### Libraries & Tools

#### Data Processing
```r
tidync          # NetCDF handling
ncdf4           # NetCDF operations
RNetCDF         # NetCDF reading
tidyverse       # Data manipulation
dplyr           # Data wrangling
tidyr           # Data tidying
DataExplorer    # EDA
```

#### Visualization
```r
ggplot2         # Plotting
plot3D          # 3D visualizations
maps            # Geographic maps
rnaturalearth   # Natural Earth data
corrplot        # Correlation matrices
ggcorrplot      # Enhanced correlation plots
```

#### Machine Learning
```r
caret           # ML framework
randomForest    # Random Forest
ranger          # Fast Random Forest
glmnet          # Regularized regression
e1071           # SVM support
kernlab         # Kernel methods
```

---

## 📸 Visualizations Created

1. 🗺️ **Spatial Distribution Maps:** SO₂ concentrations across study region
2. 🔗 **Correlation Matrices:** Relationships between 228 variables
3. 📊 **Distribution Plots:** SO₂ concentration histograms (log scale)
4. 📍 **Scatter Plots:** Longitude/latitude vs. concentration
5. 📉 **Prediction Comparisons:** Model predictions vs. actual values
6. 🌐 **World Maps:** Geographic context with concentration overlay

---

## 🚀 Future Directions

### Current Limitations
- ⚠️ Analysis limited to surface level only
- ⚠️ Only first day of 31-day simulation analyzed
- ⚠️ Single target variable (SO₂)

### Proposed Extensions

#### 1. Temporal Analysis
- [ ] Extend to all 31 days of simulation
- [ ] Build day-by-day time series predictions
- [ ] Analyze temporal patterns and trends

#### 2. Vertical Analysis
- [ ] Include all 47 vertical atmospheric levels
- [ ] 3D concentration predictions

#### 3. Multi-Target Learning
- [ ] Predict additional chemical species
- [ ] Multi-output regression models

#### 4. Advanced Methods
- [ ] Principal Component Analysis (PCA)
- [ ] Clustering techniques
- [ ] Deep learning (LSTM, CNN)
- [ ] Gradient boosting (XGBoost, LightGBM)

#### 5. Validation
- [ ] Use remaining simulation days as validation sets
- [ ] Compare with actual atmospheric measurements

---

## 📁 Repository Structure

```
CAPSTONE_CYO/GEOS_Chem/
├── Edx_Capstone_CYO_GEOS_Chem_Sebastianelli.Rmd  # Report (R Markdown)
├── Edx_Sebastianelli_Capstone_CYO.R              # R Script
└── README.md                                      # This file
```

### Data File
```
# Processed dataset (hosted on GitHub)
GC_tot_Dat3.txt
```

---

## 📚 Deliverables

| File | Description |
|------|-------------|
| 📄 **Edx_Capstone_CYO_GEOS_Chem_Sebastianelli.Rmd** | Comprehensive report with methodology, results, and scientific context |
| 💻 **Edx_Sebastianelli_Capstone_CYO.R** | Complete executable R code for reproducible analysis |
| 📊 **GC_tot_Dat3.txt** | Processed GEOS-Chem data (avoids 5GB download) |

---

## 🎓 Skills Demonstrated

| Category | Skills |
|----------|--------|
| **Domain Expertise** | Atmospheric chemistry, environmental science |
| **Big Data** | NetCDF files, large-scale scientific datasets (>5GB) |
| **Data Engineering** | File format conversion, data pipeline optimization |
| **Machine Learning** | Regression, ensemble methods, hyperparameter tuning |
| **Statistical Analysis** | Cross-validation, correlation analysis, NRMSE |
| **R Programming** | Advanced data manipulation, tidyverse, ML implementation |
| **Visualization** | Geographic mapping, 3D plotting, EDA graphics |
| **Scientific Computing** | Reproducible research, literate programming |
| **Collaboration** | Working with university research data |

---

## 🙏 Acknowledgments

**Collaborators:**
- **Jenny Fisher** - University of Wollongong
- **Robyn Schofield**

**Data Provider:**
- Australian Research Data Commons (ARDC)

**Inspiration:**
- Keller and Evans (2019) - "Application of random forest regression to the calculation of gas-phase chemistry"

---

## 📖 References

1. **GEOS-Chem Model:** http://acmg.seas.harvard.edu/geos/
2. **Dataset Citation:** http://data.aad.gov.au/aadc/metadata/citation.cfm?entry_id=AAS_4431_CAMMPCAN_GEOS_Chem_Model_AA_2017-18
3. **Research Data Australia:** https://researchdata.edu.au/geos-chem-model-australis-voyages/1701891
4. Keller, C. A. and Evans, M. J. (2019). "Application of random forest regression to the calculation of gas-phase chemistry within the GEOS-Chem chemistry model v10", *Geosci. Model Dev.*, 12, 1209–1225.
5. Seinfeld, J. H. and Pandis, S. N. (2016). *Atmospheric Chemistry and Physics: From Air Pollution to Climate Change*, 3rd Edition.

---

## 📞 Contact

**Author:** Paolo Sebastianelli  
**Course:** HarvardX PH125.9x - Data Science: Capstone (Choose Your Own)  
**Date:** July 2021  
**GitHub:** [PaoloSebas/DATA_SCIENCE](https://github.com/PaoloSebas/DATA_SCIENCE)

---

## 📝 License

This project uses data conforming to the **CC-BY Attribution License**.  
Please contact Jenny Fisher (jennyf@uow.edu.au) at the University of Wollongong before using these data.

---

## 🎯 Conclusion

This project successfully demonstrated that **machine learning, particularly Random Forest algorithms, can effectively predict atmospheric chemical concentrations** with high accuracy (NRMSE < 20%). 

The work represents an important first step toward developing **ML-driven Chemistry Transport Models** that could significantly reduce computational costs while maintaining predictive accuracy.

The combination of domain knowledge in atmospheric science with advanced data science techniques showcases the potential for interdisciplinary applications of machine learning in environmental research.

---

## 🌟 Key Achievement

> **Random Forest regression achieved 64% improvement over baseline predictions, demonstrating that machine learning can effectively emulate computationally expensive atmospheric chemistry calculations.**

---

*This project is part of a journey into data science and machine learning applied to environmental and atmospheric sciences.* 🌍📊🚀

---

**Repository Languages:**  
![R](https://img.shields.io/badge/R-97.8%25-blue)
![TeX](https://img.shields.io/badge/TeX-2.2%25-lightgrey)
