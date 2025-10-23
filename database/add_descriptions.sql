-- Add description column to menu table
ALTER TABLE menu ADD COLUMN description TEXT;

-- Update descriptions for each menu item
UPDATE menu SET description = 'Japanese dumplings filled with seasoned ground meat and vegetables, served with dipping sauce' WHERE id = 27;
UPDATE menu SET description = 'Japanese savory pancake made with flour batter, cabbage, and various toppings' WHERE id = 28;
UPDATE menu SET description = 'Italian pasta dish with garlic, olive oil, red pepper flakes, and fresh herbs' WHERE id = 29;
UPDATE menu SET description = 'Espresso with steamed milk and a layer of silky milk foam' WHERE id = 30;
UPDATE menu SET description = 'Juicy beef patty with fresh lettuce, tomatoes, cheese, and special sauce' WHERE id = 32;
UPDATE menu SET description = 'Crispy golden potato fries seasoned with special spices' WHERE id = 33;
UPDATE menu SET description = 'Strong espresso coffee diluted with hot water' WHERE id = 34;
UPDATE menu SET description = 'Chinese stir-fried noodles with vegetables and choice of protein' WHERE id = 36;
UPDATE menu SET description = 'Wok-fried rice with vegetables, eggs, and special seasonings' WHERE id = 37;