-- Add image column to menu table if it doesn't exist
ALTER TABLE menu ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Update existing menu items with images
UPDATE menu SET image = '/assets/menu/gyoza.jpg' WHERE id = 27;
UPDATE menu SET image = '/assets/menu/okonomiyaki.jpg' WHERE id = 28;
UPDATE menu SET image = '/assets/menu/aglio-olio.jpg' WHERE id = 29;
UPDATE menu SET image = '/assets/menu/cafe-latte.jpg' WHERE id = 30;
UPDATE menu SET image = '/assets/menu/beef-burger.jpg' WHERE id = 32;
UPDATE menu SET image = '/assets/menu/french-fries.jpg' WHERE id = 33;
UPDATE menu SET image = '/assets/menu/americano.jpg' WHERE id = 34;
UPDATE menu SET image = '/assets/menu/chow-mein.jpg' WHERE id = 36;
UPDATE menu SET image = '/assets/menu/fried-rice.jpg' WHERE id = 37;

-- Set default image for any menu items without images
UPDATE menu SET image = '/assets/menu/default-food.jpg' WHERE image IS NULL;