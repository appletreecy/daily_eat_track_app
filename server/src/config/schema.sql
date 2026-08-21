CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY AUTO_INCREMENT,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NUll,
    food_name VARCHAR(255) NOT NULL,
    calories NUMERIC(10, 2) NOT NULL,
    protein NUMERIC(10, 2) NOT NULL,
    fat NUMERIC(10, 2) NOT NULL,
    carbs NUMERIC(10, 2) NOT NULL,
    meal_date DATE NOT NULL,
    notes TEXT DEFAULT NUll,
    had_red_meat TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meal_date ON meals (meal_date);
CREATE INDEX idx_meal_type ON meals (meal_type);