library(ggplot2)
library(ggthemes)

ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point() +
  theme_solarized(light = TRUE) +
  scale_color_solarized("blue") +
  labs(title = "Car Weight vs MPG by Cylinders")

ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point() +
  theme_solarized(light = FALSE) +  # Using the dark variant
  scale_color_solarized("blue") +
  labs(title = "Car Weight vs MPG by Cylinders",
       subtitle = "Visualized with Solarized Dark Theme")
d