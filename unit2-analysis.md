---
title: "Unit 2: Data Visualization Analysis"
author: "Your Name"
date: "`r Sys.Date()`"
output: 
  html_document:
    theme: flatly
    toc: true
    toc_float: true
    code_folding: show
---

```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = TRUE, warning = FALSE, message = FALSE)
# Load required libraries
library(ggplot2)    # For creating visualizations
library(dplyr)      # For data manipulation
library(tidyr)      # For data tidying
library(plotly)     # For interactive plots
```

# Introduction

This analysis explores two datasets:
1. PlayersBBall.csv: Historical data about NBA basketball players from 1950 to present
2. Education_Income.csv: Income data for Americans with different education levels

We'll use various visualization techniques to answer specific questions about these datasets and uncover interesting patterns in the data.

# NBA Players Analysis

First, let's load and examine the PlayersBBall dataset:

```{r load-data}
# Read the NBA players dataset
players_data <- read.csv("PlayersBBall.csv", stringsAsFactors = FALSE)

# Display the structure of the data
str(players_data)

# Show the first few rows
head(players_data)
```

## Position Distribution

Let's create a visualization to show the number of players in each position:

```{r position-distribution}
# Create a position distribution plot
position_plot <- players_data %>%
  count(position) %>%
  ggplot(aes(x = reorder(position, n), y = n)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  coord_flip() +  # Flip coordinates for better readability
  labs(
    title = "Distribution of NBA Players by Position",
    x = "Position",
    y = "Number of Players"
  ) +
  theme_minimal()

# Make the plot interactive
ggplotly(position_plot)
```

The visualization shows that [insert your observations about the position distribution].

## Weight Distribution Analysis

Let's compare the weight distributions between centers and forwards:

```{r weight-distribution}
# Create box plots for weight comparison
weight_plot <- players_data %>%
  filter(position %in% c("C", "F")) %>%  # Select only Centers and Forwards
  ggplot(aes(x = position, y = weight, fill = position)) +
  geom_boxplot() +
  labs(
    title = "Weight Distribution: Centers vs Forwards",
    x = "Position",
    y = "Weight (lbs)"
  ) +
  theme_minimal()

ggplotly(weight_plot)

# Add statistical summary
players_data %>%
  filter(position %in% c("C", "F")) %>%
  group_by(position) %>%
  summarise(
    mean_weight = mean(weight, na.rm = TRUE),
    median_weight = median(weight, na.rm = TRUE),
    sd_weight = sd(weight, na.rm = TRUE)
  )
```

The analysis reveals that [insert your observations about weight distributions].

## Height Distribution Analysis

Now let's examine the height distributions:

```{r height-distribution}
# Function to convert height strings to inches
convert_height_to_inches <- function(height_str) {
  parts <- strsplit(height_str, "-")[[1]]
  feet <- as.numeric(parts[1])
  inches <- as.numeric(parts[2])
  return(feet * 12 + inches)
}

# Add height in inches column
players_data$height_inches <- sapply(players_data$height, convert_height_to_inches)

# Create height distribution plot
height_plot <- players_data %>%
  filter(position %in% c("C", "F")) %>%
  ggplot(aes(x = position, y = height_inches, fill = position)) +
  geom_boxplot() +
  labs(
    title = "Height Distribution: Centers vs Forwards",
    x = "Position",
    y = "Height (inches)"
  ) +
  theme_minimal()

ggplotly(height_plot)

# Add statistical summary
players_data %>%
  filter(position %in% c("C", "F")) %>%
  group_by(position) %>%
  summarise(
    mean_height = mean(height_inches, na.rm = TRUE),
    median_height = median(height_inches, na.rm = TRUE),
    sd_height = sd(height_inches, na.rm = TRUE)
  )
```

The height analysis shows that [insert your observations about height distributions].

## Height Across All Positions

Let's examine height distributions across all positions:

```{r all-positions-height}
# Create violin plots for all positions
all_positions_plot <- ggplot(players_data, 
       aes(x = position, y = height_inches, fill = position)) +
  geom_violin() +
  geom_boxplot(width = 0.2, fill = "white", alpha = 0.5) +
  labs(
    title = "Height Distribution Across All Positions",
    x = "Position",
    y = "Height (inches)"
  ) +
  theme_minimal() +
  theme(legend.position = "none")

ggplotly(all_positions_plot)
```

This visualization reveals that [insert your observations about height across positions].

## Height-Weight Relationship

Let's explore how height and weight are related:

```{r height-weight-relationship}
# Create a scatter plot with trend lines for each position
hw_plot <- ggplot(players_data, 
       aes(x = height_inches, y = weight, color = position)) +
  geom_point(alpha = 0.5) +
  geom_smooth(method = "lm", se = FALSE) +
  labs(
    title = "Height vs Weight Relationship by Position",
    x = "Height (inches)",
    y = "Weight (lbs)",
    color = "Position"
  ) +
  theme_minimal()

ggplotly(hw_plot)

# Calculate correlations by position
players_data %>%
  group_by(position) %>%
  summarise(
    correlation = cor(height_inches, weight, use = "complete.obs")
  )
```

The relationship between height and weight [insert your observations about the relationship].

## Historical Height Trends

Let's investigate how player heights have changed over time:

```{r height-trends}
# Calculate average height by year
height_trend_plot <- players_data %>%
  group_by(year_start) %>%
  summarise(
    avg_height = mean(height_inches, na.rm = TRUE),
    se_height = sd(height_inches, na.rm = TRUE) / sqrt(n())
  ) %>%
  ggplot(aes(x = year_start, y = avg_height)) +
  geom_line() +
  geom_ribbon(aes(ymin = avg_height - se_height, 
                  ymax = avg_height + se_height),
              alpha = 0.2) +
  labs(
    title = "Average Player Height Over Time",
    x = "Year",
    y = "Average Height (inches)"
  ) +
  theme_minimal()

ggplotly(height_trend_plot)
```

The historical trend shows that [insert your observations about height trends].

## 3D Visualization

Let's create a 3D visualization of height, weight, and year:

```{r 3d-visualization}
# Create 3D scatter plot using plotly
plot_ly(players_data, 
        x = ~year_start, 
        y = ~height_inches, 
        z = ~weight,
        color = ~position,
        type = "scatter3d",
        mode = "markers",
        marker = list(size = 3)) %>%
  layout(
    title = "3D View: Height, Weight, and Year by Position",
    scene = list(
      xaxis = list(title = "Year"),
      yaxis = list(title = "Height (inches)"),
      zaxis = list(title = "Weight (lbs)")
    )
  )
```

The 3D visualization reveals that [insert your observations about the 3D relationships].

# Education and Income Analysis

Now let's analyze the Education_Income dataset:

```{r load-education-data}
# Read the education and income dataset
education_data <- read.csv("Education_Income.csv")

# Create box plots of income by education level
income_plot <- ggplot(education_data, 
       aes(x = Educ, y = Income2005)) +
  geom_boxplot(fill = "steelblue", alpha = 0.7) +
  labs(
    title = "Income Distribution by Education Level",
    x = "Education Level",
    y = "Income (2005 USD)"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

ggplotly(income_plot)

# Calculate summary statistics
education_data %>%
  group_by(Educ) %>%
  summarise(
    mean_income = mean(Income2005, na.rm = TRUE),
    median_income = median(Income2005, na.rm = TRUE),
    sd_income = sd(Income2005, na.rm = TRUE)
  )
```

The analysis of income and education level shows that [insert your observations about the relationship between education and income].

# Conclusion

Based on our analysis:

1. Player Positions: [Key finding about position distribution]
2. Physical Attributes: [Key findings about height and weight]
3. Historical Trends: [Key findings about changes over time]
4. Education and Income: [Key finding about education-income relationship]

These visualizations help us understand [insert your overall conclusions about both datasets].
