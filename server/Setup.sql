create database eeb;
use eeb;

create table Item(
	idItem VARCHAR(256) NOT NULL,
    fidUser VARCHAR(256) NOT NULL,
    tsCreated TIMESTAMP,
    tsChanged TIMESTAMP,
    tsLastRead TIMESTAMP,
    txtName VARCHAR(64),
    txtDescription VARCHAR(512),
    txtSize VARCHAR(16),
    enumCut ENUM('slim', 'regular', 'loose'),
    setColor SET('black', 'brown', 'beige', 'grey', 'white', 'blue', 'petrol', 'turquoise', 'green', 'olive', 'yellow', 'orange', 'red', 'pink', 'violet', 'gold', 'silver'),
    setMaterial SET('Cashmere', 'Cord', 'Cotton', 'Denim', 'Fleece', 'Leather', 'Imitation Leather', 'Linen', 'Polyester', 'Satin', 'Silk', 'Viscose', 'Wool'),
    setType SET('T-shirt', 'Shirt', 'Sweatshirt', 'Hoodie', 'Knitwear', 'Jacket', 'Trousers', 'Jeans', 'Coat', 'Suit', 'Tracksuit', 'Shorts', 'Swimwear'),
    enumCondition ENUM('New', 'Like new', 'Worn', 'Well worn', 'Broken'),
    blnDirty BOOLEAN DEFAULT FALSE,
    constraint primary key(idItem),
    constraint foreign key(fidUser) references User(idUser)
) engine=InnoDB default charset latin1;

create table ItemWashingInfo(
	fidItem VARCHAR(256) NOT NULL,
    nmbTemperature DECIMAL(4,2),
    nmbSpinningCycles DECIMAL(4,2),
    constraint primary key(fidItem),
    constraint foreign key(fidItem) references Item(idItem)
) engine=InnoDB default charset latin1;

create table ItemAditional(
	fidItem VARCHAR(256) NOT NULL,
    fidManufacturer BINARY(16) NOT NULL,
	blnRainProtection BOOLEAN DEFAULT FALSE,
    constraint primary key(fidItem),
    constraint foreign key(fidItem) references Item(idItem),
    constraint foreign key(fidManufacturer) references Manufacturer(idManufacturer)
) engine=InnoDB default charset latin1;

create table ItemImage(
	fidItem VARCHAR(256) NOT NULL,
    blobImage BLOB,
    constraint primary key(fidItem),
    constraint foreign key(fidItem) references Item(idItem)
) engine=InnoDB default charset latin1;

create table User(
	idUser VARCHAR(256) NOT NULL,
    txtUsername VARCHAR(64) NOT NULL,
    txtEmail VARCHAR(256) NOT NULL,
    txtPassword VARCHAR(256) NOT NULL,
    tsLastLogin TIMESTAMP,
    constraint primary key(idUser)
) engine=InnoDB default charset latin1;

create table Manufacturer(
	idManufacturer VARCHAR(256) NOT NULL,
    txtName VARCHAR(256),
    constraint primary key(idManufacturer)
) engine=InnoDB default charset latin1;