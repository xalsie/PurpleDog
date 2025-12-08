CREATE TYPE user_role AS ENUM ('ADMIN', 'PRIVATE', 'PROFESSIONAL');
CREATE TYPE sale_type AS ENUM ('AUCTION', 'FIXED_PRICE');
CREATE TYPE item_status AS ENUM ('DRAFT', 'PUBLISHED', 'SOLD', 'UNSOLD', 'ARCHIVED');
CREATE TYPE order_status AS ENUM ('PENDING_PAYMENT', 'PAID', 'SHIPPING_PENDING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED');
CREATE TYPE auction_status AS ENUM ('PENDING', 'ACTIVE', 'EXTENDED', 'FINISHED_SOLD', 'FINISHED_UNSOLD');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_identity_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    address_line1 VARCHAR(255),
    address_zip VARCHAR(20),
    address_city VARCHAR(100),
    address_country VARCHAR(100),
    birth_date DATE,
    is_adult_certified BOOLEAN DEFAULT FALSE
);

CREATE TABLE profiles_professional (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    siret_number VARCHAR(50) UNIQUE NOT NULL,
    kbis_document_url TEXT,
    website_url VARCHAR(255),
    specialties TEXT[],
    interests TEXT[],
    subscription_status VARCHAR(50) DEFAULT 'TRIAL',
    subscription_end_date TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id INT REFERENCES categories(id),
    custom_commission_rate DECIMAL(5, 2) DEFAULT NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(id),
    category_id INT NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    dimensions_cm JSONB,
    weight_kg DECIMAL(10, 3),
    desired_price DECIMAL(12, 2),
    ai_estimated_price DECIMAL(12, 2),
    min_price_accepted DECIMAL(12, 2),

    sale_type sale_type NOT NULL,
    status item_status DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_media (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE auctions (
    item_id INT PRIMARY KEY REFERENCES items(id),
    start_price DECIMAL(12, 2) NOT NULL,
    current_price DECIMAL(12, 2) NOT NULL,
    reserve_price DECIMAL(12, 2),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status auction_status DEFAULT 'PENDING'
);

CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    auction_id INT REFERENCES auctions(item_id),
    bidder_id INT REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    max_auto_bid_amount DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id),
    buyer_id INT REFERENCES users(id),
    offer_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    item_id INT REFERENCES items(id),
    buyer_id INT REFERENCES users(id),
    seller_id INT REFERENCES users(id),
    item_price DECIMAL(12, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    commission_buyer_amount DECIMAL(10, 2) NOT NULL,
    commission_seller_amount DECIMAL(10, 2) NOT NULL,
    total_paid DECIMAL(12, 2) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    status order_status DEFAULT 'PENDING_PAYMENT',
    delivery_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP
);

CREATE TABLE shipments (
    order_id INT PRIMARY KEY REFERENCES orders(id),
    carrier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    pickup_date TIMESTAMP,
    status VARCHAR(50)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    item_id INT REFERENCES items(id),
    content_original TEXT,
    content_sanitized TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    user_id INT REFERENCES users(id),
    item_id INT REFERENCES items(id),
    PRIMARY KEY (user_id, item_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id),
    target_platform BOOLEAN DEFAULT TRUE,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
