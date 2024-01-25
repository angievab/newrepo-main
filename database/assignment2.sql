--Task 1 Account DB
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Task 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--Task 3
DELETE FROM public.account
WHERE account_id = 1;

--Task 4 Inventory DB
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interiors' )
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Task 5 Classification DB
SELECT inv_make, inv_model
FROM inventory i
INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Task 6 Inventory DB
UPDATE public.inventory
SET inv_image = CONCAT(
    SUBSTRING(
        inv_image
        FROM 1 FOR 7
    ),'/vehicles',
    SUBSTRING(
         inv_image
        FROM 8
    )
),
   inv_thumbnail = CONCAT(
    SUBSTRING(
        inv_thumbnail
        FROM 1 FOR 7
    ),'/vehicles',
    SUBSTRING(
        inv_thumbnail
        FROM 8
      )
);